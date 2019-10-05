const {commands} = require('../app');
const tools = require('../tools');

let run = (message, args) => {
    let fields = [];
    commands.forEach((command) => {
        fields.push({
            name: command.name,
            value: command.description
        })
    });
    message.channel.send(tools.createEmbed("Help", "Here are the commands you can use.", fields))
};

module.exports = {
    run,
    cmd: "help",
    name: "Help Command",
    description: "A Command for showing info about other commands",
    usage: "help",
};