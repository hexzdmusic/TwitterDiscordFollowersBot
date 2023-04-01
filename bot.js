require("./config.js");
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//global.Intents = GatewayIntents;
global.Discord = require("discord.js");
global._commands=[];
global.bot={
  botSelf: new Discord.Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
	]}),
  token: config.token,
  prefix: config.prefix,
  ownerID: config.ownerID,
  helper: {

    registerCommand: function (cmd, _cb) {
      bot.botSelf.on('messageCreate', message => {
        var cb = [];
        cb["username"] = message.author.username;
        cb["userid"] = message.author.id;
        cb["channel"] = message.channel;
        cb["args"] = message.content.split(" ");
        cb["msg"] = message.content;

        if(message.content.split(" ")[0] == bot.prefix+cmd) {
          _cb(message, cb);
        }

      })
    }

  },
  init: function () {

  }}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function nextMilestonePercentage(number) {

    var base = Math.pow(10, Math.floor(Math.log(number) / Math.log(10)));
    var milestone = Math.ceil(number / base) * base;
    //console.log(milestone);
    return Math.round(number/milestone*100).toString()+"%";

}
var lastTwitterFollowersCount = 0;
bot.botSelf.once(Events.ClientReady, () => {
	console.log('Ready!');
	//bot.botSelf.guilds.cache.fetch();
	setInterval(() => {
fetch('https://livecounts.lol/twitter?name='+config.twitterHandle+'&akey='+config.lcLolAPIkey+'&skey='+config.lcLolSecretKey, {method: 'GET', headers: {'origin': 'livecounts.lol', 'Referer': 'https://livecounts.lol'}}).then(res=>res.json()).then((d) => {
			if(d.followers_count != lastTwitterFollowersCount) {
			if(!bot.botSelf.channels.cache.get(config.voiceChatId)) return;
			lastTwitterFollowersCount = d.followers_count;
	bot.botSelf.channels.cache.get(config.voiceChatId).setName(`${config.beginningText} ${numberWithCommas(lastTwitterFollowersCount)} (${nextMilestonePercentage(lastTwitterFollowersCount)} next to new Milestone)`);
			}
		}).catch((err)=>{console.log(err);});
	}, 1000*config.seconds);
});
bot.botSelf.login(bot.token);
