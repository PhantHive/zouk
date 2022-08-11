const { globalCmd, studentCmd, trainCmd } = require('../../handler/slashData.js');
const CryptoJS = require("crypto-js");

module.exports = (client) => {
    console.log("Z-MUSE ONLINE")
    globalCmd(client);
    studentCmd(client, "880499115878932571");
    trainCmd(client, "502931781012684818");

    /*
    let name = CryptoJS.AES.encrypt("hmmm", process.env.AES).toString()
    console.log(name)
    console.log(CryptoJS.AES.decrypt("U2FsdGVkX1/CGzVvHYWew72BwcTyMtMXPtJANoSAdtHdi8urAOzM0slNbHnTstG0", process.env.AES).toString(CryptoJS.enc.Utf8));
    */
}