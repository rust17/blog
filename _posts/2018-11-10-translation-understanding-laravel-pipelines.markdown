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
 * 
 * @参数 \Illuminate\Http\Request $request
 * @返回值 \Illuminate\Http\Response
 */
 protected function sendRequestThroughRouter($request)
 {
 	$this->app->instance('request', $request);

 	Facade::clearResoledInstance('request');

 	$this->bootstrap();

 	return (new Pipeline($this->app))
 					->send($request)
 					->through($this->app->shouldSkipMiddleware() ? [] : $this->middleware)
 					->then($this->dispatchToRouter());
 }
```

从这段代码当中，你可以看到，一个 `pipeline` 实例发送请求经过一些 `middleware` 然后分发到 `router`。

如果这一段代码看不懂也不要紧，让我们尝试着通过以下几个例子解释清楚这个概念。

### 处理一个需要运行多个任务的类

思考下这样的场景。假如你正在搭建一个论坛，用户可以产生进程以及留下评论。但是你的客户要求你每当有内容产生的时候自动移除或者修改标签。

因此这些事你需要做的：

1. 用原始文本替换掉链接标签
2. 使用 * 符号替换掉恶意词汇
3. 将 script 标签从文本中移除

你可能会新建一些类来处理这些任务。

```php
$pipes = [
	RemoveBadWords::class,
	ReplaceLinkTags::class,
	RemoveScriptTags::class
];
```

---  
原文地址：[https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351](https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351)

---

