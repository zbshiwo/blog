/**
 * Created by 张博 on 2017/4/14.
 */
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var User = require('../models/users');

var responseData;
router.use(function(req, res, next){
   responseData = {
       code : 0,
       message : ''
   };
   next();
});

router.post('/user/register', function(req, res){
    var usernames = req.body.username;
    var passwords = req.body.password;
    var repasswords = req.body.repassword;

    if( usernames == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if( passwords == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if( passwords != repasswords) {
        responseData.code = 3;
        responseData.message = '两次密码输入不一致';
        res.json(responseData);
        return;
    }

    User.findOne({where:{username:usernames}}).then(function (userInfo) {

        if( userInfo == null ){
            User.create({username:usernames,password:passwords});
            responseData.message = '注册成功';
            res.json(responseData);
        }
        else {
            responseData.code = 4;
            responseData.message = '用户名已存在';
            res.json(responseData);
        }
    });

});

router.post('/user/login',function(req, res){

    var usernames = req.body.username;
    var passwords = req.body.password;

    if(usernames == '' || passwords == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return ;
    }

    User.findOne({where:{username:usernames,password:passwords}})
        .then(function (userInfo) {

           if (userInfo == null){
               responseData.code = 2;
               responseData.message = '用户名或密码错误';
               res.json(responseData);
           }
           else{
               responseData.useInfo = {
                   id : userInfo.dataValues.id,
                   username : userInfo.dataValues.username
               };
               req.cookies.set("userInfo", JSON.stringify({
                   id: userInfo.dataValues.id,
                   username: userInfo.dataValues.username
               }));
               responseData.message = '登陆成功';
               res.json(responseData);
           }
        });

});

router.get('/user/logout',function (req, res) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
});


function getLocalTime(i) {
    //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
    if (typeof i !== 'number') return;
    var d = new Date();
    //得到1970年一月一日到现在的秒数
    var len = d.getTime();
    //本地时间与GMT时间的时间偏移差
    var offset = d.getTimezoneOffset() * 60000;
    //得到现在的格林尼治时间
    var utcTime = len + offset;

    return new Date(utcTime + 3600000 * i);
}

router.post('/comment/post', function (req, res) {
    var page = 1;
    var limit = 5;
    // var offset;
    var pages;

    var commentData = {
        contentId : req.body.contentid,
        username : req.userInfo.username,
        addTime : getLocalTime(16),
        comment : req.body.comment
    };

    if(commentData.comment != ''){
        Comment.create({
            username : commentData.username,
            addTime : commentData.addTime,
            comment : commentData.comment,
            contentId : commentData.contentId
        }).then(function () {
            return Comment.count({
                where : {
                    contentId : commentData.contentId
                }
            });
        }).then(function (count) {
            pages = Math.ceil(count/limit);
            // page = Math.max(1, page);
            // page = Math.min(pages, page);
            //offset = (page - 1) * limit;
            return Comment.findAll({
                where : {
                    contentId : commentData.contentId
                },
                // offset : offset,
                limit : limit,
                order : [ ['addTime' , 'DESC'] ]
            });
        }).then(function (comments) {
            var array = [];
            for(var i = 0; i< comments.length; i ++){
                array.push({
                    username : comments[i].dataValues.username,
                    addTime : comments[i].dataValues.addTime,
                    comment : comments[i].dataValues.comment
                });
            }
            responseData.pages = pages;
            responseData.array = array;
            responseData.message = '评论成功'
            res.json(responseData);
        });
    }
    else{
        responseData.message = '评论不能为空';
        responseData.code = 1;
        res.json(responseData);
    }

});

module.exports = router;

