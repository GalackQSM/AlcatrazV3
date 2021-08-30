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
const request = require('node-superfetch');
const config = require('../../../config.json');

module.exports = class SteamCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'steam',
      usage: 'steam <jeu>',
      description: 'Rechercher un jeu sur Steam.',
      type: client.types.INFO,
      examples: ['steam PUBG']
    });
  }

    async run(message, args) {
        try {
            const query = args.join(" ");

            if (!query){
            return this.sendErrorMessage(message, 0, 'Utilisation de la commande: steam [Nom du jeu]');
            } 

            const search = await request
            .get('https://store.steampowered.com/api/storesearch')
            .query({
                cc: 'fr',
                l: 'fr',
                term: query
            });
                    
            if (!search.body.items.length) return message.channel.send(`Aucun résultat de recherche trouvé pour le jeu **${query}**!`);
            
            const { id, tiny_image } = search.body.items[0];
            
            const { body } = await request
            .get('https://store.steampowered.com/api/appdetails')
            .query({ appids: id });
                
            const { data } = body[id.toString()];
            const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Gratuit';
            const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Gratuit';
            const price = current === original ? current : `~~${original}~~ ${current}`;
            const platforms = [];
            if (data.platforms) {
                if (data.platforms.windows) platforms.push('Windows');
                if (data.platforms.mac) platforms.push('Mac');
                if (data.platforms.linux) platforms.push('Linux');
            }

            const embed = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
                .setTitle(`__**${data.name}**__`)
                .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
                .setDescription(`\`${data.short_description}\``)
                .setImage(tiny_image)
                .addField('❯ Prix', `\`${price}\``, true)
                .addField('❯ Métascore', `\`${data.metacritic ? data.metacritic.score : 'Aucun'}\``, true)
                .addField('❯ Recommendations', `\`${data.recommendations ? data.recommendations.total : 'Aucune'}\``, true)
                .addField('❯ Plateformes', `\`${platforms.join(', ') || 'Aucune'}\``, true)
                .addField('❯ Date de sortie', `\`${data.release_date ? data.release_date.date : 'Aucune'}\``, true)
                .addField('❯ Nombre de DLC', `\`${data.dlc ? data.dlc.length : 0} DLC\``, true)
                .addField('❯ Développeurs', `\`${data.developers ? data.developers.join(', ') || 'Aucun' : '???'}\``, true)
                .addField('❯ Éditeurs', `\`${data.publishers ? data.publishers.join(', ') || 'Aucun' : '???'}\``, true)
                .addField('❯ SiteWeb', `${data.website}`, true)
                .setFooter(config.footer)
                .setTimestamp()
            return message.channel.send({ embed });
        } catch (err) {
            return message.reply(`Oh non, une erreur s'est produite: \`${err.message}\`.`);
        }
    }
};