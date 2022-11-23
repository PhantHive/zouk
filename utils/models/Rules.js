const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    server_id: String,
    channel_id: String,
    message_id: String,
    role_id: String,
    isEdit: Boolean

});

const myDB = mongoose.connection.useDb('zouk');
module.exports = myDB.model('rules', guildSchema);
