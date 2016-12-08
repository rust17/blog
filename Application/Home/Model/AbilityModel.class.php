<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/19
 * Time: 15:49
 */
namespace Home\Model;
use Think\Model\RelationModel;

class AbilityModel extends RelationModel{
    //自动验证
    protected $_validate = array(
        //-1,'果实已存在'
        array('fruit','',-1,self::EXISTS_VALIDATE,'unique',self::MODEL_INSERT),
    );

    //新增果实信息
    public function completeAbilityInfo($id,$fruit){
        $data = array(
            'uid' => $id,
            'fruit' => $fruit,
        );
        $this->create($data);
        return $this->add();
    }
}