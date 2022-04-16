const {Theme} = require('../models/models');
// const sequelize = require('../db');

// const getConnection = async () => {
//     try {
//       await sequelize.authenticate();
//       await sequelize.sync();
//     } catch (e) {
//       console.log('Ошибка подключения к БД', e);
//     }
//   }

const createTheme = async (background) => {
    const type = await Theme.create({background});
    await type.save();
}

// getConnection();
// create("Nature");

module.exports = {
  createTheme
}
