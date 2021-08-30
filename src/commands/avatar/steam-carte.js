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
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SteamCarteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'steam-carte',
            aliases: ['valve-carte'],
            type: client.types.AVATAR,
            description: 'Dessine l\'avatar d\'un utilisateur sur une carte à collectionner Steam.',
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
      const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-carte.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#feb2c1';
            ctx.fillRect(0, 0, base.width, base.height);
            ctx.drawImage(avatar, 12, 19, 205, 205);
            ctx.drawImage(base, 0, 0);
            ctx.font = '14px Noto';
            ctx.fillStyle = 'black';
            ctx.fillText(member.user.username, 16, 25);
            ctx.fillStyle = 'white';
            ctx.fillText(member.user.username, 15, 24);
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'steam-carte.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};
