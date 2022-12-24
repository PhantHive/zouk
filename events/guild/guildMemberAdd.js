const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const { readdirSync } = require('fs');
const WDB = require("../../utils/models/Welcomes");
const themes = require("../../assets/json/theme.json");

//https://imgur.com/c67FNra.png

const applyText = (canvas, text, fontSize=null, maxPercentWidth) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    if (fontSize === null) {
        fontSize = 65;
    }
    if (maxPercentWidth === null) {
        maxPercentWidth = 0.52;
    }

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `italic bold ${fontSize -= 2}px Tahoma`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width*maxPercentWidth);

    // Return the result to use in the actual canvas
    return [ctx.font, ctx.measureText(text).width];
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
                }


                ctx.save();

                // GLOBAL SHAPE
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width, 0);
                // right top arc
                ctx.quadraticCurveTo(0.95*canvas.width, 0.1*canvas.height, canvas.width, 0.15*canvas.height);
                // line to bottom right
                ctx.lineTo(canvas.width, 0.85*canvas.height);
                // right bottom arc
                ctx.quadraticCurveTo(0.95*canvas.width, 0.90*canvas.height, canvas.width, canvas.height);
                // line to bottom left
                ctx.lineTo(0, canvas.height);
                // left bottom arc
                ctx.quadraticCurveTo(0.05*canvas.width, 0.90*canvas.height, 0, 0.85*canvas.height);
                // line to top left
                ctx.lineTo(0, 0.15*canvas.height);
                // left top arc
                ctx.quadraticCurveTo(0.05*canvas.width, 0.1*canvas.height, 0, 0);
                ctx.closePath();

                ctx.clip();

                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


                ctx.lineWidth = 5;
                ctx.strokeStyle = guildStroke;
                ctx.stroke();


                // draw same shape inside the canvas starting from the top left corner at 0.05*canvas.width, 0.1*canvas.height
                ctx.beginPath();
                ctx.moveTo(0.05*canvas.width, 0.1*canvas.height);
                ctx.lineTo(0.95*canvas.width, 0.1*canvas.height);
                // right top arc
                ctx.quadraticCurveTo(0.94*canvas.width, 0.14*canvas.height, 0.95*canvas.width, 0.15*canvas.height);
                // line to bottom right
                ctx.lineTo(0.95*canvas.width, 0.85*canvas.height);
                // right bottom arc
                ctx.quadraticCurveTo(0.94*canvas.width, 0.86*canvas.height, 0.95*canvas.width, 0.90*canvas.height);
                // line to bottom left
                ctx.lineTo(0.05*canvas.width, 0.90*canvas.height);
                // left bottom arc
                ctx.quadraticCurveTo(0.06*canvas.width, 0.86*canvas.height, 0.05*canvas.width, 0.85*canvas.height);
                // line to top left
                ctx.lineTo(0.05*canvas.width, 0.15*canvas.height);
                // left top arc
                ctx.quadraticCurveTo(0.06*canvas.width, 0.14*canvas.height, 0.05*canvas.width, 0.1*canvas.height);

                ctx.lineWidth = 1;
                ctx.strokeStyle = guildStroke;
                ctx.stroke();

                ctx.closePath();

                ctx.restore();

                ctx.beginPath();

                // write Pseudo with tag on the right of the avatar a little bit on the top
                // strong shadow on the two text above
                ctx.shadowColor = "#000000";
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.font = applyText(canvas, member.user.tag)[0];
                ctx.fillStyle = guildColor;
                ctx.fillText(member.user.tag, 0.4*canvas.width, 0.5*canvas.height);

                // make outline

                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000000";
                ctx.strokeText(member.user.tag, 0.4*canvas.width, 0.5*canvas.height);
                ctx.closePath();


                ctx.restore();

                ctx.beginPath();
                // tiny shadow to show better text
                ctx.shadowColor = "rgba(0,0,0,0.53)";
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;

                // write "to: server name" below the pseudo with a smaller font
                ctx.font = applyText(canvas, "to:", 40)[0];
                ctx.fillStyle = guildStroke;
                ctx.fillText("to:", 0.4*canvas.width, 0.6*canvas.height);
                // stroke the text
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000000";
                ctx.strokeText("to:", 0.4*canvas.width, 0.6*canvas.height);

                // write server name below the pseudo with a smaller font after "to:"
                ctx.font = applyText(canvas, member.guild.name, 45, 0.43)[0];
                ctx.fillStyle = guildColor;
                ctx.fillText(member.guild.name, 0.485*canvas.width, 0.6*canvas.height);
                // stroke the text
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000000";
                ctx.strokeText(member.guild.name, 0.5*canvas.width, 0.6*canvas.height);

                ctx.closePath();

                ctx.restore();

                ctx.beginPath();
                ctx.shadowColor = "rgba(0,0,0,0.94)";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // write "BOARDING PASS" in bottom between the bottom line and the bottom of the canva
                let font = applyText(canvas, "BOARDING PASS", 42);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("BOARDING PASS", 0.5*canvas.width - (font[1] / 2), 0.98*canvas.height);
                // stroke the text
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "#000000";
                ctx.strokeText("BOARDING PASS", 0.5*canvas.width - (font[1] / 2), 0.98*canvas.height);

                // write "WELCOME" in top between the top line and the top of the canva
                font = applyText(canvas, "WELCOME", 50);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("WELCOME", 0.5*canvas.width - (font[1] / 2), 0.09*canvas.height);
                // stroke the text
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "#000000";
                ctx.strokeText("WELCOME", 0.5*canvas.width - (font[1] / 2), 0.09*canvas.height);

                ctx.closePath();

                ctx.restore();

                ctx.beginPath();
                // write from top to bottom "Z" "L" "7" "7" "7" on the right between the right line and the right of the canvas
                font = applyText(canvas, "Z", 40);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("Z", 0.97*canvas.width - (font[1] / 2), 0.3*canvas.height);
                font = applyText(canvas, "L", 40);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("L", 0.97*canvas.width - (font[1] / 2), 0.4*canvas.height);
                font = applyText(canvas, "7", 40);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("7", 0.97*canvas.width - (font[1] / 2), 0.5*canvas.height);
                font = applyText(canvas, "7", 40);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("7", 0.97*canvas.width - (font[1] / 2), 0.6*canvas.height);
                font = applyText(canvas, "7", 40);
                ctx.font = font[0];
                ctx.fillStyle = guildColor;
                ctx.fillText("7", 0.97*canvas.width - (font[1] / 2), 0.7*canvas.height);

                ctx.strokeStyle = 'rgb(0,0,0)';
                ctx.lineWidth = 0.7;
                ctx.strokeText("Z", 0.97*canvas.width - (font[1] / 2), 0.3*canvas.height);
                ctx.strokeText("L", 0.97*canvas.width - (font[1] / 2), 0.4*canvas.height);
                ctx.strokeText("7", 0.97*canvas.width - (font[1] / 2), 0.5*canvas.height);
                ctx.strokeText("7", 0.97*canvas.width - (font[1] / 2), 0.6*canvas.height);
                ctx.strokeText("7", 0.97*canvas.width - (font[1] / 2), 0.7*canvas.height);
                ctx.closePath();


                ctx.restore();


                ctx.beginPath();
                // add glow effect to the text
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 7;

                // show nicely count member below the avatar
                ctx.font = applyText(canvas, `#${member.guild.memberCount}`, 35)[0];
                ctx.fillStyle = guildColor;
                ctx.fillText(`#${member.guild.memberCount}`, 0.07*canvas.width, 0.87*canvas.height);
                ctx.closePath();


                ctx.restore();
                // draw circle avatar on the left centered vertically
                ctx.beginPath();
                ctx.arc(0.25*canvas.width, 0.5*canvas.height, 0.12*canvas.width, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                // ctx.shadowBlur = 0;
                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
                // draw avatar based on the circle
                ctx.drawImage(avatar, 0.12*canvas.width, 0.28*canvas.height, 0.25*canvas.width, 0.25*canvas.width);

                ctx.lineWidth = 7;
                ctx.strokeStyle = guildStroke;
                ctx.stroke();


                const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');

                client.channels.fetch(system)

                    .then(channel => {
                        channel.send({ files: [attachment] }).then(r => {

                            // if user is bot we don't want to send him the message
                            if (member.user.bot) return;

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