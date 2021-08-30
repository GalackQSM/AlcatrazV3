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
const fetch = require('node-fetch')
const config = require('../../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class InstaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'insta',
      usage: 'insta [nom]',
      description: 'Connaître des informations sur l\'instagram de quelqu\'un',
      type: client.types.INFO
    });
  }
  async run(message, args) {
    const name = args.join(" ");

    if (!name) {
        return message.reply("Peut-être qu'il est utile de rechercher quelqu'un...!")
            .then(m => m.delete(5000));
    }

    const url = `https://instagram.com/${name}/?__a=1`;
    
    let res; 

    try {
        res = await fetch(url).then(url => url.json());
    } catch (e) {
        return message.reply("Je n'ai pas trouvé ce compte... :(");
    }

    const account = res.graphql.user;

      const embed = new MessageEmbed() 
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")
        .setTitle(account.full_name)
        .setURL(`https://instagram.com/${name}`)
        .setThumbnail(account.profile_pic_url_hd)
        .setDescription("Informations sur le profil")
        .addField("**Nom**", `${account.username}`)
        .addField("**Pseudo**", `${account.full_name}`)
        .addField("**Biographie**", `${account.biography.length == 0 ? "aucune" : account.biography}`)
        .addField("**Posts**", `${account.edge_owner_to_timeline_media.count}`)
        .addField("**Abonnés**", `${account.edge_followed_by.count}`)
        .addField("**Abonnements**", `${account.edge_follow.count}`)
        .addField("**Compte privé**", `${account.is_private ? "Oui 🔐" : "Non 🔓"}`);

    message.channel.send(embed);
}
}