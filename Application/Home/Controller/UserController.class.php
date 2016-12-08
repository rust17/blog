<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/6
 * Time: 15:58
 */
namespace Home\Controller;

use Think\Controller;

class UserController extends HomeController{
    public function index(){
        if($this->isLogin()) {
            $id = $this->isLogin();
            $User = D('User');
            $info = $User->getRegInfo($id);
            $this->assign('info',$info);
            $this->getBasicInfo();
            $this->getExperienceInfo();

            $this->display();
        }else{
            $this->redirect('Index/index');
        }
    }

    //新增个人资料信息
    public function completeInfo(){
        $id = $this->isLogin();
        $this->assign('id',$id['id']);
        $this->display();
        if(IS_AJAX){
            $User = D('User');
            $basic = $User->completeBasicInfo($id,I('post.username'),I('post.sex'),I('post.nickname'),I('post.team'),I('post.location'),I('post.organ'));
            echo $basic;
            $Experience = D('Experience');
            $exp = $Experience->completeExpInfo(I('post.id'),I('post.experience_title'));
            echo $exp;
            $Ability = D('Ability');
            $ability = $Ability->completeAbilityInfo(I('post.id'),I('post.fruit'));
            echo $ability;
            $Skill = D('Skill');
            $skill = $Skill->completeSkillInfo(I('post.id'),I('post.skill'));
            echo $skill;
        }
    }

    //提取基本信息
    public function getBasicInfo(){
        if($this->isLogin()){
            $id = $this->isLogin();
            $User = D('User');
            $info = $User->getBasicInfo($id);
            $this->assign('basic',$info);
        }else{
            $this->redirect('Index/index');
        }
    }

    //提取经历信息，果实信息，招式信息
    public function getExperienceInfo(){
        if($this->isLogin()){
            $id = $this->isLogin();
            $User = D('User');
            $info = $User->getExperienceInfo($id);
            $this->assign('experience',$info['extend_experience']);
            $this->assign('ability',$info['extend_ability']['fruit']);
            $this->assign('skill',$info['extend_skill']);
        }else{
            $this->redirect('Index/index');
        }
    }

    //根据文章id提取经历信息
        public function getExperienceInfo2(){
            $id = I('get.id');
            if($id){
                $Experience = D('Experience');
                $info = $Experience -> getExperienceInfo2($id);
                $this->assign('experience',$info[0]);
            }else{
                $this->error('非法访问');
            }
        }

    //编辑基本信息
    public function edit(){
        if(IS_AJAX){
            $User = D('User');
            $uid = $User -> updateBasicInfo(I('post.username'),I('post.sex'),I('post.nickname'),I('post.team'),I('post.location'),I('post.organ'));
            echo $uid;
        }else{
            $this->error('非法访问');
        }
    }

    //修改经历信息
    public function editExperience(){
        $this->getExperienceInfo2();
        $this->display();
    }

    //修改经历信息
    public function editExperience2(){
        if(IS_AJAX){
            $User = D('Experience');
            $uid = $User -> updateExperience(I('post.id'),I('post.title'),I('post.content'));
            echo $uid;
        }
    }

    //用户登录
    public function login(){
        if(IS_AJAX){
            $User = D('User');
            $uid = $User ->login(I('post.email'),I('post.password'),I('post.auto'),I('post.code'));
            echo $uid;
        }else{
            $this->error('非法访问');
        }
    }

    //用户注册
    public function register(){
        if(IS_AJAX){
            $User = D('User');
            $uid = $User ->register(I('post.email'),I('post.password'),I('post.repassword'),I('post.code'));
            echo $uid;
        }else{
            $this->error('非法访问');
        }
    }

    //用户退出
    public function logout(){
        //清理session
        session(null);
        //清理cookie
        cookie('auto',null);
        //退出提示
        $this->success('退出成功',U('Index/index'),3);
    }

}