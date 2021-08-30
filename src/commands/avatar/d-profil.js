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
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'arial.ttf'), { family: 'arial blod' });

module.exports = class DProfilCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'd-profil',
            type: client.types.AVATAR,
            description: 'Avoir le profil discord avec beaucoup de badge.',
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
                },
                {
                    key: 'cause',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, { user, cause, args }) {
      const member =  this.getMemberFromMention(msg, args) || 
      msg.guild.members.cache.get(args) || 
      msg.member;
        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'd-profil.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(avatar, 20, 20, 92, 92);
            ctx.drawImage(base, 0, 0);
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.font = 'bold 11pt arial';
            ctx.fillStyle = 'white';
            ctx.rotate(0 * (Math.PI / 100));
            ctx.fillText(member.user.tag, 190, 40, 305);
            ctx.fillStyle = 'white';
            if (cause) ctx.fillText(cause, 438, 910, 500);

            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'd-profil.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};
