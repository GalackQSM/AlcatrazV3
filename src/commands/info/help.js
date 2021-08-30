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
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      usage: 'help [commande]',
      description: 'Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d\'informations.',
      type: client.types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); 
    const { capitalize } = message.client.utils;
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (command && command.type != message.client.types.OWNER && !disabledCommands.includes(command.name)) {
      
      const embed = new MessageEmbed() 
        .setTitle(`Information de la commandes: \`${command.name}\``)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(command.description)
        .addField('Usage', `\`${prefix}${command.usage}\``, true)
        .addField('Catégorie', `\`${capitalize(command.type)}\``, true)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed.addField('Exemples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));

      message.channel.send(embed);

    } else if (args.length > 0) {
      return this.sendErrorMessage(message, `Impossible de trouver la commande \`${args[0]}\`. Veuillez saisir une commande valide.`);

    } else {

      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      const { INFO, FUN, COULEUR, POINTS, NFSW, GENERAL, JEUX, ECONOMY, LEVEL, AVATAR, BACKUP, MOD, ANTIRAID, ADMIN, OWNER } = message.client.types;
      const emojis = [
        '<:alcatraz_afk:881311926959890452>',
        '<:alcatraz_fun:881311928528543745>',
        '<:alcatraz_color:881311927807139911>',
        '<:alcatraz_points:881311930407604235>',
        '<:alcatraz_nsfw:881311930319519754>',
        '<:alcatraz_misc:881311929631670352>',
        '<:alcatraz_emojis:881311928570486794>',
        '<:alcatraz_economy:881331122829676605>',
        '<:alcatraz_level:881328186917552170>',
        '<:alcatraz_pseudo:881311930386620437>',
        '<:alcatraz_utilitaire:881311931309391872>',
        '<:alcatraz_mod:881311930109816833>',
        '<:alcatraz_antiraid:881328186770751559>',
        '<:alcatraz_admin:881311926838255716>',
        '<:alcatraz_owner:881311929925263452>'
      ];

      message.client.commands.forEach(command => {
        if (!disabledCommands.includes(command.name)) commands[command.type].push(`\`${command.name}\`,`);
      });

      const json = new MessageEmbed()
        .setTitle(`Panel des commandes de ${config.NomBot}`)
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **Plus d'information:** \`${prefix}help [commande]\`
          **Nombre de commandes:** \`${message.client.commands.size}\`
        `)
        .addField(`<:alcatraz_liens:881311929212215327> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/GalackQSM/AlcatrazV3) | [Site](https://alcatraz-bot.com) | [Dons](https://www.patreon.com/AlcatrazBot) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");

      const embed = new MessageEmbed() 
        .setTitle(`Commandes de ${config.NomBot}`)
        .setDescription(`Bienvenue à toi **${member.displayName}** sur le menu des commandes, si tu as un problème avec **${config.NomBot}**, n'hésite pas à rejoindre notre serveur support [${config.NomServeur}](${config.Support}) est créé un ticket dans le salon <#${config.ticketChannelId}>.`)
        .addField(`${emojis[0]} ${capitalize(INFO)}`, `\`${commands[INFO].length}\` commandes`, true)
        .addField(`${emojis[1]} ${capitalize(FUN)}`, `\`${commands[FUN].length}\` commandes`, true)
        .addField(`${emojis[2]} ${capitalize(COULEUR)}`, `\`${commands[COULEUR].length}\` commandes`, true)
        .addField(`${emojis[3]} ${capitalize(POINTS)}`, `\`${commands[POINTS].length}\` commandes`, true)
        .addField(`${emojis[4]} ${capitalize(NFSW)}`, `\`${commands[NFSW].length}\` commandes`, true)
        .addField(`${emojis[5]} ${capitalize(GENERAL)}`, `\`${commands[GENERAL].length}\` commandes`, true)
        .addField(`${emojis[6]} ${capitalize(JEUX)}`, `\`${commands[JEUX].length}\` commandes`, true)
        .addField(`${emojis[7]} ${capitalize(ECONOMY)}`, `\`${commands[ECONOMY].length}\` commandes`, true)
        .addField(`${emojis[8]} ${capitalize(LEVEL)}`, `\`${commands[LEVEL].length}\` commandes`, true)
        .addField(`${emojis[9]} ${capitalize(AVATAR)}`, `\`${commands[AVATAR].length}\` commandes`, true)
        .addField(`${emojis[10]} ${capitalize(BACKUP)}`, `\`${commands[BACKUP].length}\` commandes`, true)
        .addField(`${emojis[11]} ${capitalize(MOD)}`, `\`${commands[MOD].length}\` commandes`, true)
        .addField(`${emojis[12]} ${capitalize(ANTIRAID)}`, `\`${commands[ANTIRAID].length}\` commandes`, true)
        .addField(`${emojis[13]} ${capitalize(ADMIN)}`, `\`${commands[ADMIN].length}\` commandes`, true)
        .addField(`${emojis[14]} ${capitalize(OWNER)}`, `\`${commands[OWNER].length}\` commandes`, true)
        .addField(`<:alcatraz_liens:881311929212215327> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/GalackQSM/Alcatraz) | [Site](https://alcatraz-bot.com) | [Dons](https://www.patreon.com/AlcatrazBot) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
        .setFooter(config.footer)
        .setTimestamp()
        .setImage('https://i.imgur.com/1jlqgj9.png')
        .setColor("#2f3136");

      const reactions = {
        '881311926959890452': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[0]} ${capitalize(INFO)}`, 
          value: commands[INFO].join(' ')
        }),
        '881311928528543745': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[1]} ${capitalize(FUN)}`, 
          value: commands[FUN].join(' ')
        }),
        '881311927807139911': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[2]} ${capitalize(COULEUR)}`, 
          value: commands[COULEUR].join(' ')
        }),
        '881311930407604235': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[3]} ${capitalize(POINTS)}`, 
          value: commands[POINTS].join(' ')
        }),
        '881311930319519754': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[4]} ${capitalize(NFSW)}`, 
          value: commands[NFSW].join(' ')
        }),
        '881311929631670352': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[5]} ${capitalize(GENERAL)}`, 
          value: commands[GENERAL].join(' ')
        }),
        '881311928570486794': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[6]} ${capitalize(JEUX)}`, 
          value: commands[JEUX].join(' ')
        }),
        '881331122829676605': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[7]} ${capitalize(ECONOMY)}`, 
          value: commands[ECONOMY].join(' ')
        }),
        '881328186917552170': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[8]} ${capitalize(LEVEL)}`, 
          value: commands[LEVEL].join(' ')
        }),
        '881311930386620437': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[9]} ${capitalize(AVATAR)}`, 
          value: commands[AVATAR].join(' ')
        }),
        '881311931309391872': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[10]} ${capitalize(BACKUP)}`, 
          value: commands[BACKUP].join(' ')
        }),
        '881311930109816833': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[11]} ${capitalize(MOD)}`, 
          value: commands[MOD].join(' ')
        }),
        '881328186770751559': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[12]} ${capitalize(ANTIRAID)}`, 
          value: commands[ANTIRAID].join(' ')
        }),
        '881311926838255716': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[13]} ${capitalize(ADMIN)}`, 
          value: commands[ADMIN].join(' ')
        }),
        '881311929925263452': new MessageEmbed(json).spliceFields(0, 0 , { 
          name: `${emojis[14]} ${capitalize(OWNER)}`, 
          value: commands[OWNER].join(' ')
        }),
      };

      new Reactions(message.channel, message.member, embed, reactions, 180000);
    }
  }
};
