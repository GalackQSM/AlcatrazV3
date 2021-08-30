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
const { oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      aliases: ['pos'],
      usage: 'position <@membre/ID>',
      description: oneLine`
        Récupère la position actuelle du classement d'un utilisateur.
        Si aucun utilisateur n'est indiqué, votre propre position sera affichée.`,
      type: client.types.POINTS,
      examples: ['position @GalackQSM']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const pos = leaderboard.map(row => row.user_id).indexOf(member.id) + 1;
    const ordinalPos = message.client.utils.getOrdinalNumeral(pos);
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle(`Position actuel de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} est a là **${ordinalPos}** place!`)
      .addField('Position', `\`${pos}\` sur \`${message.guild.members.cache.size}\``, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
