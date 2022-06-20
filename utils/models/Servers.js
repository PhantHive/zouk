const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    discord_id: Number,
    ipsa_24: Boolean,
    ipsa_25: Boolean,
    ipsa_26: Boolean,
    ipsa_27: Boolean,
    join_ipsa_of: Number,
    join_ipsa_24: Number,
    join_ipsa_25: Number,
    join_ipsa_26: Number,
    join_ipsa_27: Number

});

const myDB = mongoose.connection.useDb('ipsa_students');
module.exports = myDB.model('servers', guildSchema);