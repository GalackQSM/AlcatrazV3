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
//● Crée par GalackQSM#0895 le 09 novembre 2020
//● Serveur Discord: https://discord.gg/HPtTfqDdMr
//● Github: https://github.com/GalackQSM/Alcatraz                                                      
//=======================================================================                                                                      
                                                                       
const Command = require('../Alcatraz.js');
const config = require('../../../config.json');

const Discord = require("discord.js")
const db = require("quick.db")
 const ms = require('parse-ms');
const { truncate } = require("fs");
module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            description: 'définir la configuration de l\'anti-raid!',
            userPermissions: ['MANAGE_GUILD'],
            type: client.types.ANTIRAID
        });
    }
  async run(message, args) {
    let cmd = args[0];
    const guildicon = message.guild.iconURL();
    if(!cmd) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL())
        .setDescription(`
        ** Commandes**
   > **config setrolecreatelimits
   > config setactionlogs
   > config setroledeletelimits
   > config setchannelcreatelimits
   > config setchanneldeletelimits
   > config setbanlimits
   > config setkicklimits
   > config clearuser
   > config show**     
   `)
       .setFooter(config.footer)
       .setColor("#2f3136")
  return message.channel.send(embed);
}
 if(cmd.toLowerCase() === 'show') {
   let rolelimt = db.get(`rolecreatelimt_${message.guild.id}`) 
   if(rolelimt === null) rolelimt = "Désactivé"
   let roledelete = db.get(`roledeletelimts_${message.guild.id}`) 
   if(roledelete === null) roledelete = "Désactivé"
   let logschannel = db.get(`acitonslogs_${message.guild.id}`)
   let logschannel2 = db.get(`acitonslogs_${message.guild.id}`)
   if(logschannel === null) logschannel = "Désactivé"
   else logschannel = `<#${logschannel2}>`
   let channelcreatelimts = db.get(`channelcreatelimts_${message.guild.id}`)
   if(channelcreatelimts === null) channelcreatelimts = "Désactivé"
   let channeldeletelimts = db.get(`channeldeletelimts_${message.guild.id}`)
   if(channeldeletelimts === null) channeldeletelimts = "Désactivé"
   let banlimts = db.get(`banlimts_${message.guild.id}`)
  if(banlimts === null) banlimts = "Désactivé"
  let kicklimts = db.get(`kicklimts_${message.guild.id}`)
  if(kicklimts === null) kicklimts = "Désactivé"

   let showembed = new Discord.MessageEmbed()

   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .addField('Limites de création de rôle', "`"+rolelimt+" Rôle`", true)
   .addField('Limites de suppression de rôle', "`"+roledelete+" Rôle`", true)
   .addField(`Salon des logs`, logschannel, true)
   .addField(`Limites de création de salon`, "`"+channelcreatelimts+" Salon`", true)
   .addField(`Limites de suppression de salon`, "`"+channeldeletelimts+" Salon`", true)
   .addField(`Limites de ban`, "`"+banlimts+" Ban`", true)
   .addField(`Limites de kick`, "`"+kicklimts+" Kick`", true)
   .setFooter(config.footer)
   .setColor("#2f3136")
    return message.channel.send(showembed);
 }
 if(cmd.toLowerCase() === 'setrolecreatelimits') {
let rolecreate = args.slice(1).join(" ");
if(!rolecreate) {
 let missing = new Discord.MessageEmbed()
 .setAuthor(message.author.username, message.author.displayAvatarURL())
 .setDescription(`**Utilisation invalide**\nconfig setolecreatelimits [nombre]`)
 .setFooter(config.footer)
 .setColor("#2f3136")
  return message.channel.send(missing);
}
if(isNaN(rolecreate)) {
  let missing = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`**Utilisation invalide (ne peut pas être des mots seulement des chiffres)**\nconfig setrolecreatelimits [nombre]`)
  .setFooter(config.footer)
  .setColor("#2f3136")
return message.channel.send(missing);
}
db.set(`rolecreatelimt_${message.guild.id}`, rolecreate)
let done = new Discord.MessageEmbed() 
.setAuthor(message.author.username, message.author.displayAvatarURL())
.setDescription("<a:alcatraz_oui:877180252491767858> Limites des création de rôle a été défini sur `"+rolecreate+"`")
.setFooter(config.footer)
.setColor("#2f3136")
return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setroledeletelimits') {
  let roledelete = args.slice(1).join(" ");
  if(!roledelete) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`**Utilisation invalide**\nconfig setroledeletelimits [nombre]`)
   .setFooter(config.footer)
   .setColor("#2f3136")
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Utilisation invalide (ne peut pas être des mots seulement des chiffres)**\nconfig setroledeletelimits [nombre]`)
    .setFooter(config.footer)
    .setColor("#2f3136")
  return message.channel.send(missing);
  }
  db.set(`roledeletelimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription("<a:alcatraz_oui:877180252491767858> Limites des suppression de rôle a été défini sur `"+rolecreate+"`")
  .setFooter(config.footer)
  .setColor("#2f3136")
  return message.channel.send(done);
  
}
if(cmd.toLowerCase() === 'setactionlogs') {
  let logs = message.mentions.channels.first();
  if(!logs) {
  let logsembed = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription(`Veuillez mentionner une chaîne valide`)
  .setFooter(config.footer)
  .setColor("#2f3136")
return message.channel.send(logsembed);
}
logs.send(`**Salon log de l'anti-raid**`)
db.set(`acitonslogs_${message.guild.id}`, logs.id)
let done = new Discord.MessageEmbed()
.setAuthor(message.author.username, message.author.displayAvatarURL())
.setDescription(`Le salon des logs a été réglé sur ${logs}`)
.setFooter(config.footer)
.setColor("#2f3136")
return message.channel.send(done)
}
if(cmd.toLowerCase() === 'setchannelcreatelimits') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`**Utilisation invalide**\nconfig setchannelcreatelimits [nombre]`)
   .setFooter(config.footer)
   .setColor("#2f3136")
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Utilisation invalide (ne peut pas être des mots seulement des chiffres)**\nconfig setchannelcreatelimits [nombre]`)
    .setFooter(config.footer)
    .setColor("#2f3136")
  return message.channel.send(missing);
  }
  db.set(`channelcreatelimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription("<a:alcatraz_oui:877180252491767858> Les limites de création de salon ont été définies sur `"+rolecreate+"`")
  .setFooter(config.footer)
  .setColor("#2f3136")
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setchanneldeletelimits') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`**Utilisation invalide**\nconfig setchanneldeletelimits [nombre]`)
   .setFooter(config.footer)
   .setColor("#2f3136")
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Utilisation invalide (ne peut pas être des mots seulement des chiffres)**\nconfig setchanneldeletelimits [nombre]`)
    .setFooter(config.footer)
    .setColor("#2f3136")
  return message.channel.send(missing);
  }
  db.set(`channeldeletelimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription("<a:alcatraz_oui:877180252491767858> Les limites de suppression des salons ont été définies sur `"+rolecreate+"`")
  .setFooter(config.footer)
  .setColor("#2f3136")
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setbanlimits') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`**Utilisation invalide**\nconfig setbanlimits [nombre]`)
   .setFooter(config.footer)
   .setColor("#2f3136")
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Utilisation invalide (Ne peut pas être des mots seulement des nombres)**\nconfig setbanlimt [nombre]`)
    .setFooter(config.footer)
    .setColor("#2f3136")
  return message.channel.send(missing);
  }
  db.set(`banlimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription("<a:alcatraz_oui:877180252491767858> Limites des bans a été défini sur `"+rolecreate+"`")
  .setFooter(config.footer)
  .setColor("#2f3136")
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'setkicklimits') {
  let rolecreate = args.slice(1).join(" ");
  if(!rolecreate) {
   let missing = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.displayAvatarURL())
   .setDescription(`**Utilisation invalide**\nconfig setbanlimits [nombre]`)
   .setFooter(config.footer)
   .setColor("#2f3136")
  
    return message.channel.send(missing);
  }
  if(isNaN(rolecreate)) {
    let missing = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`**Utilisation invalide (Ne peut pas être des mots seulement des nombres)**\nconfig setkicklimits [nombre]`)
    .setFooter(message.guild.name, guildicon)
  return message.channel.send(missing);
  }
  db.set(`kicklimts_${message.guild.id}`, rolecreate)
  let done = new Discord.MessageEmbed() 
  .setAuthor(message.author.username, message.author.displayAvatarURL())
  .setDescription("Limites des kicks a été défini sur `"+rolecreate+"`")
  .setFooter(config.footer)
  .setColor("#2f3136")
  return message.channel.send(done);
}
if(cmd.toLowerCase() === 'clearuser') {
  let user = message.mentions.users.first()
if(!user) {
  return message.channel.send(`** Mentionner l'utilisateur **`);
}
db.delete(`executer_${message.guild.id}_${user.id}_kicklimts`) 
db.delete(`executer_${message.guild.id}_${user.id}_banlimts`)
db.delete(`executer_${message.guild.id}_${user.id}_rolecreate`)
db.delete(`executer_${message.guild.id}_${user.id}_roledelete`)
db.delete(`executer_${message.guild.id}_${user.id}_channelcreate`)
db.delete(`executer_${message.guild.id}_${user.id}_channeldelete`)
return message.channel.send(`Limites utilisateur réinitialisées`);
}
}}
