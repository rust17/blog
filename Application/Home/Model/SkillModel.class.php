<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/19
 * Time: 15:49
 */
namespace Home\Model;
use Think\Model\RelationModel;

class SkillModel extends RelationModel{
    //自动验证
    protected $_validate = array(
        //-1,'招式已存在'
        array('skill','',-1,self::EXISTS_VALIDATE,'unique',self::MODEL_INSERT),
    );
    
    //新增招式信息
    public function completeSkillInfo($id,$skill){
        foreach($skill as $value){
            $data['skill'] = $value;
            $data['uid'] = $id;
            $this->create($data);
            $this->add();
        }
        return true;
    }
}