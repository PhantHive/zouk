const { readdirSync } = require("fs");
const ascii = require("ascii-table");

let table = new ascii("SLASH !");
table.setHeading("", "Slash Commands", "Loaded commands")

// slash commands
module.exports = (client) => {
    let cnt = 1;
    readdirSync('./SlashCommands/').forEach(dir => {
        const slashCmds = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith('.js'));

        for (let file of slashCmds) {
            let spull = require(`../SlashCommands/${dir}/${file}`);

            if (spull.name) {
                client.SlashCmds.set(spull.name, spull);
                table.addRow(cnt, file, '✅');
            } else {
                table.addRow(cnt, file, '❌');
                continue;
            }

            if (spull.aliases && Array.isArray(spull.aliases)) {
                spull.aliases.forEach(alias => client.aliases.set(alias, spull.name));
            }
            cnt++;
        }
    });
    console.log(table.toString());
};