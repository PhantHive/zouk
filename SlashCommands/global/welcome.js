const {ActionRowBuilder, SelectMenuBuilder, ChannelType} = require("discord.js");
// custom
const { customThemeWelcome } = require("./src/welcome/custom");




module.exports = {
    name: "welcome",
    aliases: ["welc"],
    run: async (client, interaction) => {

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

}