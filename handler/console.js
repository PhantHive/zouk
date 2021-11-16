module.exports = (client) => {
    let prompt = process.openStdin();
    prompt.addListener("data", info => {
        let x = info.toString().trim().split(/ +/g);
        client.channels.get("875099679564632064").send(x.join());
    })
}