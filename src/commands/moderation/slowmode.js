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
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: 'slowmode [#salon/ID] <temps> [raison]',
      description: oneLine`
        Active le mode lent dans un salon avec le taux spécifié.
        Si aucun salon n'est fourni, le mode lent affectera le salon actuel.
        Fournissez un taux de 0 pour désactiver.      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['slowmode #salon 2', 'slowmode 3']
    });
  }
  async run(message, args) {
    let index = 1;
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
    `);
      
    const rate = args[index];
    if (!rate || rate < 0 || rate > 59) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez indiquer une limite de débit comprise entre 0 et 59 secondes
    `);

    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer la chaîne fournie');

    let reason = args.slice(index + 1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await channel.setRateLimitPerUser(rate, reason);
    const status = (channel.rateLimitPerUser) ? 'non actif' : 'actif';
    const embed = new MessageEmbed()
      .setTitle('Commande Slowmode')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (rate === '0') {
      message.channel.send(embed
        .setDescription(`\`${status}\` ➔ \`non actif\``)
        .addField('Par', message.member, true)
        .addField('Salon', channel, true)
        .addField('Raison', reason)
      );
    
    } else {

      message.channel.send(embed
        .setDescription(`\`${status}\` ➔ \`actif\``)
        .addField('Par', message.member, true)
        .addField('Salon', channel, true)
        .addField('Temps', `\`${rate} seconde(s)\``, true)
        .addField('Raison', reason)
      );
    }

    this.sendModLogMessage(message, reason, { Salon: channel, Temps: `\`${rate} seconde(s)\`` });
  }
};
