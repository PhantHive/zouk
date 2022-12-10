const {SelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const RDB = require("../../../../utils/models/Rules");

const selectRulesChannelId = async (client, interaction, channels) => {
    let actionRow = new ActionRowBuilder()
        .addComponents(

            new SelectMenuBuilder()
                .setCustomId("rules_channel_id")
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

    let setupMsg = "Hello, Let's setup your rules message on this server!" +
        "\nAs I can only show you the 25 first channel, you may want to select the \"None of the above\" option if you want to select the channel manually.";

    await interaction.reply({ content: setupMsg, components: [actionRow] })
        .catch(async () => {
            await interaction.editReply({ content: setupMsg, components: [actionRow] })
        });
}

const selectMessageRulesId = async (client, interaction, channelId) => new Promise(async (resolve, reject) => {

    let channel;
    try {
         channel = await client.channels.fetch(channelId);
    }
    catch (e) {
        return reject("Problem in configuration. Please try again later or /rules reset and setup again.")
    }


    let selectMsg = "Please write the ID of the message you want me to set as Rules. If you don't know how to get the ID of a message, " +
        "please follow this guide: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-";

    await interaction.reply({ content: selectMsg })
        .catch(async () => {
            await interaction.editReply({ content: selectMsg })
        });

    const filter = m => m.author.id === interaction.user.id;

    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    await collector.on('collect', async (m) => {

        if (m.content === "cancel") {
            reject("Cancelled.")
            collector.stop();
        }
        else if (m.content === "none") {
            reject("No message will be edited." )
            collector.stop();
        }
        else {
            let message = await channel.messages.fetch(m.content)
                .catch(async () => {
                    await interaction.editReply({ content: "The message ID you entered is invalid." })
                    reject("The message ID you entered is invalid.");
                    collector.stop();
                });

            if (message) {
                let channelId;
                let messageId;
                RDB.findOne({
                        server_id: `${interaction.guild.id}`
                    },
                    async (err, data) => {
                        if (err) throw err;
                        if (data) {
                            data.message_id = m.content;
                            channelId = data.channel_id;
                            messageId = data.message_id;
                            data.save();
                        } else {
                            reject("Rules system is not setup on this server. Use /setup" );
                        }
                    }
                )
                // react to message with :white_check_mark:
                await message.react("✅");
                resolve(`Message ID ${m.content} is now set as Rules message. \nGoing to last step.`);
                collector.stop();
            }
        }
    });

});

const selectRulesRoleId = async (client, interaction, roles) => {
    console.log(roles.length);
    let actionRow = new ActionRowBuilder()
        .addComponents(

            new SelectMenuBuilder()
                .setCustomId("rules_role_id")
                .setPlaceholder("Select role to give.")
                .addOptions(
                    ...roles,
                    {
                        label: "None of the above",
                        description: "I will select the role manually.",
                        value: "manually"
                    }
                )

        )

    let setupMsg = "Hello, Let's setup your rules message on this server!" +
        "\nAs I can only show you the 25 first role, you may want to select the \"None of the above\" option if you want to select the role manually.";

    await interaction.reply({ content: setupMsg, components: [actionRow] })
        .catch(async () => {
            await interaction.editReply({ content: setupMsg, components: [actionRow] })
        });
}

module.exports = {

    selectRulesChannelId,
    selectMessageRulesId,
    selectRulesRoleId

}