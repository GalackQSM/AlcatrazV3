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

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <ID> [raison]',
      description: 'Débannir un membre du serveur.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['unban 774652242787041310']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant d\'utilisateur valide');
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id).user;
    if (!user) return this.sendErrorMessage(message, 0, 'Impossible de trouver l\'utilisateur, veuillez vérifier l\'ID fourni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.guild.members.unban(user, reason);
    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être déban du serveur')
      .setDescription(`Le membre ${user.tag} a été débanni avec succès.`)
      .addField('Par', message.member, true)
      .addField('Membre', user.tag, true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} à debanni ${user.tag}`);
    
    this.sendModLogMessage(message, reason, { Member: user.tag });
  }
};
