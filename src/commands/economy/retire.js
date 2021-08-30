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
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const emojis = require('../../utils/emojis.json');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'retire',
        aliases: ['with'],
        usage: 'retire 100',
        description: 'Retiré vos AlkaCoins de votre banque',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {

let user = message.author;

let member2 = db.fetch(`bank_${user.id}`)

if (args.join(' ').toLocaleLowerCase() == 'all') {
    let money = await db.fetch(`bank_${user.id}`)
    let embed = new MessageEmbed()
      .setColor("#2f3136")
      .setDescription(""+emojis.error+" **Vous n'avez pas d'AlkaCoins à retirer!**")
    if (!money) return message.channel.send(embed)
    db.subtract(`bank_${user.id}`, money)
    db.add(`money_${user.id}`, money)
    let embed5 = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(""+emojis.success+" Vous avez retiré toutes vos AlkaCoins de votre banque"); 
    message.channel.send(embed5)

} else {

    let embed2 = new MessageEmbed() 
      .setColor("#2f3136")
        .setDescription(""+emojis.error+" Spécifiez un montant à retirer!");

    if (!args[0]) {
        return message.channel.send(embed2)
    }
    let embed6 = new MessageEmbed()
      .setColor("#2f3136")
        .setDescription(""+emojis.error+" Votre montant n'est pas un nombre!")

    if(isNaN(args[0])) {
        return message.channel.send(embed6)
    }
    let embed3 = new MessageEmbed()
      .setColor("#2f3136")
        .setDescription(""+emojis.error+" Vous ne pouvez pas retirer d'AlkaCoins négatif!");

    if (message.content.includes('-')) {
        return message.channel.send(embed3)
    }
    let embed4 = new MessageEmbed()
      .setColor("#2f3136")
      .setDescription(""+emojis.error+" Vous n'avez pas beaucoup d'AlkaCoins à la banque!");

    if (member2 < args[0]) {
        return message.channel.send(embed4)
    }

    let embed5 = new MessageEmbed()
       .setColor("#2f3136")
       .setDescription(""+emojis.success+" Vous avez retiré "+args[0]+" AlkaCoins de votre banque!");

    message.channel.send(embed5)
    db.subtract(`bank_${user.id}`, args[0])
    db.add(`money_${user.id}`, args[0])
}
}
}