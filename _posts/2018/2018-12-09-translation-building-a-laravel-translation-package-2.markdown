---
title: "翻译 —— 构建一个 Laravel 翻译包（构建脚手架）"
layout: post
date: 2018-12-09 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', '2018']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第二部分
---

在[第一部分](https://laravel-news.com/building-laravel-translation-package/)当中，我们介绍了这一系列将会涵盖构建和维护一个开源 Laravel 扩展包的过程。可以查看一下我们为什么要构建这个系列的概述。接下来，我们将着手使用脚手架的方式搭建我们扩展包。

### 以脚手架的方式构建项目

当你开始构建一个扩展包，无论是什么类型的 PHP，第一件事肯定是建立一个仓库，以及最重要的 composer 文件。事实上，构建 Composer 包没有一种标准的途径；不过，我会以我的方式引导你。

我更倾向于使用 [Installer](https://laravel.com/docs/5.7/installation#installing-laravel) 安装一个新版本的 Laravel 项目。使用 Laravel Installer 进行构建给予我一个闪亮的工作环境。

在新安装的 Laravel 项目根目录下，我新建了一个 `packages` 文件夹。在这个文件夹下，我又新建了一个用于最终存放代码的文件夹，这样项目的结构与 GitHub 仓库就一模一样了，本例子中，项目结构是 `joedixon/laravel-translation`。

在项目根目录下，我运行 `git init` 建立版本库。接着，我运行 `composer init` 根据引导提示新建了 `composer.json` 文件，用于管理后边可能用到的 [Packagist](https://packagist.org/) 依赖包。

下一步，在项目根目录下我新建了 `src` 文件夹，用于存放我们的所有业务逻辑代码。

在 composer.json 文件下，我新添加了一个 PSR4 配置，目的是告诉 Composer 如何自动加载我的包：

```
"autoload": {
    "psr-4": {
        "Joedixon\\Translation\\": "src"
    }
},
```

最后，在编写第一行代码之前，我还修改了项目根目录下的 `composer.json` 文件，目的是告诉 Composer 如何加载我的程序。

```
"require": {
    ...
    "joedixon/laravel-translation": "dev-mastar"
},
"repositories": [
    {
        "type": "path",
        "url": "./packages/joedixon/laravel-translation",
        "options": {
            "symlink": true
        }
    }
]
```
也许你对于 `require` 部分已经是相当熟悉了。然而，`repositories` 部分不是。

repositories 部分的作用是告诉 Composer 链接到本地路径。使用这种方式允许我们本地测试我们的扩展包的时候不需要使用 `composer update` 来同步更新。

当使用本地路径的时候，值得注意的是，扩展包可以安装在任意目录下。然而，我更喜欢将它包含在开发环境目录当中。

现在，我们的扩展包经过配置后已经可以自动加载了，我们可以敲代码了。

### 包结构

当构建一个扩展包的时候，我总是希望尽可能的与 Laravel 的目录结构相同。因此，我会将一些 `app` 目录下典型的文件夹如 controllers，console commands，event listeners 等等，搬到我的扩展包目录 `src` 下，这样路由以及资源文件就位于我的包根目录下了。

### 服务提供者

为了让 Laravel 开始使用我们的扩展包，我们需要新建一个[服务提供者](https://laravel.com/docs/5.7/providers)。服务提供者的作用是通过一些引导操作如：绑定服务到容器，注册路由，发表配置文件以及任何其它的你可想象到的操作来加载扩展包。

提示:

通常，我会运行 `php artisan make:provider TranslationServiceProvider` 命令来新建一个位于 Laravel Providers 目录下的服务提供者文件。然后移动到我的扩展包里，同时有根据性地更新命名空间。

这一部分，我将注册路由，配置信息，视图文件以及翻译等内容，不必充实所有细节。我发现这种方式可以加快开发速度。

### 测试

好的扩展包不可能没有单元测试。

在扩展包中构建单元测试是一件棘手的事情。主要原因在扩展包内访问 Laravel 的测试助手不是一件容易的事。幸运的是，`orchestra/testbench` 这个扩展包可以帮助你实现在扩展包内部访问 Laravel 所有的测试助手方法。

执行 `composer require --dev orchestra/testbench` 以 dev 依赖的方式安装。执行完此命令后会在你的 `composer.json` 文件中添加以下配置：

```json
"require-dev": {
    "orchestra/testbench": "~3.0"
}
```

在结束本部分之前，让我们来提交改动并合并到 `master` 分支：

```shell
# within ./packages/joedixon/laravel-translation
echo "vendor/" >> .gitignore
git add. 
git commit -m "Initial Commit"
```

这部分主要是关于打包扩展包脚手架。下一部分，我们将创建一些扩展包的功能，从构建基于文件的翻译驱动开始。

---
原文地址：[https://laravel-news.com/scaffolding-a-package](https://laravel-news.com/scaffolding-a-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


