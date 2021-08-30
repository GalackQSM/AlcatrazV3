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

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'balance',
        aliases: ['bal'],
        usage: 'balance [@membre]',
        description: 'Vérifier votre solde',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          r =>
            r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.guild.members.cache.find(
          r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.member;
  
      let bal = db.fetch(`money_${user.id}`);
  
      if (bal === null) bal = 0;
  
      let bank = await db.fetch(`bank_${user.id}`);
  
      if (bank === null) bank = 0;
  
      if (user) {
        let moneyEmbed = new MessageEmbed()
          .setColor("#2f3136")
          .setFooter(config.footer)
          .setDescription(
            "**"+user.user.username+", voici votre solde:**\n\n`Porte-feuille:` "+bal+" AlkaCoins\n`Banque:` "+bank+" AlkaCoins"
          );
        message.channel.send(moneyEmbed);
      } else {
        return message.channel.send("**Entrez un membre valide!**");
      }
    }
  };