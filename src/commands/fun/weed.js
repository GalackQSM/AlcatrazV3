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
 discord = require("discord.js");
const config = require('../../../config.json');

module.exports = class WeedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'weed',
      usage: 'weed',
      description: 'Tuer une personne.',
      type: client.types.FUN,
    });
  }

    async run(message, args, level) {

        const member = message.member;


        const weed = [
            `https://www.royalqueenseeds.fr/modules/prestablog/themes/royalqueenseeds/up-img/621.jpg`,
            `https://static1.purebreak.com/articles/0/19/76/20/@/721267-cannabis-la-legalisation-de-la-weed-en-opengraph_1200-2.jpeg`,
            `https://www.alchimiaweb.com/images/xl/cookies-and-weed_8736_1_.jpg`,
            `https://www.newsweed.fr/wp-content/uploads/2015/11/weed.jpg`,
            `https://lepetitjournal.com/sites/default/files/styles/main_article/public/2018-12/weed.jpg`,
            `https://france3-regions.francetvinfo.fr/image/Ycpxwsb9JFvXWMcfbqVAbOP5Q7Y/600x400/regions/2020/06/09/5edf8721bde5d_cannabis_17-4290056.jpg`,
            `https://www.quebecscience.qc.ca/wp-content/uploads/2019/07/cannabis.jpg`,
            `https://www.agrimaroc.ma/wp-content/uploads/cannabis-maroc.jpg`,
            `https://www.dinafem.org/uploads/0003122-big-kush.jpg`,
            `https://www.royalqueenseeds.fr/149-2410-thickbox/og-kush-.jpg`,
            `https://www.zamnesia.fr/5322-17428/super-og-kush-feminisee.jpg`,
            `https://www.amsterdamgenetics.com/wp-content/uploads/2019/07/purple_weed_blog-07-780x350.jpg`,
            `https://wheresweed.com/blog_images/main/purple-cannabis-why-you-should-care-about-color.jpg`,
            `https://i.pinimg.com/originals/ff/83/d6/ff83d682f26c62d28e64335ae4a23dc2.jpg`,
            `https://pevgrow.com/23761-large_default/7556-purple-kush-marijuana-grainers.jpg`,
            `https://wheresweed.com/blog_images/500x500/purple-cannabis-why-you-should-care-about-color.jpg`
        ]

         const embed = new MessageEmbed()
        .setDescription(`**${member.user.username}** Voici une photo de canabis :herb:`, message.author.avatarURL)
        .setImage(weed[Math.floor(Math.random() * weed.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")

        message.channel.send(embed)

    }
};