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
const { MessageEmbed } = require('discord.js')
const config = require('../../../config.json');


module.exports = class TexteInfoCommand extends Command {
    constructor(client) {
        super(client, {
        name: 'texteinfo',
        usage: 'texteinfo texte',
        description: 'Affiche les informations d\'un texte: affiche le nombre de mots, de caractères etc..',
        type: client.types.INFO,
        examples: ['texteinfo Coucou sava']

    });
  }

    run(message, args) {
        const msg = args.join(' ')

        if (!msg) return message.channel.send(`${message.author}, mettez un texte pour connaître des informations à ce sujet.`)

        const characters = msg.length
        const words = msg.split(' ').length

        let descriptionMsg = args.join(' ')

        let vowel = 0
        let spaces = 0

        let removeTxt = ''
        let addCharactersInSpace = false
        let addCharactersInVowel = false


        for (let i = 0; i <= characters - 1; i++) {
            msg.toLowerCase()

            const getV = msg.charAt(i)

            if (['a', 'e', 'i', 'o', 'u'].includes(getV)) {
                vowel++
            }
        }

        for (let s = 0; s <= characters - 1; s++) {
            const getSpace = msg.charAt(s)

            if ([' '].includes(getSpace)) {
                spaces++
            }
        }


        if (characters > 720) descriptionMsg = `${descriptionMsg.slice(0, 700)}...`

        if (vowel !== 1) addCharactersInVowel = true
        if (spaces !== 1) addCharactersInSpace = true
        if (spaces >= 1) removeTxt = `(${characters - spaces} suppression des espaces)`

        let description = `${descriptionMsg} \n\n \`${words}\` mot(s) \n\n \`${vowel}\` ${addCharactersInVowel ? 'voyelles' : 'voyelle'} \n\n \`${spaces}\` ${addCharactersInSpace ? 'espaces' : 'espace'} \n\n \`${characters}\` caractère(s) ${removeTxt}`

        const embed = new MessageEmbed()
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")
        .setDescription(description)
        .setTitle("Voici le résultat")

        message.channel.send(embed)
    }
}
