const { verification } = require("./check/checkMail");
const MV = require('../../utils/models/MailSystem');

module.exports = (client, message) => {


    if (message.author.bot) return;


    if (message.channel.type === "DM") {

        if (message.content.lastIndexOf("@ipsa.fr") !== -1) {

            message.reply("La vérification email est cloturé pour le moment. Contactez un Modo si besoin!");
            /*
            let mail = message.content;

            MV.findOne({
                    userId: message.author.id
                },

                async(err, mdata) => {
                    if (err) console.log(err);

                    if (message.author.bot) {
                        return;
                    }

                    if (!mdata) {
                        await new MV({
                            userId: message.author.id,
                            ipsaMail: "",
                        }).save()

                        //========================================VERIF MAIL

                        const mailVerif = new verification(mail, message, client);
                        mailVerif.startVerif().then(err => {
                                if (err) return console.log(err);
                            }
                        );


                    }
                    else if (mdata.ipsaMail !== "") {
                        message.reply("Ce mail a déjà été enregistré.");
                    }
                    else {
                        // data is empty
                        //========================================VERIF MAIL
                        let mail = message.content;

                        const mailVerif = new verification(mail, message, client);
                        mailVerif.startVerif().then(err => {
                                if (err) return console.log(err);
                            }
                        );

                    }






                }
            ); */

        }
        else {
            message.reply("La vérification email est cloturé pour le moment. Contactez un Modo si besoin!");
            //message.reply("Pour effectuer une vérification de mail, tape ton mail d'IPSA sous format **prenom.nom@ipsa.fr**");
        }


    }









}