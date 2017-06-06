/**
 * Created by 张博 on 2017/5/22.
 */
var Sequelize = require('sequelize');
var sequelize = require('../schemas/schemas');
var Content = require('./content');

var Comment = sequelize.define('comment', {
    username : {
        type : Sequelize.STRING,
        defaultValue : ''
    },

    addTime : {
        type : Sequelize.DATE
    },

    comment : {
        type : Sequelize.STRING
    }

},{
    freezeTableName: true,// Model 对应的表名将与model名相同
    timestamps: false
});

Content.hasMany(Comment);
Comment.belongsTo(Content);

//Comment.sync({force : true});

module.exports = Comment;