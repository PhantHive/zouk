const { Client, Intents, Collection} = require('discord.js');
const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
);

//require('dotenv').config();

const client = new Client({
    partials: ["CHANNEL"],
    intents: myIntents
});

client.mongoose = require('./utils/mongose.js');

["aliases", "commands", "SlashCmds"].forEach(x => client[x] = new Collection());
["console", "event", "slash"].forEach(x => require(`./handler/${x}`)(client));

client.mongoose.init();
client.login(process.env.TOKEN);









