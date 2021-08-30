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
const querystring = require('querystring');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class QrCodeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'snapcode',
            usage: 'snapcode <pseudo>',
            description: 'Recherche un SnapCode.',
            type: client.types.GENERAL,
            examples: ['snapcode Galack-LKI']
              })
    }

    run(message, args) {
      const pseudo = args[0]

        const snapcode = `https://feelinsonice.appspot.com/web/deeplink/snapcode?username=${pseudo}&size=320&type=PNG`

        if (!args.length) return message.channel.send(`${message.author}, mettre un pseudo Snap pour faire la recherche.`)

        const embed = new MessageEmbed()
            .setTitle(""+message.author.username+" voici le Snapcode")
            .setDescription("Voici votre recherche du snapcode: `"+pseudo+"`")
            .setImage(snapcode)
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

        message.channel.send(embed)
    }
}
