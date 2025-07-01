const Sequelize = require('sequelize');
const sequelize = new Sequelize('railway', 'root', 'OPgAyTkZqwEVCIJZrsednHRCjQmnIGaH', {
    host: 'switchyard.proxy.rlwy.net',
    port: 47027,
    dialect: 'mysql',
    logging: false
});

module.exports = {Sequelize, sequelize};   //exportando o obj e sua instanciação