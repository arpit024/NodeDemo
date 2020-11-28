const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('Users', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    FirstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    LastName: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING,
        uniqueKey: true
    },
    Age: {
        type: Sequelize.INTEGER
    }
},{
    timestamps: false
});

module.exports = User;