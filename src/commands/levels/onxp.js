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
const db = require('quick.db');
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class MyVouchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'onxp',
      aliases: ['sxp'],
      description: 'Activer le sytème d\'XP',
      ownerOnly: true,
      type: client.types.LEVEL
    });
  }
  async run(message) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**Vous n'avez pas les autorisations requises ! - [ADMINISTRATEUR]**")

    try {
        let a = await db.fetch(`guildMessages_${message.guild.id}`)

        if (a) {
            return message.channel.send("**Les messages XP sont déjà activés sur le serveur!**")
        } else {
            db.set(`guildMessages_${message.guild.id}`, 1)
      const embed = new Discord.MessageEmbed()
        .setDescription(""+emojis.success+" Les messages XP sont activés avec succès!")
        .setFooter(config.footer)
        .setTimestamp() 
        .setColor("#2f3136");
      message.channel.send(embed);
        }
        return;
    } catch (e) {
        console.log(e)
        return message.channel.send("**Quelque chose s'est mal passé!**")
    }
}
}