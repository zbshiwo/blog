var sequelize = require('../schemas/schemas');
var Sequelize = require('sequelize');

var Categories = sequelize.define('categories', {
    name : {
        type: Sequelize.STRING,
        unique : true,
        allowNull : false
    }
}, {
    freezeTableName: true,// Model 对应的表名将与model名相同
    timestamps: false
});

// Categories.sync({force : true});

module.exports = Categories;