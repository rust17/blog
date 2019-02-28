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

然而，关于[这个命名](https://www.brandonsavage.net/lets-talk-about-facades/)，PHP 社区存在着许多争论。一些人认为这个术语应该改变以避免开发者的疑惑，因为它并没有完全遵循门面模式实行。如果你对这个命名感到迷惑了，你可以以自己的方式随意去理解，不过请注意，我们将要使用的基类在 Laravel 框架当中被称作门面。

### 在 Laravel 当中门面模式是怎样实现的

你可能知道，Laravel 容器内的每一个服务都有唯一的名字。在一个 Laravel 应用中，我们想要直接访问容器内的服务，可以使用 `App::make()` 方法或者 `app()` 帮助函数。

```php
<?php 

App::make('some_service')->methodName();
```

正如之前所说，Laravel 使用了门面类使得开发者可以以一种更加可读的方式访问服务。通过使用门面类，我们只需要写以下代码就可以做相同的事情。

```php
//...
someService::methodName();
//...
```

在 Laravel 当中，所有的服务都有一个门面类。这些门面类继承了 `Illuminae/Support` 内的门面基类。类唯一需要做的事情就是实现 `getFacadeAccesor` 方法，该方法返回了容器内的服务名称。

在上面的代码中，`someService` 指的就是门面类。`methodName` 实际上就是容器内的原始服务。如果我们脱离了 Laravel 的上下文来看待这个写法，这意味着有一个叫 `someService` 的类暴露了一个名字叫 `methodName()` 的静态方法，但这并不是 Laravel 实现这个接口的原理。在下一部分，我们将会看到表面之下的 Laravel 门面基类是如何工作的。

---
原文地址：[https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/](https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/)

作者：[Reza Lavarian](https://www.sitepoint.com/author/mrezalav/)

---


