const MV = require('../../../utils/models/MailSystem');

let mailVerif = require("../../../assets/admin/mailsVerif.json")

module.exports = {


    verification:

        class Verif {

            constructor(mail, message, client) {
                this.mail = mail;
                this.message = message;
                this.client = client;
            }

            async checkMail() {

                await new Promise(resolve => setTimeout(resolve, 1000))
                    .then(() => {
                        MV.findOne({
                                _id: Number('IPSA' + 880491243807846450 + this.message.author.id)
                            },
                            async (err, mdata) => {

                                if (err) {
                                    console.log("Connection to the database failed: " + err);
                                    return this.message.reply("Contactez un administrateur IPSA en lui mentionnant le problème suivant:" +
                                        "```diff\n->Erreur de connexion avec la base de donnée 'students'```");
                                }

                                if (!mdata) {
                                    return this.message.reply("Un problème beaucoup trop important est survenu, contactez un admin.")
                                }


                                let guilds = ['502931781012684818', '880491243807846450', '880499115878932571', '755084203779162151', '608155753748103170', '809190693196529704', '932332814433673227', '932333114326405140'];
                                let mailFound = false;


                                if (mdata.email === "") {
                                    for (const promo of Object.keys(mailVerif)) {
                                        if (mailVerif[promo].includes(this.mail.toLowerCase())) {
                                            //this.message.channel.send(this.mail);

                                            let name = this.mail.substring(0, this.mail.indexOf("@"));
                                            let firstName = name.substring(0, this.mail.indexOf("."));
                                            let surName = name.substring(this.mail.indexOf(".") + 1);
                                            let correctName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                                            let correctSurname = surName.toUpperCase();
                                            let fullName = correctSurname + " " + correctName

                                            let role;
                                            let oldrole;
                                            mailFound = true

                                            await guilds.forEach(serv => {

                                                new Promise(resolve => setTimeout(resolve, 2000))


                                                const check = async () => {
                                                    try {

                                                        let guild = this.client.guilds.cache.get(serv);
                                                        let user = this.message.author.id;

                                                        const member = await guild.members.fetch(user);


                                                        if (member) {

                                                            if (promo === "Communication") {
                                                                role = guild.roles.cache.find(r => r.name.includes("ADMIN COM"));
                                                            } else if ((promo === "aero3_systeme") && (serv === '809190693196529704')) {
                                                                role = guild.roles.cache.find(r => r.id === "932997263079399434");
                                                            } else {
                                                                role = guild.roles.cache.find(r => r.name.includes("IPSAlien"));
                                                            }


                                                            try {
                                                                oldrole = guild.roles.cache.find(r => r.name === "Invité")
                                                            } catch (err) {}




                                                            if ((promo === "aero4InterStudents") && (serv === '880491243807846450')) {
                                                                let interRole = guild.roles.cache.find(r => r.name.includes("International"));
                                                                member.roles.add(interRole);
                                                            }

                                                            await this.message.channel.send({content: `***${fullName}*** Tu appartiens à la promo ***${promo}***, 
                                tu es **verifié** sur ***${guild}*** en accord avec notre base de donnée.`});


                                                            // ---------------------
                                                            // database registration
                                                            // ---------------------

                                                            // to be changed every year:
                                                            const promo_table = {
                                                                "aero1": 26,
                                                                "aero2": 25,
                                                                "aero3": 24,
                                                                "aero4": 23,
                                                                "aero5": 22
                                                            }

                                                            mdata.first_name = firstName;
                                                            mdata.second_name = surName;
                                                            mdata.email = this.mail.toLowerCase();
                                                            mdata.promo = promo_table[promo];

                                                            member.roles.add(role).catch(() => {})

                                                            try {
                                                                member.roles.remove(oldrole).catch(() => {
                                                                    oldrole = guild.roles.cache.find(r => r.name === "Incruste");
                                                                    member.roles.remove(oldrole).catch(() => {})
                                                                });
                                                            }
                                                            catch (e) {}

                                                            mdata.save();
                                                        }

                                                        return this.mail;

                                                    } catch (error) { }
                                                }

                                                check();


                                            });


                                        } else {
                                            if (!this.message.content.lastIndexOf("@ipsa.fr")) {
                                                this.message.reply("Il semblerait que tu te sois trompé dans l'écriture de ton mail. (l'email doit contenir prénom.nom@ipsa.fr)");
                                                return false;
                                            }

                                        }

                                    }

                                    if (!mailFound) {
                                        this.message.reply("Il semblerait que tu te sois trompé dans l'écriture de ton mail. " +
                                            "Si tu penses qu'il s'agit d'une erreur provenant du bot je t'invite à mp un responsable discord ou à nous écrire dans le channel #general ou #idee-bugs.");
                                    }
                                } else if (mdata.email === this.mail) {
                                    this.message.reply(`Ton compte a déjà été verifié! <:drakeno:630099103220760576> `).then(m => m.delete({timeout: 6000}));
                                    return false;
                                }


                                //fs.writefiles("./jsonfiles/mailAdded.json", JSON.stringify(mailAdded, null, 2), (err) => {
                                //if (err) console.log(err);
                                //});


                            }
                        )
                    })

            }

            async startVerif() {


                MV.findOne({email: this.mail.toLowerCase()},
                    async (err, data) => {
                        if (data) {
                            if (data.discord_id !== this.message.author.id) {
                                this.message.reply("Tu ne peux pas prendre l'identité de quelqu'un d'autre Mr Who! Si tu penses qu'il s'agit d'une erreur MP un admin.");
                                return false;
                            }
                        } else {
                            await this.checkMail(this.mail);
                        }

                    });

            }

        }
}