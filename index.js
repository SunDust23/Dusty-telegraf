const { Telegraf, Markup } = require("telegraf");
require('dotenv').config();
const { v4: uuidV4 } = require('uuid');
const factGenerator = require('./factGenerator');
const comms = require("./commands");
const { themes } = require('./themes');
var _ = require("lodash");


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

let searchedBackground = "paper";
const themesChunk = _.chunk(themes, 4);


bot.hears('☸ Выбрать фон', (ctx) => {
  ctx.reply(
    'Выберите тему:',
    Markup.inlineKeyboard(
      themesChunk.map((chunk) => chunk.map((theme) => Markup.button.callback(theme.background, theme.background))),
    ),
  );

}
);

bot.hears('🌚 Цитатка', ctx => ctx.reply('В разработке!'));
bot.hears('📞 Контакты', ctx => ctx.reply('Yay!'));
bot.hears('🔍 Помощь', ctx => ctx.replyWithMarkdown(getHelp()));


//принимает на вход callback от кнопки "Выбрать фон"
bot.on('callback_query', async (ctx) => {
  try {
    ctx.reply('Идёт генерация фото, пожалуйста, подождите...')
    let imagePath = `./temp/${uuidV4()}.jpg`
    await factGenerator.generateImage(imagePath, ctx.update.callback_query.data)
    await ctx.replyWithPhoto({ source: imagePath })
    factGenerator.deleteImage(imagePath)
  } catch (error) {
    console.log('error', error)
    ctx.reply('Ошибка отправки изображения')
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))