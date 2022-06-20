const { verification } = require("./check/checkMail");
const MV = require('../../utils/models/MailSystem');
const { MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

module.exports = async (client, message) => {


    if (message.author.bot) return;


    if (message.channel.type === "DM") {

        if (message.content.lastIndexOf("@ipsa.fr") !== -1) {

            //message.reply("La vérification email est cloturé pour le moment. Contactez un Modo si besoin!");

            let mail = message.content;

            MV.findOne({
                    userId: message.author.id
                },

                async(err, mdata) => {
                    if (err) console.log(err);

                    if (message.author.bot) {
                        return;
                    }

                    if (!mdata) {
                        await new MV({
                            discord_id: message.author.id,
                            discord_tag: message.author.tag,
                            first_name: "",
                            second_name: "",
                            promo: 0,
                            email: ""
                        }).save()

                        //========================================VERIF MAIL

                        const mailVerif = new verification(mail, message, client);
                        mailVerif.startVerif().then(err => {
                                if (err) return console.log(err);
                            }
                        );


                    }
                    else if (mdata.email !== "") {
                        message.reply("Ce mail a déjà été enregistré.");
                    }
                    else {
                        // data is empty
                        //========================================VERIF MAIL
                        let mail = message.content;

                        const mailVerif = new verification(mail, message, client);
                        mailVerif.startVerif().then(err => {
                                if (err) return console.log(err);
                            }
                        );

                    }

                }
            );

        }
        else {
            // message.reply("La vérification email est cloturée pour le moment. Contactez un modérateur si besoin!");
            //message.reply("Pour effectuer une vérification de mail, tape ton mail d'IPSA sous format **prenom.nom@ipsa.fr**");
        }

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
                        '\n> Toute tes informations (INE/NOM/PRENOM) seront transmises sur un serveur de stockage temporaire et seront supprimés après ' +
                        'vérification finale.' +
                        '\n> Souhaites-tu procéder ?')
                    .setImage('https://c.tenor.com/7-CNilpY-l8AAAAd/link-start-sao.gif')

                await message.reply({ embeds: [embed], components: [row] });
            }

        }

    }


}