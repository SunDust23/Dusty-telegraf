const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    chatId: { type: DataTypes.STRING, unique: true },
    generated: { type: DataTypes.INTEGER, defaultValue: 0 }
})

const Theme = sequelize.define('theme', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    background: { type: DataTypes.STRING, unique: true }
})

const Fact = sequelize.define('fact', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    fact: { type: DataTypes.STRING, unique: true }
})


module.exports = {
    User,
    Theme,
    Fact
}