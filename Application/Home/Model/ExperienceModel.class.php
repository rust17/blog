<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/19
 * Time: 15:49
 */
namespace Home\Model;
use Think\Model\RelationModel;

class ExperienceModel extends RelationModel{

    //提取登录用户的经历信息
    public function getExperienceInfo($id){
        $map['uid'] = $id;
        $experience = $this->field('title,content')->where($map)->select();
        $experience['content'] = htmlspecialchars($experience['content']);
        return $experience;
    }
    //根据文章id提取经历信息
    public function getExperienceInfo2($id){
        $map['id'] = $id;
        $experience = $this->field('id,title,content')->where($map)->select();

        return $experience;
    }

    //修改经历信息
    public function updateExperience($id,$title,$content){
        $map['id'] =$id;
        $data = array(
            'title' => $title,
            'content' => $content,
        );
        return $this->where($map)->save($data);
    }

    //新增经历信息
    public function completeExpInfo($id,$experience_title){
        foreach($experience_title as $value){
            $data['uid'] = $id;
            $data['title'] = $experience_title;
            $this->create($data);
            $this->add();
        }
    }
}