const { readdirSync } = require('fs');
const ascii = require("ascii-table");

// ascii table
let table = new ascii("Events");
table.setHeading("", "Events", "Loaded Events");

module.exports = (client) => {

    let cnt = 1;
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(file => file.endsWith('.js'));

        for (let file of events) {
            const event = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            // ascii row with number of events
            table.addRow(cnt, eName, '✅');
            cnt += 1;
            client.on(eName, event.bind(null, client));
        }


    };
    ["client", "guild", "reactions"].forEach(x => load(x))

    console.log(table.toString());
};