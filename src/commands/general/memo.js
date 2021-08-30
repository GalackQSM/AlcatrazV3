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
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
moment.locale('fr-fr')

module.exports = class LembreteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memo',
            type: client.types.GENERAL,
            description: 'Crée un mémo qui t\'avertis avec le temps souhaiter.',
            usage: 'memo <temps> <note>',
            examples: ['memo 10m cuire des pâtes'],
        })
    }


    run(message, args) {
        const msg = `${message.author}, Je n'ai pas pu identifier une heure valide. N'oubliez pas: après avoir entré la durée, entrez **s** pour les secondes, **m** pour les minutes, **h** pour les heures et **d** pour les jours.`

        const type = args[0]

        if (!type) return message.channel.send(`${message.author}, mets le temps que tu veux que je te rappelle.`)
        if (isNaN(type) && !type.lastIndexOf('s') && !type.lastIndexOf('m') && !type.lastIndexOf('h') && !type.lastIndexOf('d')) return message.channel.send(msg)

        const motivo = args.slice(1).join(' ')

        if (!motivo) return message.channel.send(`${message.author}, mettre une raison à ce mémo.`)

        let tempo

        if (type.endsWith('s')) {
            let s = type.replace('s', '')
            tempo = 1000 * s
        } else if (type.endsWith('m')) {
            let m = type.replace('m', '')
            tempo = 1000 * 60 * m
        } else if (type.endsWith('h')) {
            let h = type.replace('h', '')
            tempo = 1000 * 60 * 60 * h
        } else if (type.endsWith('d')) {
            let d = type.replace('d', '')
            tempo = 1000 * 86400 * d
        }


        let qtdTempo = humanizeDuration(tempo, { language: 'fr' })
        if (tempo >= 2147483647) return message.channel.send(`${message.author}, mettre un temps moins que \`${qtdTempo}\`. Le délai maximum est de 24 jours.`)
        if (qtdTempo === '0 secondes') return message.channel.send(msg)
        message.channel.send(`${message.author}, pas de soucis je te rappellerai d'ici \`${qtdTempo}\`!`)
        setTimeout(function() {
            message.channel.send(`:bell: | Hey, ${message.author}, voici votre mémo: \`${motivo}\``)
        }, tempo)
    }
}