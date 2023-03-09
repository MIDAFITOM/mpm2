import serojs from 'serojs';
import seropp from 'sero-pp';
import BigNumber from "bignumber.js";

// v2
// const ADDR = "H6nxNFtCsy4PrXwVyjHro4tiNp8fD5UiYbUuAzwUvv9eKumSLcDRJPhejmU9jSXxQhHLg899hqi9cgWduMNUa1V";
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "addrStr",
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
        "name": "addr",
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
                "name": "addr_",
                "type": "address"
            },
            {
                "name": "addrStr_",
                "type": "string"
            }
        ],
        "name": "setAddr",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// v3
const ADDR = "42hx9yT6dWo2vxyJUyxqB1698PB8gVtcthi2u9G93Yon6ExC2QP8ghMdjMdNyPjSK3bY7wTzb7HQhTvKcZq47nU7";

const SERO_CURRENCY = "SERO";

const contract = serojs.callContract(ABI, ADDR);

class SmartTrigger {
    callMethod(_method, mainPkr, _args, callback) {
        console.log(_method, _args);
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

    addr(mainPKr, callback) {
        this.callMethod("addr", mainPKr, [], callback);
    }

    addrStr(mainPKr, callback) {
        this.callMethod("addrStr", mainPKr, [], callback);
    }

    setAddr(fromPK, mainPKr, addr, callback) {
        this.executeMethod("setAddr", fromPK, mainPKr, [addr, addr], SERO_CURRENCY, 0, callback);
    }
}

const smartTrigger = new SmartTrigger();
export default smartTrigger;