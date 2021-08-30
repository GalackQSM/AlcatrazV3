const Command = require('../Alcatraz.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RoletaRussaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roulette-russe',
            aliases: ['rouletterusse'],
            description: 'Jouer à la roulette russe',
            usage: 'roulette-russe <nombre>',
            type: client.types.JEUX,
            examples: ['roulette-russe 5']
        })
    }

    run(message, args) {
        let options = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
        ]

        let bot = options[Math.floor(Math.random() * options.length)]

        let botEscolha = bot

        if (!args.length) {
            message.channel.send(`:scales: | ${message.author}, veuillez entrer un nombre que vous voulez entre 1 et 10.`)
        }
        // ---
        else if (args[0] > 10 || args[0] < 1 || !['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(args[0])) {
            message.channel.send(` ${message.author}, le nombre \`${args[0]}\` Ce n'est pas valable! J'accepte uniquement les nombres de 1 à 10.`)
        }
        // ---
        else if (botEscolha == args[0]) {
            message.channel.send(`${message.author}, comme je suis très indécis, je n'ai pas pu choisir. Essayez de taper à nouveau la commande, et qui sait? :cry:`)
        }
        // ---
        else if (botEscolha !== args[0]) {
            message.channel.send(`Tu as choisis le numéro \`${args[0]}\`, et moi je choisis le numéro \`${botEscolha}\`.`)


            let roulette = [
                '1',
                '2',
                '5',
                '4',
                '5',
                '6',
            ]

            let resultat = roulette[Math.floor(Math.random() * roulette.length)]
                // 🔄
            message.channel.send('Roulement...').then(rs => {


                if (args[0] == resultat) {
                    rs.edit(`:skull: | Le nombre et **${resultat}**, ${message.author}! Puts, je me souviens que tu as choisi \`${resultat}\`... Je pense, malheureusement pour vous, mais heureusement pour moi, quelqu'un mourra ... A bientôt dans la prochaine vie ... :cry:`)
                } else if (args[0] !== resultat || botEscolha !== resultat) {
                    rs.edit(`:skull: | Le nombre et **${resultat}**, ${message.author}!...  Heureusement pour nous deux, personne n'est mort!`)
                } else if (botEscolha == resultat) {
                    rs.edit(`:skull: | Le nombre et **${resultat}!**, ${message.author}! Ouf ... Attendez ... Non ... Allons-y doucement, non? C'est juste un jeu--`)
                }
            })

        }
    }
}
