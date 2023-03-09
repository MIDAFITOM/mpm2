pragma solidity ^0.4.25;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./Utils.sol";

contract BasePool is Ownable {
    using SafeMath for uint256;

    uint256 public dailyQuota = 3.164e19;
    uint256 public ratioMidafi = 1000;
    uint256 public ratioSero = 100;
    uint256 public batchSize_bp = 10;
    uint256 public oneDay_bp;
    uint256 public dayOffset_bp;
    uint256 public totalStaked;
    uint256 public totalBurned;
    uint256 public totalStakedValid;

    uint256 public totalShares;
    uint256 private _lastModified_bp;
    uint256 private _lastClaimed_bp;

    struct Stake {
        uint256 sero;
        uint256 totalSero;
        uint256 staked;
        uint256 totalStaked;
        uint256 weight;
        uint256 shares;
        uint256 interest;
        uint256 totalInterest;
        uint256 lastGas;
        uint256 updatedTimestamp;
    }
    struct Partner {
        address pkr;
        string addrStr;
        uint256 shares;
        uint256 balance;
    }
    Partner[5] private _partners;
    Stake[] private _stakes;
    mapping(address => uint256) private _indexes;

    constructor(uint256 oneDay_, uint256 dayOffset_) public {
        oneDay_bp = oneDay_;
        dayOffset_bp = dayOffset_;
        _stakes.push(
            Stake({
                sero: 0,
                lastGas: 0,
                totalSero: 0,
                totalStaked: 0,
                weight: 0,
                shares: 0,
                staked: 0,
                interest: 0,
                totalInterest: 0,
                updatedTimestamp: 0
            })
        );
        _partners[0].shares = 50;
        _partners[1].shares = 20;
        _partners[2].shares = 20;
        _partners[3].shares = 5;
        _partners[4].shares = 5;
    }

    function interestOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].interest;
        }
        return 0;
    }

    function totalStakedOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].totalStaked;
        }
        return 0;
    }

    function stakedOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].staked;
        }
        return 0;
    }

    function weightOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].weight;
        }
        return 0;
    }

    function sharesOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].shares;
        }
        return 0;
    }

    function seroBalanceOf(address owner) public view returns (uint256) {
        uint256 index = _indexes[owner];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].sero;
        }
        return 0;
    }

    function updateTimeOf(address account) public view returns (uint256) {
        uint256 index = _indexes[account];
        if (index > 0 && index < _stakes.length) {
            return _stakes[index].updatedTimestamp;
        }
        return 0;
    }

    function partnerByIndex(uint256 index) public view returns (address) {
        return _partners[index].pkr;
    }

    function partnerStrByIndex(uint256 index) public view returns (string) {
        return _partners[index].addrStr;
    }

    function partnerSharesByIndex(uint256 index) public view returns (uint256) {
        return _partners[index].shares;
    }

    function partnerBalanceByIndex(
        uint256 index
    ) public view returns (uint256) {
        return _partners[index].balance;
    }

    function _depositMidafiAt(
        address owner,
        uint256 amount,
        uint256 weight,
        uint256 timestamp
    ) internal {
        require(
            weight == 100 ||
                weight == 110 ||
                weight == 120 ||
                weight == 130 ||
                weight == 140 ||
                weight == 150,
            "BasePool: invalid weight"
        );
        uint256 index = _indexes[owner];
        if (index == 0) {
            _addNewStakeAt(owner, amount, weight, timestamp);
        } else {
            Stake storage investor = _stakes[index];
            _addCollateral(investor, amount);
            _setWeight(investor, weight);
        }
    }

    function _withdrawMidafi(
        address owner,
        uint256 amount
    ) internal returns (uint256) {
        uint256 index = _indexes[owner];
        require(
            index > 0 && index < _stakes.length,
            "BasePool: index out of range"
        );
        uint256 staked = _stakes[index].staked;
        require(staked >= amount, "BasePool: Insufficient balance");
        Stake storage investor = _stakes[index];
        _reduceCollateral(investor, amount);
        _updateShare(investor);
    }

    function _depositSeroAt(
        address owner,
        uint256 amount,
        uint256 timestamp
    ) internal {
        uint256 index = _indexes[owner];
        if (index == 0) {
            _addNewStakeAt(owner, 0, 100, timestamp);
            index = _indexes[owner];
        }
        require(
            index > 0 && index < _stakes.length,
            "BasePool: index out of range"
        );
        Stake storage investor = _stakes[index];
        _addSero(investor, amount);
    }

    function _withdrawSero(address owner, uint256 amount) internal {
        uint256 index = _indexes[owner];
        require(
            index > 0 && index < _stakes.length,
            "BasePool: index out of range"
        );
        Stake storage investor = _stakes[index];
        _reduceSero(investor, amount);
    }

    function _profit(address owner, uint256 amount) internal {
        require(amount <= interestOf(owner), "BasePool: Insufficient profit");
        uint256 index = _indexes[owner];
        require(
            index > 0 && index < _stakes.length,
            "BasePool: index out of range"
        );
        Stake storage investor = _stakes[index];
        return _profit(investor, amount);
    }

    function _profit(Stake storage investor, uint256 amount) internal {
        require(investor.interest >= amount, "BasePool: insufficient balance");
        investor.interest = investor.interest.sub(amount);
    }

    function _reinvest(address owner, uint256 amount) internal {
        require(amount <= interestOf(owner), "BasePool: Insufficient profit");
        uint256 index = _indexes[owner];
        require(
            index > 0 && index < _stakes.length,
            "BasePool: index out of range"
        );
        Stake storage investor = _stakes[index];
        return _reinvest(investor, amount);
    }

    function _reinvest(Stake storage investor, uint256 amount) internal {
        require(investor.interest >= amount, "BasePool: insufficient balance");
        investor.interest = investor.interest.sub(amount);
        investor.staked = investor.staked.add(amount);
        investor.totalStaked = investor.totalStaked.add(amount);
        totalStaked = totalStaked.add(amount);
    }

    function _claimAt(address account, uint timestamp) internal {
        _poolSnapshotAt(timestamp);
        uint256 gasSum = 0;
        uint256 index = _indexes[account];
        if (index != 0) {
            Stake storage investor = _stakes[index];
            uint256 cost = _claimAt(investor, timestamp);
            if (cost > 0) {
                gasSum = gasSum.add(cost);
            }
        }
        for (uint256 i = 0; i < batchSize_bp; i++) {
            if (_lastClaimed_bp == 0) {
                _lastClaimed_bp++;
                continue;
            }
            if (_lastClaimed_bp >= _stakes.length) {
                _lastClaimed_bp = _lastClaimed_bp.sub(_stakes.length);
            }

            investor = _stakes[_lastClaimed_bp];
            cost = _claimAt(investor, timestamp);
            if (cost > 0) {
                gasSum = gasSum.add(cost);
            }

            _lastClaimed_bp++;
            if (_lastClaimed_bp >= _stakes.length) {
                _lastClaimed_bp = _lastClaimed_bp.sub(_stakes.length);
            }
        }
        if (gasSum > 0) {
            _distribute(gasSum);
        }
    }

    function _claimAt(
        Stake storage investor,
        uint timestamp
    ) private returns (uint256) {
        if (investor.weight == 0) {
            return 0;
        }
        if (
            Utils.sameDay(
                investor.updatedTimestamp,
                timestamp,
                oneDay_bp,
                dayOffset_bp
            )
        ) {
            return 0;
        }
        if (
            investor.updatedTimestamp == 0 &&
            Utils.sameDay(investor.lastGas, timestamp, oneDay_bp, dayOffset_bp)
        ) {
            return 0;
        }

        uint256 gas = investor.staked.mul(ratioSero).div(ratioMidafi);
        if (investor.sero < gas) {
            return 0;
        }
        investor.sero = investor.sero.sub(gas);
        investor.lastGas = gas;
        totalBurned = totalBurned.add(gas);
        uint256 myLastModified = investor.updatedTimestamp;
        investor.updatedTimestamp = timestamp;
        if (myLastModified == 0) {
            return gas;
        }
        uint256 claimable = dailyQuota.mul(investor.shares).div(totalShares);
        investor.interest = investor.interest.add(claimable);
        return gas;
    }

    function _partnerWithdraw(
        address owner,
        uint256 amount,
        uint256 index
    ) internal {
        require(index < _partners.length, "BasePool: index out of range");
        require(owner == _partners[index].pkr, "BasePool: not your balance");
        require(
            _partners[index].balance >= amount,
            "BasePool: Insufficient balance"
        );
        _partners[index].balance = _partners[index].balance.sub(amount);
    }

    function _addNewStakeAt(
        address owner,
        uint256 amount,
        uint256 weight,
        uint256 timestamp
    ) internal {
        _indexes[owner] = _stakes.length;
        _stakes.push(
            Stake({
                sero: 0,
                totalSero: 0,
                totalStaked: amount,
                weight: weight,
                shares: amount.mul(weight).div(100),
                staked: amount,
                interest: 0,
                totalInterest: 0,
                updatedTimestamp: 0,
                lastGas: timestamp
            })
        );
        totalStaked = totalStaked.add(amount);
    }

    function _poolSnapshotAt(uint timestamp) private {
        if (
            Utils.sameDay(timestamp, _lastModified_bp, oneDay_bp, dayOffset_bp)
        ) {
            return;
        }
        totalShares = 0;
        totalStakedValid = 0;
        for (uint256 i = 1; i < _stakes.length; i++) {
            _updateShare(_stakes[i]);
            totalShares = totalShares.add(_stakes[i].shares);
            uint256 gas = _stakes[i].staked.mul(ratioSero).div(ratioMidafi);
            if (_stakes[i].updatedTimestamp > 0 && _stakes[i].sero >= gas) {
                totalStakedValid = totalStakedValid.add(_stakes[i].staked);
            }
        }
        _lastModified_bp = timestamp;
    }

    function _updateShare(Stake storage investor) private {
        if (investor.updatedTimestamp == 0) {
            return;
        }
        uint256 validMidafi = investor.staked;
        if (
            investor.updatedTimestamp != 0 &&
            investor.lastGas.mul(ratioMidafi).div(ratioSero) < validMidafi
        ) {
            validMidafi = investor.lastGas.mul(ratioMidafi).div(ratioSero);
        }
        uint256 newShares = validMidafi.mul(investor.weight).div(100);
        uint256 gas = investor.staked.mul(ratioSero).div(ratioMidafi);
        if (investor.updatedTimestamp == 0 || investor.sero < gas) {
            newShares = 0;
        }
        if (newShares != investor.shares) {
            investor.shares = newShares;
        }
    }

    function _addSero(Stake storage investor, uint256 amount) private {
        investor.sero = investor.sero.add(amount);
        investor.totalSero = investor.totalSero.add(amount);
    }

    function _reduceSero(Stake storage investor, uint256 amount) private {
        investor.sero = investor.sero.sub(amount);
        investor.totalSero = investor.totalSero.sub(amount);
    }

    function _addCollateral(Stake storage investor, uint256 amount) private {
        investor.totalStaked = investor.totalStaked.add(amount);
        investor.staked = investor.staked.add(amount);
        totalStaked = totalStaked.add(amount);
    }

    function _reduceCollateral(Stake storage investor, uint256 amount) private {
        investor.totalStaked = investor.totalStaked.sub(amount);
        investor.staked = investor.staked.sub(amount);
        totalStaked = totalStaked.sub(amount);
    }

    function _setWeight(Stake storage investor, uint256 weight) private {
        investor.weight = weight;
    }

    function _distribute(uint256 gas) private {
        uint256 total = 0;
        for (uint256 i = 0; i < _partners.length; i++) {
            total = total.add(_partners[i].shares);
        }
        if (total <= 0) {
            return;
        }
        for (i = 0; i < _partners.length; i++) {
            _partners[i].balance = _partners[i].balance.add(
                gas.mul(_partners[i].shares).div(total)
            );
        }
    }

    function setDailyQuota(uint256 newDailyQuota) public onlyOwner {
        dailyQuota = newDailyQuota;
    }

    function setRatioMidafi(uint256 newRatioMidafi) public onlyOwner {
        require(newRatioMidafi != 0, "BasePool: invalid parameter");
        ratioMidafi = newRatioMidafi;
    }

    function setRatioSero(uint256 newRatioSero) public onlyOwner {
        ratioSero = newRatioSero;
    }

    function setPoolBatchSize(uint256 newBatchSize) public onlyOwner {
        batchSize_bp = newBatchSize;
    }

    function setPartner(
        address partner,
        string addrStr,
        uint256 index
    ) public onlyOwner {
        require(
            index > 0 && index < _partners.length,
            "BasePool: index out of range"
        );
        _partners[index].pkr = partner;
        _partners[index].addrStr = addrStr;
    }

    function setPartnerShares(uint256 share, uint256 index) public onlyOwner {
        require(
            index >= 0 && index < _partners.length,
            "BasePool: index out of range"
        );
        _partners[index].shares = share;
    }
}
