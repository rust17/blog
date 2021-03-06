---
title: "[译] —— 构建一个 Laravel 翻译包（基础介绍）"
layout: post
date: 2018-12-05 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: blog
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第一部分
---

### 介绍

在接下来的多部分篇幅当中，我们将介绍使用 Laravel 构建以及维护一个开源包的过程。在这当中，我们将尽我们所能涵盖从自动加载包解决第一个问题、git pull 与 requests 等内容。

### 我们将构建什么

在这个系列中，我们将构建一个翻译包以完善 Laravel 自带的本地化功能。

Laravel 的本地化机制允许你的应用程序切换多个语言环境以及根据需要切换自定义翻译内容。处理各种语言一般分为三个步骤：

1. 将内容从模板里取出移动到以 JSON 或者 PHP 数组格式存储的文件中。
2. 使用 Laravel 的翻译检索方法标记模板文件里的内容。
3. 在 `app.php` 文件当中为应用程序设置当前的语言环境。

想象一下，你希望同时使用英语和西班牙语内容，以及希望使用 JSON 格式的语言文件。于是在 `resources/lang` 目录下新建一个 `en.json` 文件和一个 `es.json` 文件。

在每个文件里，新建一个对象然后添加一个键值。

```
// en.json
{
    "hello": "hello"
}
```

```
// es.json
{
    "hello": "hola"
}
```

在模板里渲染，你只需要使用以下帮助方法：

```php
// some_file.blade.php
{ { __('hello') } }
```

现在如果你的 app.local 是设置成 `en`，将会渲染出 'hello'，如果是设置成 `es`，可以猜到，视图将渲染出 'hola'。

伴随着项目的日益增大，管理这些文件将会变得很困难，我们的扩展包可以帮助你处理这个难题。我们将构建一个功能，通过扫描你的项目找到缺失的翻译键并将这些缺失的翻译选项添加进语言文件当中。我们将在不同的语言环境中处理同步语言同时添加一个数据库驱动以支持不同的服务器环境。

我们将使用 [Tailwind CSS](https://tailwindcss.com/) 结合 [Vue.js](https://vuejs.org/) 来构建一个扩展包自带的翻译管理用户界面。

通过用户界面你可以在添加新的语言环境的同时添加新的、更新或者删除现有的翻译内容。

### 为什么我们要构建这个包？

我这样做出于两个原因。第一，语言管理是一个我的项目中很常见的需求。尽管现在已经有很好的扩展包了，但是并没有一个可以完全符合我的需求。

第二，我现在没有维护任何开源项目，但是这一直是我想做的事情。这个系列对我来说也是一个学习经验，同时我觉得将这个过程记录下来有助于帮助到其它有着相同需求的人。

我很兴奋可以开始这个系列，也很期待与你分享我的经历。如果在这个过程当中你有任何疑问或者建议，都可以随意在 [Twitter](https://twitter.com/_joedixon) 上跟我沟通。

接下来，我们准备开始第二部分——[利用脚手架搭建项目](https://laravel-news.com/scaffolding-a-package/)。

---
原文地址：[https://laravel-news.com/building-laravel-translation-package](https://laravel-news.com/building-laravel-translation-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


