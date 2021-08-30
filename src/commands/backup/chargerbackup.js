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
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');
const backup = require("discord-backup");
  backup.setStorageFolder(__dirname+"/backups/");

module.exports = class ChargerBackupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chargerbackup',
      usage: 'chargerbackup <ID>',
      aliases: ['chargerbck'],
      description: 'Charger une sauvegarde de votre serveur',
      type: client.types.BACKUP
    });
  }
  async run(message, args) {
    
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(""+emojis.fail+" | Vous devez être administrateur de ce serveur pour charger une sauvegarde!");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(""+emojis.fail+" | Vous devez spécifier un ID de sauvegarde valide!");
        }
        backup.fetch(backupID).then(async () => {
            message.channel.send(":warning: | Lorsque la sauvegarde est chargée, tous les salon, rôles, etc. seront remplacés! Réagissez avec ✅ pour confirmer!").then(m => {
        m.react("✅")
      const filtro = (reaction, user) => {
            return ["✅"].includes(reaction.emoji.name) && user.id == message.author.id;
            };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {
                    m.edit(""+emojis.fail+" | Le temps est écoulé! Chargement de sauvegarde annulé!");
                }).then(coleccionado=> {
          
        const reaccion = coleccionado.first();
        if(reaccion.emoji.name === "✅"){
                  message.author.send(""+emojis.success+" | Votre sauvegarde c'est charger correctement!");
                  backup.load(backupID, message.guild).then(() => {
                      backup.remove(backupID);
                  }).catch((err) => {
                      return message.author.send(""+emojis.fail+" | Désolé, une erreur s'est produite ... Veuillez vérifier que je dispose des droits d'administrateur!");
                  });
        };
    
        })
      })
    });
}};
