const { Client, IntentsBitField, Collection} = require('discord.js');

let myIntents = new IntentsBitField();
myIntents.add( IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildIntegrations, IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers
);

require('dotenv').config();

const client = new Client({
    partials: ["CHANNEL"],
    intents: myIntents
});

client.mongoose = require('./utils/mongose.js');

["aliases", "commands", "SlashCmds"].forEach(x => client[x] = new Collection());
["console", "event", "slash"].forEach(x => require(`./handler/${x}`)(client));

client.mongoose.init();
client.login(process.env.TOKEN);









