const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    _id: Number,
    discord_id: Number,
    warning_of: Number,
    warning_24: Number,
    warning_25: Number,
    warning_26: Number,
    warning_27: Number

});

const myDB = mongoose.connection.useDb('<dbname>');
module.exports = myDB.model('warnings', guildSchema);