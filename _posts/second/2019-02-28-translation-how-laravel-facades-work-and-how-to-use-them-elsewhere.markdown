---
title: "译 —— Laravel 门面模式是如果工作的以及在其它框架中如何使用"
layout: post
date: 2018-02-28 13:30
headerImage: false
tag:
- translation
- laravel
- facade
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 介绍了 Laravel 的门面模式以及如何移植到别的框架中
---

门面模式是一种常用的面向对象软件设计模式。实际上，一个门面就是指一个通过封装功能复杂的类库并提供简单易读接口的类。门面模式也可以用于为复杂和糟糕设计 API 提供统一的、精心设计的 API。

Laravel 框架当中有一个特性类似于这种模式，也被称作门面。在这篇教程我们将学到如何将 Laravel 的门面模式带到别的框架。在此之前，你需要对 [Ioc 容器](https://www.sitepoint.com/inversion-of-control-the-hollywood-principle/)有一点基本的理解。

首先，让我们看看 Laravel 门面的内部工作部分，然后，我们将讨论如何将这个特性改写适配到别的框架中。

### Laravel 中的门面模式

Laravel 的一个门面，是指一个提供了类似静态接口访问容器内部服务的类。根据官方文档的说明，这些门面，作为访问容器服务的底层实现提供了一个代理途径。

---
原文地址：[https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/](https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/)

作者：[Reza Lavarian](https://www.sitepoint.com/author/mrezalav/)

---


