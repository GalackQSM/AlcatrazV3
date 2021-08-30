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

module.exports = class ListeRoleCommand extends Command {
  constructor(client) {
    super(client, {
            name: 'listerole',
            aliases: ["lr"],
            description: 'Voir la liste de tous les rôles du serveur.',
            examples: ["listerole"],
            type: client.types.INFO,

        });
    }
    async run(message, args) {
        const roles = new MessageEmbed()
        .setTitle(`📃 Liste des rôles du serveur ${message.guild.name}`)
        .setDescription(message.guild.roles.cache.map(r => `${r}`).join(" | "))
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")
    message.channel.send(roles);
    }
};
