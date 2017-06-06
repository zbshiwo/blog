/**
 * Created by 张博 on 2017/4/14.
 */
var cookies = require('cookies');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use('/public',express.static('./public'));

var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine','html');

swig.setDefaults({cache:false});


app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {
    req.cookies = new cookies(req, res);

    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
        }
        catch(e){}
    }
    next();
})
//app.use();
app.use('/admin', require('./routers/admin.js'));
app.use('/api', require('./routers/api.js'));
app.use('/', require('./routers/main.js'));
//修改为数据库连接成功 监听端口8081，失败则不监听


app.listen(8081);