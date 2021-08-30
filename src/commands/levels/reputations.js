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
const db = require('quick.db');
const Discord = require('discord.js');
const config = require('../../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class ReputationsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reputations',
      aliases: ['reps'],
      usage: 'reputations [membre]',
      description: ' Affiche les réputations d\'un membre',
      type: client.types.LEVEL
    });
  }
  async run(message) {
    let user = message.mentions.users.first() || message.author
    let thanks = await db.get(`userthanks_${user.id}`)
    let thanksl = await db.get(`userthanks_${user.id}`)

 if(thanks > 10) thanks = "Niveau 1"
if(thanks > 0) thanks = "Niveau 0"
if(thanks > 20) thanks = "Niveau 2"
if(thanks > 30) thanks = "Niveau 3"
if(thanks > 40) thanks = "Niveau 4"
if(thanks > 50) thanks = "Niveau 5"
if(thanks > 60) thanks = "Niveau 6"
if(thanks > 70) thanks = "Niveau 7"
if(thanks > 80) thanks = "Niveau 8"
if(thanks > 90) thanks = "Niveau 9"
if(thanks > 100) thanks = "Niveau MAX"
if(thanks === null) thanks = "Aucun niveau"
let embed = new Discord.MessageEmbed()
.setAuthor(user.username || user.user.username , user.displayAvatarURL() || user.user.displayAvatarURL())
.addField(`Niveau de l'utilisateur`, thanks || 'Nouveau', false)
.addField(`Nombre total des réputations`, thanksl || '0', false)
.setTimestamp()
.setColor("#2f3136")
.setFooter(config.footer)
message.channel.send(embed)
}
};