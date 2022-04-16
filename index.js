const { Telegraf, Markup } = require("telegraf");
require('dotenv').config();
const { v4: uuidV4 } = require('uuid');
const factGenerator = require('./src/factGenerator');
const comms = require("./src/commands");
const { themes } = require('./src/themes');
var _ = require("lodash");

const sequelize = require('./db');
const { User, Theme } = require('./models/models');
// const {createTheme} = require('./src/create');


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

const getConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Ошибка подключения к БД', e);
  }
}

const getKeyboard = () => {
  return Markup.keyboard([
      ['☸ Выбрать фон', '🌚 Цитатка'], // Row1 with 2 buttons
      ['📝 Статистика', '🔍 Помощь'], // Row2 with 2 buttons
    ])
    .oneTime()
    .resize()
}


bot.start(async (ctx) => {
  let chatId = ctx.chat.id;

  try {
    await User.create({ chatId });
    console.log(`Пользователь успешно записан!`);
  } catch (e) {
    console.log(`Пользователь уже зарегестрирован!`);
  }
  
  return await ctx.reply(`Приветствую, ${ctx.from.first_name ? ctx.from.first_name : "хороший человек"}!`, getKeyboard())
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
bot.hears('📝 Статистика', async (ctx) => {

  let chatId = ctx.chat.id;
  const user = await User.findOne({chatId});

  ctx.reply(`${ctx.from.first_name} ${ctx.from.last_name}, ты сгенерировал ${user.generated} цитаток!!!`);

});
bot.hears('🔍 Помощь', ctx => ctx.replyWithMarkdown(getHelp()));


//принимает на вход callback от кнопки "Выбрать фон"
bot.on('callback_query', async (ctx) => {
  let chatId = ctx.chat.id;
  const user = await User.findOne({chatId});
  user.generated +=1;
  console.log(user.generated);

  try {
    ctx.reply('Идёт генерация фото, пожалуйста, подождите...')
    let imagePath = `./temp/${uuidV4()}.jpg`
    await factGenerator.generateImage(imagePath, ctx.update.callback_query.data)
    await ctx.replyWithPhoto({ source: imagePath })
    factGenerator.deleteImage(imagePath);

    await user.save();
  } catch (error) {
    console.log('error', error)
    ctx.reply('Ошибка отправки изображения')
  }
  console.log(user.generated);
});



bot.command('admin', (ctx) => {
  if (ctx.chat.id == process.env.ADMIN_ID)
  {
    return ctx.reply(
      'Добрый день, добро пожаловать в админ-панель!',
      Markup.keyboard([
        Markup.button.callback('Добавить фон', 'adminСreateTheme'),
        Markup.button.callback('Добавить факт', 'adminСreateFact')
      ]).resize()
    )
  }
  else {
    ctx.reply('В доступе отказано!\nЭта команда доступна только администратору!');
  }
})

bot.action("adminСreateTheme", (ctx) => {
    ctx.reply('нажатие первой кнопки прошло успешно');
    console.log("lol");
});
bot.action("adminСreateFact", (ctx) => {
    ctx.reply('нажатие второй кнопки прошло успешно');
    console.log("kek");
});

// bot.action("Fruits",(ctx) => {
//     ctx.reply('нажатие третьей кнопки прошло успешно');
//     background = "Fruits";
// });
// bot.action("Nature",(ctx) => {
//     ctx.reply('нажатие четвёртой кнопки прошло успешно');
//     background = "Nature";
// });

bot.launch();
getConnection();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))