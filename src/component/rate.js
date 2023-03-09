import serojs from 'serojs';
import seropp from 'sero-pp';
import BigNumber from "bignumber.js";
const MPM_ADDR = "5uVhXNsdN8TQdZTSeLeCAvCqqBeY6j5E7JrGtcEmf9hAoR1WEY91UriaKGcf1usAtJ32cfvQHG9qVsWt6xDHXULQ";

const abi = [
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
    }
];
const contract = serojs.callContract(abi, MPM_ADDR);

class Rate {

    details(mainPkr, callback) {
        this.callMethod('details', mainPkr, [], function (json) {
            console.log("raw result of details =>", JSON.stringify(json));
            if (!json || json === "0x0") {
                callback(0);
            } else {
                json = json.replace("\"parentCode\":\"\"\"\",", "");
                callback(JSON.parse(json).totalInvestment);
            }
        });
    }

    callMethod(_method, from, _args, callback) {
        // let that = this;
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: from,
            to: MPM_ADDR,
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
}

const rate = new Rate();
export default rate;