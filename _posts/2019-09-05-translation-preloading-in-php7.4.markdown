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

## 不只是 Opcache

当预加载在构建最顶层缓存 opcache 的时候，有点不太一样。Opcache 会将你的 PHP 源文件编译成 "opcodes"，并且将它们存放到磁盘上。

你可以认为 "opcodes" 就是底层代码，可以在执行的时候轻松地被解读。因此 opcache 跳过了从源代码到运行时底层代码的翻译阶段。一个巨大的进步！

但是，其实还有很大的操作空间。Opcache 缓存的文件不知道其他文件。如果你使用 `A` 类继承 `B` 类，依旧需要在运行时将它们连接到一块。更进一步，opcache 扮演了检查源文件是否被修改过的角色，并且决定是否清除该缓存。

因此这里就是预加载介入的地方了：它不仅仅将文件编译成 opcodes，而且连接有关联的类，traits 以及接口。它将“编译过的”可执行 blob —— 就是可以被 PHP 编译器执行的代码 —— 保存在内存中。

当一个请求到达服务器，就可以使用早已存储在内存中的那部分代码库，而不需要任何的上层的执行。

因此，我们是在讨论哪“部分代码库”呢？

---

原文地址：[https://stitcher.io/blog/preloading-in-php-74](https://stitcher.io/blog/preloading-in-php-74)

---
