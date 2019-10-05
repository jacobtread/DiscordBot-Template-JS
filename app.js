const Discord = require("discord.js");
const fs = require("fs");
const tools = require("./tools");

const client = new Discord.Client();
let commands = new Discord.Collection();
let settings = {token: undefined, prefix: undefined};

fs.readFile("config.json", (err, data) => {
    if (err) {
        console.log("Failed to load config file 'config.json'!");
        process.exit();
    } else {
        try {
            let jsonData = JSON.parse(data.toString());
            if (jsonData.token && jsonData.prefix) {
                settings = jsonData;

                client.login(settings.token).then(() => {
                    console.log(`Successfully logged into ${client.user.tag}`);
                    fs.readdir('commands', (err, files) => {
                        if (err) {
                            console.log("Failed to load commands directory!");
                            process.exit();
                        } else {
                            files = files.filter(file => file.endsWith('.js'));
                            files.forEach(file => {
                                const command = require(`./commands/${file}`);
                                commands.set(command.cmd, command);
                            });
                            console.log(`Loaded ${files.length} command${files.length > 1 ? "'s" : ""}`)
                        }
                    });
                }).catch(() => {
                    console.log("Failed to login with token check your token!")
                })
            }
        } catch (e) {
            console.log("An error occurred when parsing 'config.json' please check your syntax!")
        }
    }
});

client.on('message', message => {
    if (!message.author.bot) {
        const content = message.content;
        if (content.startsWith(settings.prefix) || content.startsWith(`<@${client.user.id}>`)) {
            let args = content.split(' ');
            let found = false;
            commands.forEach((command, cmd) => {
                    if (content.substr(content.startsWith(settings.prefix) ? 1 : `<@${client.user.id}>`.length + 1).toLowerCase() === cmd) {
                        args.shift();
                        found = true;
                        let canRun = true;
                        if (command.permissions !== undefined) {
                            for (let perm in command.permissions) {
                                if (!message.member.hasPermission(perm)) {
                                    canRun = false;
                                    break;
                                }
                            }
                        }
                        if (canRun) {
                            command.run(message, args);
                        } else {
                            message.channel.send(tools.createEmbed("Missing Permissions", "You do not have the required permissions to execute that command!"))
                        }
                    }
                }
            );
            if (!found) {
                message.channel.send(tools.createEmbed("Unknown Command", `That command couldn't be found try ${settings.prefix}help!`))
            }
        }
    }
});

module.exports = {
    commands
};