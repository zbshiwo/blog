/**
 * Created by 张博 on 2017/4/14.
 */
var express = require('express');
var User = require('../models/users');
var Content = require('../models/content');
var Categories = require('../models/categories');
var Comment = require('../models/comment');
var router = express.Router();

router.use(function (req, res, next) {

    if( req.userInfo.username ) {
        User.findOne({where: {username: req.userInfo.username}}).then(function (userInfo) {
            req.userInfo.id = userInfo.dataValues.id;
            req.userInfo.isAdmin = userInfo.dataValues.isAdmin;
            next();
        });

    }
    else next();
});

router.get('/', function(req, res, next){

    var category  = Number(req.query.category) || '';
    var page = Number(req.query.page) || '';
   // console.log(page);
    var data = {
        category : category,
        userInfo : req.userInfo,
        categories : [],
        contents : [],
        count : 0,
        limit : 5,
        page : 1,
        pages : 0,
        comments : []
    };

    if(page != ''){
        data.page = page;
    }

    Categories.findAll().then(function (categories) {
        data.categories = categories;

        if(category == ''){
            return Content.count();
        }
        else{
            return Content.count({
                where :{
                    categoryId : category
                }
            });
        }

    }).then(function(count){
        data.pages = Math.ceil(count / data.limit);
        data.count = count;
        var skip = (data.page - 1) * data.limit;
        if(category == ''){
            return Content.findAll({
                offset : skip,
                limit : data.limit,
                include : [ {
                    model : User
                } ]
            });
        }
        else{
            return Content.findAll({
                offset : skip,
                limit : data.limit,
                where : {
                    categoryId : category
                },
                include : [ {
                    model : User
                } ]
            });
        }
    }).then(function (contents) {

            data.contents = contents;
            res.render("main/index", data);
    });
});

router.get('/view', function (req, res) {
    var contentId = Number(req.query.contentid) || '';
    var page = Number(req.query.page) || 1;
    console.log(contentId);
    console.log(page);
    var offset;

    var data = {
        userInfo : req.userInfo,
        limit : 5,
        page : 1
    };
    Comment.count({
        where : {
            contentId : contentId
        }
    }).then(function (counts) {
        data.counts = counts;
        data.pages = Math.ceil(data.counts/data.limit);
        data.page = Math.max(1, page);
        data.page = Math.min(page, data.pages);

        offset = (data.page - 1) * data.limit;
        return Comment.findAll({
            where : {
                contentId : contentId
            },
            offset : offset,
            limit : data.limit,
            order : [ ['addTime' , 'DESC'] ]
        });
    }).then(function (comments) {

        data.comments = comments;
        Categories.findAll().then(function(categories){
            data.categories = categories;
            return Content.findOne({
                where : {
                    id : contentId
                }
            });
        }).then(function (content) {
            data.category = content.dataValues.categoryId;
            data.content = content;
            var n = ++content.dataValues.views;
            return Content.update({
                views : n
            },{
                where :{
                    id : contentId
                }
            });
        }).then(function (a) {
            res.render('main/view', data);
        });
    });

});

module.exports = router;