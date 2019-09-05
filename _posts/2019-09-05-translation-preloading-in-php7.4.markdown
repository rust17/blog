---
title: "[译] —— PHP 7.4 中的预加载"
layout: post
date: 2019-09-05 16:00
headerImage: false
tag:
- preloading
- php 7.4
category: blog
hidden: true
author: circle
description: preloading in php 7.4
---

PHP 7.4 添加了预加载支持，这是一个可以显著提升你的代码性能的功能。

简而言之，这就是预加载：

* 为了提前加载一些文件，你需要写一个 PHP 脚本
* 服务器启动后该脚本立马被执行
* 所有的预加载文件放到内存当中等待所有的请求
* 源文件代码改动对预加载没有影响，除非服务器重启

让我们来深入了解一番。

---

原文地址：[https://stitcher.io/blog/preloading-in-php-74](https://stitcher.io/blog/preloading-in-php-74)

---
