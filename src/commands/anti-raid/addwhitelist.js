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
const config = require('../../../config.json');

const db = require("quick.db")
 const ms = require('parse-ms');
const { truncate } = require("fs");
module.exports = class AntutrustCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addwhitelist',
            description: 'Ajoutez un membre a la whitelist!',
            userPermissions: ['MANAGE_GUILD'],
            type: client.types.ANTIRAID
        });
    }
  async run(message, args) {
 const guildicon = message.guild.iconURL();
if(message.author.id === message.guild.ownerID) {
    
        let user = message.mentions.users.first()
        if(!user) {
            let usermention = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`
            **Mentionner un membre!** 
            `)
            .setFooter(message.guild.name, guildicon)
    
            return message.channel.send(usermention)
        }
        let trustedusers = db.get(`trustedusers_${message.guild.id}`)
        if(trustedusers && trustedusers.find(find => find.user == user.id)) {
        return message.channel.send(`Ce membre est déjà sur la whitelist`)
        }
let data = {
    user: user.id
}
        db.push(`trustedusers_${message.guild.id}`, data)
        let added = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`
        **${user} est maintenant dans la whitelist!** 
        `)
        .setFooter(config.footer)
        .setColor("#2f3136")

        return message.channel.send(added);
    }
message.channel.send(`Seul le propriétaire du serveur peut utiliser cette commande!`)
}}
