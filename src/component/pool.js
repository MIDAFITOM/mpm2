import serojs from 'serojs';
import seropp from 'sero-pp';
import Web3 from 'sero-web3';
import BigNumber from "bignumber.js";

// v41
const ADDR = "2MVgtpLi18PQgwMZFv3p6VEKJRFhkfX1rXBRYnF6EREJieUcBbWNhPPWTrKwgamZBDs3DYod3rnMouje85soj3A9";
const ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "profit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "weight",
                "type": "uint256"
            }
        ],
        "name": "depositMidafi",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dividendTotalShares",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalStakedValid",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "oneDay_ds",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
        "name": "dividendBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "drtMidafi",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalShares",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "seroInDividendOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "partnerByIndex",
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
        "inputs": [],
        "name": "centennialDepositMidafi",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amount",
                "type": "uint256"
            },
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "partnerWithdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "updateTimeOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "newRatioMidafi",
                "type": "uint256"
            }
        ],
        "name": "setRatioMidafi",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "depositSero",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dayOffset_ds",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "newDailyQuota",
                "type": "uint256"
            }
        ],
        "name": "setDailyQuota",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "reinvest",
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
        "constant": false,
        "inputs": [
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "centennialWithdrawMidafi",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "inputs": [
            {
                "name": "newRatioSero",
                "type": "uint256"
            }
        ],
        "name": "setRatioSero",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "totalStakedOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dayOffset_bp",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "partnerStrByIndex",
        "outputs": [
            {
                "name": "",
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
                "name": "newBatchSize",
                "type": "uint256"
            }
        ],
        "name": "setDividendBatchSize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "ratioSero",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "seroBalanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "centennialWithdrawSero",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "batchSize_ds",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "stakedOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unclaimedDividendBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawMidafi",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "partnerBalanceByIndex",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unallocatedDividendBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "partnerSharesByIndex",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "ratioMidafi",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "daoWithdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "midafiInDividendOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "batchSize_bp",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "share",
                "type": "uint256"
            },
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "setPartnerShares",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "oneDay_bp",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
        "name": "totalBurned",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "interestOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "dailyQuota",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "weightOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "newBatchSize",
                "type": "uint256"
            }
        ],
        "name": "setPoolBatchSize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "partner",
                "type": "address"
            },
            {
                "name": "addrStr",
                "type": "string"
            },
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "setPartner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "sharesOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
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
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawSero",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_dao",
                "type": "address"
            },
            {
                "name": "_daoStr",
                "type": "string"
            },
            {
                "name": "oneDay_",
                "type": "uint256"
            },
            {
                "name": "dayOffset_",
                "type": "uint256"
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
    }
];

const MIDAFI_CURRENCY = "MIDAFI";

const contract = serojs.callContract(ABI, ADDR);

class Pool {
    details(mainPkr, callback) {
        let dailyQuota;
        let totalShares;
        let shares;
        this.dailyQuota(mainPkr, function (res) {
            dailyQuota = res;
        });
        this.totalShares(mainPkr, function (res) {
            totalShares = res;
        });
        this.sharesOf(mainPkr, function (res) {
            shares = res;
        });
        callback({
            dailyQuota: dailyQuota,
            totalShares: totalShares,
            shares: shares,
        });
    }

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

    async dailyQuota(mainPKr, callback) {
        this.callMethod("dailyQuota", mainPKr, [], callback);
    }

    async totalStaked(mainPKr, callback) {
        this.callMethod("totalStaked", mainPKr, [], callback);
    }

    async totalBurned(mainPKr, callback) {
        this.callMethod("totalBurned", mainPKr, [], callback);
    }

    async totalShares(mainPKr, callback) {
        this.callMethod("totalShares", mainPKr, [], callback);
    }

    async totalStakedValid(mainPKr, callback) {
        this.callMethod("totalStakedValid", mainPKr, [], callback);
    }

    async dividendTotalBalance(mainPKr, callback) {
        this.callMethod("dividendTotalBalance", mainPKr, [], callback);
    }

    async dividendBalance(mainPKr, callback) {
        this.callMethod("dividendBalance", mainPKr, [], callback);
    }

    async stakedOf(mainPKr, callback) {
        this.callMethod("stakedOf", mainPKr, [mainPKr], callback);
    }

    async sharesOf(mainPKr, callback) {
        this.callMethod("sharesOf", mainPKr, [mainPKr], callback);
    }

    async interestOf(mainPKr, callback) {
        this.callMethod("interestOf", mainPKr, [mainPKr], callback);
    }

    async seroBalanceOf(mainPKr, callback) {
        this.callMethod("seroBalanceOf", mainPKr, [mainPKr], callback);
    }

    async partner(mainPKr, index, callback) {
        this.callMethod("partnerByIndex", mainPKr, [index], callback);
    }

    async partnerStrByIndex(mainPKr, index, callback) {
        this.callMethod("partnerStrByIndex", mainPKr, [index], callback);
    }

    async partnerShare(mainPKr, index, callback) {
        this.callMethod("partnerSharesByIndex", mainPKr, [index], callback);
    }

    async partnerBalance(mainPKr, index, callback) {
        this.callMethod("partnerBalanceByIndex", mainPKr, [index], callback);
    }

    async ratioMidafi(mainPKr, callback) {
        this.callMethod("ratioMidafi", mainPKr, [], callback);
    }

    async ratioSero(mainPKr, callback) {
        this.callMethod("ratioSero", mainPKr, [], callback);
    }

    depositMidafi(fromPK, mainPKr, amount, weight, callback) {
        this.executeMethod("depositMidafi", fromPK, mainPKr, [weight], MIDAFI_CURRENCY, amount, callback);
    }

    withdrawMidafi(fromPK, mainPKr, amount, callback) {
        this.executeMethod("withdrawMidafi", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    depositSero(fromPK, mainPKr, amount, callback) {
        this.executeMethod("depositSero", fromPK, mainPKr, [], "SERO", amount, callback);
    }

    withdrawSero(fromPK, mainPKr, amount, callback) {
        this.executeMethod("withdrawSero", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    profit(fromPK, mainPKr, amount, callback) {
        this.executeMethod("profit", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    reinvest(fromPK, mainPKr, amount, callback) {
        this.executeMethod("reinvest", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    claim(fromPK, mainPKr, callback) {
        this.executeMethod("claim", fromPK, mainPKr, [], "SERO", 0, callback);
    }

    async centennialMidafiOf(mainPKr, callback) {
        this.callMethod("midafiInDividendOf", mainPKr, [mainPKr], callback);
    }

    async centennialSeroOf(mainPKr, callback) {
        this.callMethod("seroInDividendOf", mainPKr, [mainPKr], callback);
    }

    centennialDepositMidafi(fromPK, mainPKr, amount, callback) {
        this.executeMethod("centennialDepositMidafi", fromPK, mainPKr, [], MIDAFI_CURRENCY, amount, callback);
    }

    centennialWithdrawMidafi(fromPK, mainPKr, amount, callback) {
        this.executeMethod("centennialWithdrawMidafi", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    centennialWithdrawSero(fromPK, mainPKr, amount, callback) {
        this.executeMethod("centennialWithdrawSero", fromPK, mainPKr, [amount.toString()], "SERO", 0, callback);
    }

    daoWithdraw(fromPK, mainPKr, callback) {
        this.executeMethod("daoWithdraw", fromPK, mainPKr, [], "SERO", 0, callback);
    }
}

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://light.seronode.io/"))

let poolBalance = new BigNumber(0);
try {
    poolBalance = web3.sero.getBalance(ADDR, "latest");
} catch (error) {
    console.log("get latest Pool balance error: ", error);
}

export { poolBalance, ADDR as poolAddr };
const pool = new Pool();
export default pool;