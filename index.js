const { Telegraf, Markup} = require("telegraf");
require('dotenv').config();
const { v4: uuidV4 } = require('uuid');
let factGenerator = require('./factGenerator');
const comms = require("./commands");


const token = process.env.BOT_TOKEN;

// Создать бота с полученным ключом
const bot = new Telegraf(token);
bot.use(Telegraf.log());

// // Задать команды боту
// bot.setMyCommands(comms);

const getHelp = () => {
  let helpText = `*Доступные команды:*\n`;
  helpText += comms.map(
    (command) => `*/${command.command}* ${command.description}`
  ).join(`\n`);
  return helpText;
};


bot.start(async (ctx) =>
{
  return await ctx.reply(`Приветствую, ${ctx.from.first_name ? ctx.from.first_name : "хороший человек"}!`, Markup
    .keyboard([
      ['☸ Выбрать фон', '🌚 Цитатка'], // Row1 with 2 buttons
      ['📞 Контакты', '🔍 Помощь'], // Row2 with 2 buttons
    ])
    .oneTime()
    .resize()
  )
}
);

// Обработчик команды /help
bot.help((ctx) => ctx.replyWithMarkdown(getHelp()));



bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))