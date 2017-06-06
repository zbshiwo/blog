/**
 * Created by 张博 on 2017/4/22.
 */
var mysql = require('mysql');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('blog', 'root', 'zb960117', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;



