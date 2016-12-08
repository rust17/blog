<?php
return array(
	//'配置项'=>'配置值'
    'VIEW_PATH' => './Template/',       //模板位置
    'DEFAULT_MODULE' => 'Home',       //默认模块
    'MODULE_ALLOW_LIST' => array('Home'),       //设置访问列表
    //数据库配置
    'DB_TYPE'=>'pdo',
    'DB_USER'=>'root',
    'DB_PWD'=>'',
    'DB_PREFIX'=>'blog_',
    'DB_DSN'=>'mysql:host=localhost;dbname=blog;charset=UTF8',
);