const {SelectMenuBuilder, ActionRowBuilder} = require("discord.js");


const editOptions = async (interaction) => {

    let actionRow = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("edit_rules")
                .setPlaceholder("Choose an option")
                .addOptions(
                    {
                        label: "Edit channel id",
                        emoji: "📝",
                        value: "edit_channel_id",
                    },
                    {
                        label: "Edit message id",
                        emoji: "🗨️",
                        value: "edit_message_id",
                    },
                    {
                        label: "Edit role id",
                        emoji: "👮",
                        value: "edit_role_id",
                    }
                )
        )

    await interaction.reply({ content: "What do you wish to edit?", components: [actionRow] })
}


module.exports = {
    editOptions
}
