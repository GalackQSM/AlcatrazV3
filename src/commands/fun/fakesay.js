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

module.exports = class FakeSayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fakesay',
            aliases: ['fakemsg'],
            description: 'Parle a la place d\'un membre',
            usage: 'fakesay <@membre> <message>',
            type: client.types.FUN,
            examples: ['fakesay GalackQSM#0895 salut']
        })
    }

    run(message, args) {
        if (!args.length) return message.channel.send(`${message.author}, mentionner quelqu'un et poster un message après la mention. Exemple: \`${this.client.commandPrefix}fakesay\` ` + '<' + '@' + this.client.user.id + '>' + ` \`<message>\``) || message.channel.send(`:x: | ${message.author}, mentionner quelqu'un et poster un message après la mention. Exemple: \`${this.client.commandPrefix}fakesay\` ` + '<' + '@!' + this.client.user.id + '>' + `\`<message>\``)

        const member = message.mentions.users.first() || this.client.users.cache.get(args[0])
        if (!member) return message.channel.send(`${message.author}, Je n'ai pas trouvé l'utilisateur \`${member ? undefined : args[0]}\`. Assurez-vous de mentionner quelqu'un.`)

        let mensagem = args.slice(1).join(' ')
        if (!mensagem) return message.channel.send(`${message.author}, placer un message après avoir memntionnez un membre.`)

        let avatar = member.displayAvatarURL({ dynamic: true });
        message.channel.createWebhook(member.username, { avatar: avatar }).then(msgWebhook => {
            msgWebhook.send(mensagem)

            message.delete()

            setTimeout(function() {
                msgWebhook.delete()
            }, 1000 * 15)
        })
    }
}
