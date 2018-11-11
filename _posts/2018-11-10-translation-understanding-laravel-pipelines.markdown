---
title: "翻译文章 —— 理解 Laravel 中的管道途径"
layout: post
date: 2018-11-10 09:00
headerImage: false
tag:
- translation
- laravel
category: blog
author: circle
description: 翻译文章 —— Laravel 代码解析
---

基本上，通过使用 laravel 的管道方式，你可以在几个类之间以一种流畅的方式传递对象以实现任何种类的任务以及最后一旦在所有任务都被完成之后返回结果值。

> 你可以在这里学到更多的 [laravel 管道方式](https://laracasts.com/series/whip-monstrous-code-into-shape/episodes/14)

关于管道方式是如何工作的最显著的例子莫过于这个框架自身使用最多的组件 —— 中间件。

> 中间件提供了一种方便的机制用于过滤对你的应用发起的 HTTP 请求......

中间件长的是这个样子的：

```php
<?php

namespace App\Http\Middleware;

use Closure;

class TestMiddleware
{
	/**
	 * 处理一个请求
	 * 
	 * @参数 \Illuminate\Http\Request $request
	 * @参数 \Closure $next
	 * @返回值 mixed
	 */
	 public function handle($request, Closure $next)
	 {
	 	// 你可以在这里书写你的代码

	 	return $next($request);
	 }
}
```

这种中间件实质上只是通过管道发送请求的地方，目的是为了执行必要的任务。比如你可以检查请求是否是一个 HTTP 请求，是否是一个 JSON 请求，是否存在用户的认证信息等等。

如果你看一下 `\Illuminate\Foundation\Http\Kernel` 这个类，你就会发现中间件是如何被一个 `Pipeline` 类的实例执行的。

```php
/**
 * 通过中间件或者路由发送发送特定的请求

```

---  
原文地址：[https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351](https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351)

---

