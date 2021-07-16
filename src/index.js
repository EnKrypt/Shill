const Discord = require('discord.js');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { validateArgs } = require('./validation');

const args = yargs(hideBin(process.argv)).config().alias('c', 'config').argv;
validateArgs(args);

const client = new Discord.Client();
let textChannel = {};

client.on('ready', () => {
    textChannel = client.channels.cache.get(args.textChannel);
    console.log(
        'Shill is ready to execute shell commands on this host remotely.'
    );
});

client.on('message', (message) => {
    if (
        message.channel.type === 'text' &&
        message.channel.id === args.textChannel &&
        args.authenticatedUsers.includes(message.author.id)
    ) {
        textChannel.send(`Would have processed ${message.content}`);
    } else if (
        message.channel.type === 'dm' &&
        message.content === `!auth ${args.password}` &&
        !args.authenticatedUsers.includes(message.author.id)
    ) {
        args.authenticatedUsers.push(message.author.id);
        message.author.send('Successfully authorized');
    }
});

client.login(args.token);
