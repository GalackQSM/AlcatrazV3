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

module.exports = class GivePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'givepoints',
      aliases: ['gp'],
      usage: 'givepoints <@membre/ID> <nombre de point>',
      description: 'Donne le montant spécifié de vos propres points à l\'utilisateur mentionné.',
      type: client.types.POINTS,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['givepoints @GalackQSM 1000']
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member.id === message.client.user.id)
      return message.channel.send('Merci, vous êtes trop gentil! Mais je dois refuser. Je préfère ne pas prendre de documents.');
    const amount = parseInt(args[1]);
    const points = message.client.db.users.selectPoints.pluck().get(message.author.id, message.guild.id);
    if (isNaN(amount) === true || !amount)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de points valide');
    if (amount < 0 || amount > points) return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez indiquer un nombre de points inférieur ou égal à ${points} (votre total de points)
    `);
    message.client.db.users.updatePoints.run({ points: -amount }, message.author.id, message.guild.id);
    const oldPoints = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    message.client.db.users.updatePoints.run({ points: amount }, member.id, message.guild.id);
    let description;
    if (amount === 1) description = `Transfert réussi de **${amount}** point à ${member}!`;
    else description = `Transfert réussi de **${amount}** point à ${member}!`;
    const embed = new MessageEmbed()
      .setTitle(`Points actuel de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(description)
      .addField('Par', message.member, true)
      .addField('À', member, true)
      .addField('Points', `\`${oldPoints}\` ➔ \`${amount + oldPoints}\``, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
