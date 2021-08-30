//  ______   __                      __                                  
// /      \ |  \                    |  \                                 
//|  $$$$$$\| $$  _______  ______  _| $$_     ______   ______   ________ 
//| $$__| $$| $$ /       \|      \|   $$ \   /      \ |      \ |        \
//| $$    $$| $$|  $$$$$$$ \$$$$$$\\$$$$$$  |  $$$$$$\ \$$$$$$\ \$$$$$$$$
//| $$$$$$$$| $$| $$      /      $$ | $$ __ | $$   \$$/      $$  /    $$ 
//| $$  | $$| $$| $$_____|  $$$$$$$ | $$|  \| $$     |  $$$$$$$ /  $$$$_ 
//| $$  | $$| $$ \$$     \\$$    $$  \$$  $$| $$      \$$    $$|  $$    \
// \$$   \$$ \$$  \$$$$$$$ \$$$$$$$   \$$$$  \$$       \$$$$$$$ \$$$$$$$$
//=======================================================================                                                                      
//● Crée par GalackQSM le 09 novembre 2019
//● Serveur Discord: https://discord.gg/Kcw3q53353
//● Github: https://github.com/GalackQSM/Alcatraz                                                  
//=======================================================================                                                                      
                                                                       
const Command = require('../Alcatraz.js');
const Discord = require('discord.js');
const db = require('quick.db');
const config = require('../../../config.json');

module.exports = class GendCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      usage: 'rank',
      description: 'displays your rank in a small embed',
      type: client.types.LEVEL
    });
  }

  async run (message, args) {
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let xp = db.fetch(`messages_${message.guild.id}_${user.id}`)
    let lvl = db.fetch(`level_${message.guild.id}_${user.id}`)
    if (lvl === null) lvl = 0
    if (xp === null) xp = 0
    let curxp = xp;
    let curlvl = lvl;
    let nxtLvlXp = curlvl * 100;
    let difference2 = nxtLvlXp + 100 - curxp;
    let embed = new Discord.MessageEmbed()
    .setTimestamp()
    .setColor("#2f3136")
    .setAuthor(message.author.tag,message.author.avatarURL())
    .addField("<:alcatraz_level:881328186917552170> Niveau",`\`\`\`Niveau ${db.fetch(`level_${message.guild.id}_${message.author.id}`) || "0"}\`\`\``, false)
    .addField("<:alcatraz_utilitaire:881311931309391872> XP", `\`\`\`${db.fetch(`messages_${message.guild.id}_${message.author.id}XP`) || "0"}\`\`\``, false)
    .addField("<:alcatraz_utilitaire:881311931309391872> Total XP", `\`\`\`${curxp - 1}XP\`\`\``, false)
    .addField("<:alcatraz_utilitaire:881311931309391872> Besoin d'XP pour atteindre le niveau suivant", `\`\`\`${difference2 + 1}XP\`\`\``, false)
    .setTimestamp()
    .setFooter(config.footer)

    message.channel.send(embed)
}}