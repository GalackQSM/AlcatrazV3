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
const { Message } = require('discord.js');

module.exports  = class createInvite extends Command {
  constructor(client) {
    super(client, {
        name: "createinvite",
        aliases: ['crinv', 'createinv'],
        usage: 'createinvite [ID Serveur]',
        description: "Crée une invitation sur un serveur et la supprime lorsque vous rejoignez.",
        type: client.types.OWNER,
        ownerOnly: true,
    });
  }
async run(message, args) {
    function send(invite, generated){
        const string = `Voici le lien du serveur ;) (${generated ? 'nouveau' : 'vieux'} invite)`;
        return message.author.send(`${string}\n${invite}`)
        .catch(() => message.channel.send(`${string}\n${invite}`));
    }
    const guildID = args[0];
    if(!guildID) return this.sendErrorMessage(message, 0, 'Fournir l\'ID du serveur');
    const guild = this.client.guilds.cache.get(guildID);
    if(!guild) return this.sendErrorMessage(message, 0, `${guildID} n'est pas un serveur valide`);
    if(!guild.me.permissions.has("CREATE_INSTANT_INVITE")) return this.sendErrorMessage(message, 0, 'Alcatraz n\'a pas les autorisations sur ce serveur');
    const invites = guild.fetchInvites().catch(()=>{});
    if(invites && invites.size) return send(invites.random(), false);
    const channel = guild.channels.cache.filter(c => c.type == "text").random();
    const invite = await channel.createInvite({maxUses: 1, maxAge: 150, unique: true});
    return send(invite, true);
  }
};