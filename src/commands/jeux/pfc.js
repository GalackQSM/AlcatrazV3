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
const { MessageEmbed } = require('discord.js');
const rps = ['ciseaux','pierre', 'feuille'];
const res = ['Ciseaux :v:','Pierre :fist:', 'Feuille :raised_hand:'];
const config = require('../../../config.json');

module.exports = class RockPaperScissorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pfc',
      usage: 'pfc <pierre | feuille | ciseaux>',
      description: 'Jouez à une partie de pierre-feuille-ciseaux contre Alcatraz!',
      type: client.types.JEUX,
      examples: ['pfc pierre']
    });
  }
  run(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) 
      return this.sendErrorMessage(message, 0, 'Merci d\'entrer `pierre`, `feuille`, ou `ciseaux`.');
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random()*3);
    let result;
    if (userChoice === botChoice) result = 'C\'est un match nul!';
    else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = `**${config.NomBot}** gagne !`;
    else result = `**${message.member.displayName}** gagne !`;
    const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName} vs. ${config.NomBot}`)
      .addField('Votre choix:', res[userChoice], true)
      .addField(`Le choix de ${config.NomBot}`, res[botChoice], true)
      .addField('Résultat', result, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
