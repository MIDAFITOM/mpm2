import serojs from 'serojs';
import seropp from 'sero-pp';
import Web3 from 'sero-web3';
import BigNumber from "bignumber.js";

// v34
const ADDR = "s6i8yBLpH8NDT1iAS9VWVb29JQada9FdeXrE1mvFnkn2aNmVqSdPQP78KDU7JSJMP7U6Cqx3bMnHM6yQm6Lh4gw";
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "dayOffset",
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
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "bonusCurrencies",
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
        "constant": true,
        "inputs": [],
        "name": "totalVotes",
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
                "name": "account",
                "type": "address"
            },
            {
                "name": "currency",
                "type": "string"
            }
        ],
        "name": "winnerBonusOf",
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
        "name": "triggerVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "addBonus",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "techAddrStr",
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
        "constant": true,
        "inputs": [],
        "name": "voteStartTime",
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
                "name": "elected",
                "type": "address"
            },
            {
                "name": "electedStr",
                "type": "string"
            }
        ],
        "name": "vote",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdrawVoterRewards",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "currency",
                "type": "string"
            }
        ],
        "name": "allocatedBalanceOf",
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
        "name": "awardDuration",
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
        "name": "voteInterval",
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
        "name": "withdrawWinnerRewards",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "name": "nextAwardTime",
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
        "name": "withdrawDevRewards",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "dev_",
                "type": "address"
            },
            {
                "name": "devStr_",
                "type": "string"
            }
        ],
        "name": "setDev",
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
        "name": "pastVotesOf",
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
        "name": "oneDay",
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
        "name": "setBatchSize",
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
                "name": "votePeriod_",
                "type": "uint256"
            }
        ],
        "name": "setVotePeriod",
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
        "name": "winnerRewardsOf",
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
                "name": "currency",
                "type": "string"
            }
        ],
        "name": "bonusOf",
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
        "name": "voteLeaderboardOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
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
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "votesOf",
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
                "name": "account",
                "type": "address"
            }
        ],
        "name": "voterRewardsOf",
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
                "name": "dayOffset_",
                "type": "uint256"
            }
        ],
        "name": "setDayOffset",
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
        "constant": true,
        "inputs": [],
        "name": "lastRewardTime",
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
        "name": "currentVotes",
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
        "name": "lastWinnerVotes",
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
        "name": "voteEndTime",
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
        "name": "devRewards",
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
        "name": "lastWinnerElectedStr",
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
        "constant": true,
        "inputs": [],
        "name": "votePeriod",
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
        "name": "withdrawTechRewards",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            },
            {
                "name": "currency",
                "type": "string"
            }
        ],
        "name": "addCurrency",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "revoke",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "removeCurrency",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "devAddrStr",
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
                "name": "tech_",
                "type": "address"
            },
            {
                "name": "techStr_",
                "type": "string"
            }
        ],
        "name": "setTech",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "name": "techRewards",
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
                "name": "oneDay_",
                "type": "uint256"
            }
        ],
        "name": "setOneDay",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "batchSize",
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
                "name": "voteInterval_",
                "type": "uint256"
            }
        ],
        "name": "setVoteInterval",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "nextAwardTime_",
                "type": "uint256"
            },
            {
                "name": "votePeriod_",
                "type": "uint256"
            },
            {
                "name": "voteInterval_",
                "type": "uint256"
            },
            {
                "name": "awardDuration_",
                "type": "uint256"
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

const SERO_CURRENCY = "SERO";
const MIDAFI_CURRENCY = "MIDAFI";

const contract = serojs.callContract(ABI, ADDR);

class Vote {
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

    async nextAwardTime(mainPKr, callback) {
        this.callMethod("nextAwardTime", mainPKr, [], callback);
    }
    async voteStartTime(mainPKr, callback) {
        this.callMethod("voteStartTime", mainPKr, [], callback);
    }
    async voteEndTime(mainPKr, callback) {
        this.callMethod("voteEndTime", mainPKr, [], callback);
    }
    async votesOf(mainPKr, callback) {
        this.callMethod("votesOf", mainPKr, [mainPKr], callback);
    }
    async pastVotesOf(mainPKr, callback) {
        this.callMethod("pastVotesOf", mainPKr, [mainPKr], callback);
    }
    async updateTimeOf(mainPKr, callback) {
        this.callMethod("updateTimeOf", mainPKr, [mainPKr], callback);
    }
    async voterRewardsOf(mainPKr, callback) {
        this.callMethod("voterRewardsOf", mainPKr, [mainPKr], callback);
    }
    async winnerRewardsOf(mainPKr, callback) {
        this.callMethod("winnerRewardsOf", mainPKr, [mainPKr], callback);
    }
    async winnerBonusOf(mainPKr, currency, callback) {
        this.callMethod("winnerBonusOf", mainPKr, [mainPKr, currency], callback);
    }
    async voteLeaderboardOf(mainPKr, index, callback) {
        this.callMethod("voteLeaderboardOf", mainPKr, [index], callback);
    }
    async lastWinnerVotes(mainPKr, callback) {
        this.callMethod("lastWinnerVotes", mainPKr, [], callback);
    }
    async lastWinnerElectedStr(mainPKr, callback) {
        this.callMethod("lastWinnerElectedStr", mainPKr, [], callback);
    }
    async allocatedBalanceOf(mainPKr, currency, callback) {
        console.log("vote.allocatedBalance called");
        this.callMethod("allocatedBalanceOf", mainPKr, [currency], callback);
    }
    async bonusOf(mainPKr, currency, callback) {
        this.callMethod("bonusOf", mainPKr, [currency], callback);
    }

    vote(fromPK, mainPKr, elected, amount, callback) {
        this.executeMethod("vote", fromPK, mainPKr, [elected, elected], MIDAFI_CURRENCY, amount, callback);
    }

    revoke(fromPK, mainPKr, callback) {
        this.executeMethod("revoke", fromPK, mainPKr, [], SERO_CURRENCY, 0, callback);
    }

    withdrawVoterRewards(fromPK, mainPKr, callback) {
        this.executeMethod("withdrawVoterRewards", fromPK, mainPKr, [], MIDAFI_CURRENCY, 0, callback);
    }

    withdrawWinnerRewards(fromPK, mainPKr, callback) {
        this.executeMethod("withdrawWinnerRewards", fromPK, mainPKr, [], SERO_CURRENCY, 0, callback);
    }

    trigger(fromPK, mainPKr, callback) {
        this.executeMethod("triggerVote", fromPK, mainPKr, [], SERO_CURRENCY, 0, callback);
    }

    withdrawBonusFromPool(fromPK, mainPKr, callback) {
        this.executeMethod("withdrawBonusFromPool", fromPK, mainPKr, [], SERO_CURRENCY, 0, callback);
    }

    async devAddr(mainPKr, callback) {
        this.callMethod("devAddrStr", mainPKr, [], callback);
    }
    async techAddr(mainPKr, callback) {
        this.callMethod("techAddrStr", mainPKr, [], callback);
    }
    async devRewards(mainPKr, callback) {
        this.callMethod("devRewards", mainPKr, [], callback);
    }
    async techRewards(mainPKr, callback) {
        this.callMethod("techRewards", mainPKr, [], callback);
    }
    bonusCurrencies(mainPKr, index, callback) {
        this.callMethod("bonusCurrencies", mainPKr, [index], callback);
    }

    withdrawDevRewards(fromPK, mainPKr, amount, callback) {
        console.log("withdrawDevRewards");
        this.executeMethod("withdrawDevRewards", fromPK, mainPKr, [amount.toString()], SERO_CURRENCY, 0, callback);
    }
    withdrawTechRewards(fromPK, mainPKr, amount, callback) {
        console.log("withdrawTechRewards");
        this.executeMethod("withdrawTechRewards", fromPK, mainPKr, [amount.toString()], SERO_CURRENCY, 0, callback);
    }
}

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://light.seronode.io/"))

let voteBalance = new BigNumber(0);
try {
    voteBalance = web3.sero.getBalance(ADDR, "latest");
} catch (error) {
    console.log("get latest DAO balance error: ", error);
}

export { voteBalance, ADDR as voteAddr };
const vote = new Vote();
export default vote;