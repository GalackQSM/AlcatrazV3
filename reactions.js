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

module.exports = class Reactions {
constructor(channel, member, embed, reactions, timeout = 120000) {
this.channel = channel;
this.memberId = member.id;
this.embed = embed;
this.reactions = reactions;
this.emojis = Object.keys(this.reactions);
this.timeout = timeout;
this.channel.send(this.embed).then(message => {
this.message = message;
this.addReactions();
this.createCollector();
});
}
async addReactions() {
    for (const emoji of this.emojis) {
      await this.message.react(emoji);
    }
  }
createCollector() {
    
    const collector = this.message.createReactionCollector((reaction, user) => {
      return (this.emojis.includes(reaction.emoji.name) || this.emojis.includes(reaction.emoji.id)) &&
        user.id == this.memberId;
    }, { time: this.timeout });

    collector.on('collect', async reaction => {
      let newPage =  this.reactions[reaction.emoji.name] || this.reactions[reaction.emoji.id];
      if (typeof newPage === 'function') newPage = newPage();
      await this.message.edit(newPage);
      await reaction.users.remove(this.memberId);
    }); 

    collector.on('end', () => {
      this.message.reactions.removeAll();
    });
  }
};
