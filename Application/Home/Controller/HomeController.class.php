<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/19
 * Time: 16:03
 */
namespace Home\Controller;
use Think\Controller;

class HomeController extends Controller{
    //检测是否登录
    public function isLogin(){
        if(!is_null(cookie('auto'))){
            $value = explode('|',base64_decode(cookie('auto')),2);
            list($email,$ip) = $value;
            if($ip == get_client_ip()){
                $map['email'] = $email;
                $User = D('User');
                $id = $User->field('id')->where($map)->find();
                return $id;
            }else{
                $this->redirect('Index/index');
            }
        }
    }
}