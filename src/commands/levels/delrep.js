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
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');

module.exports = class DelrepCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delrep',
      aliases: ['dr'],
      usage: 'delrep [membre]',
      description: 'Effacer les réputations d\'un membre',
      ownerOnly: true,
      type: client.types.LEVEL
    });
  }
  async run(message) {
   let user = message.mentions.users.first()
   let reps = await db.get(`userthanks_${user.id}`)
   if(!user) return this.sendErrorMessage(message, 0, "mentionner un membre pour supprimer la réputation")
    
    db.delete(`userthanks_${user.id}`, reps)

const embed = new MessageEmbed()

.setColor("#2f3136")
.setFooter(config.footer)
.setDescription(""+emojis.success+" **Vous avez bien supprimez **"+reps+" réputation(s)** à <@"+user.id+">.")
 return message.channel.send(embed)

}};
