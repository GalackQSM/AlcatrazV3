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
const math = require('mathjs')
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json');

module.exports = class CalculatriceCommand extends Command {
    constructor(client) {
        super(client, {
        name: 'calculatrice',
        aliases: ['calcule'],
        usage: 'calculatrice <opération>',
        description: 'Utilise la calculatrice d\'Alcatraz.',
        type: client.types.GENERAL,
        examples: ['calculatrice 100+150']
    })
  }

    run(message, args) {
        if (!args.length) return message.channel.send(`${message.author}, mettre une formule mathématique à calculer.`)

        let calcular = args.join(' ')

        try {
            const embed = new MessageEmbed()
                .setFooter(config.footer)
                .setTimestamp()
                .setTitle(`Résultat de l'opération: \`${calcular}\`:`)
                .setDescription(`Réponse: **${math.evaluate(calcular)}**`)
                .setColor("#2f3136");

            message.channel.send(embed)
        } catch (err) {
            const split = err.message.split(' ')
            const length = split.length
            const errMsg = err.message

            if (errMsg.includes('Côté gauche de l\'opérateur d\'affectation non valide') || errMsg.includes('Partie inattendue') || errMsg.includes('Fin d\'expression inattendue')) return message.channel.send(`${message.author}, Je n'ai pas pu calculer votre expression. Vérifiez que ses opérateurs sont corrects et réessayez.`)

            message.channel.send(`${message.author}, le symbole \`${split[length - 1]}\` ce n'est pas un symbole valide.`)
            console.log('[Calc]: ' + err)
        }
    }
}
