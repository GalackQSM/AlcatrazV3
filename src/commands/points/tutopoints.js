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
const { stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class ExplainPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tutopoints',
      aliases: ['tutop', 'tp'],
      usage: 'tutopoints',
      description: 'Explique les différents aspects des points et des systèmes de couronnes d\'Alcatraz.',
      type: client.types.POINTS
    });
  }
  run(message) {

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);

    let earningPoints = 
      stripIndent`Vous pouvez gagner des points des manières suivantes: en envoyant des **messages**, en utilisant les  **commandes**,` +
      ' et en passant du temps dans le **salon vocal**.';
    if (!disabledCommands.includes('givepoints')) earningPoints += 
      ` Et si quelqu'un se sent généreux, il peut vous donner des points en utilisant la commande \`${prefix}givepoints\`.`;
    
    const pointsPer = stripIndent`
      Points de message :: ${messagePoints} par message
      Points de commande :: ${commandPoints} par commande
      Points de vocal   :: ${voicePoints} par minute
    `;

    earningPoints += ` Voici les **points par action de ce serveur**:\n\`\`\`asciidoc\n${pointsPer}\`\`\``;
 
    if (!disabledCommands.includes('actionpoints'))
      earningPoints += `
        Pour revoir rapidement les points par action de votre serveur, vous pouvez utiliser la commande \`${prefix}actionpoints\`.
      `;

    let checkingPoints = '';

    if (!disabledCommands.includes('points'))
      checkingPoints += `\nPour voir les points actuels, utilisez la commande \`${prefix}points\`.`;
    
    if (!disabledCommands.includes('totalpoints'))
      checkingPoints += ` Pour voir les points globaux, utilisez la commande \`${prefix}totalpoints\`.`;

    let leaderboard = '';

    if (!disabledCommands.includes('position'))
      leaderboard += ` Pour vérifier le classement du classement, utilisez la commande \`${prefix}position\`.`;
      
    if (!disabledCommands.includes('leaderboard'))
      leaderboard += ` Pour voir le classement lui-même, utilisez la commande \`${prefix}leaderboard (off)\`.`;
    
    let crown = stripIndent`
      Si un \`rôle de couronne\` et un \`calendrier de la couronne\` sont définis, alors la personne avec le plus de points dans ce cycle gagnera!` +
      ` De plus, les points de chacun seront réinitialisés à **0** (le total des points restera inchangé).
    `;

    if (!disabledCommands.includes('couronne'))
      crown += `\nUtilisez la commande \`${prefix}couronne\` pour des informations spécifiques au serveur.`;

    const embed = new MessageEmbed()
      .setTitle('Points et couronne')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Gagner des points', earningPoints)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    if (checkingPoints) embed.addField('Points de contrôle', checkingPoints);
    if (leaderboard) embed.addField('Le classement', leaderboard);
    embed.addField('La Couronne', crown);
    message.channel.send(embed);
  }
};
