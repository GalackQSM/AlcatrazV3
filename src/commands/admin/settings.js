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
const { stripIndent, oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['setting', 'set', 's', 'config', 'conf'],
      usage: 'settings [category]',
      description: oneLine`
        Affiche tous les paramètres actuels de votre serveur.
        Si une catégorie est fournie, seuls les paramètres qui lui appartiennent seront affichés.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['settings System']
    });
  }
  run(message, args) {

    const row = message.client.db.settings.selectRow.get(message.guild.id);
    const prefix = `\`${row.prefix}\``;
    const systemChannel = message.guild.channels.cache.get(row.system_channel_id) || '`Aucun`';
    const modlogChannel = message.guild.channels.cache.get(row.modlog_channel_id) || '`Aucun`';
    const verificationChannel = message.guild.channels.cache.get(row.verification_channel_id) || '`Aucun`';
    const welcomeChannel = message.guild.channels.cache.get(row.welcome_channel_id) || '`Aucun`';
    const leaveChannel = message.guild.channels.cache.get(row.leave_channel_id) || '`Aucun`';
    const crownChannel = message.guild.channels.cache.get(row.crown_channel_id) || '`Aucun`';
    const adminRole = message.guild.roles.cache.get(row.admin_role_id) || '`Aucun`';
    const modRole = message.guild.roles.cache.get(row.mod_role_id) || '`Aucun`';
    const muteRole = message.guild.roles.cache.get(row.mute_role_id) || '`Aucun`';
    const autoRole = message.guild.roles.cache.get(row.auto_role_id) || '`Aucun`';
    const verificationRole = message.guild.roles.cache.get(row.verification_role_id) || '`Aucun`';
    const crownRole = message.guild.roles.cache.get(row.crown_role_id) || '`Aucun`';
    const autoKick = (row.auto_kick) ? `Après \`${row.auto_kick}\` avertisement(s)` : '`désactivé`';
    const messagePoints = `\`${row.message_points}\``;
    const commandPoints = `\`${row.command_points}\``;
    const voicePoints = `\`${row.voice_points}\``;
    let verificationMessage = row.verification_message || '`Aucun`';
    let welcomeMessage = row.welcome_message || '`Aucun`';
    let leaveMessage = row.leave_message|| '`Aucun`';
    let crownMessage = row.crown_message || '`Aucun`';
    const crownSchedule = (row.crown_schedule) ? `\`${row.crown_schedule}\`` : '`Aucun`';
    let disabledCommands = '`Aucune`';
    if (row.disabled_commands) 
      disabledCommands = row.disabled_commands.split(' ').map(c => `\`${c}\``).join(' ');

    const verificationStatus = `\`${message.client.utils.getStatus(
      row.verification_role_id && row.verification_channel_id && row.verification_message
    )}\``;
    const randomColor = `\`${message.client.utils.getStatus(row.random_color)}\``;
    const welcomeStatus = `\`${message.client.utils.getStatus(row.welcome_message && row.welcome_channel_id)}\``;
    const leaveStatus = `\`${message.client.utils.getStatus(row.leave_message && row.leave_channel_id)}\``;
    const pointsStatus = `\`${message.client.utils.getStatus(row.point_tracking)}\``;
    const crownStatus = `\`${message.client.utils.getStatus(row.crown_role && row.crown_schedule)}\``;
    
    let setting = args.join().toLowerCase();
    if (setting.endsWith('setting')) setting = setting.slice(0, -7);
    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    switch (setting) {
      case 'system':
        return message.channel.send(embed
          .setTitle('Paramètres: `Système`')
          .addField('Préfix', prefix, true)
          .addField('Salon système', systemChannel, true)
          .addField('Salon Modlog', modlogChannel, true)
          .addField('Rôle Administrateur', adminRole, true)
          .addField('Rôle Modérateur', modRole, true)
          .addField('Rôle Mute', muteRole, true)
          .addField('Rôle Auto', autoRole, true)
          .addField('Auto Kick', autoKick, true)
          .addField('Couleur aléatoire', randomColor, true)
        );
      case 'welcome':
      case 'welcomemessages':
        if (welcomeMessage != '`Aucun`') welcomeMessage = `\`\`\`${welcomeMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Messages de bienvenue`')
          .addField('Salon', welcomeChannel, true)
          .addField('Statut', welcomeStatus, true);
        if (welcomeMessage.length > 1024) embed
          .setDescription(welcomeMessage)
          .addField('Message', 'Message situé au-dessus en raison des limites de caractères.');
        else embed.addField('Message', welcomeMessage);
        return message.channel.send(embed);
      case 'leave':
      case 'leavemessages':
        if (leaveMessage != '`Aucun`') leaveMessage = `\`\`\`${leaveMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Messages d\'au revoir`')
          .addField('Salon', leaveChannel, true)
          .addField('Statut', leaveStatus, true);
        if (leaveMessage.length > 1024) embed
          .setDescription(leaveMessage)
          .addField('Message', 'Message situé au-dessus en raison des limites de caractères.');
        else embed.addField('Message', leaveMessage);
        return message.channel.send(embed);
      case 'points':
      case 'pointssystem':
        return message.channel.send(embed
          .setTitle('Paramètres: `Système de points`')
          .addField('Points de message', messagePoints, true)
          .addField('Points de commande', commandPoints, true)
          .addField('Points de vocal', voicePoints, true)
          .addField('Statut', pointsStatus)
        );
      case 'crown':
      case 'crownsystem':
        if (crownMessage != '`Aucun`') crownMessage = `\`\`\`${crownMessage}\`\`\``;
        embed
          .setTitle('Paramètres: `Système de couronne`')
          .addField('Rôle', crownRole, true)
          .addField('Salon', crownChannel, true)
          .addField('Programme', crownSchedule, true)
          .addField('Statut', crownStatus);
        if (crownMessage.length > 1024) embed
          .setDescription(crownMessage)
          .addField('Message', 'Message situé au-dessus en raison des limites de caractères.');
        else embed.addField('Message', crownMessage);
        return message.channel.send(embed);
      case 'commands':
      case 'disabledcommands':
        return message.channel.send(embed
          .setTitle('Paramètres: `Commandes désactivées`')
          .addField('Commandes désactivées', disabledCommands)
        );
    }
    if (setting)
      return this.sendErrorMessage(message, `
      Argument invalide. Veuillez saisir une catégorie de paramètres valide. Utilisation \`${row.prefix}settings\` pour une liste.
      `);

    if (verificationMessage.length > 512) verificationMessage = verificationMessage.slice(0, 503) + '...';
    if (welcomeMessage.length > 512) welcomeMessage = welcomeMessage.slice(0, 503) + '...';
    if (leaveMessage.length > 512) leaveMessage = leaveMessage.slice(0, 503) + '...';
    if (crownMessage.length > 512) crownMessage = crownMessage.slice(0, 503) + '...';
    if (verificationMessage != '`Aucun`') verificationMessage = `\`\`\`${verificationMessage}\`\`\``;
    if (welcomeMessage != '`Aucun`') welcomeMessage = `\`\`\`${welcomeMessage}\`\`\``;
    if (leaveMessage != '`Aucun`') leaveMessage = `\`\`\`${leaveMessage}\`\`\``;
    if (crownMessage != '`Aucun`') crownMessage = `\`\`\`${crownMessage}\`\`\``;

    embed
      .setTitle('Paramètres')
      .addField('__**Système**__', stripIndent`
        **Préfix:** ${prefix}
        **Salon système:** ${systemChannel}
        **Salon Modlog:** ${modlogChannel}
        **Rôle Administrateur:** ${adminRole}
        **Rôle Modérateur:** ${modRole}
        **Rôle Mute:** ${muteRole}
        **Auto Rôle:** ${autoRole}
        **Auto Kick:** ${autoKick}
        **Couleur aléatoire:** ${randomColor}
      `)
      .addField('__**Vérification**__', stripIndent`
        **Statut:** ${verificationStatus}
        **Rôle:** ${verificationRole}
        **Salon:** ${verificationChannel}
        **Message:** ${verificationMessage}
      `)
      .addField('__**Messages de bienvenue**__', stripIndent`
        **Statut:** ${welcomeStatus}
        **Salon:** ${welcomeChannel}
        **Message:** ${welcomeMessage}
      `)
      .addField('__**Messages d\'au revoir**__', stripIndent`
        **Statut:** ${leaveStatus}
        **Salon:** ${leaveChannel}
        **Message:** ${leaveMessage}
      `)
      .addField('__**Système de points**__', stripIndent`
        **Statut:** ${pointsStatus}
        **Points de message:** ${messagePoints}
        **Points de commande:** ${commandPoints}
        **Points de vocal:** ${voicePoints}
      `)
      .addField('__**Système de couronne**__', stripIndent`
        **Statut:** ${crownStatus}
        **Programme:** ${crownSchedule}
        **Rôle:** ${crownRole}
        **Salon:** ${crownChannel}
        **Message:** ${crownMessage}
      `)
      .addField('__**Commandes désactivées**__', disabledCommands);

    message.channel.send(embed);
  }
};