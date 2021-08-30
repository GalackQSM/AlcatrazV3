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

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      aliases: ['clearbot'],
      usage: 'purgebot [#salon/ID] <Nombre de message> [raison]',
      description: oneLine`
        Passe au crible le nombre spécifié de messages dans le salon fourni
        et supprime toutes les commandes et tous les messages d'Alcatraz.
        Si aucun salon n'est indiqué, les messages seront supprimés du salon actuel.
        Pas plus de 100 messages peuvent être passés au crible à la fois.
        Les messages datant de plus de 2 semaines ne peuvent pas être supprimés.`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purgebot 20']
    });
  }
  async run(message, args) {
    
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
    `);

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'Je n\'ai pas l\'autorisation de gérer les messages dans le salon fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

    await message.delete();

    let messages = (await message.channel.messages.fetch({limit: amount})).filter(msg => { 
      const cmd = msg.content.trim().split(/ +/g).shift().slice(prefix.length).toLowerCase();
      const command = message.client.commands.get(cmd) || message.client.aliases.get(cmd);
      if (msg.author.bot || command) return true;
    });

    if (messages.size === 0) { 

      message.channel.send(
        new MessageEmbed()
          .setTitle('Commande purgebot')
          .setDescription(`
            Impossible de trouver des messages ou des commandes de bot.
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addField('salon', channel, true)
          .addField('Messages trouvés', `\`${messages.size}\``, true)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136")
      ).then(msg => msg.delete({ timeout: 10000 })).catch(err => message.client.logger.error(err.stack));

    } else { 
      
      channel.bulkDelete(messages, true).then(msgs => { 
        const embed = new MessageEmbed()
          .setTitle('Commande purgebot')
          .setDescription(`
            Supprimé avec succès **${msgs.size}** message(s). 
            Ce message sera supprimé après \`10 secondes\`.
          `)
          .addField('salon', channel, true)
          .addField('Messages trouvés', `\`${msgs.size}\``, true)
          .addField('Raison', reason)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");

        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    this.sendModLogMessage(message, reason, { Channel: channel, 'Messages trouvés': `\`${messages.size}\`` });
  }
};
