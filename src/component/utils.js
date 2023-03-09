import BigNumber from "bignumber.js";

function getDate(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

export function formatDate(time) {
    const Y = time.getFullYear();
    const M = getDate(time.getMonth() + 1);
    const d = getDate(time.getDate());
    const h = getDate(time.getHours());
    const m = getDate(time.getMinutes());
    // var s =getDate(time.getSeconds());
    return `${h}:${m} ${Y}/${M}/${d}`;

}

export function showPrice(price, decimalPlaces) {
    if (price) {
        let ret = new BigNumber(price).dividedBy(new BigNumber("1000")).toFixed(decimalPlaces);
        return trimNumber(ret);
    } else {
        return "0.000";
    }
}

export function decimals(val, decimal, decimalPlaces) {
    if (!val || val === 0) {
        return "0";
    }
    let text = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal)).toFixed(decimalPlaces, 1);
    return trimNumber(text);
}

export function sameDay(time1, time2) {
    // return parseInt((time1+28800) / 24 / 3600) === parseInt((time2+28800) / 24 / 3600)
    // return parseInt((time1+28800) / 3600) === parseInt((time2+28800) / 3600)
    return parseInt((time1 + 72000) / 24 / 3600) === parseInt((time2 + 72000) / 24 / 3600)
}

export function showPK(name, pk, len) {
    if (!pk) {
        return "";
    }
    if (!len) {
        len = 8;
    }
    return name + " " + pk.slice(0, len) + "..." + pk.slice(-len)
}

function trimNumber(numberStr) {
    if (numberStr.indexOf(".") > -1 && numberStr.charAt(numberStr.length - 1) === '0') {
        for (var i = numberStr.length - 1; i > 0; i--) {
            if (numberStr.charAt(i) !== '0') {
                if (numberStr.charAt(i) === '.') {
                    return numberStr.substring(0, i);
                } else {
                    return numberStr.substring(0, i + 1);
                }
            }
        }
    }
    return numberStr;
}

export function showAddr(pk, len) {
    if (pk === undefined || pk === "") { return ""; }
    if (!len) {
        len = 4;
    }
    return pk.slice(0, len) + "..." + pk.slice(-len)
}

export function computePower(totalInvestment) {
    let ti = decimals(totalInvestment, 18, 0);
    // console.log("totalInvestment in SERO:", ti);
    if (ti < 10) {
        return 100;
    } else if (ti >= 10 && ti < 5000) {
        return 110;
    } else if (ti >= 5000 && ti < 10000) {
        return 120;
    } else if (ti >= 10000 && ti <= 50000) {
        return 130;
    } else if (ti >= 50000 && ti <= 100000) {
        return 140;
    } else {
        return 150;
    }
}

export function showAmount(amount, decimals, dp) {
    let text = amount.dividedBy(new BigNumber(10).pow(decimals)).toFormat(dp, {
        decimalSeparator: '.', groupSeparator: ' ', groupSize: 3,
    });
    return trimNumber(text)
}

export function showCode(code, prefix, suffix) {
    if (!code) {
        return "";
    }
    return code.slice(0, prefix) + "****" + code.slice(-suffix)
}