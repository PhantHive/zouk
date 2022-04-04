const fs = require("fs");
const { MessageActionRow, MessageButton } = require('discord.js');
const {join} = require("path");

module.exports = {


    getFiles: async function(type, interaction, client) {

        const topic = interaction.options.getString('matiere');
        const sheet_dir = join(__dirname, `../../../assets/aero1Sources/${type}/${topic}`);

        try {
            fs.readdir(sheet_dir, async function (err, folders) {

                let rows = []
                if (err) {
                    interaction.reply({content: "Unable to scan directory"});
                    return console.log('Unable to scan directory: ' + err);
                }
                //listing all files using forEach

                const row = new MessageActionRow()

                    .addComponents(
                        new MessageButton()
                            .setCustomId(topic)
                            .setLabel(topic)
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                    )

                rows.push(row)

                folders.forEach(function (folder) {
                    let subrow = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(folder)
                                .setLabel(folder)
                                .setStyle('PRIMARY')
                        )
                    rows.push(subrow)
                })

                await interaction.reply({
                    content: `*FFE (fast file exporter) By IRIS Robotics* <a:Fast:960621566536847440>`,
                    components: rows
                })
                    .then(() => {
                        const collector = interaction.channel.createMessageComponentCollector({time: 15000});
                        collector.on('collect', async i => {

                            await i.reply("Working on it! WAIT FOR ME! *(the file might be too heavy)*")

                            let toSendFolder = `${sheet_dir}/${i.customId}/`;

                            fs.readdir(toSendFolder, function (err, files) {

                                files.forEach(function (file) {

                                    let lastUnder = file.lastIndexOf('_'); // Under = underscord, looking for the last inderscore index.
                                    const sheetType = file.split('_')[0];
                                    const subject = file.split('_')[1];
                                    let year = file.substr(lastUnder + 1)
                                    year = year.split('.')[0];
                                    let full_name = file.split('.')[0].split('_')[2]
                                    full_name = full_name.replace(/-/g, ' ');

                                    i.followUp({
                                        content: `<a:aniaressources:865350631560314890> **${sheetType}** concerning **${subject}** from *${full_name}* in ${year}`,
                                        files: [`${toSendFolder}/${file}`]
                                    })
                                        .catch(() => console.log("Request aborted"));
                                })
                            });


                            /*
                            */


                        })
                    })


            })


            /*interaction.reply({ content: `<a:aniaressources:865350631560314890> **${sheetType}** concerning **${subject}** from *${full_name}* in ${year}` ,
                files: [`${sheet_dir}/${file}`] });*/
        } catch (err) {
            await interaction.reply({content: `Error: ${err}`});
            console.log(err);
        }

    }

};