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

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      usage: 'ban <@membre/ID> [raison]',
      description: 'Bannir un membre de votre serveur.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['ban @GalackQSM']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous bannir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas bannir quelqu\'un avec un rôle égal ou supérieur');
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'Le membre fourni ne peut pas être banni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await member.ban({ Raison: reason });
        const banni = [
            `https://media1.tenor.com/images/d856e0e0055af0d726ed9e472a3e9737/tenor.gif?itemid=8540509`,
            `https://media1.tenor.com/images/e72cac5d0e755aca7d78ed19ac34cc9a/tenor.gif?itemid=18033317`,
            `https://thumbs.gfycat.com/ConfusedDiligentIvorygull-size_restricted.gif`,
            `https://i.pinimg.com/originals/f4/2b/fb/f42bfb762f9c4bad9428facae3363f78.gif`,
            `https://thumbs.gfycat.com/UnselfishColdErne-size_restricted.gif`
        ]
    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être banni')
      .setDescription(`Le membre **${member}** a été banni avec succès.\n\n**Par:** ${message.member}\n**Membre banni:** ${member}\n**Pour la raison:** ${reason}`)
      .setImage(banni[Math.floor(Math.random() * banni.length)])
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} a banni ${member.user.tag}`);
        
    this.sendModLogMessage(message, reason, { Membre: member});
  }
};
