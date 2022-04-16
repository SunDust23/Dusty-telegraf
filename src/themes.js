const sequelize = require('../db');
const { Theme } = require('../models/models');

const themes = Theme.findAll();
console.log(themes);




// [
//     {
//         background: "abstract"
//     },
//     {
//         background: "fruit"
//     },
//     {
//         background: "nature"
//     },
//     {
//         background: "paper"
//     },
//     {
//         background: "sky"
//     },
//     {
//         background: "dark"
//     },
//     {
//         background: "texture"
//     },
//     {
//         background: "light"
//     },
//     {
//         background: "pasta"
//     },
// ]

module.exports = {themes}