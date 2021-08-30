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
const fetch = require('node-fetch');
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');
const Discord = require("discord.js");
const backup = require("discord-backup");
  backup.setStorageFolder(__dirname+"/backups/");

module.exports = class CreeBackupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creebackup',
      usage: 'creebackup',
      aliases: ['creebck'],
      description: 'Crée une sauvegarde de votre serveur',
      type: client.types.BACKUP
    });
  }
  async run(message) {
    
    let perms = message.member.hasPermission("ADMINISTRATOR");
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

    if (!perms)
      return message.channel.send(
       ""+emojis.fail+" `|` **Désolé "+`${message.author}`+", Vous ne disposez pas des autorisations «Administrateur» pour exécuter cette commande**"
      );
    backup
      .create(message.guild, {
        jsonBeautify: true
      })
      .then(backupData => {
        message.author.send(
          new Discord.MessageEmbed()
         .setAuthor(`Sauvegarde créée avec succès.`)
          .setDescription(`${emojis.success} Votre saugarde a été faite avec succès.\nPour charger la sauvegarde, utilisez ${prefix}chargerbackup ${backupData.id}`)
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136")

          )
        message.channel.send(
          new Discord.MessageEmbed()
         .setAuthor(`Sauvegarde créée avec succès.`)
          .setThumbnail(message.author.displayAvatarURL())
          .setDescription(`${emojis.success} Votre saugarde a été faite avec succès.\n**L'ID de le sauvegarde a été envoyé en message privé.**`)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136")

        );
      });
    }
  };
