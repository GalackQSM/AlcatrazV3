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
                                                                       
const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');
const { fail } = require('./utils/emojis.json');

class Client extends Discord.Client {
 constructor(config, options = {}) {  
    super(options);
    this.logger = require('./utils/logger.js');
    this.db = require('./utils/db.js');
    this.types = {
      INFO: 'Informations',
      FUN: 'Fun',
      COULEUR: 'Couleurs',
      POINTS: 'Points',
      GENERAL: 'Général',
      NFSW: 'NFSW',
      JEUX: 'Jeux',
      ECONOMY: 'Economie',
      LEVEL: 'Niveau',
      AVATAR: 'Avatar',
      BACKUP: 'Backup',
      MOD: 'Modération',
      ANTIRAID: 'Anti-Raid',
      ADMIN: 'Administration',
      OWNER: 'Propriétaire'
    };
    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.topics = [];
    this.token = config.token;
    this.apiKeys = config.apiKeys;
    this.ownerId = config.ownerId;
    this.bugReportChannelId = config.bugReportChannelId;
    this.feedbackChannelId = config.feedbackChannelId;
    this.serverLogId = config.serverLogId;
    this.utils = require('./utils/utils.js');
    this.logger.info('Initialisation...');

  }

  loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('Aucun événement trouvé');
      this.logger.info(`${files.length} événement(s) trouvé(s)...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        const event = require(resolve(__basedir, join(path, f)));
        super.on(eventName, event.bind(null, this));
        delete require.cache[require.resolve(resolve(__basedir, join(path, f)))]; 
        this.logger.info(`Chargement de l'évenement: ${eventName}`);
      });
    });
    return this;
  }

  loadCommands(path) {
    this.logger.info('Chargement des commandes...');
    let table = new AsciiTable('Commandes');
    table.setHeading('Fichiers', 'Aliases', 'Catégories', 'Statut');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); 
        if (command.name && !command.disabled) {
          this.commands.set(command.name, command);
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, command.type, 'pass');
        } else {
          this.logger.warn(`${f} échec du chargement`);
          table.addRow(f, '', '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  isOwner(user) {
    if (user.id === this.ownerId) return true;
    else return false;
  }

  sendSystemErrorMessage(guild, error, errorMessage) {

    const systemChannelId = this.db.settings.selectSystemChannelId.pluck().get(guild.id);
    const systemChannel = guild.channels.cache.get(systemChannelId);

    if ( 
      !systemChannel || 
      !systemChannel.viewable || 
      !systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) return;

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${this.user.tag}`, this.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Erreur système: \`${error}\``)
      .setDescription(`\`\`\`diff\n- Défaillance du système\n+ ${errorMessage}\`\`\``)
      .setTimestamp()
      .setColor(guild.me.displayHexColor);
    systemChannel.send(embed);
  }
}

module.exports = Client;