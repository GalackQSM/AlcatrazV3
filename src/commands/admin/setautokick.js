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

module.exports = class SetAutoKickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautokick',
      aliases: ['setak', 'sak'],
      usage: 'setautokick <nombre>',
      description: oneLine`
      Définit le nombre d'avertissements nécessaires avant que Alcatraz expulse automatiquement quelqu'un de votre serveur.
      Ne fournissez aucun nombre d'avertissements ou un nombre d'avertissements de 0 pour désactiver \`l'auto kick\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setautokick 3']
    });
  }
  run(message, args) {

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id) || 'non actif';
    const amount = args[0];
    if (amount && (!Number.isInteger(Number(amount)) || amount < 0)) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez saisir un nombre positif.');
      
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Auto Kick`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('`L\'auto kick` a été mis à jour avec succès. <:alcatraz_valider:776109858948120636>')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0 || amount == 0) {
      message.client.db.settings.updateAutoKick.run(null, message.guild.id);
      return message.channel.send(embed.addField('Statut', `\`${autoKick}\` ➔ \`non actif\``));
    }

    message.client.db.settings.updateAutoKick.run(amount, message.guild.id);
    message.channel.send(embed.addField('Statut', `\`${autoKick}\` ➔ \`${amount}\``));
  }
};
