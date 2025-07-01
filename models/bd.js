require('dotenv').config();
console.log('senha:'+process.env.DB_PASS)
const Sequelize = require('sequelize');
const sequelize = new Sequelize('railway', 'root', process.env.DB_PASS, {
    host: 'switchyard.proxy.rlwy.net',
    port: 47027,
    dialect: 'mysql',
    logging: false
});

module.exports = {Sequelize, sequelize};   //exportando o obj e sua instanciação