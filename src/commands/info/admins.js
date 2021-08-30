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
const MenuReac = require('../../../reactions.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Affiche une liste de tous les administrateurs actuels.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    const adminRole = message.guild.roles.cache.get(adminRoleId) || '`Aucun`';

    const admins = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`Liste des administrateurs [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Rôle d\'administrateur', adminRole)
      .addField('Nombre d\'administrateurs', `**${admins.length}** membre(s) sur **${message.guild.members.cache.size}** membres`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    let max = 25;
    if (admins.length === 0) message.channel.send(embed.setDescription('Aucun administrateur trouvé.'));
    else if (admins.length <= max) {
      const range = (admins.length == 1) ? '[1]' : `[1 - ${admins.length}]`;
      message.channel.send(embed
        .setTitle(`Liste des administrateurs ${range}`)
        .setDescription(admins.join('\n'))
      );

    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Liste des administrateurs [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après deux minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(admins.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new MessageEmbed(json)
          .setTitle(`Liste des administrateurs [${n + 1} - ${max}]`)
          .setDescription(admins.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === admins.length) return;
        n += interval;
        max += interval;
        if (max >= admins.length) max = admins.length;
        return new MessageEmbed(json)
          .setTitle(`Liste des administrateurs [${n + 1} - ${max}]`)
          .setDescription(admins.slice(n, max).join('\n'));
      };

      const reactions = {
        '◀️': previous,
        '▶️': next,
      };

      new MenuReac(message.channel, message.member, embed, reactions);
    }
  }
};