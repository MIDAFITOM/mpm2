pragma solidity ^0.4.25;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./Utils.sol";

contract BaseVote is Ownable {
    using SafeMath for uint256;
    uint256 public batchSize = 10;
    uint256 private WINNER_REWARDS = 2.87 ether;
    uint256 private VOTER_REWARDS = 2.87 ether;
    uint256 private DEV_REWARDS = 1.43 ether;
    uint256 private TECH_REWARDS = 1.43 ether;
    uint256 private _lastAwarded;
    struct Candidate {
        uint256 votes;
        address elected;
        string electedStr;
    }
    struct Elector {
        uint256 pastVotes;
        address[] candidates;
        uint256[] votes;
        uint256 rewards;
        uint256 totalRewards;
        uint256 updatedTimestamp;
    }
    uint256 public voteStartTime;
    uint256 public voteEndTime;
    uint256 public nextAwardTime;
    uint256 public oneDay;
    uint256 public dayOffset;
    uint256 public votePeriod;
    uint256 public voteInterval;
    uint256 public awardDuration;
    uint256 public devRewards;
    uint256 public techRewards;
    uint256 public currentVotes;
    uint256 public lastWinnerVotes;
    uint256 public lastRewardTime;
    uint256 public totalVotes;
    string public lastWinnerElectedStr;
    string public devAddrStr;
    string public techAddrStr;
    string[9] public bonusCurrencies;
    address private lastWinner;
    address private devAddr;
    address private techAddr;
    Candidate[] private _candidates;
    Elector[] _electors;
    mapping(address => uint256) private _cddt_indexes;
    mapping(address => uint256) private _elector_indexes;
    mapping(address => uint256) private _winner_rewards;
    mapping(address => uint256)[9] private _winner_bonus;
    uint256[9] private bonuses;

    constructor(
        uint256 nextAwardTime_,
        uint256 votePeriod_,
        uint256 voteInterval_,
        uint256 awardDuration_,
        uint256 oneDay_,
        uint256 dayOffset_
    ) public {
        nextAwardTime = nextAwardTime_;
        voteStartTime = nextAwardTime_;
        votePeriod = votePeriod_;
        voteInterval = voteInterval_;
        awardDuration = awardDuration_;
        oneDay = oneDay_;
        dayOffset = dayOffset_;
        voteEndTime = nextAwardTime_.add(votePeriod * oneDay);
        _candidates.push(
            Candidate({votes: 0, elected: address(0), electedStr: ""})
        );
        address[] memory candidates = new address[](1);
        uint256[] memory votes = new uint256[](1);
        _electors.push(
            Elector({
                pastVotes: 0,
                candidates: candidates,
                votes: votes,
                rewards: 0,
                totalRewards: 0,
                updatedTimestamp: 0
            })
        );
    }

    function votesOf(address account) public view returns (uint256) {
        uint256 index = _elector_indexes[account];
        if (index == 0) {
            return 0;
        }
        Elector storage me = _electors[index];
        uint256[] storage allMyVotes = me.votes;
        uint256 total;
        for (uint256 i = 0; i < allMyVotes.length; i++) {
            total = total.add(allMyVotes[i]);
        }
        return total;
    }

    function pastVotesOf(address account) public view returns (uint256) {
        uint256 index = _elector_indexes[account];
        if (index == 0) {
            return 0;
        }
        return _electors[index].pastVotes;
    }

    function voterRewardsOf(address account) public view returns (uint256) {
        uint256 index = _elector_indexes[account];
        if (index == 0) {
            return 0;
        }
        return _electors[index].rewards;
    }

    function updateTimeOf(address account) public view returns (uint256) {
        uint256 index = _elector_indexes[account];
        if (index > 0 && index < _electors.length) {
            return _electors[index].updatedTimestamp;
        }
        return 0;
    }

    function winnerRewardsOf(address account) public view returns (uint256) {
        return _winner_rewards[account];
    }

    function winnerBonusOf(
        address account,
        string memory currency
    ) public view returns (uint256) {
        uint256 index;
        bool found;
        (index, found) = _currencyIndex(currency);
        if (found) {
            return _winner_bonus[index][account];
        } else {
            return 0;
        }
    }

    function bonusOf(string memory currency) public view returns (uint256) {
        uint256 index;
        bool found;
        (index, found) = _currencyIndex(currency);
        if (found) {
            return bonuses[index];
        } else {
            return 0;
        }
    }

    function _triggerAt(address account, uint256 timestamp) internal {
        _awardAt(account, timestamp);
    }

    function setDev(address dev_, string devStr_) public onlyOwner {
        devAddr = dev_;
        devAddrStr = devStr_;
    }

    function setTech(address tech_, string techStr_) public onlyOwner {
        techAddr = tech_;
        techAddrStr = techStr_;
    }

    function setOneDay(uint256 oneDay_) public onlyOwner {
        oneDay = oneDay_;
    }

    function setVotePeriod(uint256 votePeriod_) public onlyOwner {
        votePeriod = votePeriod_;
    }

    function setVoteInterval(uint256 voteInterval_) public onlyOwner {
        voteInterval = voteInterval_;
    }

    function setDayOffset(uint256 dayOffset_) public onlyOwner {
        dayOffset = dayOffset_;
    }

    function setBatchSize(uint256 newBatchSize) public onlyOwner {
        batchSize = newBatchSize;
    }

    function addCurrency(
        uint256 index,
        string memory currency
    ) public onlyOwner {
        bonusCurrencies[index] = currency;
    }

    function removeCurrency(uint256 index) public onlyOwner {
        bonusCurrencies[index] = "";
    }

    function _currencyIndex(
        string memory currency
    ) internal view returns (uint256 index, bool found) {
        for (uint256 i = 0; i < bonusCurrencies.length; i++) {
            if (
                keccak256(abi.encodePacked(bonusCurrencies[i])) ==
                keccak256(abi.encodePacked(currency))
            ) {
                found = true;
                index = i;
                break;
            }
        }
    }

    function _leaderboard(uint256 n) internal view returns (Candidate[]) {
        uint256[] memory winners = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            _top(winners, i);
        }
        Candidate[] memory rets = new Candidate[](n);
        for (i = 0; i < n; i++) {
            if (winners[i] > 0) {
                rets[i] = _candidates[winners[i]];
            } else {
                break;
            }
        }
        return rets;
    }

    function _awardAt(address account, uint256 timestamp) internal {
        if (timestamp > voteEndTime) {
            while (timestamp > voteEndTime) {
                voteEndTime = voteEndTime.add(votePeriod * oneDay).add(
                    voteInterval * oneDay
                );
            }
            voteStartTime = voteEndTime.sub(votePeriod * oneDay);
            _choseWinner();
            _gatherAll();
        }
        if (timestamp >= nextAwardTime) {
            while (timestamp >= nextAwardTime) {
                nextAwardTime = nextAwardTime.add(awardDuration);
            }
            _awardTeam();
        }
        _voteSnapshotAt(timestamp);
        _doVoterAward(account, timestamp);
    }

    function _choseWinner() internal {
        Candidate[] memory winners = _leaderboard(1);
        if (winners.length < 1 || winners[0].elected == address(0)) {
            return;
        }
        lastWinnerVotes = winners[0].votes;
        lastWinnerElectedStr = winners[0].electedStr;
        lastWinner = winners[0].elected;
        uint256 i;
        for (i = 1; i < _candidates.length; i++) {
            delete _cddt_indexes[_candidates[i].elected];
        }
        delete _candidates;
        _candidates.push(
            Candidate({votes: 0, elected: address(0), electedStr: ""})
        );
    }

    function _voteSnapshotAt(uint timestamp) private {
        if (!Utils.sameDay(timestamp, lastRewardTime, oneDay, dayOffset)) {
            lastRewardTime = timestamp;
            _updateTotalVotes();
        }
    }

    function _doVoterAward(address account, uint256 timestamp) internal {
        if (totalVotes == 0) {
            return;
        }
        uint256 index = _elector_indexes[account];
        if (index != 0) {
            Elector storage elector = _electors[index];
            _doVoterAward(elector, timestamp);
        }
        for (uint256 i = 0; i < batchSize; i++) {
            if (_lastAwarded == 0) {
                _lastAwarded++;
                continue;
            }
            if (_lastAwarded >= _electors.length) {
                _lastAwarded = _lastAwarded.sub(_electors.length);
            }

            elector = _electors[_lastAwarded];
            _doVoterAward(elector, timestamp);

            _lastAwarded++;
            if (_lastAwarded >= _electors.length) {
                _lastAwarded = _lastAwarded.sub(_electors.length);
            }
        }
    }

    function _doVoterAward(
        Elector storage _elector,
        uint256 timestamp
    ) internal {
        if (_elector.pastVotes == 0) {
            return;
        }
        if (
            Utils.sameDay(
                _elector.updatedTimestamp,
                timestamp,
                oneDay,
                dayOffset
            )
        ) {
            return;
        }
        _elector.updatedTimestamp = timestamp;
        uint256 rewards = VOTER_REWARDS.mul(_elector.pastVotes).div(totalVotes);
        _elector.rewards = _elector.rewards.add(rewards);
    }

    function _voteAt(
        address elector,
        uint256 votes,
        address elected,
        string electedStr,
        uint256 timestamp
    ) internal {
        require(
            timestamp >= voteStartTime && timestamp <= voteEndTime,
            "BaseVote: vote not active"
        );
        currentVotes = currentVotes.add(votes);
        uint256 index = _cddt_indexes[elected];
        if (index == 0) {
            index = _candidates.length;
            _cddt_indexes[elected] = index;
            _candidates.push(
                Candidate({
                    votes: votes,
                    elected: elected,
                    electedStr: electedStr
                })
            );
        } else {
            _candidates[index].votes = _candidates[index].votes.add(votes);
        }
        index = _elector_indexes[elector];
        if (index == 0) {
            address[] memory candidates = new address[](1);
            candidates[0] = elected;
            uint256[] memory votes_ = new uint256[](1);
            votes_[0] = votes;
            Elector memory elector_ = Elector({
                pastVotes: 0,
                candidates: candidates,
                votes: votes_,
                rewards: 0,
                totalRewards: 0,
                updatedTimestamp: 0
            });
            _elector_indexes[elector] = _electors.length;
            _electors.push(elector_);
        } else {
            _electors[index].candidates.push(elected);
            _electors[index].votes.push(votes);
        }
    }

    function _revoke(address account, uint256 amount) internal {
        uint256 index = _elector_indexes[account];
        require(
            index > 0 && index < _electors.length,
            "BaseVote: index out of range"
        );
        require(
            amount == votesOf(account).add(pastVotesOf(account)),
            "BaseVote: should revoke all your votes"
        );
        currentVotes = currentVotes.sub(votesOf(account));
        Elector storage self = _electors[index];
        for (uint256 i = 0; i < self.votes.length; i++) {
            uint256 elected_index = _cddt_indexes[self.candidates[i]];
            if (elected_index == 0 || elected_index >= _candidates.length) {
                continue;
            }
            Candidate storage elected = _candidates[elected_index];
            elected.votes = elected.votes.sub(self.votes[i]);
        }

        delete self.candidates;
        delete self.votes;
        delete self.pastVotes;
    }

    function _withdrawWinnerRewards(address account, uint256 amount) internal {
        require(
            _winner_rewards[account] >= amount,
            "BaseVote: insufficient rewards"
        );
        _winner_rewards[account] = _winner_rewards[account].sub(amount);
    }

    function _withdrawWinnerBonus(
        address account,
        string memory currency,
        uint256 amount
    ) internal {
        uint256 index;
        bool found;
        (index, found) = _currencyIndex(currency);
        require(found, "BaseVote: currency not supported");
        require(
            _winner_bonus[index][account] >= amount,
            "BaseVote: insufficient bonus"
        );
        _winner_bonus[index][account] = _winner_bonus[index][account].sub(
            amount
        );
    }

    function _withdrawVoterRewards(address account, uint256 amount) internal {
        uint256 index = _elector_indexes[account];
        require(
            index > 0 && index < _electors.length,
            "BaseVote: out of range"
        );
        require(
            _electors[index].rewards == amount,
            "BaseVote: must withdraw all balance"
        );
        _electors[index].rewards = 0;
    }

    function _withdrawDevRewards(address account, uint256 amount) internal {
        require(account == devAddr, "BaseVote: bad account");
        require(amount >= devRewards, "BaseVote: insufficient rewards");
        devRewards = devRewards.sub(amount);
    }

    function _withdrawTechRewards(address account, uint256 amount) internal {
        require(account == techAddr, "BaseVote: bad account");
        require(amount >= techRewards, "BaseVote: insufficient rewards");
        techRewards = techRewards.sub(amount);
    }

    function _gatherAll() internal {
        currentVotes = 0;
        for (uint256 i = 0; i < _electors.length; i++) {
            _gather(_electors[i]);
        }
    }

    function _gather(Elector storage self) internal {
        uint256 votes = 0;
        for (uint256 i = 0; i < self.votes.length; i++) {
            votes = votes.add(self.votes[i]);
        }
        self.pastVotes = self.pastVotes.add(votes);
        delete self.candidates;
        delete self.votes;
    }

    function _updateTotalVotes() internal {
        totalVotes = 0;
        for (uint256 i = 0; i < _electors.length; i++) {
            totalVotes = totalVotes.add(_electors[i].pastVotes);
        }
        if (lastWinner != address(0)) {
            _winner_rewards[lastWinner] = _winner_rewards[lastWinner].add(
                WINNER_REWARDS
            );
            for (i = 0; i < bonusCurrencies.length; i++) {
                if (bonuses[i] > 0) {
                    _winner_bonus[i][lastWinner] = _winner_bonus[i][lastWinner]
                        .add(bonuses[i]);
                    bonuses[i] = 0;
                }
            }
        }
    }

    function _top(uint256[] memory winners, uint256 index) private view {
        uint256 winner = 0;
        for (uint256 i = 1; i < _candidates.length; i++) {
            bool ignore = false;
            for (uint256 j = 0; j < index; j++) {
                if (winners[j] == 0) {
                    break;
                }
                if (winners[j] == i) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) {
                continue;
            }

            if (
                winner == 0 || _candidates[i].votes > _candidates[winner].votes
            ) {
                winner = i;
            }
        }
        if (winner > 0) {
            winners[index] = winner;
        }
    }

    function _awardTeam() internal {
        devRewards = devRewards.add(DEV_REWARDS);
        techRewards = techRewards.add(TECH_REWARDS);
    }

    function _addBonus(string memory currency, uint256 amount) internal {
        uint256 index;
        bool found;
        (index, found) = _currencyIndex(currency);
        if (found) {
            bonuses[index] = bonuses[index].add(amount);
        }
    }
}
