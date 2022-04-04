const { getFiles } = require('./src/ffe');

module.exports = {
    name: "mp",
    run: async (client, interaction) => {

        await getFiles("mp", interaction, client);

    }
};