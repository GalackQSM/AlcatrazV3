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
const ms = require("parse-ms");
const db = require('quick.db');
const Discord = require('discord.js');
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');
const { MessageEmbed } = require('discord.js');


module.exports = class VouchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reputation',
      aliases: ['rep'],
      usage: 'rep [membre]',
      description: 'Donner une réputation à un membre',
      type: client.types.LEVEL
    });
  }
  async run(message) {

    let timeout =  1800000;

let bump = await db.fetch(`cooldown_${message.author.id}`)
if (bump !== null && timeout - (Date.now() - bump) > 0) {
    let time = ms(timeout - (Date.now() - bump));
return message.channel.send(new Discord.MessageEmbed()
.setAuthor("Tu as déjà donner une réputation" , message.author.displayAvatarURL({dynamic :true}))
.setDescription(""+emojis.error+" Vous avez déjà demander\nRéessayez dans **"+time.hours+" Heure(s) , "+time.minutes+" Minute(s) , "+time.seconds+" Seconde(s)**")
.setColor("#2f3136")
.setFooter(config.footer))}

let user = message.mentions.users.first()
if(!user) return this.sendErrorMessage(message, 0, "mentionner un membre")
if(user.id === message.author.id) return this.sendErrorMessage(message, 0, "tu ne peux pas te mentionner")

db.add(`userthanks_${user.id}`, 1)
db.set(`cooldown_${message.author.id}`, Date.now())
let embed1 = new MessageEmbed()
.setColor("#2f3136")
.setFooter(config.footer)
.setDescription(""+emojis.success+" **"+JworkR+"\n"+amount+"** AlkaCoins")
 return message.channel.send(embed1)

}
};