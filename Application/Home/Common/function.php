<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/10
 * Time: 21:48
 */
//校验验证码
function check_code($code,$id = 1){
    $Verify = new \Think\Verify();
    $Verify->reset = false;
    return $Verify->check($code,$id);
}

