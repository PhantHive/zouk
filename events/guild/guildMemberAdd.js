const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const { readdirSync } = require('fs');
const WDB = require("../../utils/models/Welcomes");
const themes = require("../../assets/json/theme.json");

//https://imgur.com/c67FNra.png

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 65;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `italic bold ${fontSize -= 10}px Tahoma`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};

module.exports = async (client, member) => {

        WDB.findOne({
            server_id: member.guild.id
        },
            async (err, data) => {
                if (!data) return console.log("no data...");
                if (err) return console.log(err);

                // general ipsa server
                const generalPath = `./assets/img/welcome/${themes[parseInt(data.theme)]["name"]}`;
                let rand_back = []
                readdirSync(generalPath).forEach(file => {
                    rand_back.push(`${generalPath}/${file}`);
                })

                const system = data.channel_id;

                const canvas = Canvas.createCanvas(800, 450);
                const ctx = canvas.getContext('2d');
                let background;
                let guildColor;
                let guildStroke;

                background = await Canvas.loadImage(rand_back[Math.floor(Math.random() * rand_back.length)]);
                guildColor = '#ffffff';
                guildStroke = data.color;

                if ((member.guild.id === '502931781012684818') || (member.guild.id === '819986031809134643')) {
                    console.log("iris member joined.")
                } else if (member.guild.id === "809190693196529704") {
                    console.log("System member joined.")
                } else {
                    if ((member.guild.id === '608155753748103170') || (member.guild.id === '755084203779162151')) {
                        try {
                            const incruste = member.guild.roles.cache.find(role => role.name === "incruste"); //
                            member.roles.add(incruste);
                        } catch (err) {
                            //do nothing
                        }
                    } else if ((member.guild.id === '880499115878932571')) {
                        try {
                            const incruste = member.guild.roles.cache.find(role => role.name === "Incruste"); //
                            member.roles.add(incruste);
                        } catch (err) {
                            //do nothing
                        }
                    }

                }


                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = guildStroke;
                ctx.strokeRect(8, 11, 780, 430);

                ctx.font = 'italic bold 65px Tahoma ';
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = "black"
                ctx.lineWidth = 5;
                ctx.shadowColor = "black";
                ctx.shadowBlur = 15;
                ctx.strokeText('Bienvenue à toi,', 85, 320);
                ctx.fillText('Bienvenue à toi,', 85, 320);

                // Select the font size and type from one of the natively available fonts
                ctx.font = applyText(canvas, `${member.displayName}!`);
                // Select the style that will be used to fill the text in
                ctx.fillStyle = guildColor;
                // Actually fill the text with a solid color
                ctx.strokeStyle = "black"
                ctx.lineWidth = 2;
                ctx.shadowColor = "black";
                ctx.shadowBlur = 20;
                ctx.strokeText(`${member.user.tag}`, 145, 380)
                ctx.fillText(`${member.user.tag}`, 145, 380);

                ctx.font = 'italic  25px Tahoma ';
                ctx.fillStyle = '#000000';
                ctx.strokeStyle = "black"
                ctx.lineWidth = 2;
                ctx.shadowColor = "white";
                ctx.shadowBlur = 15;
                ctx.strokeText('Information en message privé', 355, 420);
                ctx.fillText('Information en message privé', 355, 420);

                ctx.font = 'italic  30px Tahoma ';
                ctx.fillStyle = '#000000';
                ctx.strokeStyle = "black"
                ctx.lineWidth = 3;
                ctx.shadowColor = "white";
                ctx.shadowBlur = 5;
                ctx.strokeText(`${member.guild.memberCount} members`, 30, 55);
                ctx.fillText(`${member.guild.memberCount} members`, 30, 55);

                ctx.beginPath();
                ctx.strokeStyle = guildStroke;
                ctx.lineWidth = 15;
                ctx.arc(400, 140, 100, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.closePath();
                ctx.clip();


                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
                ctx.drawImage(avatar, 300, 40, 200, 200);
                const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');

                client.channels.fetch(system)

                    .then(channel => {
                        channel.send({ files: [attachment] }).then(r => {
                            let rulesChannel = member.guild.channels.cache.find(ch => ch.name.includes('règlement') || ch.name.includes('règles'));
                            let globalMsg;

                            if (member.guild.id === "717344084695580672") {
                                member.createDM().then(
                                    channel => {
                                        channel.send(`Salut, bienvenue sur le discord  **${member.guild.name}** 😉\n` +
                                            '\n' +
                                            `*Phearion t'ouvre ses portes mon jeune Pheadin 🧚‍! On se retrouvera très bientôt!*\n\n` +
                                            `                           ***We are not just building a city.
                                                                                        We are making a whole mini games server.*** \n ` +
                                            '                          ***Phearion <:phearion:902330542014484480>***\n' +
                                            '                                                 ●¸.•*¨Ƹ̵̡Ӝ̵̨̄Ʒ¨*•.¸●\n' +
                                            '\n'
                                        );

                                    }).catch(console.error)

                            } else if (member.guild.id === "809190693196529704") {
                                member.createDM().then(
                                    channel => {
                                        channel.send(`L'élite est là! Bienvenue! 😉\n` +
                                            '\n' +
                                            `Pour avoir accès à l\'intégralité du serveur accepte le règlement ici ---> <#932996983738744844> \n` +
                                            `                                              I.S.I.E.R procède à ta vérification...(Si tu penses que le bot ne t'as pas vérifié correctement
                                                 MP un modo).\n ` +
                                            '\n' +
                                            '                                                 ●¸.•*¨Ƹ̵̡Ӝ̵̨̄Ʒ¨*•.¸●\n' +
                                            '\n'
                                        );

                                    }).catch(console.error)
                            } else {
                                if (member.guild.id === "880491243807846450") {
                                    globalMsg = "Vous êtes sur le discord général d'IPSA, par des étudiants pour des étudiants."
                                } else {
                                    globalMsg = "Si tu n\'es pas sur le discord global IPSA: https://discord.gg/M98V7hDRx5"
                                }
                                member.createDM().then(
                                    channel => {
                                        channel.send(`Salut, bienvenue sur le discord **${member.guild.name}** 😉\n` +
                                            '\n' +
                                            `Pour avoir accès à l\'intégralité du serveur accepte le règlement ici ---> <#${rulesChannel.id}> \n` +
                                            `> ${globalMsg} \n ` +
                                            '\n' +
                                            '                                                 ●¸.•*¨Ƹ̵̡Ӝ̵̨̄Ʒ¨*•.¸●\n' +
                                            '\n'
                                        );

                                    }).catch(console.error)
                            }


                        })
                    })
            }
        )




};