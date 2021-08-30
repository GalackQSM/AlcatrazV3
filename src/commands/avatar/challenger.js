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
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { silhouette } = require('../../../util/Canvas');

module.exports = class ChallengerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'challenger',
            aliases: ['challenge'],
            type: client.types.AVATAR,
            description: 'Dessine l\'avatar d\'un utilisateur sur l\'écran "Challenger approche".',
            throttling: {
                usages: 1,
                duration: 10,
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'user',
                    type: 'user',
                    default: msg => msg.author
                },
                {
                    key: 'silhouetted',
                    type: 'boolean',
                    default: false
                }
            ]
        });
    }

    async run(msg, { user, silhouetted, args }) {
      const member =  this.getMemberFromMention(msg, args) || 
      msg.guild.members.cache.get(args) || 
      msg.member;
        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'challenger.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(silhouetted ? this.silhouetteImage(avatar) : avatar, 484, 98, 256, 256);
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }

    silhouetteImage(image) {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        silhouette(ctx, 0, 0, image.width, image.height);
        return canvas;
    }
};
