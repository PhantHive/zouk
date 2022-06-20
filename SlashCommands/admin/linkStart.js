
module.exports = {
    name: "linkstart",
    run: async (client, interaction) => {

        // ----------------
        // List of new students
        // ----------------

        const studs = ["239455598343618580"];
        console.log(client);
        for (const st of studs) {

            await client.users.fetch(st)
                .then((user, err) => {
                    if (err) {
                        console.log(err);
                    }

                    try {
                        user.send({ content: "Bonjour! Mon nom est **Zouk** le bot en charge de vérifier" +
                                "les ipsaliens ehe ;).\n Si tu reçois ce message c'est que tu as indiqué aux modos discord IPSA" +
                                "que tu avais été admis.\n Pour engager la discussion avec moi afin de te vérifier, je te prie de me répondre" +
                                "ainsi: **linkstart**" })
                            .catch(() => {
                                interaction.reply({ content: `User ${st} has DMs closed`, ephemeral: true });
                            });
                    } catch (err) {
                        console.log(err);
                    }
            })


        }

        interaction.reply({ content: "done.", ephemeral: true });

    }
};