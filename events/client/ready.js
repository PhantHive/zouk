const { globalCmd, studentCmd } = require('../../dataHandler.js');
const {trainCmd} = require("../../dataHandler");

module.exports = (client) => {
    console.log("Z-MUSE ONLINE")
    globalCmd(client);
    trainCmd(client, "502931781012684818");
    studentCmd(client, "880499115878932571");
}