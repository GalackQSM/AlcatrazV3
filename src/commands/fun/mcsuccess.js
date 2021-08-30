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
const Discord = require("discord.js");
const superagent = require('superagent')
const fetch = require('node-fetch');
const axios = require('axios')

module.exports = class MinecraftArchievementCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mcsuccess',
      aliases: ['mcs'],
      usage: 'mcsuccess [texte]',
      description: 'Transformez votre texte en un succès Minecraft.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
try {
let text = args.join(" "); 
 if (!text) return message.channel.send("Écrivez un texte pour la réalisation."); 
 if (text.length > 23) return message.channel.send("Le succès ne peut contenir que 23 caractères maximum."); 
 if (text.length < 2) return message.channel.send("Le succès doit contenir plus de 2 caractères."); 

let links = ["https://www.minecraftskinstealer.com/achievement/a.php?i=38", "https://www.minecraftskinstealer.com/achievement/a.php?i=1", "https://www.minecraftskinstealer.com/achievement/a.php?i=21", "https://www.minecraftskinstealer.com/achievement/a.php?i=20", "https://www.minecraftskinstealer.com/achievement/a.php?i=13", "https://www.minecraftskinstealer.com/achievement/a.php?i=18", "https://www.minecraftskinstealer.com/achievement/a.php?i=17", "https://www.minecraftskinstealer.com/achievement/a.php?i=9", "https://www.minecraftskinstealer.com/achievement/a.php?i=31", "https://www.minecraftskinstealer.com/achievement/a.php?i=22", "https://www.minecraftskinstealer.com/achievement/a.php?i=23", "https://www.minecraftskinstealer.com/achievement/a.php?i=2", "https://www.minecraftskinstealer.com/achievement/a.php?i=11", "https://www.minecraftskinstealer.com/achievement/a.php?i=19", "https://www.minecraftskinstealer.com/achievement/a.php?i=33", "https://www.minecraftskinstealer.com/achievement/a.php?i=34", "https://www.minecraftskinstealer.com/achievement/a.php?i=26", "https://www.minecraftskinstealer.com/achievement/a.php?i=35", "https://www.minecraftskinstealer.com/achievement/a.php?i=6", "https://www.minecraftskinstealer.com/achievement/a.php?i=7", "https://www.minecraftskinstealer.com/achievement/a.php?i=10", "https://www.minecraftskinstealer.com/achievement/a.php?i=39", "https://www.minecraftskinstealer.com/achievement/a.php?i=4", "https://www.minecraftskinstealer.com/achievement/a.php?i=5", "https://www.minecraftskinstealer.com/achievement/a.php?i=28"] //Links de los logros. (Yo solo añadí algunos, puedes seguir añadiendo más si quieres)
 
const { body } = await superagent
.get(links[Math.floor(Math.random() * links.length)])
.query({
  h: 'Succès obtenue!',
  t: text
});
  
message.channel.send({ files: [{ attachment: body, name: 'Achievement.png' }] 
                      
});
} catch (err) {
console.log(err)
}
}}