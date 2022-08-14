const {SelectMenuBuilder, ActionRowBuilder} = require("discord.js");

const customThemeWelcome = async (client, interaction) => {

    let actionRow = new ActionRowBuilder()

    actionRow.addComponents(
        new SelectMenuBuilder()
            .setCustomId("theme")
            .setPlaceholder("Choose a theme")
            .addOptions(
                {
                    label: "Planes",
                    emoji: "1008063352569872465",
                    value: "0",
                },
                {
                    label: "Waifu",
                    emoji: "1008062691765653554",
                    value: "1",
                },
                {
                    label: "Landscapes",
                    emoji: "1008063338355359834",
                    value: "2",
                }
            )
    )
    //await interaction.editReply({ content: "You may want to customize your welcome message :)." });
    await interaction.editReply({ content: "You may want to customize your welcome message :).", components: [actionRow] });



}

const customColorWelcome = async (client, interaction) => {

    let colorRow = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("color")
                .setPlaceholder("Choose a color")
                .addOptions(
                    {
                        label: "Blue",
                        emoji: "💙",
                        value: "blue",
                    },
                    {
                        label: "Red",
                        emoji: "♥️",
                        value: "red",
                    },
                    {
                        label: "Green",
                        emoji: "💚",
                        value: "green",
                    },
                    {
                        label: "Yellow",
                        emoji: "💛",
                        value: "yellow"
                    },
                    {
                        label: "Purple",
                        emoji: "💜",
                        value: "purple"
                    }
                )
        )
    //await interaction.editReply({ content: "Choose your color." });
    await interaction.editReply({ content: "Choose your color.", components: [colorRow] });
}


module.exports = {

    customThemeWelcome,
    customColorWelcome

}