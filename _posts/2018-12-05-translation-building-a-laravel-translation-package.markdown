---
title: "翻译 —— 构建一个 Laravel 翻译包"
layout: post
date: 2018-12-05 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: blog
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包
---

## 第一部分

---
### 介绍

在接下来的多部分篇幅当中，我们将介绍使用 Laravel 构建以及维护一个开源包的过程。在这当中，我们将尽我们所能涵盖从自动加载包解决第一个问题、拉与请求等内容。

### 我们将构建什么

在这个系列中，我们将构建一个翻译包以完善 Laravel 自带的本地化功能。

Laravel 的本地化机制允许你的应用程序切换多个语言环境以及根据需要切换自定义翻译内容。处理各种语言环境分为三个步骤：

1. 将内容从模板里取出移动到以 JSON 或者 PHP 数组格式存储的文件中。
2. 使用 Laravel 的翻译检索方法标记模板文件里的内容。
3. 在 `app.php` 文件当中为应用程序设置当前的语言环境。

想象一下，你希望同时使用英语和西班牙语内容，以及希望使用 JSON 格式的语言文件。于是在 `resources/lang` 目录下新建一个 `en.json` 文件和一个 `es.json` 文件。

在每个文件里，新建一个对象然后添加一个键值。

```json
// en.json
{
    "hello": "hello"
}
```

```json
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
## 第二部分
---
在[第一部分](https://laravel-news.com/building-laravel-translation-package/)当中，我们介绍了这一系列将会涵盖构建和维护一个开源 Laravel 扩展包的过程。可以查看一下我们为什么要构建这个系列的概述。接下来，我们将着手使用脚手架的方式搭建我们扩展包。

### 以脚手架的方式构建项目

当你开始构建一个扩展包，无论是什么类型的 PHP，第一件事肯定是建立一个仓库，以及最重要的 composer 文件。事实上，构建 Composer 包没有一种标准的途径；不过，我会以我的方式引导你。

我更倾向于使用 [Installer](https://laravel.com/docs/5.7/installation#installing-laravel) 安装一个新版本的 Laravel 项目。使用 Laravel Installer 进行构建给予我一个闪亮的工作环境。

在新安装的 Laravel 项目根目录下，我新建了一个 `packages` 文件夹。在这个文件夹下，我又新建了一个用于最终存放代码的文件夹，这样项目的结构与 GitHub 仓库就一模一样了，本例子中，项目结构是 `joedixon/laravel-translation`。

在项目根目录下，我运行 `git init` 建立版本库。接着，我运行 `composer init` 根据引导提示新建了 `composer.json` 文件，用于管理后边可能用到的 [Packagist](https://packagist.org/) 依赖包。

下一步，在项目根目录下我新建了 `src` 文件夹，用于存放我们的所有业务逻辑代码。

在 composer.json 文件下，我新添加了一个 PSR4 配置，目的是告诉 Composer 如何自动加载我的包：

```json
"autoload": {
    "psr-4": {
        "Joedixon\\Translation\\": "src"
    }
},
```

最后，在编写第一行代码之前，我还修改了项目根目录下的 `composer.json` 文件，目的是告诉 Composer 如何加载我的程序。

```json
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

---  
原文地址：[https://laravel-news.com/building-laravel-translation-package](https://laravel-news.com/building-laravel-translation-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


