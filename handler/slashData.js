
async function globalCmd(Client) {
    const gData = [

        require('../assets/slashcommands/global/play.json')

    ]
    await Client.application?.commands.set(gData);
}


async function studentCmd(Client, guildId) {
    const sData = [


        require('../assets/slashcommands/students/mp.json'),
        require('../assets/slashcommands/students/tp.json'),
        require('../assets/slashcommands/students/fiche.json')

    ]
    await Client.guilds.cache.get(guildId)?.commands.set(sData);
}

async function trainCmd(Client, guildId) {
    const tData = [


        require('../assets/slashcommands/students/mp.json'),
        require('../assets/slashcommands/students/tp.json'),
        require('../assets/slashcommands/students/fiche.json'),
        require('../assets/slashcommands/admin/linkStart.json')

    ]
    await Client.guilds.cache.get(guildId)?.commands.set(tData);
}


module.exports = { globalCmd, studentCmd, trainCmd }