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
const Reactions = require('../../../reactions.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'moderateur',
      usage: 'moderateur',
      description: 'Affiche une liste de tous les modérateurs actuels.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const modRole = message.guild.roles.cache.get(modRoleId) || '`Aucun`';

    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`Listes des moderateurs [${mods.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Rôle des modérateurs', modRole)
      .addField('Nombre de modérateurs', `**${mods.length}** membre(s) sur **${message.guild.members.cache.size}** membres`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    let max = 25;
    if (mods.length === 0) message.channel.send(embed.setDescription('Aucun modérateur trouvé.'));
    else if (mods.length <= max) {
      const range = (mods.length == 1) ? '[1]' : `[1 - ${mods.length}]`;
      message.channel.send(embed
        .setTitle(`Liste des modérateurs ${range}`)
        .setDescription(mods.join('\n'))
      );

    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Liste des modérateurs [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après deux minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(mods.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new MessageEmbed(json)
          .setTitle(`Liste des modérateurs [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === mods.length) return;
        n += interval;
        max += interval;
        if (max >= mods.length) max = mods.length;
        return new MessageEmbed(json)
          .setTitle(`Liste des modérateurs [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const reactions = {
        '◀️': previous,
        '▶️': next,
      };

      new Reactions(message.channel, message.member, embed, reactions);
    }
  }
};