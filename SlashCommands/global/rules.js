const {ActionRowBuilder, SelectMenuBuilder, ChannelType} = require("discord.js");
// custom
const { selectMessageRulesId, selectRulesChannelId, selectRulesRoleId} = require("./src/rules/custom");
const RDB = require("../../utils/models/Rules");
const {editOptions} = require("./src/rules/edit");
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    name: "rules",
    aliases: ["rl"],
    run: async (client, interaction) => {


        const choice = interaction.options.getString("config");

        RDB.findOne({
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

                let botNames = [];
                client.guilds.cache.get(interaction.guild.id).members.cache.forEach(member => {
                    if (member.user.bot) {
                        botNames.push(member.user.username);
                    }
                })

                let roles = interaction.guild.roles.cache.map(r => {
                    return {
                        label: `${r.name}`,
                        value: `${r.id}`
                    }
                });

                // filter roles to remove bots name roles
                roles = roles.filter(role => !botNames.includes(role.label));


                if (channels.length > 25) {
                    channels.splice(24, channels.length - 23)
                }

                if (roles.length > 25) {
                    roles.splice(24, roles.length - 23)
                }

                if (choice === "reset_rules" && !data) {
                    return interaction.reply("There is no rules message set up on this server.")
                }
                else if (choice === "reset_rules" && data) {
                    await data.remove();
                    return interaction.reply("Rules message has been reset.")
                }
                else if (choice === "edit_rules" && !data) {
                    return interaction.reply("There is no rules message set up on this server. Use `rules setup` to set up a rules message.")
                }
                else if (choice === "edit_rules" && data) {
                    data.isEdit = true;
                    data.save();
                    await editOptions(interaction);
                }
                else {
                    if (!data) {

                        await selectRulesChannelId(client, interaction, channels);

                    }
                    else if (data.channel_id !== "0" && data.message_id !== "0" && data.role_id !== "0") {
                        await interaction.reply({ content: "Everything has been set already! If you want to change anything use `rules edit`" });
                    }
                    else {
                        await interaction.reply({ content: "Seems like you missed some informations during the configuration." +
                                "\nLet's go back to where you were the last time." });
                        await wait(5000);
                        if (data.channel_id === "0") {
                            await selectRulesChannelId(client, interaction, channels);
                        }
                        else if (data.message_id === "0") {
                            await selectMessageRulesId(client, interaction, data.channel_id);
                        }
                        else if (data.role_id === "0") {
                            await selectRulesRoleId(client, interaction, roles);
                        }

                    }
                }

            }

        )



    }

}