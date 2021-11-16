const { readdirSync } = require('fs');

module.exports = (client) => {
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(file => file.endsWith('.js'));

        for (let file of events) {
            const event = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            client.on(eName, event.bind(null, client));
        }
    };
    ["client", "guild"].forEach(x => load(x))
};