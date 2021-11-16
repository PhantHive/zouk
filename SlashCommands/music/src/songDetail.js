const Discord = require('discord.js');
const ytdl = require("ytdl-core");

module.exports =  {

    songInfo: function(song, interaction) {

        if (ytdl.validateURL(song)) {


            return ytdl.getInfo(song)
                .then(async res => {
                    let title = res.videoDetails.title;
                    let thumbnail = res.videoDetails.thumbnails.at(-1)["url"];
                    let songUrl = res.videoDetails.video_url;
                    let ytbChannel = res.videoDetails.author["name"];
                    let timestamp = res.videoDetails.lengthSeconds;

                    return [ title, thumbnail, songUrl, ytbChannel, timestamp ];
                })



        }



            /*let urlSong = song;
            let thumbnail = songInfo["bestThumbnail"].url;
            let songTitle = songInfo[title;
            let duration = songInfo[index].duration;
            let author = songInfo[index]['author'].name;*/

    }

}