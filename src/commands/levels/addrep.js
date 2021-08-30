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
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class AddrepCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrep',
      aliases: ['arep'],
      usage: 'addrep [nombre] [membre]',
      description: 'Ajouter des points de réputation à un membre',
      ownerOnly: true,
      type: client.types.LEVEL
    });
  }
  async run(message, args) {
      
    let user = message.mentions.users.first()
    if(!user) return this.sendErrorMessage(message, 0, "mentionner un membre pour donner une réputation")
    
    db.add(`userthanks_${user.id}`, args[1])
    db.set(`cooldown_${message.author.id}`, Date.now())

    return message.react('👌')
    
}};
