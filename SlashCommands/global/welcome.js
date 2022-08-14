const {ActionRowBuilder, SelectMenuBuilder, ChannelType} = require("discord.js");
// custom
const { customThemeWelcome } = require("./src/welcome/custom");
const WDB = require("../../utils/models/Welcomes");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "welcome",
    aliases: ["welc"],
    run: async (client, interaction) => {


        WDB.findOne({
                server_id: interaction.guild.id
            },
            async (err, data) => {

                if (err) {
                    console.log(err);
                    return interaction.reply({ content: "An error occured while searching in the database. Please try again later." });
                }

                if (!data) {
                    let channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).map(c => {
                        return {
                            label: `${c.name}`,
                            value: `${c.id}`
                        }
                    });

                    if (channels.length > 25) {
                        channels.splice(24, channels.length - 23)
                    }

                    console.log(channels);

                    let actionRow = new ActionRowBuilder()
                        .addComponents(

                            new SelectMenuBuilder()
                                .setCustomId("channel_id")
                                .setPlaceholder("Select channel to send.")
                                .addOptions(
                                    ...channels,
                                    {
                                        label: "None of the above",
                                        description: "I will select the channel manually.",
                                        value: "manually"
                                    }
                                )

                        )

                    let setupMsg = "Hello, Let's setup your welcome message on this server!" +
                        "\nAs I can only show you the 25 first channel, you may want to select the \"None of the above\" option if you want to select the channel manually.";

                    await interaction.reply({ content: setupMsg, components: [actionRow] });
                }
                else if (data.theme !== 0 && data.color !== "#000000" && data.server_id !== 0 && data.channel_id !== 0) {
                    await interaction.reply({ content: "Everything has been set already! If you want to change anything use /editwelcome" });
                }
                else {
                    await interaction.reply({ content: "Seems like you missed some informations during the configuration." +
                            "\nLet's go back to where you were the last time." });
                    await wait(5000);
                    await customThemeWelcome(client, interaction);
                }


            }

        )



    }

}