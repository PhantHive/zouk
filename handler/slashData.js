
async function globalCmd(Client) {
    const gData = [

        require('../assets/slashcommands/global/play.json'),
        require('../assets/slashcommands/global/rules.json'),
        require('../assets/slashcommands/global/welcome.json')


    ]
    await Client.application?.commands.set(gData);
}

/*
async function studentCmd(Client, guildId) {
    const sData = [


        require('../assets/slashcommands/students/mp.json'),
        require('../assets/slashcommands/students/tp.json'),
        require('../assets/slashcommands/students/fiche.json')

    ]
    await Client.guilds.cache.get(guildId)?.commands.set(sData);
}*/

async function trainCmd(Client, guildId) {
    const tData = [

        require('../assets/slashcommands/admin/linkStart.json'),
        require('../assets/slashcommands/admin/dbtransfer.json'),
        require('../assets/slashcommands/global/welcome.json')

    ]
    await Client.guilds.cache.get(guildId)?.commands.set(tData);
}


module.exports = { globalCmd, trainCmd }