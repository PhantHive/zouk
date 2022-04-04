const { getFiles } = require('./src/ffe');

module.exports = {
    name: "fiche",
    run: async (client, interaction) => {

        await getFiles("fiche", interaction, client);

    }
};