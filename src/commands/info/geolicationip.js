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
const superagent = require('superagent')
const translate = require('@vitalets/google-translate-api');
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json');

module.exports = class GeolicationIpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'geolicationip',
            aliases: ['ipinformation', 'geolication-ip'],
            description: 'Consulter la géolocalisation d\'une ip donnée.',
            usage: 'geolicationip [ip]',
            type: client.types.INFO,
            examples: ['geolicationip 162.159.135.232']
        })
    }

    async run(message, args) {
        try {
            const ip = args[0]
            const member = message.member;
  
            const { body } = await superagent
                .get(`http://ipinfo.io/${ip}?token=f1963241941bec`)

            translate(`${body.continent} | ${body.name} (${body.gec})`, { from: 'fr', to: 'fr' }).then(fr => {

                const embed = new MessageEmbed()
                    .setFooter(config.footer)
                    .setTimestamp()
                    .setColor("#2f3136")
                    .setThumbnail('https://media.discordapp.net/attachments/550312377305006112/756262513246732409/emoji.png')
                    .setTitle(""+member.user.username+" voici votre recherche pour l'ip `"+ip+"`")
                    .addField('Hostname', `\`${body.hostname}\``|| '`Pas de réponse`')
                    .addField('Ville', `\`${body.city}\`` || '`Pas de réponse`')
                    .addField('Région', `\`${body.region}\`` || '`Pas de réponse`')
                    .addField('Pays', `\`${body.country}\`` || '`Pas de réponse`')
                    .addField('Code postal', `\`${body.postal}\`` || '`Pas de réponse`')
                    .addField('Opérateur', `\`${body.org}\`` || '`Pas de réponse`')
                    .addField('Fuseau Horaire', `\`${body.timezone}\`` || '`Pas de réponse`')

                message.channel.send(embed)

            })

        } catch (err) {
            if (err.status === 520 || err.status == 500 || err.status == 404) return message.channel.send(`${message.author}, pour une raison quelconque, je n'ai pas pu accéder aux données sur cette ip.`)

            console.error(err)
        }
    }
}
