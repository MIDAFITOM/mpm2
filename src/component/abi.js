import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import { Toast } from 'antd-mobile-v2'
// import { decimals } from './utils'

const config = {
	name: "MIDAFI",
	contractAddress: "5uVhXNsdN8TQdZTSeLeCAvCqqBeY6j5E7JrGtcEmf9hAoR1WEY91UriaKGcf1usAtJ32cfvQHG9qVsWt6xDHXULQ",
	github: "https://gitee.com/midafitom/mpm",
	author: "midafi",
	url: document.location.href,
	logo: document.location.protocol + '//' + document.location.host + '/mpm/logo.png'
}

const MIDAFI = "MIDAFI";

const abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "winnerList",
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
		"name": "withdrawAirdrop",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "triggerStaticProfit",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "details",
		"outputs": [
			{
				"name": "json",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "registerNode",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "directCode",
				"type": "string"
			},
			{
				"name": "code",
				"type": "string"
			}
		],
		"name": "invest",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "reinvestValue",
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
		"inputs": [],
		"name": "buyToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
				"name": "initialOp",
				"type": "address"
			},
			{
				"name": "initialTech",
				"type": "address"
			},
			{
				"name": "initialCodeServiceAddr",
				"type": "address"
			},
			{
				"name": "initialAirdrop",
				"type": "address"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
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

const caddress = config.contractAddress;
const contract = serojs.callContract(abi, caddress);

class Abi {
	constructor() {
		let self = this;
		self.OnInit = new Promise(
			(resolve, reject) => {
				seropp.init(config, function (rest) {
					if (rest === 'success') {
						console.log("seropp init success");
						return resolve()
					} else {
						return reject(rest)
					}
				})
			}
		)
	}

	accountDetails(pk, callback) {
		console.log("account details");;
		seropp.getAccountDetail(pk, function (item) {
			if ("[object Map]" === item.Balance.toString()) {
				callback({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: item.Balance.get("SERO"), token: item.Balance.get(MIDAFI) })
			} else {
				callback({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: item.Balance["SERO"], token: 0 })
			}
		});
	}

	accountList(callback) {
		seropp.getAccountList(function (data) {
			let accounts = [];
			data.forEach(function (item, index) {
				if ("[object Map]" === item.Balance.toString()) {
					// console.log("item(map): ", item);
					let token = 0;
					if (item.Balance.has(MIDAFI)) {
						token = item.Balance.get(MIDAFI)
						// console.log("has midafi", token);
					}
					accounts.push({
						pk: item.PK,
						mainPKr: item.MainPKr,
						name: item.Name,
						balance: item.Balance.get("SERO"),
						token: token
					})
				} else {
					// console.log("item(not map): ", item);
					accounts.push({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: item.Balance["SERO"], token: 0 })
				}
			});
			callback(accounts)
		});
	}

	details(mainPkr, callback) {
		this.callMethod('details', mainPkr, [], function (json) {
			// console.log("raw result of details =>", JSON.stringify(json));
			if (!json || json === "0x0") {
				callback({
					lcode: "",
					rcode: "",
					parentCode: "",
					value: 0,
					totalInvestment: 0,
					totalStaticReward: 0,
					totalDynamicReward: 0,
					totalCollideReward: 0,
					totalDynamicDirectReward: 0,
					totalWinReward: 0,
					canWithdrawValue: 0,
					lAmount: 0,
					rAmount: 0,
					lTotalAmount: 0,
					rTotalAmount: 0,
					lchildsCode: "",
					rchildsCode: "",
					staticReward: 0,
					dynamicReward: 0,
					collideReward: 0,
					dynamicDirectReward: 0,
					dayRecommendAmount: 0,
					dayReward: 0,
					lValues: [0],
					rValues: [0],
					lastUpdated: 0,
					isLeft: 1,
				})
			} else {
				json = json.replace("\"parentCode\":\"\"\"\",", "");
				callback(JSON.parse(json));
			}
		});
	}

	triggerStaticProfit(from, mainPKr, callback) {
		this.executeMethod('triggerStaticProfit', from, mainPKr, [], 0, callback);
	}

	reinvest(from, mainPKr, value, callback) {
		this.executeMethod('reinvest', from, mainPKr, [value], 0, callback);
	}

	invest(from, mainPKr, value, directCode, code, callback) {
		this.executeMethod('invest', from, mainPKr, [directCode, code], value, callback);
	}

	withdraw(from, mainPKr, callback) {
		this.executeMethod('withdraw', from, mainPKr, [], 0, callback);
	}

	withdrawAirdrop(from, mainPKr, callback) {
		this.executeMethod('withdrawAirdrop', from, mainPKr, [], 0, callback);
	}

	getWinners(from, callback) {
		let that = this;
		let winnerList = [];
		let preWinnerList = [];
		that.callMethod("winnerList", from, [], function (json) {
			if (!json || json === "0x0") {
				callback({
					preWinnerList: [],
					winnerList: [],
					preWinnerPool: 0,
					winnerPool: 0
				})
			}
			let res = JSON.parse(json);
			if (res['preCode'] !== "") {
				let codes = res['preCode'].split(",");
				let values = res['preValues'];
				let amounts = res['preAmounts'];
				for (var i = 0; i < codes.length; i++) {
					preWinnerList.push({
						code: codes[i],
						value: values[i],
						amount: amounts[i]
					});
				}
			}

			if (res['code'] !== "") {
				let codes = res['code'].split(",");
				let amounts = res['amounts'];
				for (i = 0; i < codes.length; i++) {
					winnerList.push({
						code: codes[i],
						amount: amounts[i]
					});
				}
			}

			callback({
				preWinnerList: preWinnerList,
				winnerList: winnerList,
				preWinnerPool: res['preWinnerPool'],
				winnerPool: res['winnerPool']
			})
		});
	}

	callMethod(_method, from, _args, callback) {
		// let that = this;
		let packData = contract.packData(_method, _args);
		let callParams = {
			from: from,
			to: caddress,
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

	executeMethod(_method, from, mainPKr, args, value, callback) {
		// let that = this;
		let packData = contract.packData(_method, args);
		let executeData = {
			from: from,
			to: caddress,
			value: "0x" + value.toString(16),
			data: packData,
			gasPrice: "0x" + new BigNumber("1000000000").toString(16),
			cy: "SERO",
		};
		let estimateParam = {
			from: mainPKr,
			to: caddress,
			value: "0x" + value.toString(16),
			data: packData,
			gasPrice: "0x" + new BigNumber("1000000000").toString(16),
			cy: "SERO",
		}
		seropp.estimateGas(estimateParam, function (gas, err) {
			if (err) {
				Toast.fail("Unknow Gas Limit")
			} else {
				executeData["gas"] = gas;
				seropp.executeContract(executeData, function (res) {
					if (callback) {
						callback(res)
					}
				})
			}
		});
	}
}

const alpha = new Abi();
export default alpha;
