pragma solidity ^0.4.25;

import "./seroInterface.sol";
import "./Ownable.sol";
import "./Utils.sol";
import "./Strings.sol";
import "./BasePool.sol";
import "./Dividend.sol";

contract StakingPool is BasePool, Dividend, SeroInterface {
    string private constant SERO_CURRENCY = "SERO";
    string private constant MIDAFI_CURRENCY = "MIDAFI";
    uint256 private _lastDistribute;

    constructor(
        address _dao,
        string _daoStr,
        uint256 oneDay_,
        uint256 dayOffset_
    ) public BasePool(oneDay_, dayOffset_) Dividend(oneDay_, dayOffset_) {
        setPartner(_dao, _daoStr, 1);
    }

    function depositMidafi(uint256 weight) public payable {
        require(Strings.equal(MIDAFI_CURRENCY, sero_msg_currency()));
        require(!Utils.isContract(msg.sender));
        _depositMidafiAt(msg.sender, msg.value, weight, now);
    }

    function withdrawMidafi(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        _withdrawMidafi(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function depositSero() public payable {
        require(Strings.equal(SERO_CURRENCY, sero_msg_currency()));
        require(!Utils.isContract(msg.sender));
        _depositSeroAt(msg.sender, msg.value, now);
    }

    function withdrawSero(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        address owner = msg.sender;
        _withdrawSero(owner, amount);
        require(sero_send(owner, SERO_CURRENCY, amount, "", ""));
    }

    function profit(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        _profit(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function reinvest(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        _reinvest(msg.sender, amount);
    }

    function claim() public {
        _claimAt(tx.origin, now);

        if (
            !Utils.sameRound(_lastDistribute, now) &&
            partnerBalanceByIndex(0) > 0
        ) {
            _lastDistribute = now;
            uint256 balance = partnerBalanceByIndex(0);
            _partnerWithdraw(address(0), balance, 0);
            _increase(balance);
        }
        _dividendAt(tx.origin, now);
    }

    function centennialDepositMidafi() public payable {
        require(Strings.equal(MIDAFI_CURRENCY, sero_msg_currency()));
        require(!Utils.isContract(msg.sender));
        _centennialDepositMidafiAt(msg.sender, msg.value, now);
    }

    function centennialWithdrawMidafi(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        _centennialWithdrawMidafi(msg.sender, amount);
        require(sero_send(msg.sender, MIDAFI_CURRENCY, amount, "", ""));
    }

    function centennialWithdrawSero(uint256 amount) public {
        require(!Utils.isContract(msg.sender));
        _centennialWithdrawSero(msg.sender, amount);
        require(sero_send(msg.sender, SERO_CURRENCY, amount, "", ""));
    }

    function partnerWithdraw(uint256 amount, uint256 index) public {
        require(!Utils.isContract(msg.sender));
        _partnerWithdraw(msg.sender, amount, index);
        require(sero_send(msg.sender, SERO_CURRENCY, amount, "", ""));
    }

    function daoWithdraw() public {
        uint256 index = 1;
        address dao = partnerByIndex(index);
        uint256 amount = partnerBalanceByIndex(index);
        if (amount == 0) {
            return;
        }
        _partnerWithdraw(dao, amount, index);
        require(sero_send(dao, SERO_CURRENCY, amount, "", ""));
    }
}
