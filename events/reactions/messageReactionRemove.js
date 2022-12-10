const RDB = require("../../utils/models/Rules");
const {EmbedBuilder} = require("discord.js");

module.exports = async (client, messageReaction, user) => {


    // check if user is bot
    if (user.bot) return;

    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    RDB.findOne({
        server_id: `${messageReaction.message.guild.id}`
    }, async (err, data) => new Promise(async (resolve, reject) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data && messageReaction.emoji.name === "✅") {
            let member = messageReaction.message.guild.members.cache.get(user.id);

            try {
                let role = messageReaction.message.guild.roles.cache.get(data.role_id);
                member.roles.remove(role)
                    .catch(() => reject("Role not found: not set in /rules"));
            } catch (error) {
                reject("Role not found: not set in /rules");
            }

            // send DM to user for removal of rules role
            const embed = new EmbedBuilder()
                .setColor("#f10000")
                .setTitle("Rules Removed")
                .setDescription(`You have removed your approval of the: ${messageReaction.message.guild.name} rules!`)
                .setTimestamp()
                .setFooter({ text: `Removed by ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
            member.send({ embeds: [embed] });

            resolve();
        }

    }));

}
