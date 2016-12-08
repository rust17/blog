<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;
use Think\Controller;
class ExperienceController extends HomeController {
    public function index(){
        $this->getExperienceInfo();
        $this->display();
    }

    //提取登录用户经历信息
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