---
title: "翻译 —— 理解 Laravel 的管道方式"
layout: post
date: 2018-11-10 09:00
headerImage: false
tag:
- translation
- laravel
category: ['blog', '2018']
author: circle
description: 翻译文章 —— Laravel 代码解析
---

基本上，通过使用 laravel 的管道方式，你可以在几个类之间以一种流畅的方式传递对象以实现任何类型的任务，在所有任务一旦被完成之后返回结果。

> 你可以在这里学到更多的 [laravel 的管道方式](https://laracasts.com/series/whip-monstrous-code-into-shape/episodes/14)

关于管道方式的工作原理最显著的例子就是框架自身使用最多的组件 —— 中间件。

> 中间件提供了一种方便的机制用于过滤经过你的应用的 HTTP 请求......

中间件是长的这个样子的：

```
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

中间件实际上只是通过管道的方式传递请求，目的是为了执行必要的任务。比如你可以检查请求是否是一个 HTTP 请求，是否是一个 JSON 请求，是否存在用户的认证信息等等。

如果你看一下 `\Illuminate\Foundation\Http\Kernel` 这个类，你就会发现中间件是如何被一个 `Pipeline` 类的实例执行的。

```
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

思考下这样的场景。假如你正在搭建一个论坛，用户可以产生进程以及留下评论。但是你的客户要求你每当有内容产生的时候自动移除或者修改相关的标签。

因此这些事你需要做的：

1. 用原始文本替换掉链接标签
2. 使用 * 符号替换掉恶意词汇
3. 将 script 标签从文本中移除

你可能会新建一些类来处理这些任务。

```
$pipes = [
	RemoveBadWords::class,
	ReplaceLinkTags::class,
	RemoveScriptTags::class
];
```

然后将指定的"内容"传递给其中一个任务处理，之后将处理结果传递给下一个任务。我们可以使用管道的方式实现一样的效果。

```
<?php

public function create(Request $request)
{
	$pipes = [
		RemoveBadWords::class,
		ReplaceLinkTags::class,
		RemoveScriptTags::class
	];

	$post = app(Pipeline::class)
		->send($request->content)
		->through($pipes)
		->then(function ($content) {
			return Post::create(['content' => 'content']);
		});

	// return any type of response
}
```

每个“任务”类应该有一个“处理”方法来执行动作。也许定一个每个类都有一个方法来实施的“锲约”会是一个不错的主意：

```
<?php

namespace App;

use Closure;

interface Pipe
{
	public function handle($content, Closure $next);
}
```

*命名什么的最痛苦了¯\_(ツ)_/¯*

```
<?php

namespace App;

use Closure;

class RemoveBadWords implements Pipe
{
	public function handle($content, Closure $next)
	{
		// 你可以在这里处理任务以及将处理过的内容交给下一个管道

		return $next($content);
	}
}
```

处理任务的方法应该接收两个参数，第一个是可传递的对象，第二个是一个闭包，这个闭包的作用是在执行完最后一个管道方法后将处理好的对象重定向到指定的地方。

你可以自定义方法名称替代 "handle"，然后你需要指定被管道执行的方法名称，就好像这样子

```
app(Pipeline::class)
	->send($content)
	->through($pipes)
	->via(`自定义的方法名称`) // <--- 这里 ：）
	->then(function ($content) {
		return Post::create(['content' => $content]);
	});
```

### 最后是什么结果？

最后，传递的内容被每一个 `$pipe` 依次处理，处理过后的内容将被存储。

```
$post = app(Pipeline::class)
	->send($request->all())
	->through($pipes)
	->then(function ($content) {
		return Post::create(['content' => $content]);
	});
``` 

### 结语

记住，有很多方法可以实现这种管道方式，想用哪一种取决于你自己。但是在你的武器库里新增一项工具以备不时之需总归是一件好事。

我希望这个例子可以帮助你更好的理解所谓的 "laravel 的管道"是如何运行的。

如果你想了解更多这方面的知识，你可以看看 laravel 的文档

[https://laravel.com/api/5.4/Illuminate/Pipeline/Pipeline.html](https://laravel.com/api/5.4/Illuminate/Pipeline/Pipeline.html)

### 在哪里使用？

这就需要你自己慢慢发现了......如果你有任何建议请告知我。😉

[jeff 的 Twiter](https://twitter.com/Jeffer_8a)

---  
原文地址：[https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351](https://medium.com/@jeffochoa/understanding-laravel-pipelines-a7191f75c351)

作者：[Jeff](https://medium.com/@jeffochoa)

---

