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

const querystring = require('querystring');
const Command = require('../Alcatraz.js');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class QrCodeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'qr-code',
            aliases: ['qrcode'],
            usage: 'qr-code <url/texte>',
            description: 'Crée un code QR-Code.',
            type: client.types.GENERAL,
            examples: ['qr-code https://alcatraz-bot.com', 'qr-code Alcatraz le meilleur bot open-source']
              })
    }

    run(message, args) {
        const search = querystring.stringify({ chl: args.join(' ') })
        const qr = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&${search}`

        if (!args.length) return message.channel.send(`${message.author}, mettre un texte ou une URL pour crée le QR Code.`)

        const embed = new MessageEmbed()
            .setTitle(""+message.author.username+" voici votre QR-Code")
            .setDescription("[Vous pouvez télécharger le code ici]("+qr+")")
            .setImage(qr)
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

        message.channel.send(embed)
    }
}
