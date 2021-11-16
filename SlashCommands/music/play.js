const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require("ffmpeg");
const wait = require('util').promisify(setTimeout);
const { songInfo } = require('./src/songDetail.js');

const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel,
} = require('@discordjs/voice');


module.exports = {
    name: "play",
    run: async (client, interaction) => {
        const song = interaction.options.getString("song");
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(interaction.member.user.id);

        // song details
        let title;
        let thumbnail;
        let songUrl;
        let ytbChannel;
        let timestamp;

        const userChannel = member.voice.channel;
        if (!userChannel) interaction.reply("You are not in a voice channel. <a:akali:891838504517115954>");

        let connection = await connectToChannel(userChannel);


        async function connectToChannel(channel) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            try {
                interaction.reply("I'm ready to play music for you!");
                await wait(1000);


                let songInfos = await songInfo(song, interaction)

                title = songInfos[0]
                thumbnail = songInfos[1]
                songUrl = songInfos[2]
                ytbChannel = songInfos[3]
                timestamp = songInfos[4]

                await interaction.editReply(`🎹: **Playing: ${title}**`);
                await entersState(connection, VoiceConnectionStatus.Ready, 300_000);
                return connection;
            } catch (error) {
                connection.destroy();
                throw error;
            }
        }



    }

}
