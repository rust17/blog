---
title: "[译] —— 构建一个 Laravel 翻译包（发布扩展包）"
layout: post
date: 2019-01-19 17:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第八部分
---

在[预发布清单](https://laravel-news.com/building-a-laravel-translation-package-pre-launch-checklist)完成之后，是时候着手发布我们的扩展包并提供给别的开发者使用了。

现在的问题是，开发者们一般使用 [Composer](https://getcomposer.org/) 来管理项目中的扩展依赖。为了兼容 composer ，我们还需要做几件事情。

### 标记一个发布版本

为了让扩展包的使用者能有效的管理扩展依赖，提供合适的版本号就显得很重要。

管理代码版本的常用途径是遵循[语义化版本控制](https://semver.org/)。该协议定义了一系列“关于如何分配和新增版本号的规定”。从该网站中，我们可以知道：

1. 当你做了一些修改并且不兼容以前的 API 时，需要发布重大的版本，
2. 当你新增了一些向后兼容的功能时，需要发布次要的版本，
3. 当你做了一些向后兼容的 bug 修复时，需要发布补丁版本。

只要遵循 `重大版本.次级版本.补丁版本` 的格式，就可以开始给预发布版本添加标签和构建元数据。

如果你感兴趣，你可以在该网站找到语义版本控制的完整定义。

决定首次发布的版本号可能有点困难，我最近在 Twitter 上看到一个有趣的讨论。

根据语义化版本控制，如果你的扩展包可以在生产环境直接使用，你应该直接使用 1.0.0，如果还不能在生产环境使用，那么你的包就还处于开发阶段，首次发布的版本应该是 0.1.0。

有许多方式可以给发布的版本打标签。这篇文章当中，我将介绍在 GitHub 上是怎样进行版本控制的。

在你的项目根目录下，找到 'Draft a new release' 并点击附近的 'Release' 按钮。

然后，在 'Tag version' 字段里输入你想要的版本号数字，选择你想要关联的目标。你可以关联一个分支或者某个 commit。你也可以使用一个适当的标题作为版本号，一般而言，我使用数字。

你也可以输入一些发布信息，这样就可以让使用者知道哪些地方改变了，甚至可以感谢为你贡献的开发者。

### 提交到 Packagist

现在，为了允许使用者可以通过 Composer 轻松安装扩展包，通常采用的方式是发布到 [Packagist](https://packagist.org/)。

登录 Packagist 账号然后点击导航中的 'Submit' 按钮。根据提示输入你的 git 仓库地址。

Packagist 将从 composer.json 文件中获取相关信息然后发布一个扩展包，以备使用者下载。同时，Packagist 还将自动生成一个界面，界面会显示一些包的情况。例如：下载量、版本号和最新动态。

### 总结

伴随着包的发布，准备提供给用户使用，这一系列的文章也已经准备结束。

现在，我们可以开始处理一些别的事务如：发布新的扩展包版本，解决用户提的问题，是否采取其它用户提交的代码合并。

我非常希望你能享受这系列文章，并且伴随着学习的过程得到一些有用的知识。和往常一样，如果你有任何问题，请到 [Twitter](https://twitter.com/_joedixon) 与我联系。

---
原文地址：[https://laravel-news.com/building-a-laravel-translation-package-launching-the-package](https://laravel-news.com/building-a-laravel-translation-package-launching-the-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


