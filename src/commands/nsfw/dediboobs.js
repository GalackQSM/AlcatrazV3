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
            name: 'dediboobs',
            aliases: ['dediboobs'],
            type: client.types.NSFW,
            description: 'Avoir une dédiboobs.',
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

         const embed = new MessageEmbed().setColor(0x00FFFF);
        if (!msg.channel.nsfw) {
            embed.setTitle(''+emojis.nsfw+' NSFW')
            .setDescription("Impossible d'afficher le contenu NSFW dans un salon SFW.")
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

            return msg.channel.send({embed});
        }

      const member =  this.getMemberFromMention(msg, args) || 
      msg.guild.members.cache.get(args) || 
      msg.member;
        try {
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'dedi.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            greyscale(ctx, 154, 399, 500, 500);
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.font = '60px girly';
            ctx.fillStyle = 'black';
	    	ctx.rotate(17 * (Math.PI / 100));

            ctx.fillText(member.user.username, 290, -15, 190);
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'dedi.png' }] });
        } catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};
