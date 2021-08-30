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
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'girly.ttf'), { family: 'Coffin Stone' });
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class DediBoobsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tatia',
            aliases: ['tatia'],
            type: client.types.FUN,
            description: 'Avoir une dédi de Tatia.',
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
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tatia.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            greyscale(ctx, 154, 399, 500, 500);
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.font = '50px girly';
            ctx.fillStyle = 'black';
	    	ctx.rotate(17 * (Math.PI / 100));

            ctx.fillText(member.user.username, 400, 100, 160);
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'tatia.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};
