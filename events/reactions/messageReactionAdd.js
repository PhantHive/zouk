const RDB = require("../../utils/models/rules.js");
const {EmbedBuilder} = require("discord.js");

module.exports = async (client, messageReaction, user) => {


    // check if user is bot
    if (user.bot) return;

    // If the message is partial, fetch it
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
            console.log("Fetching message reaction");
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    // using RDB check if the message is a rules message and if it is, check if the reaction is a checkmark
    RDB.findOne({
        server_id: `${messageReaction.message.guild.id}`
    }, async (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data && messageReaction.emoji.name === "✅") {
            // If the reaction is a checkmark, add the role to the user
            let member = messageReaction.message.guild.members.cache.get(user.id);
            let role = messageReaction.message.guild.roles.cache.get(data.role_id);

            member.roles.add(role);

            // send DM to user
            const embed = new EmbedBuilder()
                .setColor("#4BF100")
                .setTitle("Rules Accepted")
                .setDescription(`You have accepted the rules of ${messageReaction.message.guild.name}!`)
                .setTimestamp()
                .setFooter({ text: `Accepted by ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
            member.send({ embeds: [embed] });

        }

    });

}