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

为了让扩展包的使用者能有效地管理扩展依赖，提供合适的版本号就显得很重要。

通常管理代码版本的途径是遵循[语义化版本控制](https://semver.org/)。该协议定义了一系列的“规则和要求来指示如何分配和新增版本号”。从该网站中，我们可以了解到：

1. 当你做了一些不兼容旧版本 API 的修改时，需要发布一个 MAJOR 版本
2. 当你新增了一些兼容旧版本的功能时，需要发布一个 MINOR 版本
3. 当你做了一些兼容旧版本的 bug 修复时，需要发布一个 PATCH 版本

并且根据 `MAJOR.MINOR.PATCH` 的格式进行扩展，我们还可以给预发布版本添加标签和构建元数据。

如果你感兴趣，你可以在该网站找到语义化版本控制的完整定义。

通常，决定首次发布的版本号可能会有点困难，最近，我在 Twitter 上还看到一个关于这方面的有趣的讨论。

语义化版本控制建议，如果你正在使用生产环境的扩展包，你应该直接使用 1.0.0，但是如果还不能在生产环境使用，那么你的包就还处于开发阶段，首次发布的版本就应该是 0.1.0。

其实有许多方式可以给发布的版本打标签。这篇文章当中，我将介绍通常在 GitHub 上是怎样做的。

首先，在你仓库的根目录下，找到并点击 'Release' 按钮，它应该位于 'Draft a new release' 附近。

然后，在 'Tag version' 字段输入框里输入你希望的版本号数字，选择你希望关联的目标，可以关联到某个分支或者某个 commit。当然，你也可以输入一个适当的标题作为版本号，一般而言，我使用数字。

你还可以输入一些发布记录，这样就可以让使用者们知道哪些地方改变了，甚至还可以感谢那些作出贡献的开发者们。

### 提交到 Packagist

现在，为了让使用者们可以通过使用 Composer 轻松安装扩展包，通常采用的方式是发布到 [Packagist](https://packagist.org/)。

为了实现这一点，你需要登录 Packagist 账号然后点击主菜单中的 'Submit' 按钮。根据提示输入你的 git 仓库地址。

Packagist 将从你的项目中寻找 composer.json 文件，获取相关信息然后发布扩展包到扩展包库里，以备使用者们进行下载。同时，Packagist 还将为扩招包自动生成一个界面，界面会展示一些信息，例如：下载量、版本号和最新动态。

### 总结

伴随着扩展包的成功发布，并且已经准备好提供给用户使用，这一系列的文章也已经即将结束。

现在，我们可以开始处理一些别的事务了：发布新的版本，解决用户提的问题，决定是否采取其它用户提交的代码合并。

我非常希望你能享受这一系列的文章，并且能得到一些有用的知识。和往常一样，如果你有任何问题，请到 [Twitter](https://twitter.com/_joedixon) 与我联系。

---
原文地址：[https://laravel-news.com/building-a-laravel-translation-package-launching-the-package](https://laravel-news.com/building-a-laravel-translation-package-launching-the-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


