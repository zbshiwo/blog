/**
 * Created by 张博 on 2017/5/10.
 */
/**
 * Created by 张博 on 2017/5/10.
 */
var sequelize = require('../schemas/schemas');
var Sequelize = require('sequelize');

module.exports = sequelize.define('user', {
    username : {
        type: Sequelize.STRING,
        unqiue:true
    },
    password : {
        type: Sequelize.STRING
    },
    isAdmin : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
}, {
    freezeTableName: true,// Model 对应的表名将与model名相同
    timestamps: false
});