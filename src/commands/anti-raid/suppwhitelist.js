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
//● Crée par GalackQSM#0895 le 09 novembre 2020
//● Serveur Discord: https://discord.gg/HPtTfqDdMr
//● Github: https://github.com/GalackQSM/Alcatraz                                                  
//=======================================================================                                                                      
                                                                       
const Command = require('../Alcatraz.js');
const Discord = require("discord.js")
const config = require('../../../config.json')
const db = require("quick.db")
 const ms = require('parse-ms');
const { truncate } = require("fs");
module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'suppwhitelist',
            description: 'Supprimer un membre de la whitelist!',
            userPermissions: ['MANAGE_GUILD'],
            type: client.types.ANTIRAID
        });
    }
  async run(message, args) {

if(message.author.id === message.guild.ownerID) {
    
        let user = message.mentions.users.first()
        if(!user) {
            return message.channel.send(`mentionner un membre`)
        }
        const guildicon = message.guild.iconURL();
        let database = db.get(`trustedusers_${message.guild.id}`)
        if(database) {
            let data = database.find(x => x.user === user.id)
          let unabletofind = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`
          ** impossible de trouver ce membre dans la base de données!** 
          `)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136")
          
            if(!data) return message.channel.send(unabletofind)
          
            let value = database.indexOf(data)
            delete database[value]
          
            var filter = database.filter(x => {
              return x != null && x != ''
            })
          
            db.set(`trustedusers_${message.guild.id}`, filter)
          let deleted = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`
          **Suppression de ${user} de la whitelist!** 
          `)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136")
          
            return message.channel.send(deleted)
          
        } else {          
     message.channel.send(`Ce membre n'est pas sur la whitelist`)
        }}
    
      message.channel.send(`Seul le propriétaire du serveur peut utiliser cette commande!`)
}}
