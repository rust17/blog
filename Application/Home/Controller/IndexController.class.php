<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;
use Think\Controller;
use Think\Verify;

class IndexController extends HomeController {
    public function index(){
        $this->display();
    }
    public function verify(){
        $Verify = new Verify();
        $Verify ->entry(1);
    }
    //提取经历信息
    public function getExperienceInfo(){
        if($this->isLogin()){
            $id = $this->isLogin();
            $Experience = D('Experience');
            $info = $Experience -> getExperienceInfo($id['id']);
            $this->assign('experience',$info);
        }else{
            $this->redirect('Index/index');
        }
    }
}