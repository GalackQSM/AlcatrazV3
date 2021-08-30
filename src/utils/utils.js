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

const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const { stripIndent } = require('common-tags');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeElement(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function trimArray(arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`et **${len}** autres...`);
  }
  return arr;
}
function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
  let string = arr.join(joinChar);
  const diff = maxLen - 15; 
  if (string.length > maxLen) {
    string = string.slice(0, string.length - (string.length - diff)); 
    string = string.slice(0, string.lastIndexOf(joinChar));
    string = string + `\nEt **${arr.length - string.split('\n').length}** autres...`;
  }
  return string;
}

function getRange(arr, current, interval) {
  const max = (arr.length > current + interval) ? current + interval : arr.length;
  current = current + 1;
  const range = (arr.length == 1 || arr.length == current || interval == 1) ? `[${current}]` : `[${current} - ${max}]`;
  return range;
}

function getOrdinalNumeral(number) {
  number = number.toString();
  if (number === '11' || number === '12' || number === '13') return number + 'th';
  if (number.endsWith(1)) return number + 'st';
  else if (number.endsWith(2)) return number + 'nd';
  else if (number.endsWith(3)) return number + 'rd';
  else return number + 'th';
}

async function getCaseNumber(client, guild, modLog) {
  
  const message = (await modLog.messages.fetch({ limit: 100 })).filter(m => m.member === guild.me &&
    m.embeds[0] &&
    m.embeds[0].type == 'rich' &&
    m.embeds[0].footer &&
    m.embeds[0].footer.text &&
    m.embeds[0].footer.text.startsWith('Case')
  ).first();
  
  if (message) {
    const footer = message.embeds[0].footer.text;
    const num = parseInt(footer.split('#').pop());
    if (!isNaN(num)) return num + 1;
  }

  return 1;
}

function getStatus(...args) {
  for (const arg of args) {
    if (!arg) return 'non actif';
  }
  return 'actif';
}

function replaceKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?size/g, '`?size`');
}

function replaceCrownKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?role/g, '`?role`')
    .replace(/\?points/g, '`?points`');
}

async function transferCrown(client, guild, crownRoleId) {

  const crownRole = guild.roles.cache.get(crownRoleId);
  
  if (!crownRole) {
    return client.sendSystemErrorMessage(guild, 'mise à jour de la couronne', stripIndent`
      Impossible de transférer le rôle de couronne, il a peut-être été modifié ou supprimé
    `);
  }
  
  const leaderboard = client.db.users.selectLeaderboard.all(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  const points = client.db.users.selectPoints.pluck().get(winner.id, guild.id);
  let quit = false;

  await Promise.all(guild.members.cache.map(async member => { // Good alternative to handling async forEach
    if (member.roles.cache.has(crownRole.id)) {
      try {
        await member.roles.remove(crownRole);
      } catch (err) {

        quit = true;
        
        return client.sendSystemErrorMessage(guild, 'mise à jour de la couronne', stripIndent`
          Impossible de transférer le rôle de couronne, veuillez vérifier la hiérarchie des rôles et vous assurer que j'ai l'autorisation Gérer les rôles
        `, err.message);
      } 
    }
  }));

  if (quit) return;

  try {
    await winner.roles.add(crownRole);
    client.db.users.wipeAllPoints.run(guild.id);
  } catch (err) {
    return client.sendSystemErrorMessage(guild, 'mise à jour de la couronne', stripIndent`
      Impossible de transférer le rôle de couronne, veuillez vérifier la hiérarchie des rôles et vous assurer que j'ai l'autorisation Gérer les rôles
    `, err.message);
  }
  
  let { crown_channel_id: crownChannelId, crown_message: crownMessage } = 
    client.db.settings.selectCrown.get(guild.id);
  const crownChannel = guild.channels.cache.get(crownChannelId);

  if (
    crownChannel &&
    crownChannel.viewable &&
    crownChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    crownMessage
  ) {
    crownMessage = crownMessage
      .replace(/`?\?member`?/g, winner) 
      .replace(/`?\?username`?/g, winner.user.username) 
      .replace(/`?\?tag`?/g, winner.user.tag) 
      .replace(/`?\?role`?/g, crownRole) 
      .replace(/`?\?points`?/g, points); 
    crownChannel.send(new MessageEmbed().setDescription(crownMessage).setColor(guild.me.displayHexColor));
  }

  client.logger.info(`${guild.name}: Rôle de couronne attribué à ${winner.user.tag} et réinitialiser les points du serveur`);
}


function scheduleCrown(client, guild) {

  const { crown_role_id: crownRoleId, crown_schedule: cron } = client.db.settings.selectCrown.get(guild.id);

  if (crownRoleId && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      client.utils.transferCrown(client, guild, crownRoleId);
    });
    client.logger.info(`${guild.name}: Tâche planifiée avec succès`);
  }
}

module.exports = {
  capitalize,
  removeElement,
  trimArray,
  trimStringFromArray,
  getRange,
  getOrdinalNumeral,
  getCaseNumber,
  getStatus,
  replaceKeywords,
  replaceCrownKeywords,
  transferCrown,
  scheduleCrown
};