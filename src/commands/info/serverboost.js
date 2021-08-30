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

let features = {
        ANIMATED_ICON: "Icône animée",
        BANNER: "Bannière",
        COMMERCE: "Commerce",
        COMMUNITY: "Communauté",
        DISCOVERABLE: "Découvrable",
        FEATURABLE: "Fonctionnable",
        INVITE_SPLASH: "Invite splash",
        PUBLIC: "Public",
        NEWS: "News",
        PARTNERED: "En partenariat",
        VANITY_URL: "URL personnalisé",
        VERIFIED: "Vérifié",
        VIP_REGIONS: "VIP. Région",
        RELAY_ENABLED: "Relais activé",
        WELCOME_SCREEN_ENABLED: "Écran de bienvenue activé"
    };

    let level = { 
        0: "Aucun",
        1: "Niveau 1",
        2: "Niveau 2",
        3: "Niveau 3"
    };

module.exports = class ServerBoostCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverboost',
      usage: 'serverboost',
      description: 'Informations sur les boosts du serveur.',
      type: client.types.INFO
    });
  }
  run(message) {

    var server = message.guild 

    const embed = new MessageEmbed()
    .setColor(`#2f3136`)
    .setFooter(config.footer)
    .setAuthor("Statut de boost: " + server.name)
    .setThumbnail(!server.splashURL({ size: 2048, format: "jpg" })
        ? server.iconURL({ size: 2048, format: "jpg" })
        : server.splashURL({ size: 2048, format: "jpg" }))
    .addFields({
        name: "Niveau de boost", value: level[server.premiumTier],
        inline: false
    })
    .addFields({
        name: "Nombre de boost", value: server.premiumSubscriptionCount === 0 ? "aucun boost"
            : `${server.premiumSubscriptionCount} ${
            server.premiumSubscriptionCount === 1 ? "membre" : "membres"}`,
        inline: false
    })
    .addFields({
        name: "Avantages du serveur", value: `${server.features.length <= 0
            ? "aucun"
            : `${server.features.map(f => features[f]).join(", ")}`
            }`
        , inline: false
    })
    .setImage(server.bannerURL({ size: 2048, format: "jpg" }));
message.channel.send(embed);
  }
};