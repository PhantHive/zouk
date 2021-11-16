const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const ffmpeg = require("ffmpeg");
const wait = require('util').promisify(setTimeout);
const { songInfo } = require('./src/songDetail.js');
const { createReadStream } = require('fs');
const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel, AudioPlayer,
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
        let streamOp = { seek: 0, volume: 1 };

        let player = new AudioPlayer();

        const userChannel = member.voice.channel;
        if (!userChannel) interaction.reply("You are not in a voice channel. <a:akali:891838504517115954>");


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
                return connection;

            } catch (error) {
                connection.destroy();
                throw error;
            }
        }

        async function playSong() {
            let stream = await play.stream(songUrl)
            let resource = createAudioResource(stream.stream,
                {
                    inputType: StreamType.Arbitrary, inlineVolume:true
                });
            resource.volume.setVolume(0.7);
            connection.subscribe(player);
            player.play(resource);

        }

        let connection = await connectToChannel(userChannel);
        await playSong();




    }

}
