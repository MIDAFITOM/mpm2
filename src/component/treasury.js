import serojs from 'serojs';
import seropp from 'sero-pp';
import BigNumber from "bignumber.js";

// v6
const TREASURY_ADDR = "2WLb9KS5WrHDk1HxNNV1bKc3hY5KJ63Vq2vAgJNpQhHU2cXQB5eVNiCRSPYXc4toHBExkqGJTQsgWekFQbXqAzvE";
const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "currency",
                "type": "string"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "x",
                "type": "bytes32"
            }
        ],
        "name": "bytes32ToString",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    }
];


const contract = serojs.callContract(abi, TREASURY_ADDR);

class Treasury {
    callMethod(_method, mainPkr, _args, callback) {
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: mainPkr,
            to: TREASURY_ADDR,
            data: packData
        }

        seropp.call(callParams, function (callData) {
            if (callData !== "0x") {
                let res = contract.unPackData(_method, callData);
                if (callback) {
                    callback(res);
                }
            } else {
                callback("0x0");
            }
        });
    }
    executeMethod(_method, fromPK, mainPKr, args, value, cy, callback) {
        console.log("method: %s, args: %s", _method, args);
        let packData = contract.packData(_method, args);
        let executeData = {
            from: fromPK,
            to: TREASURY_ADDR,
            value: "0x" + value.toString(16),//SERO
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: cy,
        };
        let estimateParam = {
            from: mainPKr,
            to: TREASURY_ADDR,
            value: "0x" + value.toString(16),//SERO
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: cy,
        }
        seropp.estimateGas(estimateParam, function (gas) {
            executeData["gas"] = gas;
            seropp.executeContract(executeData, function (res) {
                if (callback) {
                    callback(res)
                }
            })
        });
    }

    owner(mainPKr, callback) {
        this.callMethod("owner", mainPKr, [], callback);
    }

    deposit(fromPK, mainPKr, cy, value, callback) {
        console.log("deposit %s %s", value, cy);
        this.executeMethod("deposit", fromPK, mainPKr, [], value, cy, callback);
    }

    withdraw(fromPK, mainPKr, cy, value, callback) {
        console.log("withdraw fromPK: %s, mainPKr: %s, currency: %s, value: %s", fromPK, mainPKr, cy, value)
        // withdraw 可能要使用fromPK来预估Gas，否则会预估错误，因为碰到了OnlyOwner修饰器
        this.executeMethod("withdraw", fromPK, mainPKr, [cy, value.toString()], 0, "SERO", callback);
    }
    withdrawByOwner(fromPK, mainPKr, value, callback) {
        console.log("fromPK: %s, mainPKr: %s, value: %s", fromPK, mainPKr, value)
        // withdraw 可能要使用fromPK来预估Gas，否则会预估错误，因为碰到了OnlyOwner修饰器
        this.executeMethod("withdrawSeroByOwner", fromPK, fromPK, [value.toString()], 0, "SERO", callback);
    }
    withdrawByEvery(fromPK, mainPKr, value, callback) {
        console.log("fromPK: %s, mainPKr: %s, value: %s", fromPK, mainPKr, value)
        this.executeMethod("withdrawSeroByEvery", fromPK, mainPKr, [value.toString()], 0, "SERO", callback);
    }
    withdrawToOp(fromPK, mainPKr, value, callback) {
        console.log("fromPK: %s, mainPKr: %s, value: %s", fromPK, mainPKr, value)
        this.executeMethod("withdrawSeroToOp", fromPK, fromPK, [value.toString()], 0, "SERO", callback);
    }

    // admin only
    transferOwnership(fromPK, mainPKr, newOwnerPKr, callback) {
        console.log("transferOwnership fromPK: %s, mainPKr: %s, newOwner: %s", fromPK, mainPKr, newOwnerPKr)
        this.executeMethod("transferOwnership", fromPK, mainPKr, [newOwnerPKr], 0, "SERO", callback);
    }
}

const treasury = new Treasury();
export default treasury;