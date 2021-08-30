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
const parser = require('cron-parser');
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SetCrownScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownschedule',
      aliases: ['setcs', 'scs'],
      usage: 'setcrownschedule <crown>',
      description: stripIndent`
        Définit le calendrier de rotation des rôles de couronne de Alcatraz.
        Le format est de style crown:
        \`\`\`*    *    *    *    *
        ┬    ┬    ┬    ┬    ┬
        │    │    │    │    │
        │    │    │    │    └ jour de la semaine (0 - 7)
        │    │    │    └───── mois (1 - 12)
        │    │    └────────── jour du mois (1 - 31)
        │    └─────────────── heurs (0 - 23)
        └──────────────────── minutes (0 - 59)\`\`\`
        Si vous souhaitez utiliser plusieurs valeurs pour l'une des catégories, veuillez les séparer par \`,\`.` +
        ' La syntaxe d\'étape est également prise en charge, par exemple: `0 */1 * * *` (Toutes les heures). ' +
        ' Pour le jour de la semaine, 0 et 7 peuvent représenter le dimanche. ' +
        ' Si vous avez besoin d\'aide supplémentaire pour construire votre crown, veuillez consulter ce site Web: <https://crontab.guru/#>. ' + 
        ` N'entrez aucun calendrier pour effacer le \`calendrier de la couronne\`.
        un \`rôle de la couronne\` doit également être défini pour activer la rotation des rôles.
        **Notez s'il vous plaît:** Pour éviter tout abus potentiel de l'API Discord, les minutes et les secondes seront toujours définies sur \`0\`.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownschedule 0 21 * * 3,6', 'setcrownschedule 0 0 15 * *']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: oldCrownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    const oldStatus = message.client.utils.getStatus(crownRoleId, oldCrownSchedule);

    if (crownMessage) {
      if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
      crownMessage = `\`\`\`${crownMessage}\`\`\``;
    }

    let description = 'Le `calendrier de la couronne` a été mis à jour avec succès. <:valider:774806924712476674>';
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Système de couronne`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Rôle', crownRole || '`Aucun`', true)
      .addField('Salon', crownChannel || '`Aucun`', true)
      .addField('Message', crownMessage || '`Aucun`')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (!message.content.includes(' ')) {
      message.client.db.settings.updateCrownSchedule.run(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); 
      
      const status = 'non actif';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(2, 0, { name: 'Calendrier', value: `\`${oldCrownSchedule || 'Aucun'}\` ➔ \`Aucun\``, inline: true })
        .spliceFields(3, 0, { name: 'Statut', value: statusUpdate })
      );
    }

    let crownSchedule = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    try {
      parser.parseExpression(crownSchedule);
    } catch (err) {
      return this.sendErrorMessage(message, 0, oneLine`
        Argument invalide. Veuillez réessayer avec une expression cron valide.
        Si vous avez besoin d'aide supplémentaire pour construire votre cron, veuillez consulter ce site Web: <https://crontab.guru/#>
      `);
    }

    const cron = crownSchedule.split(' ');
    if (cron[0] != '0') {
      description = description + `\n**Note:** Les minutes ont été modifiées de \`${cron[0]}\` à \`0\`.`;
      cron[0] = '0';
    }
    if (cron.length === 6 && cron[5] != '0') {
      if (description.includes('\n'))
        description = description.slice(0, -1) + `, et les secondes ont été changées de \`${cron[5]}\` à \`0\`.`;
      else description = description + `\n**Note:** Les secondes ont été changées de \`${cron[5]}\` à \`0\`.`;
      cron[5] = '0';
    } 
    crownSchedule = cron.join(' ');
    embed.setDescription(description);

    message.client.db.settings.updateCrownSchedule.run(crownSchedule, message.guild.id);
    if (message.guild.job) message.guild.job.cancel(); 

    message.client.utils.scheduleCrown(message.client, message.guild);

    const status =  message.client.utils.getStatus(crownRole, crownSchedule);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .spliceFields(2, 0, { 
        name: 'Calendrier', 
        value: `\`${oldCrownSchedule || 'Aucun'}\` ➔ \`${crownSchedule}\``, 
        inline: true 
      })
      .spliceFields(3, 0, { name: 'Statut', value: statusUpdate })
    );
  }
};
