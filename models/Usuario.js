const BD = require('./bd.js')
const Usuario = BD.sequelize.define('usuario', {
    id:{
        type: BD.Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: BD.Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: BD.Sequelize.STRING,
        allowNull: false
    }
})

Usuario.sync();

module.exports = Usuario;