pragma solidity ^0.4.25;

import "./seroInterface.sol";
import "./Strings.sol";
import "./BaseVote.sol";

contract DAO is BaseVote, SeroInterface {
    string private constant SERO_CURRENCY = "SERO";
    string private constant MIDAFI_CURRENCY = "MIDAFI";
    uint256[9] private allocatedBalances;

    constructor(
        uint256 nextAwardTime_,
        uint256 votePeriod_,
        uint256 voteInterval_,
        uint256 awardDuration_,
        uint256 oneDay_,
        uint256 dayOffset_
    )
        public
        BaseVote(
            nextAwardTime_,
            votePeriod_,
            voteInterval_,
            awardDuration_,
            oneDay_,
            dayOffset_
        )
    {
        addCurrency(0, SERO_CURRENCY);
    }

    function triggerVote() public {
        _awardAt(tx.origin, now);
    }

    function voteLeaderboardOf(
        uint256 index
    ) public view returns (uint256, string) {
        require(index >= 0 && index < 6, "DAO: out of range");
        Candidate[] memory winners = _leaderboard(6);
        if (index < winners.length) {
            return (winners[index].votes, winners[index].electedStr);
        } else {
            return (0, "");
        }
    }

    function allocatedBalanceOf(
        string memory currency
    ) public view returns (uint256) {
        uint256 index;
        bool found;
        (index, found) = _currencyIndex(currency);
        if (found) {
            return allocatedBalances[index];
        } else {
            return 0;
        }
    }

    function vote(address elected, string electedStr) public payable {
        require(!Utils.isContract(msg.sender));
        require(Strings.equal(MIDAFI_CURRENCY, sero_msg_currency()));
        require(msg.value > 0, "DAO: no votes");
        _awardAt(msg.sender, now);
        _voteAt(msg.sender, msg.value, elected, electedStr, now);
    }

    function revoke() public {
        uint256 amount = votesOf(msg.sender);
        amount = amount.add(pastVotesOf(msg.sender));
        if (amount == 0) {
            return;
        }
        _revoke(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function withdrawVoterRewards() public {
        uint256 amount = voterRewardsOf(msg.sender);
        _withdrawVoterRewards(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function withdrawWinnerRewards() public {
        uint256 amount = winnerRewardsOf(msg.sender);
        if (amount > 0) {
            _withdrawWinnerRewards(msg.sender, amount);
            require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
        }
        for (uint256 i = 0; i < bonusCurrencies.length; i++) {
            string storage currency = bonusCurrencies[i];
            if (bytes(currency).length == 0) {
                continue;
            }
            amount = winnerBonusOf(msg.sender, currency);
            if (amount > 0) {
                _withdrawWinnerBonus(msg.sender, currency, amount);
                require(sero_send(msg.sender, currency, amount, "", ""));
                allocatedBalances[i] = allocatedBalances[i].sub(amount);
            }
        }
    }

    function withdrawDevRewards(uint256 amount) public {
        _withdrawDevRewards(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function withdrawTechRewards(uint256 amount) public {
        _withdrawTechRewards(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function addBonus() public payable {
        for (uint256 i = 0; i < bonusCurrencies.length; i++) {
            string storage currency = bonusCurrencies[i];
            if (bytes(currency).length == 0) {
                continue;
            }
            if (sero_balanceOf(currency) > allocatedBalances[i]) {
                uint256 bonus = sero_balanceOf(currency);
                bonus = bonus.sub(allocatedBalances[i]);
                _addBonus(currency, bonus);
                allocatedBalances[i] = allocatedBalances[i].add(bonus);
            }
        }
    }
}
