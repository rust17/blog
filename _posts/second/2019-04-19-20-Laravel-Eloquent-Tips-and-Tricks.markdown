---
title: "[译] —— 二十个 Laravel Eloquent 使用小技巧"
layout: post
date: 2019-04-19 19:30
headerImage: false
tag:
- translation
- laravel
- eloquent
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 介绍一些 Laravel Eloquent 的使用技巧
---

Eloquent ORM 看起来像一个简单的机制，但是表面之下，有许多未暴露的方法以及不知名的方式，使用这些方法可以用来实现更强大的功能。在这篇文章里，我将向你展示一些使用技巧。

### 1. 自增和自减

与其这样：

```php
$article = Article::find($article_id);
$article->read_count++;
$article->save();
```

不如这样：

```php
$article = Article::find($article_id);
$article->increment('read_count');
```

这样也可以：

```php
Article::find($article_id)->increment('read_count');
Article::find($article_id)->increment('read_count', 10); // +10
Product::find($product_id)->increment('stock'); // -1
```

### 2. XorY 方法

Eloquent 有好几个包含了两个方法的函数，例如“执行 X，不然就执行 Y”。

**例子 1** - findOrFail():

与其这样：

```php
$user = User::find($id);
if (!$user) { abort (404); }
``` 

不如这样：

```php
$user = User::findOrFail($id);
```

**例子 2** - firstOrCreate():

与其这样：

```php
$user = User::where('email', $email)->first();
if (!$user) {
    User::create([
        'email' => $email
    ]);
}
```

只需要这样：

```php
$user = User::firstOrCreate(['email' => $email]);
```

---
原文地址：[https://laravel-news.com/eloquent-tips-tricks](https://laravel-news.com/eloquent-tips-tricks)

作者：[POVILASKOROP](https://laravel-news.com/@povilaskorop)

---
