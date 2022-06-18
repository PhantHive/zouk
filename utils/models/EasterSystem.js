const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    
    ID: String,
    thanksEaster: Number,
    loveEaster: Number

});


const myDB = mongoose.connection.useDb('ipsa_students');
module.exports =myDB.model('EasterSystem', guildSchema);