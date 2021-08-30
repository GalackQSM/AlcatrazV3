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
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const { streamToArray } = require('../../../util/Util');
const { drawImageWithTint } = require('../../../util/Canvas');
const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            aliases: ['trigger'],
            type: client.types.AVATAR,
            memberName: 'triggered',
            description: 'Dessine l\'avatar d\'un utilisateur "Triggered".',
            hidden: false,
            throttling: {
                usages: 1,
                duration: 10,
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'user',
                    prompt: 'De quel utilisateur souhaitez-vous modifier l\'avatar ?',
                    type: 'user',
                    default: msg => msg.author,
                },
            ],
        });
    }

 async run(msg, args) {
      const member =  this.getMemberFromMention(msg, args[0]) || 
      msg.guild.members.cache.get(args[0]) || 
      msg.member;
        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 2048 });
        try {
            const base = await loadImage('https://cdn.discordapp.com/attachments/688763072864976906/702119398638354482/triggered.png');
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const encoder = new GIFEncoder(base.width, base.width);
            const canvas = createCanvas(base.width, base.width);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.width);
            const stream = encoder.createReadStream();
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(50);
            encoder.setQuality(200);
            for (let i = 0; i < 4; i++) {
                drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
                drawImageWithTint(ctx, base, coord1[i], coord2[i], 216, 290, 40, 50);
                encoder.addFrame(ctx);
            }
            encoder.finish();
            const buffer = await streamToArray(stream);
            return msg.channel.send({ files: [{ attachment: Buffer.concat(buffer), name: 'triggered.gif' }] });
        }
        catch (err) {
            return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
        }
    }
};