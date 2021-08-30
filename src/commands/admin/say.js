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
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: 'say [#salon/ID] <message>',
      description: oneLine`
        Envoie un message au salon spécifié.
        Si aucun salon n'est indiqué, le message sera envoyé au salon actuel.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['say #general Alcatraz']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
    `);

    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof(modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');
    if (modChannelIds.includes(channel.id)) return this.sendErrorMessage(message, 0, stripIndent`
      Si le salon est réservé aux modérateurs, veuillez mentionner un salon de texte accessible ou fournir un identifiant de salon de texte valide
    `);

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez me fournir un message à dire');

    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation d\'envoyer des messages dans le salon fourni');

    if (!channel.permissionsFor(message.member).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'Vous n\'êtes pas autorisé à envoyer des messages dans le salon fourni');

    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    channel.send(msg, { disableMentions: 'true' });
        message.delete();

  } 
};