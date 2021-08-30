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
  fetch = require('node-fetch');
  Discord = require("discord.js");
const config = require('../../../config.json');

module.exports = class CovidCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'covid',
      description: 'Savoir les statistiques du Covid-19.',
      type: client.types.GENERAL
    });
  }

  async run (message, args, level, smessage, data) {
	let title = (":microbe: Statut Covid-19")
    const ddate = new Date();
    let month = await ddate.getMonth() + 1;
    let day = await ddate.getDate();
    let year = await ddate.getFullYear();
    const embed = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setTitle(title)
    let timestamp = (year + "-" + month + "-" + day);
    if (!args.length) {
      const website = await fetch("https://disease.sh/v3/covid-19/all");
      const json = await website.json()
      embed.addField("Décès d'aujourd'hui", json.todayDeaths, true) 
      .addField("Décès total", json.deaths, true) 
      .addField("Rétabli d'aujourd'hui", json.todayRecovered, true) 
      .addField("Rétabli", json.recovered, true) 
      .addField("État critique", json.critical, true) 
      .addField("Cas actifs", json.active, true)  
      .addField("Cas d'aujourd'hui", json.todayCases, true)  
      .addField("Décès par millions", json.deathsPerOneMillion, true)  
      .addField("Total des cas", json.cases, true)  
      .setImage("https://media0.giphy.com/media/MCAFTO4btHOaiNRO1k/source.gif")
      .setFooter('© 2020 DeltaBot Inc - https://delta-bot.com')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

      message.channel.send(embed)
    } else if (args[0] == "countries") {
	    title += "[countries]"
	    embed.setTitle(title)
	    if (args[1] == "all") {
		 title += "[all]"
		 embed.setTitle(title)
		if (!args[2]) {
		embed.setTitle(":microbe: Statut Covid-19") 
		}
	    }
    }
  }
}
