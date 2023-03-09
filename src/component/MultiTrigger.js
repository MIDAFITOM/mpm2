import serojs from 'serojs';
import seropp from 'sero-pp';
import BigNumber from "bignumber.js";

// v43
const ADDR = "3kU7y9u5adJScg9LJkgAS2CcSKTB47YSoXjyzMJUsLHewV3yQFtABFZ8LFZUsDMBvg7YeudcpFWxhvKPNKHkGStA";
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "pool",
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
        "name": "daoStatus",
        "outputs": [
            {
                "name": "json",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dao",
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
        "inputs": [],
        "name": "poolInfo",
        "outputs": [
            {
                "name": "json",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "trigger",
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
        "constant": true,
        "inputs": [],
        "name": "daoInfo",
        "outputs": [
            {
                "name": "json",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
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
        "constant": true,
        "inputs": [],
        "name": "poolStatus",
        "outputs": [
            {
                "name": "json",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
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
        "inputs": [
            {
                "name": "pool_",
                "type": "address"
            },
            {
                "name": "dao_",
                "type": "address"
            }
        ],
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

const SERO_CURRENCY = "SERO";

const contract = serojs.callContract(ABI, ADDR);

class MultiTrigger {
    callMethod(_method, mainPkr, _args, callback) {
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: mainPkr,
            to: ADDR,
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

    executeMethod(_method, fromPK, mainPKr, args, cy, value, callback) {
        console.log("args: ", args);
        let packData = contract.packData(_method, args);
        let executeData = {
            from: fromPK,
            to: ADDR,
            value: "0x" + value.toString(16),//SERO
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: cy,
        };
        let estimateParam = {
            from: mainPKr,
            to: ADDR,
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

    trigger(fromPK, mainPKr, callback) {
        this.executeMethod("trigger", fromPK, mainPKr, [], SERO_CURRENCY, 0, callback);
    }

    async poolStatus(mainPKr, callback) {
        this.callMethod("poolStatus", mainPKr, [], callback);
    }
    async poolInfo(mainPKr, callback) {
        this.callMethod("poolInfo", mainPKr, [], callback);
    }
    async daoStatus(mainPKr, callback) {
        this.callMethod("daoStatus", mainPKr, [], callback);
    }
    async daoInfo(mainPKr, callback) {
        this.callMethod("daoInfo", mainPKr, [], callback);
    }

}

const multiTrigger = new MultiTrigger();
export default multiTrigger;