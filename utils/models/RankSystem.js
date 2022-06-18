const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    
    ID: String,
    serverID: String,
    XP: Number,
    LEVEL: Number,
    RANK: Number


});

const myDB = mongoose.connection.useDb('ipsa_students');
module.exports = myDB.model('RankSystem', guildSchema);