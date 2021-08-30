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
const moment = require('moment');
const config = require('../../../config.json');

module.exports = class WarnPurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warnpurge',
      aliases: ['purgewarn'],
      usage: 'warnpurge <@membre/ID> <nombre de message> [raison]',
      description: 'Avertit un membre de votre serveur, puis purge ses messages du nombre de messages fourni.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
      examples: ['warnpurge @GalackQSM 50']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous prévenir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas avertir quelqu\'un avec un rôle égal ou supérieur');
    
    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id);

    const amount = parseInt(args[1]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('DD/MM/YYYY'),
      reason: reason
    };

    warns.warns.push(warning);
  
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    const messages = (await message.channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    if (messages.size > 0) await message.channel.bulkDelete(messages, true);  

    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être averti')
      .setDescription(`Le membre ${member} a été averti, avec **${messages.size}** messages supprimer.`)
      .addField('Par', message.member, true)
      .addField('Membre', member, true)
      .addField('Nombre d\'avertissement', `\`${warns.warns.length}\``, true)
      .addField('Messages trouvés', `\`${messages.size}\``, true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} warnpurged ${member.user.tag}`);
    
    this.sendModLogMessage(message, reason, { 
      Member: member, 
      'Nombre d\'avertissement': `\`${warns.warns.length}\``,
      'Messages trouvés': `\`${messages.size}\``
    });

    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Limite d'avertissement atteinte. Lancé automatiquement par ${message.guild.me}.`]);
    }

  }
};
