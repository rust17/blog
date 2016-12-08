/**
 * Created by lenovo on 2016/11/5.
 */
$(function(){
    //登录对话框
    $('#box-login').dialog({
        width:430,
        height:410,
        title:'博客登录',
        modal:true,
        resizable:false,
        closeText:'关闭',
        autoOpen:false,
        buttons : [{
            text : '登录',
            click : function(){
                $(this).submit();
            }
        }],
    }).validate({
        submitHandler : function(){
            $('#box-login').ajaxSubmit({
                url : ThinkPHP['MODULE'].replace("/index.php","") + '/User/login',
                type : 'POST',
                beforeSubmit : function(){
                    $('#loading').dialog('open').html('登录中');
                },
                success : function(responseText){
                    if(responseText > 0){
                        $('#loading').css('background','url('+ ThinkPHP['IMG'] +'/success.gif) no-repeat center 30px').html('登录成功...');
                        setTimeout(function(){
                            $('#loading').dialog('close');
                            $('#box-login').dialog('close');
                        },3000);
                    }
                }
            });
        }
    });
    //点击弹窗登录
    $('#login').click(function(){
        $('#box-login').dialog('open');
    });
    $('#locate-login').click(function(){
        $('#box-register').dialog('close');
        $('#box-login').dialog('open');
    });

    //注册弹窗对话框
    $('#box-register').dialog({
        width : 430,
        height : 410,
        title : '博客注册',
        modal : true,
        resizable : false,
        closeText : '关闭',
        autoOpen : false,
        buttons : [{
            text : '注册',
            click : function(e){
                $(this).submit();
            }
        }],
    }).validate({
        submitHandler : function(){
            $('#box-register').ajaxSubmit({
                url : ThinkPHP['MODULE'].replace("/index.php","") + '/User/register',
                type : 'POST',
                beforeSubmit : function(){
                    $('#loading').dialog('open');
                },
                success : function(responseText){
                    if(responseText > 0){
                        $('#loading').css('background','url('+ ThinkPHP['IMG'] +'/success.gif) no-repeat center 30px').html('注册成功...');
                        setTimeout(function(){
                            $('#loading').dialog('close');
                            $('#box-register').dialog('close');
                        },2000);

                    }
                }
            });
        }
    });
    //点击弹窗注册
    $('#register').click(function(){
        $('#box-register').dialog('open');
    });
    $('#locate-register').click(function(){
        $('#box-login').dialog('close');
        $('#box-register').dialog('open');
    });

    //点击更换验证码
    var imgverify = $('.image-code').attr('src');
    $('.image-code').click(function(){
        $('.image-code').attr('src',imgverify + '?random=' + Math.random());
    });
    //loading对话框
    $('#loading').dialog({
        width : 100,
        height : 70,
        modal : true,
        resizable : false,
        autoOpen : false,
    }).parent().find('.ui-dialog-titlebar').hide();
})