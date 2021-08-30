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
const config = require('../../../config.json');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: 'kick <@membre/ID> [raison]',
      description: 'Expulse un membre de votre serveur.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['kick @GalackQSM']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous expulsez'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas botter quelqu\'un avec un rôle égal ou supérieur');
    if (!member.kickable) 
      return this.sendErrorMessage(message, 0, 'Le membre fourni ne peut pas être kick');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.kick(reason);
        const kick = [
            `https://media4.giphy.com/media/3xz2BHM2zwM3mFfYgo/giphy.gif`,
            `https://www.reactiongifs.com/r/2011/08/gtfo.gif`,
            `https://media.melty.fr/article-4076200-raw/media.gif`,
            `https://media2.giphy.com/media/l3V0j3ytFyGHqiV7W/giphy.gif`
        ]
    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être kick')
      .setDescription(`Le membre **${member}** a été kick avec succès.\n\n**Par:** ${message.member}\n**Membre kick:** ${member}\n**Pour la raison:** ${reason}`)
      .setImage(kick[Math.floor(Math.random() * kick.length)])
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} a kick ${member.user.tag}`);
    
    this.sendModLogMessage(message, reason, { Membre: member});
  }
};
