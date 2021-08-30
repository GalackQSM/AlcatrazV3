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

module.exports = class NicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pseudo',
      aliases: ['nick', 'nn'],
      usage: 'pseudo <pseudo>',
      description: 'Remplace votre propre surnom par celui spécifié. Le surnom ne peut pas comporter plus de 32 caractères.',
      type: client.types.GENERAL,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
      userPermissions: ['CHANGE_NICKNAME'],
      examples: ['pseudo GalackQSM']
    });
  }
  async run(message, args) {

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un pseudo');
    const nickname = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le pseudo ne dépasse pas 32 caractères');
    } else if (message.member === message.guild.owner) {
      return this.sendErrorMessage(message, 1, 'Impossible de changer le pseudo du propriétaire du serveur');
    } else {
      try {

        const oldNickname = message.member.nickname || '`Aucun`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await message.member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Changement de pseudo')
          .setDescription(`Le pseudo de ${message.member} a été mis à jour avec succès.`)
          .addField('Membre', message.member, true)
          .addField('Pseudo', nicknameStatus, true)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");
        message.channel.send(embed);

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }  
  }
};