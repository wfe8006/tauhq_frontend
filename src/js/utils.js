const numberWithCommas = (n) => {
    var parts = parseFloat(n).toFixed(2).toString().split(".");
    return (
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (parts[1] ? "." + parts[1] : "")
    );
}




const timesince = (timestamp) => {
    if (timestamp == 0) {
        return "-";
    }
    var diff;
    diff = Date.now() / 1000 - timestamp;
    var interval;
    interval = diff / 86400;
    if (interval > 1) {
        //timestamp in milliseconds so * 1000
        const dateObject = new Date(timestamp * 1000);
        const humanDateFormat = dateObject.toLocaleString();
        return humanDateFormat.substring(0, 10);
        //return Math.floor(interval) + " days ago";
    }
    interval = diff / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hrs ago";
    }
    interval = diff / 60;
    if (interval > 1) {
        return Math.floor(interval) + " mins ago";
    }
    return Math.floor(diff) + " secs ago";
}

const nFormatter = (num, digits) => {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

module.exports = {
    numberWithCommas,
    timesince,
    nFormatter,

}