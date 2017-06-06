/**
 * Created by 张博 on 2017/4/14.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Categories = require('../models/categories');
var Content = require('../models/content');

router.use(function (req, res, next) {

    if( req.userInfo.username ) {
        User.findOne({where: {username: req.userInfo.username}}).then(function (userInfo) {
            req.userInfo.id = userInfo.dataValues.id;
            req.userInfo.isAdmin = userInfo.dataValues.isAdmin;
            if(req.userInfo.isAdmin){
                next();
            }
            else{
                res.send('不允许访问!');
                return;
            }
        });
    }
    else{
        res.send('不允许访问！');
        return;
    }
});

router.get('/', function(req, res){
    res.render('admin/index', {
        userInfo : req.userInfo
    });
});

router.get('/user', function (req, res) {

    var page = Number(req.query.page) || 1;
    var limit = 5;

    User.count().then(function (counts) {

        var pages = Math.ceil(counts / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        User.findAll({
            offset : skip,
            limit : limit
        })
            .then(function (users) {
                res.render('admin/user_index', {
                    userInfo : req.userInfo,
                    users : users,
                    page : page,
                    pages : pages,
                    limit : limit,
                    counts : counts,
                    user : 'user'
                });
            });
    });
});

router.get('/category', function (req, res) {
    var page = Number(req.query.page) || 1;
    var limit = 5;

    Categories.count().then(function (counts) {

        var pages = Math.ceil(counts / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        Categories.findAll({
            offset : skip,
            limit : limit,
            order : [ ['id' , 'DESC'] ]
        })
            .then(function (categories) {
                res.render('admin/category_index', {
                    userInfo : req.userInfo,
                    categories : categories,
                    page : page,
                    pages : pages,
                    limit : limit,
                    counts : counts,
                    user : 'category'
                });
            });
    });
});

router.get('/category/add', function (req, res) {
    res.render('admin/category_add', {
        userInfo : req.userInfo
    });
});

router.post('/category/add', function (req, res) {
    String.prototype.Trim = function()
    {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    var name = (req.body.name).Trim() || '';
    if(name == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : '分类名称不能为空'
        });
    }
    else {
        Categories.findOne({
            where: {
                name: name
            }
        }).then(function (result) {
            if (result == null) {
                Categories.create({name: name}).then(function () {
                    res.render('admin/success', {
                        userInfo: req.userInfo,
                        message: '保存成功',
                        url: '/admin/category'
                    })
                });
            }
            else res.render('admin/error', {
                userInfo: req.userInfo,
                message: '该分类已存在'
            })
        });
    }

});

router.get('/category/edit', function (req, res) {
    var id = Number( req.query.id ) || '';
    if( id == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : 'id不存在'
        });
    }
    else{
        Categories.findOne({
            where : {
                id : id
            }
        }).then(function (category) {
            if(category == null){
                res.render('admin/error', {
                    userInfo : req.userInfo,
                    message : 'id错误'
                });
            }
            else{
                res.render('admin/category_edit', {
                    userInfo : req.userInfo,
                    category : category
                });
            }
        });
    }

});

router.post('/category/edit',function (req, res) {
    var name = (req.body.name) || '';
    var id = Number(req.query.id) || '';

    if(name == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : '分类名称不能为空'
        });
    }
    else{
        Categories.findOne({
            where : {
                id : id
            }
        }).then(function (category) {
            if(category == null){
                res.render('admin/error', {
                    userInfo : req.userInfo,
                    message : 'id错误1'
                });
            }
            else{
                if(name == category.dataValues.name){
                    res.render('admin/success', {
                        userInfo : req.userInfo,
                        message : '修改成功1',
                        url : '/admin/category'
                    });
                }
                else{
                    Categories.findAll({
                        where : {
                            name : name
                        }
                    }).then(function (categories) {
                        if(categories.length == 0){
                            Categories.update({name : name},{
                                where : {
                                    id : id
                                }
                            }).then(function () {
                                res.render('admin/success', {
                                    userInfo : req.userInfo,
                                    message : '修改成功2',
                                    url : '/admin/category'
                                });
                            });
                        }
                        else {
                            res.render('admin/error', {
                                userInfo : req.userInfo,
                                message : '分类名称已存在',
                            });
                        }
                    });
                }
            }
        });
    }
});

router.get('/category/delete', function (req, res) {
    var id = Number( req.query.id ) || '';
    if( id == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : 'id不存在'
        });
    }
    else{
        Content.findAll({
            where : {
                categoryId : id
            }
        }).then(function (contents) {
            if(contents.length != 0){
                res.render('admin/error', {
                    userInfo : req.userInfo,
                    message : '该分类下有内容，请先删除内容在来尝试'
                });
            }
            else{
                Categories.destroy({
                    where : {
                        id : id
                    }
                }).then(function (result) {
                    res.render('admin/success', {
                        userInfo : req.userInfo,
                        message : '删除成功',
                        url : '/admin/category'
                    });
                });
            }
        });
    }
});

// router.post('/category/delete', function (req, res) {
//     var name = (req.body.name) || '';
//     var id = Number(req.query.id) || '';
//
//     if(name == ''){
//         res.render('admin/error', {
//             userInfo : req.userInfo,
//             message : '分类名称不能为空'
//         });
//     }
//     else{
//         Categories.findOne({
//             where : {
//                 id : id
//             }
//         }).then(function (category) {
//             if(category == null){
//                 res.render('admin/error', {
//                     userInfo : req.userInfo,
//                     message : 'id错误3'
//                 });
//             }
//             else{
//                 if(category.dataValues.name != name){
//                     res.render('admin/error', {
//                         userInfo : req.userInfo,
//                         message : '分类名称输入错误'
//                     });
//                 }
//                 else{
//                     Categories.destroy({
//                         where : {
//                             id : id,
//                             name : name
//                         }
//                     }).then(function () {
//                         res.render('admin/success', {
//                             userInfo : req.userInfo,
//                             message : '删除成功',
//                             url : '/admin/category'
//                         });
//                     });
//                 }
//             }
//         });
//     }
// });

router.get('/content', function (req, res) {

    var page = Number(req.query.page) || 1;
    var limit = 5;

    Content.count().then(function (counts) {

        var pages = Math.ceil(counts / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        Content.findAll({
            offset : skip,
            limit : limit,
            order : [ ['id' , 'DESC'] ],
            include: [{
                model: Categories
            }, {
                model : User
            }]
        })
            .then(function (contents) {
                res.render('admin/content_index', {
                    userInfo :  req.userInfo,
                    contents : contents,
                    pages : pages,
                    page : page,
                    limit : limit,
                    counts : counts,
                    user : 'content'
                });
            });
    });
});

router.get('/content/add', function (req, res) {
    Categories.findAll({
        order : [ [ 'id' , 'DESC'] ]
    }).then(function (categories) {
        res.render('admin/content_add', {
            userInfo : req.userInfo,
            categories : categories
        });
    }) ;
});

router.post('/content/add', function (req, res) {
    var category = Number(req.body.category);
    console.log(category);
    var title = req.body.title;
    var description = req.body.description;
    var content = req.body.content;

    if(title == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : '标题不能为空'
        });
        return;
    }
    if(category == ''){
        res.render('admin/error', {
            userInfo : req.userInfo,
            message : '分类不能为空'
        });
        return;
    }

    Content.create({
        userId : req.userInfo.id,
        categoryId : category,
        title : title,
        description : description,
        content : content
    }).then(function () {
        res.render('admin/success', {
            userInfo : req.userInfo,
            message : '插入成功',
            url : '/admin/content'
        });
    });

});

router.get('/content/edit', function (req, res) {
    var id = Number(req.query.id || '');
    console.log(req.query.id);
    Content.findOne({
        where : {
            id : id
        },
        include : [ {
            model : Categories
        }]
    }).then(function (content) {
        Categories.findAll().then(function (categories) {
            if(content == null){
                res.render('admin/error', {
                    userInfo : req.userInfo,
                    message : 'id错误'
                });
            }
            else {
                res.render('admin/content_edit', {
                    userInfo : req.userInfo,
                    content : content,
                    categories : categories
                });
            }
        });

    });


});

router.post('/content/edit',function (req, res) {
    var id = Number(req.query.id) || '';
    console.log(req.body);
    var category = Number(req.body.category);
    var title = req.body.title;
    var description = req.body.description;
    var content = req.body.content;

    if(id == ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : 'id错误'
        });
    }
    else if(title == ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : 'title不能为空'
        });
    }
    else {
        Content.update({
            title : title,
            description : description,
            content : content,
            categoryId : category
        },{
            where : {
                id : id
            }
        }).then(function () {
            res.render('admin/success',{
                userInfo : req.userInfo,
                message : '修改成功',
                url : '/admin/content'
            });
        });

    }


});

router.get('/content/delete', function (req, res) {
     var id = req.query.id;

     Content.findOne({
         where : {
             id : id
         }
     }).then(function (content) {
         if(content == null){
             res.render('admin/error', {
                 userInfo: req.userInfo,
                 message: 'id错误'
             });
         }
         else{
             Content.destroy({
                 where : {
                     id : id
                 }
             }).then(function () {
                 res.render('admin/success', {
                     userInfo : req.userInfo,
                     message : '删除成功',
                     url : '/admin/content'
                 })
             });
         }
     })

});

module.exports = router;

