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
const request = require('node-superfetch')
const moment = require('moment')
moment.locale('fr-fr')
const config = require('../../../config.json');

module.exports = class GitHubCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'githubrepo',
            type: client.types.GENERAL,
            description: 'Affiche les informations d\'un référentiel sur github.',
            usage: 'githubrepo <auteur> <nom>',
            examples: ['githubrepo GalackQSM Alcatraz', 'githubrepo GalackQSM | Alcatraz'],
        })
    }

    async run(message, args) {
      const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

        try {
            let author;
            let repo;

            if (!args.length) return this.sendErrorMessage(message, 0, 'Mettre l\'auteur du référentiel et son nom. Vous pouvez également les séparer en plaçant un | entre eux, si vous préférez.')

            if (!args.join(' ').includes('|')) {
                author = args[0]
                repo = args[1]
            } else {
                const sep = args.join(' ').split(' | ')

                author = sep[0]
                repo = sep[1]
            }

            if (!author) return this.sendErrorMessage(message, 0, 'Placer l\'auteur du référentiel.')

            if (!repo) return this.sendErrorMessage(message, 0, 'Mettre le nom du référentiel.')

            const { body } = await request
                .get(`https://api.github.com/repos/${author}/${repo}`)

            const embed = new MessageEmbed()
                .setThumbnail(body.owner.avatar_url)
                .setTitle(body.full_name)
                .setURL(body.html_url)
                .setDescription(body.description)
                .addField('Language', '`'+body.language+'`')
                .addField('Étoiles (stars)', '`'+body.stargazers_count+' Étoiles`')
                .addField('Observateurs', '`'+body.subscribers_count+' Observateurs`')
                .addField('Forks', '`'+body.forks_count+' forks`')
                .addField('Questions ouvertes', body.open_issues_count ? 0 : '`Aucune question`', true)
                .addField('Branch standard', '`'+body.default_branch+'`')
                .addField('Créé le', '`'+moment(body.created_at).format('L') + `\n\` (${moment(body.created_at).startOf('day').fromNow()})`)
                .addField('Dernière mise à jour', '`'+moment(body.updated_at).format('L') + `\n\` (${moment(body.updated_at).startOf('day').fromNow()})`)
                .setFooter(config.footer)
                .setTimestamp()
                .setColor("#2f3136");

            message.channel.send(embed)
        } catch (err) {
            if (err.status === 404) return message.channel.send(`${message.author}, Je n'ai trouvé aucun référentiel portant ce nom.`)

            console.log(`[github] - ${err}`)
        }
    }
}