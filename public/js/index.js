/**
 * Created by 张博 on 2017/4/19.
 */
//var $ = require('./jquery-3.2.1');

// jQuery(document).ready(function (jQueryAlias) {
//
// })
//
// jQuery(function () {
//
// })
//
// $(document).ready(function (jQueryAlias) {
//
// })
//
// $(function () {
//
// })

$(function(){
   var $registerBox = $('#registerBox');
   var $loginBox = $('#loginBox');
   //切换到注册面板
   $loginBox.find('a').on('click', function(){
       $registerBox.show();
       $loginBox.hide();
   });
   //切换到登录面板
    $registerBox.find('a').on('click', function () {
        $loginBox.show();
        $registerBox.hide();
    });
    //注册
    $registerBox.find('button').on('click', function () {
       $.ajax({
          type:'post',
           url:'/api/user/register',
           data:{
               username:$registerBox.find('[name = "username"]').val(),
               password:$registerBox.find('[name = "password"]').val(),
               repassword:$registerBox.find('[name = "repassword"]').val()
           },
           dataType:'json',
           success:function (result){
               $('#error1').html(result.message);
               if(result.code == 0){
                   setTimeout(function () {
                       $loginBox.show();
                       $registerBox.hide();
                   },1000);
               }
           }
       });
    });

    $loginBox.find('button').on('click', function () {
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name = "username"]').val(),
                password:$loginBox.find('[name = "password"]').val()
            },
            dataType:'json',
            success:function (result){
                $('#error2').html(result.message);
                if(result.code == 0){
                    setTimeout(function () {
                        window.location.reload();
                    },2000);
                }

            }
        });
    });

    $("#logout").click(function () {
        $.ajax({
            url : 'api/user/logout',
            success : function (result) {
                if(result.code == 0){
                    window.location.reload();
                }
            },
            type : 'get'
        })
    })

    $("#messageBtn").click(function () {
        $.ajax({
            type : 'post',
            data : {
                contentid : $("#contentId").val(),
                comment : $("#messageContent").val()
            },
            url : '/api/comment/post',
            dataType : 'json',
            success : function (result) {

                if(result.code == 1){
                    return;
                }
                else {
                    $("#messageContent").val('');
                    render(result.array, result.pages);
                }
            }
        });
    })

});

function render(data, pages) {
    var html = '';
    for(var i = 0; i< data.length; i++){
        // html += '<div class="messageBox">' +
        //     '<p class="name clear"><span class="fl">' + '</span><span class="fr">' + '</span></p>' +
        //     '<p></p>' +
        //     '</div>';
        html = html + `<div class="messageBox">
                <p class="name clear"><span class="fl">${data[i].username}</span><span class="fr">${data[i].addTime.toString()}</span></p>
                <p>${data[i].comment}</p>
            </div>`;

    }
    $('#pages').html(`1/${pages}`);
    $('#messageCount').html(i);
    $('.messageList').html(html);
}
