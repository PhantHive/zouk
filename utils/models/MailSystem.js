const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    _id: String,
    discord_id: Number,
    discord_tag: String,
    first_name: String,
    second_name: String,
    promo: Number,
    email: String

});

const myDB = mongoose.connection.useDb('ipsa_students');
module.exports = myDB.model('students', guildSchema);