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

module.exports = class CouleursCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleurs',
      aliases: ['colors'],
      usage: 'couleurs',
      description: 'Affiche une liste de toutes les couleurs disponibles.',
      type: client.types.COULEUR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
   
    const colors = message.guild.roles.cache.filter(c => c.name.startsWith('#'))
      .sort((a, b) => b.position - a.position).array();
    
    const embed = new MessageEmbed()
      .setTitle(`Couleurs disponibles [${colors.size}]`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix

    let max = 50;
    if (colors.length === 0) message.channel.send(embed.setDescription('Aucune couleur trouvée.'));
    else if (colors.length <= max) {
      const range = (colors.length == 1) ? '[1]' : `[1 - ${colors.length}]`;
      message.channel.send(embed
        .setTitle(`Couleurs disponibles ${range}`)
        .setDescription(`${colors.join(' ')}\n\nFaite \`${prefix}couleur <nom de couleur>\` pour choisir une couleur de rôle.`)
      );
      
    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Couleurs disponibles [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après deux minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`${colors.slice(n, max).join(' ')}\n\nFaite \`${prefix}couleur <nom de couleur>\` en choisir un.`);

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new MessageEmbed(json)
          .setTitle(`Couleurs disponibles [${n + 1} - ${max}]`)
          .setDescription(`${colors.slice(n, max).join(' ')}\n\nFaite \`${prefix}couleur <nom de couleur>\` en choisir un.`);
      };

      const next = () => {
        if (max === colors.length) return;
        n += interval;
        max += interval;
        if (max >= colors.length) max = colors.length;
        return new MessageEmbed(json)
          .setTitle(`Couleurs disponibles [${n + 1} - ${max}]`)
          .setDescription(`${colors.slice(n, max).join(' ')}\n\nFaite \`${prefix}couleur <nom de couleur>\` en choisir un.`);
      };

      const reactions = {
        '◀️': previous,
        '▶️': next,
      };

      new Reactions(message.channel, message.member, embed, reactions);
      
    }
  }
};
