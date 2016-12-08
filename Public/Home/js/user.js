/**
 * Created by lenovo on 2016/11/13.
 */
$(function(){
    //展开、折叠信息
    $('#basic').click(function(){
        $('#basic-content').is(':hidden');
        $('#basic-content').slideToggle();
    });
    $('#experience').click(function(){
        $('#experience-content').is(':hidden');
        $('#experience-content').slideToggle();
    });
    $('#ability').click(function(){
        $('#ability-content').is(':hidden');
        $('#ability-content').slideToggle();
    });
    //点击编辑，显示框线
    $('.edit-basic').click(function(){
        $(this).parent().find('input').css('border','1px solid #000000');
        $(this).parent().find('input').attr('readonly',null);
        $(this).parent().find('p').show();
    });
    //编辑资料，点击完成，提交
    $('.edit-basic').find('p.complete').click(function(e){
        $(this).submit();
    }).validate({
        submitHandler : function(){
            $('#basic-info').ajaxSubmit({
                url : ThinkPHP['MODULE'].replace("/index.php","") + '/User/edit',
                type : 'POST',

            })
        }
    });
    //点击添加图标，添加标题输入框
    var a = document.getElementById('count-title').value;
    $('#add-title').click(function(){
        var title = $(this).parent().parent().parent().find('.title');
        a++;
        title.append('<dt><input id="count-title" value="'+ a +'" style="display: none;" />标&nbsp题 &nbsp'+ a +'：<input type="text" id="experience_title" name="experience_title" class="experience_title" /></dt>');
    });
    //点击添加图标，添加能力输入框
    var b = document.getElementById('count-skill').value;
    $('#add-skill').click(function(){
        var title = $(this).parent().parent().parent().find('.ability');
        b++;
        title.append('<dt><input id="count-skill" value="'+ b +'" style="display: none;" />能&nbsp力 &nbsp'+ b +'：<input type="text" name="skill['+ b +']" class="skill" /></dt>');
    });
    //点击完成保存
    $('#save').click(function(){
        $(this).submit();
    }).validate({
        submitHandler : function(){
            $('#complete-info').ajaxSubmit({
                url : ThinkPHP['MODULE'].replace("/index.php","")+'/User/completeInfo',
                type : 'POST',
                beforeSubmit : function(){
                    console.log(1);
                },
            })
        }
    });
});