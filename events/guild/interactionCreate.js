const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
module.exports = async (client, interaction) => {


    if (interaction.isCommand()) {

        let SlashCmds = client.SlashCmds.get(interaction.commandName);
        if (SlashCmds) return SlashCmds.run(client, interaction)

    }

    if (interaction.isButton()) {

        // ------------------
        // 2027 verif
        // ------------------

        if (interaction.customId === "yes") {

            let INE;

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('QUESTIONS (2/3)')
                .setDescription('> Renseigne moi ton numéro INE (Tu trouveras ce N° sur le relevé de notes du BACCALAUREAT de français ou sur parcoursup.' +
                    '\nTu as juste à m\'écrire ce numéro à la suite de mon message.');

            await interaction.update({ embeds: [embed], components: [ ]});

            const filter = m => m.author.id !== client.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 35000, max: 1 });

            collector.on('collect', async m => {

                INE = m;

                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('QUESTIONS (2/3)')
                    .setDescription('> Merci de renseigner ton nom par message.');

                await interaction.followUp({ embeds: [embed], components: [] });

                const last_filter = m => m.author.id !== client.user.id;
                const last_collector = interaction.channel.createMessageCollector({ last_filter, time: 35000, max: 1 });

                last_collector.on('collect', async m => {

                    client.channels.fetch("988195875367030815")
                        .then(chann => {


                            const embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(m.author.id)
                                .setDescription(`Nom complet: **${m}**
                                \nINE: **${INE}**`);

                            chann.send({ embeds: [embed] });
                        })


                    await interaction.followUp({ content: "Merci, la validation est terminée, voici le lien du serveur 2027:" +
                            "\nhttps://discord.gg/tEC9eTKZef" +
                            "\nMets toi à ton aise dans l'archipel 97! (chaque serveur de promo à sa thématique et \n" +
                            "on s'est dit qu'un peu de fraicheur dans une archipel serait parfaite! ;)" +
                            "\nPour toutes questions: Contactez un **Guardian** du 2027 ou un **Island Guards**" +
                            "\nUne fois que l'école nous auras transmise vos emails ipsa, une annonce sera faite" +
                            "\npour que vous puissiez procéder à la vérification finale. Profites de tes vacances!" +
                            "\n\nZouk, votre cher compagnon de route à votre écoute." })

                });

            });
        }

        if (interaction.customId === "no") {

            console.log("tye");

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('ANNULATION')
                .setDescription('> Annuler.');

            await interaction.update({ embeds: [embed], components: [ ] });

        }


    }

};