<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/11/6
 * Time: 17:27
 */
namespace Home\Model;
use Think\Model\RelationModel;

class UserModel extends RelationModel{
    //自动验证
    protected $_validate = array(
        //-1,'账号长度6-18个字符'
        array('username','6,18',-1,self::EXISTS_VALIDATE,'length'),
        //-2,'6到16位，区分大小写'
        array('password','6,16',-2,self::EXISTS_VALIDATE,'length'),
        //-3,'密码和密码确认不一致'
        array('repassword','password',-3,self::EXISTS_VALIDATE,'confirm'),
        //-4,'账号已存在'
        array('username','',-4,self::EXISTS_VALIDATE,'unique',self::MODEL_INSERT),
        //-5,'邮箱已存在'
        array('email','',-5,self::EXISTS_VALIDATE,'unique',self::MODEL_INSERT),
        //-6,'验证码验证'
        array('code','check_code',-6,self::EXISTS_VALIDATE,'function'),
        //判断时邮箱登录还是用户名登录
        array('login_username','email','noemail',self::EXISTS_VALIDATE),
    );
    //自动完成
    protected $_auto = array(
        array('password','sha1',self::MODEL_BOTH,'function'),
        array('create','time',self::MODEL_INSERT,'function'),
    );

    //一对多关联用户
    protected $_link = array(
        'extend_experience'=>array(
            'mapping_type'=>self::HAS_MANY,
            'class_name'=>'Experience',
            'foreign_key'=>'uid',
            'mapping_fields'=>'title,id',
        ),
        'extend_ability'=>array(
            'mapping_type'=>self::HAS_ONE,
            'class_name'=>'Ability',
            'foreign_key'=>'uid',
            'mapping_fields'=>'id,fruit',
        ),
        'extend_skill'=>array(
            'mapping_type'=>self::HAS_MANY,
            'class_name'=>'Skill',
            'foreign_key'=>'uid',
            'mapping_fields'=>'skill,uid',
        ),
    );

    //注册用户
    public function register($email,$password,$repassword,$code){
        $data = array(
            'email' => $email,
            'password' => $password,
            'repassword' => $repassword,
            'code' => $code,
        );
        //注册
        if($this->create($data)){
            $uid = $this->add();
            return $uid ? $uid : 0;
        }else{
            return $this->getError();
        }
    }

    //登录用户
    public function login($email,$password,$auto,$code){
        $data = array(
            'password'=>$password,
            'code' => $code,
        );

        //自动验证，自动完成
        if($this->create($data)) {
            //where
            $map['email'] = $email;
        }else{
            return $this->getError();
        }
        //验证密码
        $user = $this->field('id,email,password,face')->where($map)->find();
        if ($user['password'] == sha1($password)) {
            //登录验证后写入登录信息
            $update = array(
                'id' => $user['id'],
                'last_login' => NOW_TIME,
                'last_ip' => get_client_ip(1),
            );
            $this->save($update);

            //将记录写入到cookie和session中
            $auth = array(
                'id' => $user['id'],
                'email' => $user['email'],
                'face' => json_decode($user['face']),
                'last_login' => NOW_TIME,
            );
            session('user_auth', $auth);

            //记录自动登录信息，写入cookie中
            if ($auto == 'on') {
                cookie('auto', base64_encode($user['email'].'|'.get_client_ip()), 3600 * 24);
            }
            return $user['id'];
        } else {
            return -7;      //-7，密码不正确
        }
    }

    //获取注册信息，最后登录时间，最后登录ip
    public function getRegInfo($id){
        $map = $id;
        return $this->format($this->table('__USER__')
                    ->field('create,last_login,last_ip')
                    ->where($map)
                    ->select());
    }

    //获取基本信息
    public function getBasicInfo($id){
        $map = $id;
        return $this->format($this->table('__USER__')
                    ->field('username,sex,nickname,team,location,organ')
                    ->where($map)
                    ->select());
    }

    //获取经历信息、果实信息和招式信息
    public function getExperienceInfo($id){
        $map = $id;
        $user = $this->relation(true)->field('id,username')->where($map)->find();
        $Skill = D('Skill');
        $data = array(
            'aid' => $user['extend_ability']['id'],
        );
        $map_skill = array(
            'uid' => $user['id'],
        );
        $Skill->where($map_skill)->save($data);

        return $user;
    }

    //修改基本信息
    public function updateBasicInfo($username,$sex,$nickname,$team,$location,$organ){
        $map['id'] = session('user_auth')['id'];
        $data = array(
            'username' => $username,
            'sex' => $sex,
            'nickname' => $nickname,
            'team' => $team,
            'location' => $location,
            'organ' => $organ,
        );
        return $this->where($map)->save($data);
    }

    //完善基本信息
    public function completeBasicInfo($id,$username,$sex,$nickname,$team,$location,$organ){
        $map['id'] = $id;
        $data = array(
            'username' => $username,
            'sex' => $sex,
            'nickname' => $nickname,
            'team' => $team,
            'location' => $location,
            'organ' => $organ,
        );

        $basic = $this->where($map['id'])->save($data);
        return $basic;
    }

    //格式化返回的信息
    public function format($list){
        foreach($list as $key=>$value){
            $list[0]['create'] = date('Y-m-d H:i',$list[0]['create']);
            $list[0]['last_login'] = date('Y-m-d H:i',$list[0]['last_login']);
            return $list;
        }
    }

}