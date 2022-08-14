const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { customThemeWelcome, customColorWelcome} = require("../../SlashCommands/global/src/welcome/custom");
const wait = require('node:timers/promises').setTimeout;
const WDB = require("../../utils/models/Welcomes.js");
const themes = require("../../assets/json/theme.json");

const isChannelValid = async (channel) => new Promise((resolve, reject) => {

    const id = Number(channel);
    if (Number.isInteger(id) && id !== 0 ) {
        resolve("Thank you! I will send welcome message in this channel.");
    }
    else {
        reject("Sorry, I can't send welcome message in this channel. It is probably not a valid channel.");
    }

})

const customNextStep = async (client, interaction, data) => {

    if (data.theme !== -1 && data.color !== "#000000") {
        await interaction.editReply({ content: `Your welcome message is fully setup! Congrats my boy.` +
                `\n**Channel**: <#${data.channel_id}>\n**Theme**: ${themes[data.theme]["name"]}\n**Color**: ${data.color}`, components: []})
    }
    else if (data.theme === -1) {
        await customThemeWelcome(client, interaction);
    }
    else {
        await customColorWelcome(client, interaction);
    }
}

const startSetup = async (client, interaction, data) => {

    if (interaction.values[0] === "manually") {
        await interaction.update({ content: "Please write the channel you want me to send welcome message in. (Either you can tag the channel #channel or give me the ID)", components: [] })

        const filter = i => i.author.id === interaction.author.id;
        const collector = interaction.channel.createMessageCollector(filter, { time: 30000 });

        collector.on("collect", async msg => {
            let channel;
            if (msg.content.startsWith("<#")) {
                channel = msg.content.match(/\d+/g)
            }
            else {
                channel = msg.content;
            }
            await isChannelValid(channel)
                .then(async res => {
                    await interaction.editReply({ content: res });
                    collector.stop();
                    data.channel_id = `${channel}`;
                    data.save();
                    await msg.delete({ timeout: 15000 });
                    await wait(1000);
                    await customNextStep(client, interaction, data); // checking where to go next

                })
                .catch(err => console.log(err));

        })
    }
    else {
        await isChannelValid(interaction.values[0])
            .then(async res => {
                await interaction.editReply({ content: res, components: [] })
                    .catch(async () => {
                        await interaction.update({ content: res, components: [] })
                    })
                data.channel_id = `${interaction.values[0]}`;
                data.save();
                await wait(2000);
                await customNextStep(client, interaction, data); // checking where to go next

            })
            .catch(err => console.log(err));

    }
    data.save();

}

module.exports = async (client, interaction) => {


    if (interaction.isCommand()) {

        let SlashCmds = client.SlashCmds.get(interaction.commandName);
        if (SlashCmds) return SlashCmds.run(client, interaction)

    }

    if (interaction.isSelectMenu()) {

        // welcome message
        if (interaction.customId === "channel_id") {

            WDB.findOne({
                    server_id: interaction.guild.id
                },
                async (err, data) => {
                    if (err) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                        return console.log(err);
                    }

                    if (!data) {
                        await new WDB({
                            server_id: `${interaction.guild.id}`,
                            channel_id: "0",
                            theme: -1,
                            color: "#000000"
                        }).save();

                        WDB.findOne({
                                server_id: interaction.guild.id
                            },
                            async (err, data) => {
                                if (err) {
                                    await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                                    return console.log(err);
                                }
                                await interaction.update({ content: "Wait a sec please...", components: [] });
                                await wait(1000);
                                await startSetup(client, interaction, data);
                            }
                        )

                    }
                    else if (data.channel_id !== "0") {
                        await interaction.update({ content: "The channel id has already been set. If you want to change it use /editwelcome." +
                                "\nGoing to the next step."});
                        await wait(2500);
                        await customThemeWelcome(client, interaction);
                    }
                    else {
                        await startSetup(client, interaction, data);
                    }

                }
            )


        }

        if (interaction.customId === "theme") {
            //await interaction.editReply({ content: `You have choosen ${interaction.values[0]} as your welcome message theme.` });
            WDB.findOne({
                    server_id: interaction.guild.id
                },
                async (err, data) => {
                    if (err) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                        return console.log(err);
                    }

                    if (!data) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                    }
                    else {

                        if (data.theme !== -1) {
                            await interaction.update({ content: "The theme has already been set. If you want to change it use /editwelcome." +
                                    "\nGoing to the next step."});
                            await wait(2500);
                            await customNextStep(client, interaction, data); // checking where to go next
                        }
                        data.theme = parseInt(interaction.values[0]);
                        await data.save();
                        await interaction.update({ content: `You have choosen ${themes[parseInt(interaction.values[0])]["name"]} as your welcome message theme.`, components: [] });
                        await wait(2000);
                        await customNextStep(client, interaction, data); // checking where to go next
                    }
                }
            )

        }
        if (interaction.customId === "color") {
            WDB.findOne({
                    server_id: interaction.guild.id
                },
                async (err, data) => {
                    if (err) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                        return console.log(err);
                    }

                    if (!data) {
                        await interaction.update({ content: "Sorry, A problem occured with the database. Please try again later." });
                    }
                    else {

                        if (data.color !== "#000000") {
                            await interaction.update({ content: "Seems like everything have already been set. If you want to change it use /editwelcome." });
                            await wait(2500);
                            await customColorWelcome(client, interaction);
                        }
                        data.color = interaction.values[0];
                        await data.save();
                        await interaction.update({ content: `Your welcome message is fully setup! Congrats my boy.` +
                                `\n**Channel**: <#${data.channel_id}>\n**Theme**: ${themes[data.theme]["name"]}\n**Color**: ${data.color}`, components: [] });
                        
                    }
                }
            )
            //await interaction.editReply({ content: "Your welcome message is fully setup! Congrats my boy" });

        }

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
                .setDescription('> Renseigne moi ton numéro INE (Tu trouveras ce N° sur le relevé de notes du BACCALAUREAT de français ou sur parcoursup).' +
                    '\nTu as juste à m\'écrire ce numéro à la suite de mon message.');

            await interaction.update({ embeds: [embed], components: [ ]});

            const filter = m => m.author.id !== client.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 35000, max: 1 });

            collector.on('collect', async m => {

                INE = m;

                if (INE.toString().length !== 11) {
                    return interaction.followUp("Vous avez renseignez un mauvais INE. Recommancer avec **linkstart**")
                }
                else {
                    const embed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('QUESTIONS (3/3)')
                        .setDescription('>Merci de renseigner ton nom de famille par message.');

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
                }

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