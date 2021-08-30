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
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class DepositCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'deposit',
        aliases: ['dep'],
        usage: 'deposit 100',
        description: 'Déposer vos AlkaCoins dans la banque',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {

let user = message.author;

let member2 = db.fetch(`money_${user.id}`)

if (args.join(' ').toLocaleLowerCase() == 'all') {
    let money = await db.fetch(`money_${user.id}`)
    let embed = new MessageEmbed()
        .setColor("#2f3136")
      .setDescription(""+emojis.error+" **Vous n'avez pas d'AlkaCoins à retirer!**")
    if (!money) return message.channel.send(embed)
    db.subtract(`money_${user.id}`, money)
    db.add(`bank_${user.id}`, money)
    let embed5 = new MessageEmbed()
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.success+" Vous avez déposé toutes vos AlkaCoins de votre portefeuille"); 
    message.channel.send(embed5)

} else {

    let embed2 = new MessageEmbed() 
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.error+" Précisez un montant à déposer!");

    if (!args[0]) {
        return message.channel.send(embed2)
    }
    let embed6 = new MessageEmbed()
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.error+" Votre montant n'est pas un nombre!")

    if(isNaN(args[0])) {
        return message.channel.send(embed6)
    }
    let embed3 = new MessageEmbed()
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.error+" Vous ne pouvez pas déposer d'AlkaCoins négatif!");

    if (message.content.includes('-')) {
        return message.channel.send(embed3)
    }
    let embed4 = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(""+emojis.error+" Vous n'avez pas beaucoup d'AlkaCoins dans le portefeuille!");

    if (member2 < args[0]) {
        return message.channel.send(embed4)
    }

    let embed5 = new MessageEmbed()
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.success+" Vous avez déposé vos "+args[0]+" AlkaCoins dans de votre banque!");

    message.channel.send(embed5)
    db.subtract(`money_${user.id}`, args[0])
    db.add(`bank_${user.id}`, args[0])
}
}
}