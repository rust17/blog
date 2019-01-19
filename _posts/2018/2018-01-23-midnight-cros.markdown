---
layout: post
category: ['blog', '2018']
title:  "记录一次折腾到深夜的跨域经历"
tags: [阅读,人生]
---
### 跨域
背景：项目中需要配合别人开发，对方通过调用接口的形式将数据同步到我们的系统，在这个过程中，遇到了对方数据发不过来的情况，然而我用fildder调用自己的接口确没这个问题，经过沟通，得知对方是在浏览器里发送ajax请求发不过来，这里整理一下。<!-- more -->

跨域的现象①：No 'Access-Control-Allow-Origin' header is present on the requested resource,并且status 200 ok
这种情况，服务器后台允许OPTIONS请求，并且接口也允许了OPTIONS请求，但是头部匹配时出现了不匹配现象。

解决办法：在服务器程序中添加   
   header('Access-Control-Allow-Origin: xxx.com');      
   header('Access-Control-Allow-Credentials:true');      
   header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');   

主要表示允许哪个域名访问，切记不要写通配符*，不然也会报错，允许的请求的包header信息。

跨域的现象②：No 'Access-Control-Allow-Origin' header is present on the requested resource,并且The response had HTTP status code 404
这种情况，本次ajax请求时“非简单请求”，请求前会发送一次预见请求(OPTIONS)，服务器端后台接口没有允许OPTIONS请求，导致无法找到对应接口地址。

解决办法：配置Apache web 服务器(httpd.conf)

原始代码

    AllowOverride none
    Require all denied

改为以下代码

    Options FollowSymLinks
    AllowOverride none
    Order deny,allow
    Allow from all
