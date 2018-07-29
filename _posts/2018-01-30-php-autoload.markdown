---
layout: post
category: "php"
title:  "php自动加载__autoload()相关笔记"
tags: [php]
---
<br>

在看框架源码时，发现了__autoload()和spl_autoload_register()以及__call()这几个方法，研究了好久，于是对其记录一番。<br>
<!-- more -->

php的__autoload()函数是一个魔术函数，作用是替代多次调用include和require，当一个php文件使用new关键字实例化时，如果该类没有被定义，将会触发__autoload函数，在该函数中进行引入类的php文件；如果实例化时，在本文件中找到该类的定义，则不触发__autoload函数。<br>

例子:<br>



        #Linux.php
        <?php
        
        class Linux{
            function __construct(){
                echo '<h1>'.__CLASS__.'</h1>';
            }
        }

        #test.php
        <?php
        function __autoload($classname){
            $classpath = "{$classname}.php";
            if(file_exists($classpath)){
                require_once($classpath);
            }else{
                echo $classpath.'not be found!';
            }
        }

        $a = new Linux();

运行test.php，输出"Linux"，运行到new Linux时，发现没有定义Linux类，触发__autoload函数，就会引进Linux.php文件然后实例化Linux类。<br>

spl_autoload_register函数的作用就是将自定义函数设置替换成__autoload函数，如果同时出现__autoload函数和spl_autoload_register函数，会以spl_autoload_register为准。<br>

将test.php改成如下：<br>

        #test.php
        <?php
        function myLoad($classname){
            $classpath = "{$classname}.php";
            if(file_exists($classpath)){
                require_once($classpath);
            }else{
                echo $classpath."not be found!";
            }
        }

        spl_autoload_register("myLoad");

        $a = new Linux();

运行test.php，输出"Linux"，运行new Linux时，发现没有定义Linux类，触发由spl_autoload_register注册的myLoad函数，在函数中引进Linux.php文件然后实例化。<br>

注意：spl_autoload_register函数的参数如果是数组，传入数组的话，分两种：一种是静态方法回调，一种是对象方法回调。对象方法回调：<br>

        spl_autoload_register(array($this, 'loadClass'), true, $prepend);

调用本类的$this->loadClass()方法，如果loadClass是静态方法，把$this换成当前类的名字以字符串形式传递就行，或者这么写：<br>

        spl_autoload_register('MyClass::loadClass', true, $prepend);

当要调用的方法不存在或权限不足时，会自动调用__call()方法。应用示例：<br>

        public function __call(){
            $module = $this->getModule();
            if($module){
                return $module;
            }else{
                return parent::__call();
            }
        }