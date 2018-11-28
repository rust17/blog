---
title: "翻译 —— 使用 Laravel 和 Vue.js 制作一个留言板"
layout: post
date: 2018-11-27 21:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: blog
author: circle
description: 翻译文章 —— 使用 Laravel 和 Vue.js 制作一个留言板
---

### 介绍

[Scotch.io](https://scotch.io) 的读者们，再次欢迎回来，今天我们将学习创建一个留言板。

> ### 内容清单
> 1. [介绍][1]
> 2. [安装 Laravel][2]
> 3. [数据库配置][3]
> 4. [模型与数据迁移][4]
> 5. [模型工厂][5]
> 6. [路由与控制器][6]
> 7. [创建变形器][7]
> 8. [使用 Postman 终端测试][8]
> 9. [前端搭建][9]
> 10. [使用 Laravel 预设][10]
> 11. [Vue.js 组件][11]
> 12. [显示所有的签名][12]
> 13. [签署留言板][13]
> 14. [结语][14]

看起来很酷，对不对？

你将学到的不仅仅是如何搭建一个留言板还有一些关于 Laravel 和 Vue.js 的知识：

* Laravel 5.5 的模型工厂结构
* 使用 Postman 进行终端测试以及导出结果以供团队成员使用
* Laravel 5.5 的预设功能
* Laravel 5.5 的变形器
* 创建以及使用 Vue.js 组件
* 在 Laravel 当中使用 Axios 进行 Ajax 请求

### 安装 Laravel

安装 Laravel 只需要简单地在你的电脑上执行执行以下命令，cd 到你的 www 目录然后执行：

```shell
composer create-project --prefer-dist laravel/laravel guestbook
```

在这之后，你需要创建一个配置文件将你的域名指向 public 这个目录（我的域名是 [http://guestbook.dev](http://guestbook.dev)）

---  
原文地址：[https://scotch.io/tutorials/build-a-guestbook-with-laravel-and-vuejs](https://scotch.io/tutorials/build-a-guestbook-with-laravel-and-vuejs)

作者：[Rachid Laasri](https://scotch.io/@RachidLaasri)

---

[1]: #介绍
[2]: #安装-laravel
[3]: #数据库配置
[4]: #模型与数据迁移
[5]: #模型工厂
[6]: #路由与控制器
[7]: #创建变形器
[8]: #使用-postman-终端测试
[9]: #前端搭建
[10]: #使用-laravel-预设
[11]: #vue.js-组件
[12]: #显示所有的签名
[13]: #签署留言板
[14]: #结语
