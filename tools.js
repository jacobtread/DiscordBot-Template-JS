const {RichEmbed} = require('discord.js');

let createEmbed = (title, desc, fields = undefined) => {
    return new RichEmbed({
        title,
        description: desc,
        fields,
    })
};

module.exports = {
    createEmbed
};