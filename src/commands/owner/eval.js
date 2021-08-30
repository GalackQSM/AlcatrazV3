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

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      usage: 'eval <code>',
      description: 'Exécute le code fourni et affiche la sortie.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['eval 1 + 1']
    });
  }
  run(message, args) {
    const input = args.join(' ');
    if (!input) return this.sendErrorMessage(message, 0, 'Veuillez fournir le code pour l\'évaluer');
    if(!input.toLowerCase().includes('token')) {

      const embed = new MessageEmbed();

      try {
        let output = eval(input);
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        
        embed
          .addField('Demande', `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché.' : input}\`\`\``)
          .addField('Résultat', `\`\`\`js\n${output.length > 1024 ? 'Trop grand pour être affiché.' : output}\`\`\``)
          .setColor('#66FF00');

      } catch(err) {
        embed
          .addField('Demande', `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché.' : input}\`\`\``)
          .addField('Résultat', `\`\`\`js\n${err.length > 1024 ? 'Trop grand pour être affiché.' : err}\`\`\``)
          .setColor('#FF0000');
      }

      message.channel.send(embed);

    } else {
      message.channel.send('Oups, j\'ai failli donner mon Token, qu\'elle bouler.');
    }
  }
};