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
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const config = require('../../../config.json');

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'slots',
        usage: 'slots 300',
        description: 'Tentez votre chance à une machine à sous. Attention, je suis très doué pour voler votre argent.',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user = message.author;
        let moneydb = await db.fetch(`money_${user.id}`)
        let money = parseInt(args[0]);
        let win = false;

    
        if (!money) return message.reply("Vous devez parier quelque chose.");
        if (money > moneydb) return message.reply(`Vous n'avez que ${money}, n'essayez pas de me mentir `);
    
        let number = []
        for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }
    
        if (number[0] == number[1] && number[1] == number[2])  { 
            money *= 9
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
            money *= 3
            win = true;
        }
        if (win) {
            let slotsEmbed1 = new MessageEmbed()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nVous avez gagné ${money} pièces`)
        .setColor("#2f3136")
        .setFooter(config.footer)
            message.channel.send(slotsEmbed1)
            db.add(`money_${user.id}`, money)
        } else {
            let slotsEmbed = new MessageEmbed()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nVous avez perdu ${money} pièces`)
        .setColor("#2f3136")
        .setFooter(config.footer)
            message.channel.send(slotsEmbed)
            db.subtract(`money_${user.id}`, money)
        }
    
    }
    }