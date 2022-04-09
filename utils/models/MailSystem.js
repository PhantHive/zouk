const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    userId: String,
    ipsaMail: String

});

const myDB = mongoose.connection.useDb('<dbname>');
module.exports = myDB.model('mailsystems', guildSchema);