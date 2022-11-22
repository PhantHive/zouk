const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    server_id: String,
    channel_id: String,
    message_id: String, //image category

});

const myDB = mongoose.connection.useDb('zouk');
module.exports = myDB.model('rules', guildSchema);
