const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({

    server_id: Number,
    channel_id: Number,
    img_cat: Number, //image category
    color: String, //color

});

const myDB = mongoose.connection.useDb('zouk');
module.exports = myDB.model('welcomes', guildSchema);