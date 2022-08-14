const MV = require('../../utils/models/MailSystem');
//mailVerif
let mailVerif = require("../../assets/admin/mailsVerif.json")

module.exports = (client, member) => {

    let guilds = ['880491243807846450', '880499115878932571', '755084203779162151', '608155753748103170', '809190693196529704', '932332814433673227', '932333114326405140'];

    MV.findOne({
            discord_id: member.id
        },

        async(err, data) => {
            if (!data) {
                member.createDM().then(channel => {
                    channel.send("Bonjour, je suis chargé de te vérifier!\n " +
                        "Envoie ton mail sous format: **prenom.nom@ipsa.fr**\n" +
                        "(environ 5 secondes sont nécessaire pour traiter ta demande)")

                }).catch(err => console.log(err))

                if (member.guild.id === "809190693196529704") {
                    const incrusteRole = member.guild.roles.cache.find(role => role.name === "Incruste");
                    member.roles.add(incrusteRole);
                }
            }
            else {
                member.createDM().then(channel => {
                    channel.send("Bonjour, tu as déjà été vérifé en accord avec notre base de données!\n" +
                        "Je procède aux vérifications serveur.");

                    let guilds = ['880491243807846450', '880499115878932571', '755084203779162151', '608155753748103170', '809190693196529704', '932332814433673227', '932333114326405140'];
                    guilds.forEach(serv => {
                        let guild = client.guilds.cache.get(serv);
                        let user = member.id;
                        let role;
                        let oldrole;

                        const check = async () => {
                            const verif = await guild.members.fetch(user);

                            if (verif) {

                                if (member.guild.id === "809190693196529704") {
                                    if (mailVerif["aero3_systeme"].includes(data.ipsaMail.toLowerCase())) {
                                        role = member.guild.roles.cache.find(r => r.id === "932997263079399434");
                                        oldrole = member.guild.roles.cache.find(r => r.name.includes("Incruste"));
                                    } else {
                                        const incrusteRole = member.guild.roles.cache.find(role => role.name.includes("Incruste"));
                                        member.roles.add(incrusteRole);

                                    }

                                } else {
                                    try {
                                        role = member.guild.roles.cache.find(r => r.name === "IPSAlien");
                                    } catch (error) {
                                    }

                                    try {
                                        oldrole = member.guild.roles.cache.find(r => r.name === "Invité");
                                    } catch (error) {
                                        try {
                                            oldrole = member.guild.roles.cache.find(r => r.name === "Incruste");
                                        } catch (error) {
                                        }
                                    }
                                }


                                guild.members.cache.get(user).roles.add(role);
                                guild.members.cache.get(user).roles.remove(oldrole);

                            }
                        }
                        check();


                    });

                }).catch(err => console.log(err))
            }

        }
    )

}