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
const config = require('../../../config.json');
const answers = [
  'Il est certain.',
  'C\'est décidément ainsi.',
  'Sans aucun doute.',
  'Oui définitivement.',
  'Vous pouvez vous y fier.',
  'Comme je le vois oui.',
  'GalackQSM est le meilleur.',
  'Bonne perspective.',
  'Oui.',
  'Non.',
  'Les signes pointent vers Oui.',
  'Je sais pas.',
  'Répondre brumeux, réessayer.',
  'Demander à nouveau plus tard.',
  'Mieux vaut ne pas te dire maintenant.',
  'Impossible de prédire maintenant.',
  'Concentrez-vous et demandez à nouveau.',
  'Ne comptez pas dessus.',
  'Ma réponse est non.',
  'Mes sources disent non.',
  'Les perspectives ne sont pas si bonnes.',
  'Très douteux.'
];

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      aliases: ['fortune'],
      usage: '8ball <question>',
      description: 'Demande au 8-Ball des questions.',
      type: client.types.JEUX,
      examples: ['8ball Vais-je gagner à la loterie?']
    });
  }
  run(message, args) {
    const question = args.join(' ');
    if (!question) return this.sendErrorMessage(message, 0, 'Veuillez fournir une question à poser');
    const embed = new MessageEmbed()
      .setTitle('🎱  Je réponds à tes questions  🎱')
      .addField('Question', question)
      .addField('Réponse', `${answers[Math.floor(Math.random() * answers.length)]}`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};