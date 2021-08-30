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
const Discord = require("discord.js");
const backup = require("discord-backup");
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

  backup.setStorageFolder(__dirname+"/backups/");
module.exports = class BackupInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'infobackup',
      usage: 'infobackup <ID>',
      aliases: ['infobck'],
      description: 'Informations sur la sauvegarde de votre serveur',
      type: client.types.BACKUP
    });
  }
  async run(message, args) {

        let backupID = args[0];
        if(!backupID){
            return message.channel.send(""+emojis.fail+" | Vous devez spécifier un ID de sauvegarde valide!");
        }
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${(dd[1]?dd:"0"+dd[0])}/${(mm[1]?mm:"0"+mm[0])}/${yyyy}`;
            let embed = new Discord.MessageEmbed()
                .setAuthor("Informations de la sauvegarde")
                .setThumbnail(backupInfos.data.iconURL)
                .addField("ID de sauvegarde", backupInfos.id, false)
                .addField("ID du serveur", backupInfos.data.guildID, false)
                .addField("Taille", `${backupInfos.size} mb`, false)
                .addField("Créé le", formatedDate, false)
                .addField("Région", backupInfos.data.region, false)
                .setFooter(config.footer)
                .setTimestamp()
                .setColor("#2f3136");
            message.channel.send(embed);
        }).catch((err) => {
            return message.channel.send(":x: | Aucune sauvegarde trouvée pour `"+backupID+"`!");
        });
    }
  };
