/**
 * Created by 张博 on 2017/5/13.
 */
var sequelize = require('../schemas/schemas');
var Sequelize = require('sequelize');
var Categories = require('./categories');
var User = require('./users');
var Content = sequelize.define('content', {
    title : {
        type: Sequelize.STRING,
        unique : true
    },
    views : {
        type : Sequelize.INTEGER,
        defaultValue : 0
    },
    description : {
        type: Sequelize.STRING,
        defaultValue : ''
    },
    content : {
        type : Sequelize.STRING,
        defaultValue : ''
    }
}, {
    freezeTableName: true// Model 对应的表名将与model名相同
});

User.hasMany(Content, {froeignKey : 'userid'});
Content.belongsTo(User, {froeignKey : 'userid'});
Categories.hasMany(Content, {froeignKey : 'categoryid'});
Content.belongsTo(Categories, {froeignKey : 'categoryid'});
//Content.sync({force : true});
module.exports = Content;

