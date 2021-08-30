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
 const ms = require('parse-ms')
module.exports = class TrustedlistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist',
            description: 'Voir la liste de la whitelist!',
            userPermissions: ['MANAGE_GUILD'],
            type: client.types.ANTIRAID
        });
    }
  async run(message, args) {
        let guild = message.guild.iconURL()
   
          let wordlist = new Discord.MessageEmbed()
           .setThumbnail(guild)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136")
         let database = db.get(`trustedusers_${message.guild.id}`)
         if(database && database.length) {
            let array =[]
              database.forEach(m => {
              array.push(`<@${m.user}>`)
            })
         
            wordlist.addField('**Liste de la whitelist**', `${array.join("\n")}`)
        }
        return message.channel.send(wordlist);
}}
