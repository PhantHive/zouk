
const { MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

module.exports = async (client, message) => {


    if (message.author.bot) return;

    if (message.channel.type === "DM") {


        // temporary
        if (message.content.includes("linkstart")) {

            let already_verif = false;
            await client.channels.fetch("988195875367030815")
                .then(async chann => {
                    await chann.messages.fetch()
                        .then(messages => {
                            messages.forEach(msg => {
                                msg.embeds.forEach((embed) => {
                                    if (embed.title.includes(message.author.id)) {
                                        already_verif = true
                                    }
                                })

                            });
                        });
                });

            if (already_verif) {
                message.reply("Vous êtes déjà vérifié. Vous avez perdu le lien? le voici: https://discord.gg/tEC9eTKZef")
            }
            else {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('yes')
                            .setLabel('OUI')
                            .setStyle('PRIMARY'),

                        new MessageButton()
                            .setCustomId('no')
                            .setLabel('NON...')
                            .setStyle('DANGER'),
                    );

                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('QUESTIONS (1/3)')
                    .setDescription('> J\'espère que tu vas bien, procédons à la vérification' +
                        '\n> Toutes tes informations (INE/NOM/PRENOM) seront transmises sur un serveur de stockage temporaire et seront supprimées après ' +
                        'vérification finale.' +
                        '\n> Souhaites-tu procéder ?')
                    .setImage('https://c.tenor.com/7-CNilpY-l8AAAAd/link-start-sao.gif')

                await message.reply({ embeds: [embed], components: [row] });
            }

        }

    }


}