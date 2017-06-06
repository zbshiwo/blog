// /**
//  * Created by 张博 on 2017/4/15.
//  */
// var mysql = require('mysql');
//
// var pool = mysql.createPool({
//     host : 'localhost',
//     port : 3306,
//     database : 'blog',
//     user : 'root',
//     password : 'zb960117'
// });
// var tableName = 'user';
// module.exports.IsConnection = function() {
//     pool.getConnection(function (err, connection) {
//         if (err)
//             console.log('数据库连接失败');
//         else
//             console.log('数据库连接成功');
//     });
// };
//
// module.exports.addToMySql = function(obj) {
//
//     pool.getConnection(function (err, connection) {
//         if (err) {
//             console.log('数据库连接失败');
//         }
//         else {
//             connection.query('INSERT INTO' +
//                 connection.escapeId(tableName) +
//                 'VALUES(' + connection.escape(obj.username) +
//                 ',' + connection.escape(obj.password) + ');',
//                 function (err, result) {
//                     if (err){
//                         console.log(err.message);
//                         connection.release();
//                     }
//                     else {
//                         console.log('插入成功');
//                         connection.release();
//                     }
//             });
//         }
//     });
// };
// //SELECT * FROM user WHERE username = '';
// module.exports.search = function(obj){
//     pool.getConnection(function(err, connection){
//         if(err) {
//             console.log('数据库连接失败');
//             return false;
//         }
//         else{
//             connection.query('SELECT * FROM ' +
//                 connection.escapeId(tableName) +
//                 'WHERE username = ?',
//                 {username:obj.username},
//                 function(err, result){
//                     connection.release();
//                     if(err) return false;
//                     else{
//                         if(result.length == 0) return true;
//                         else return false;
//                     }
//                 }
//             );
//         }
//     });
//
// };
// // UPDATE user SET password = '' WHERE username = '';
// module.exports.update = function(obj){
//     pool.getConnection(function(err, connection){
//         if(err) console.log('数据库连接失败');
//         else{
//             connection.query('UPDATE' + connection.escapeId(tableName) +
//                 'SET password = ? WHERE username = ? ;',
//                 ['123456','123'],
//                 function(err,result){
//                     if(err) console.log(err.message);
//                     else console.log('更新成功');
//                 }
//             );
//             connection.release();
//         }
//     });
// };
