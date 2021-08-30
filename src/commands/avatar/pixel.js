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

module.exports = class PixelizeCommand extends Command {
	constructor(client) {
		super(client, {
            name: 'pixel',
            type: client.types.AVATAR,
            description: 'Dessine une image ou l\'avatar d\'un utilisateur pixélisé.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					type: 'image',
					default: msg => member.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image, args}) {
      const member =  this.getMemberFromMention(msg, args) || 
      msg.guild.members.cache.get(args) || 
      msg.member;
        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 512 });
		try {
            const { body } = await request.get(avatarURL);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			const width = canvas.width * 0.15;
			const height = canvas.height * 0.15;
			ctx.drawImage(data, 0, 0, width, height);
			ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('L\'image résultante était supérieure à 8 Mo.');
			return msg.channel.send({ files: [{ attachment, name: 'pixelize.png' }] });
		} catch (err) {
			return msg.channel.send(`Oh non, une erreur s'est produite: \`${err.message}\`. Réessayez plus tard!`);
		}
	}
};