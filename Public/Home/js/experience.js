/**
 * Created by lenovo on 2016/11/20.
 */
$(function(){
    CKEDITOR.replace('TextArea1', { height: '400' });
    function getContent(){
        return CKEDITOR.instances.TextArea1.getData();    //获取textarea的值
    }
    //修改提交按钮
    $('#exp').click(function(){
        $(this).submit();
    }).validate({
        submitHandler : function(){
            $('#experience').ajaxSubmit({
                url : ThinkPHP['MODULE'].replace("/index.php","") + "/User/editExperience2",
                type : 'POST',
                data : {
                    id : $('#id').val(),
                    title : $('#title').val(),
                    content : getContent(),
                },
            });
        }
    });
});