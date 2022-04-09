const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    
    ID: String,
    thanksEaster: Number,
    loveEaster: Number

});


module.exports = mongoose.model('EasterSystem', guildSchema);