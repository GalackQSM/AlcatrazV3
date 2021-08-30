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
const request = require('node-superfetch')
const { MessageEmbed } = require('discord.js')
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class IsitupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scanweb',
            description: 'Connaître l\'état d\'un site Web.',
            usage: 'scanweb [site]',
            examples: ['scanweb discord.com', 'scanweb google.com'],
            type: client.types.INFO,

        })
    }

    async run(message, args) {
        try {
            const site = args[0]

            const { body } = await request
                .get(`https://isitup.org/${site}.json`)

            if (body.status_code === 3) return this.sendErrorMessage(message, 0, 'Je n\'ai trouvé aucun site Web avec le nom.');

            if (!body.response_code) {
                const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setTitle(''+emojis.error+' Ce site est hors ligne.')
                    .setDescription(`Malheureusement, le site \`${site}\` est actuellement hors ligne.`)
                    .setFooter(config.footer)
                    .setTimestamp()

                message.channel.send(embed)
            } else {
                const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setTitle(''+emojis.success+' Le site Web '+site+' est en ligne.')
                    .addField('Domaine', `\`${body.domain}\``, true)
                    .addField('Port', `\`${body.port}\``, true)
                    .addField('Ip', `\`${body.response_ip}\``, true)
                    .addField('Code d\'état', `\`${body.status_code}\``, true)
                    .addField('Code de réponse', `\`${body.response_code}\``, true)
                    .addField('Temps de réponse', `\`${body.response_time}\`ms`, true)
                    .setFooter(config.footer)
                    .setTimestamp()

                message.channel.send(embed)
            }
        } catch (err) {
            message.channel.send(`${message.author}, une erreur s'est produite lors de la tentative de vous donner le statut de ce site.`)
            console.log(`[scanweb] - ${err}`)
        }
    }
}
