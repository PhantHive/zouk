const { globalCmd, studentCmd, trainCmd } = require('../../dataHandler.js');
const {trainCmd} = require("../../dataHandler");

module.exports = (client) => {
    console.log("Z-MUSE ONLINE")
    globalCmd(client);
    studentCmd(client, "880499115878932571");
    trainCmd(client, "502931781012684818");
}