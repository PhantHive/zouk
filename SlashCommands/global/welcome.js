const {ActionRowBuilder, SelectMenuBuilder, ChannelType} = require("discord.js");
// custom
const { customThemeWelcome, customColorWelcome, selectChannelId} = require("./src/welcome/custom");
const WDB = require("../../utils/models/Welcomes");
const {editOptions} = require("./src/welcome/edit");
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    name: "welcome",
    aliases: ["welc"],
    run: async (client, interaction) => {


        const choice = interaction.options.getString("config");

        WDB.findOne({
                server_id: `${interaction.guild.id}`
            },
            async (err, data) => {

                if (err) {
                    console.log(err);
                    return interaction.reply({ content: "An error occured while searching in the database. Please try again later." });
                }

                let channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).map(c => {
                    return {
                        label: `${c.name}`,
                        value: `${c.id}`
                    }
                });

                if (channels.length > 25) {
                    channels.splice(24, channels.length - 23)
                }

                if (choice === "reset" && !data) {
                    return interaction.reply("There is no welcome message set up on this server.")
                }
                else if (choice === "reset" && data) {
                    await data.remove();
                    return interaction.reply("Welcome message has been reset.")
                }
                else if (choice === "edit" && !data) {
                    return interaction.reply("There is no welcome message set up on this server. Use `welcome setup` to set up a welcome message.")
                }
                else if (choice === "edit" && data) {
                    data.isEdit = true;
                    data.save();
                    await editOptions(interaction);
                }
                else {
                    if (!data) {

                        await selectChannelId(client, interaction, channels);

                    }
                    else if (data.theme !== -1 && data.color !== "#000000" && data.server_id !== "0" && data.channel_id !== "0") {
                        await interaction.reply({ content: "Everything has been set already! If you want to change anything use `welcome edit`" });
                    }
                    else {
                        await interaction.reply({ content: "Seems like you missed some informations during the configuration." +
                                "\nLet's go back to where you were the last time." });
                        await wait(5000);
                        if (data.channel_id === "0") {
                            await selectChannelId(client, interaction, channels);
                        }
                        else if (data.theme === -1) {
                            await customThemeWelcome(client, interaction);
                        }
                        else if (data.color === "#000000") {
                            await customColorWelcome(client, interaction);
                        }

                    }
                }

            }

        )



    }

}