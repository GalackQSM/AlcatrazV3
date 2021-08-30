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
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../../util/Canvas');

module.exports = class CoeurCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coeur',
            type: client.types.AVATAR,
            description: 'Dessine l\'avatar d\'un utilisateur avec des coeurs.',
            throttling: {
                usages: 1,
                duration: 10
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'user',
                    type: 'user',
                    default: msg => msg.author
                }
            ]
        });
    }

    async run(msg, { user, args }) {
        const member =  this.getMemberFromMention(msg, args) || 
        msg.guild.members.cache.get(args) || 
        msg.member;
        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 512 });
        ({ format: 'png', size: 512 });
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'coeur.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(avatar.width, avatar.height);
            const ctx = canvas.getContext('2d');
            drawImageWithTint(ctx, avatar, 'deeppink', 0, 0, avatar.width, avatar.height);
            ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'coeur.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};
