const { Telegraf, Markup } = require("telegraf");
require('dotenv').config();
const { v4: uuidV4 } = require('uuid');
const factGenerator = require('./factGenerator');
const comms = require("./commands");
const { themes } = require('./themes');
var _ = require("lodash");
const chunk = require('lodash.chunk');


const token = process.env.BOT_TOKEN;

// Создать бота с полученным ключом
const bot = new Telegraf(token);
bot.use(Telegraf.log());

// // Задать команды боту
// bot.setMyCommands(comms);

const getHelp = () => {
  let helpText = `*Доступные команды:*\n`;
  helpText += comms.map(
    (command) => `*/${command.command}* - ${command.description}`
  ).join(`\n`);
  return helpText;
};


bot.start(async (ctx) => {
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



bot.hears('☸ Выбрать фон', ctx => ctx.reply(
  'Выберите тему:',
  inlineMessageThemes,
));
bot.hears('🌚 Цитатка', ctx => ctx.reply('В разработке!'));
bot.hears('📞 Контакты', ctx => ctx.reply('Yay!'));
bot.hears('🔍 Помощь', ctx => ctx.replyWithMarkdown(getHelp()));


const themesChunk = _.chunk(themes, 4);

const inlineMessageThemes = Markup.inlineKeyboard(
  themesChunk.map((chunk) => chunk.map((theme) => Markup.button.callback(theme.background, theme.background))),
  // Markup.button.callback("Custom", "Custom")
);


// bot.command('inline', (ctx) => {
//   ctx.reply(
//     'Выберите тему:',
//     inlineMessageThemes,
//   );
// })

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))