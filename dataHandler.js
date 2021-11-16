
async function globalCmd(Client) {
    const gData = [

        require('./assets/slashcommands/global/play.json')

    ]
    await Client.application?.commands.set(gData);
}


module.exports = { globalCmd }