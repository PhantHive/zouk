const { getFiles } = require('./src/ffe');

module.exports = {
    name: "tp",
    run: async (client, interaction) => {

        await getFiles("tp", interaction, client);

    }
};