const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    server_id: String,
    channel_id: String,
    theme: Number, //image category
    color: String, //color

});

const myDB = mongoose.connection.useDb('zouk');
module.exports = myDB.model('welcomes', guildSchema);