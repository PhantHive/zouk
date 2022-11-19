const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const ffmpeg = require("ffmpeg");
const wait = require('util').promisify(setTimeout);
const { songInfo } = require('./src/songDetail.js');
const { createReadStream } = require('fs');
const fs = require('fs');
const queueFile = './src/queue.json';
const queues = require(queueFile);
const path = require('path');

const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel
} = require('@discordjs/voice');


async function connectToChannel(song, channel, interaction) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    try {
        interaction.reply("I'm ready to play music for you!");

        await playSong(song, connection, interaction);

    } catch (error) {
        connection.destroy();
        throw error;
    }
}

async function playSong(song, connection, interaction) {


    // song details
    let title;
    let thumbnail;
    let songUrl;
    let ytbChannel;
    let timestamp;
    let streamOp = { seek: 0, volume: 1 };

    let player = new createAudioPlayer()

    let guildId = interaction.guild.id;

    let songInfos = await songInfo(song, interaction)

    title = songInfos[0]
    thumbnail = songInfos[1]
    songUrl = songInfos[2]
    ytbChannel = songInfos[3]
    timestamp = songInfos[4]

    await interaction.editReply(`🎹: **Playing: ${title}**`);

    if (!queues[guildId]) {
        queues[guildId] = {
            "queue": [songUrl],
            "curPlay": 0
        };
    }
    else {
        queues[guildId]["queue"].push(songUrl);
        queues[guildId]["curPlay"] = -1
    }

    fs.writeFile(path.join(__dirname, queueFile), JSON.stringify(queues, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
    });



    let stream = await play.stream(songUrl)
    let resource = createAudioResource(stream.stream,
        {
            inputType: StreamType.Arbitrary, inlineVolume:true
        });
    resource.volume.setVolume(1);
    connection.subscribe(player);
    player.play(resource);

}

module.exports = {
    name: "play",
    aliases: ["p", "pl"],
    run: async (client, interaction) => {
        const song = interaction.options.getString("song");
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(interaction.member.user.id);


        const userChannel = member.voice.channel;
        if (!userChannel) interaction.reply("You are not in a voice channel. <a:akali:891838504517115954>");


        await connectToChannel(song, userChannel, interaction);


    }

}
