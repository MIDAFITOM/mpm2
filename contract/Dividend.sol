pragma solidity ^0.4.25;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./Utils.sol";

contract Dividend is Ownable {
    using SafeMath for uint256;
    struct Participant {
        uint256 sero;
        uint256 midafi;
        uint256 shares;
        uint256 updatedTimestamp;
    }
    uint256 public batchSize_ds = 10;
    uint256 public oneDay_ds;
    uint256 public dayOffset_ds;
    uint256 public unallocatedDividendBalance;
    uint256 public unclaimedDividendBalance;
    uint256 public dividendBalance;
    uint256 public dividendTotalShares;
    uint256 public drtMidafi;
    uint256 private _lastModified_ds;
    uint256 private _lastClaimed_ds;
    Participant[] private _participants;
    mapping(address => uint256) private _positions;
    mapping(address => uint256) private _joinTime;

    constructor(uint256 oneDay_, uint256 dayOffset_) public {
        oneDay_ds = oneDay_;
        dayOffset_ds = dayOffset_;
        _participants.push(
            Participant({sero: 0, midafi: 0, shares: 0, updatedTimestamp: 0})
        );
    }

    function midafiInDividendOf(address owner) public view returns (uint256) {
        uint256 index = _positions[owner];
        if (index > 0 && index < _participants.length) {
            return _participants[index].midafi;
        }
        return 0;
    }

    function seroInDividendOf(address owner) public view returns (uint256) {
        uint256 index = _positions[owner];
        if (index > 0 && index < _participants.length) {
            return _participants[index].sero;
        }
        return 0;
    }

    function _increase(uint256 amount) internal {
        unallocatedDividendBalance = unallocatedDividendBalance.add(amount);
    }

    function _dividendAt(address account, uint256 timestamp) internal {
        _dividentSnapshotAt(timestamp);
        if (dividendBalance == 0 || dividendTotalShares == 0) {
            return;
        }
        uint256 index = _positions[account];
        if (index != 0) {
            Participant storage pp = _participants[index];
            _dividendAt(pp, timestamp);
        }
        for (uint256 i = 0; i < batchSize_ds; i++) {
            if (_lastClaimed_ds == 0) {
                _lastClaimed_ds++;
                continue;
            }
            if (_lastClaimed_ds >= _participants.length) {
                _lastClaimed_ds = _lastClaimed_ds.sub(_participants.length);
            }
            pp = _participants[_lastClaimed_ds];
            _dividendAt(pp, timestamp);

            _lastClaimed_ds++;
            if (_lastClaimed_ds >= _participants.length) {
                _lastClaimed_ds = _lastClaimed_ds.sub(_participants.length);
            }
        }
    }

    function _centennialDepositMidafiAt(
        address owner,
        uint256 amount,
        uint256 timestamp
    ) internal {
        uint256 index = _positions[owner];
        if (index == 0) {
            index = _participants.length;
            _positions[owner] = index;
            _participants.push(
                Participant({
                    sero: 0,
                    midafi: 0,
                    shares: 0,
                    updatedTimestamp: timestamp
                })
            );
        }
        drtMidafi = drtMidafi.add(amount);
        Participant storage participant = _participants[index];
        _centennialDepositMidafi(participant, amount);
    }

    function _centennialWithdrawMidafi(address owner, uint256 amount) internal {
        uint256 index = _positions[owner];
        require(
            index > 0 && index < _participants.length,
            "Dividend: index out of range"
        );
        drtMidafi = drtMidafi.sub(amount);
        Participant storage participant = _participants[index];
        _centennialWithdrawMidafi(participant, amount);
    }

    function _centennialWithdrawSero(address owner, uint256 amount) internal {
        uint256 index = _positions[owner];
        require(
            index > 0 && index < _participants.length,
            "Dividend: index out of range"
        );
        Participant storage participant = _participants[index];
        _centennialWithdrawSero(participant, amount);
    }

    function _centennialDepositMidafi(
        Participant storage owner,
        uint256 amount
    ) private {
        owner.midafi = owner.midafi.add(amount);
    }

    function _centennialWithdrawMidafi(
        Participant storage owner,
        uint256 amount
    ) private {
        require(owner.midafi >= amount, "Dividend: Insufficient balance");
        owner.midafi = owner.midafi.sub(amount);
    }

    function _centennialWithdrawSero(
        Participant storage owner,
        uint256 amount
    ) private {
        require(owner.sero >= amount, "Dividend: Insufficient balance");
        owner.sero = owner.sero.sub(amount);
    }

    function _dividendAt(Participant storage p, uint256 timestamp) private {
        if (Utils.sameDay(p.updatedTimestamp, timestamp, oneDay_ds, dayOffset_ds)) {
            return;
        }
        p.updatedTimestamp = timestamp;
        uint256 income = dividendBalance.mul(p.shares).div(dividendTotalShares);
        p.sero = p.sero.add(income);
        unclaimedDividendBalance = unclaimedDividendBalance.sub(income);
    }

    function _dividentSnapshotAt(uint timestamp) private {
        if (Utils.sameDay(timestamp, _lastModified_ds, oneDay_ds, dayOffset_ds)) {
            return;
        }
        _lastModified_ds = timestamp;
        dividendTotalShares = 0;
        if (unallocatedDividendBalance == 0) {
            dividendBalance = 0;
            return;
        }
        for (uint256 i = 1; i < _participants.length; i++) {
            if (
                Utils.sameDay(
                    _participants[i].updatedTimestamp,
                    timestamp,
                    oneDay_ds,
                    dayOffset_ds
                )
            ) {
                continue;
            }
            if (_participants[i].shares != _participants[i].midafi) {
                _participants[i].shares = _participants[i].midafi;
            }

            dividendTotalShares = dividendTotalShares.add(
                _participants[i].midafi
            );
        }
        dividendBalance = unallocatedDividendBalance;
        unclaimedDividendBalance = unclaimedDividendBalance.add(
            unallocatedDividendBalance
        );
        unallocatedDividendBalance = 0;
    }

    function setDividendBatchSize(uint256 newBatchSize) public onlyOwner {
        batchSize_ds = newBatchSize;
    }
}
