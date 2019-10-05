let run = (message, args) => {
    message.channel.send(`<@${message.author.id}> Yay test command works :shrug:`)
};

module.exports = {
    run,
    cmd: "test",
    name: "Test Command",
    description: "Example command for testing purposes",
    usage: "test",
    // permissions: ["ADMINISTRATOR"]
};