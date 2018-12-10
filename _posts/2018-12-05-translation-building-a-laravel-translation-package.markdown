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

## 第一部分 —— 基础介绍

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
## 第二部分 —— 构建脚手架
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
## 第三部分 —— 扯扯翻译
---
正如我们[之前](https://laravel-news.com/scaffolding-a-package/)讨论的那样，Laravel 的翻译资料是存放在扩展包之外的文件里的。它们的存储方式可以是 PHP 数组或者 JSON 文件。

Laravel 翻译扩展包与这些文件进行交互的目的是：

* 列出所有的语言
* 添加新的语言
* 列出所有的翻译资料
* 新增翻译资料
* 修改现有的翻译资料

我计划将这个包制作成大多数 Laravel 的功能一样，公开多个驱动程序以支持翻译管理。第一个驱动将利用 Laravel 现有的基于文件的转换，并计划稍后添加数据库驱动。明确这一点后，我们首先定义一个锲约，驱动将实现这个契约以确保所有需要的方法对于包来说是可用的。

文件驱动需要跟文件系统交互以确保返回的数据符号要求格式。这里面包含了大量的过滤，映射和迭代，因此我们将在 Laravel 的[集合](https://laravel.com/docs/5.7/collections)文档中学到很多。

### 列出所有的语言

需要获得一个语言的集合，我们使用文件系统函数从语言配置文件中获取一个文件夹目录数组，并打包放在一个集合中。

```php
$directories = Collection::make($this->disk->directories($this->languageFilesPath));
```

接下来，我们将使用 `mapWithKeys` 方法遍历所有的目录，从路径中抽取语言（这一部分在最后）然后返回一个键值对数组。

```php
return $directories->mapWithKeys(function ($directory) {
    $language = basename($directory);
    return [$language => $language];
})
```

返回的结果结构是这样的：

```json
// $this->allLanguages()->toArray()
[
    'en' => 'en',
    'fr' => 'fr',
    'es' => 'es',
];
```

### 添加新的语言

如果要新添加一种语言，我们需要新增一个文件夹目录以及一个 JSON 文件来配置语言路径，文件我们使用新加的语言名字来命名。

```php
$this->disk->makeDirectory("{$this->languageFilesPath}/$language");

if (! $this->disk->exists("{$this->languageFilesPath}/{$language}.json")) {
    $this->disk->put(
        "$this->languageFilesPath/$language.json",
        json_encode((object) [], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
    );
}
```

然后，我们使用文件系统函数来将这个文件添加到用语言命名的文件夹下，这个文件中存放着一个空的 JSON 加密数组。

使用常量 JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT 是为了确保生成的 JSON 符合正确的格式。

### 列出所有的翻译资料

当列出全部翻译资料的时候，我们希望区分多个（数组的方式）与单个（JSON 的方式）。

*多个*

为了获取多个翻译资料，我们首先使用文件系统函数来从语言命名的文件夹下获取所有文件。

```php
$groups Collection($this->disk->allFiles("{$this->languageFilePath}/{$language}"))
```

然后，我们遍历所有从该文件夹中取出的文件使用文件系统函数 `getRequire` 获取直接访问文件的地址。

```php
$group->mapWithKeys(function ($group) {
    return [$group->getBasename('.php') => $this->disk->getRequire($group->getPathname())];
});
```

返回的结果大概是这样：

```json
[
    'auth' => [
        'failed' => 'These credentials do not match our records',
    ],
]
```

*单个*

我们可以通过 `json_decode` 方法解密文件内容从而获取单个翻译资料。

```php
if ($this->disk->exists($this->languageFilesPath."/$language.json")) {
    return new Collection(json_decode($this->disk->get($singlePath), true));
}
```

结果大概是这个样子：

```json
[
    'hello' => 'hello',
]
```

### 新增/修改翻译资料

新增和修改翻译资料大多数时候都是相似的。首先，我们获取文件内容，并以数组格式添加到翻译资料中。然后，我们检查数组的键是否已经存在。如果已存在，我们就更新对应数组的值，如果不存在，就在数组中新增一个键值对。最后，将整个数组写进文件中。

*多个*

```php
$translations = $this->getGroupTranslationsFor($language);
$values = $translations->get($group);
$values[$key] = $value;
$translations->put($group, $values);
$this->disk->put(
    "{$this->languageFilePath}/{$language}/{$group}.php",
    "<?php\n\nreturn ".var_export($translations, true). ';'.\PHP_EOL
);
```

*单个*

```php
$translations = $this->getSingleTranslationsFor($language);
$translations->put($key, $value);
$this->disk->put(
    "{$this->languageFilePath}/$language.json",
    json_encode((object) $translations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);
```

为了凸显效果一些代码片段已经被截断。你可以在下方的链接看到完整的代码：

[驱动接口](https://github.com/joedixon/laravel-translation/blob/master/src/Drivers/DriverInterface.php)
[文件驱动](https://github.com/joedixon/laravel-translation/blob/master/src/Drivers/File.php)

这个驱动奠定了我们可以建立的基础。接下来，我们将为扩展包新建用户接口。它使用了 [Tailwind CSS](https://tailwindcss.com/) 和 [Vue.js](https://vuejs.org/)，这两个框架都已被 Laravel 社区广泛地使用了。 

---
## 第四部分——连接前端

在[上一部分](https://laravel-news.com/wrangling-translations)，我们谈到了通过将翻译资料以特定的方式转变成应用程序的语言文件，现在我们就来跟这些文件进行交互。在这篇文章中，我们将建立前端界面，并准备通过该界面帮助用户管理翻译资料。

UI 界面将会使用社区里最受欢迎的 [Tailwind CSS](https://tailwindcss.com/) 和 [Vue.js](https://vuejs.org/)。

### 途径

不管喜欢还是讨厌，我将 [Caleb Porzio](https://twitter.com/calebporzio) 的一本书 《[拥抱后端](https://www.youtube.com/watch?v=uQO4Xh1gMpY)》中的一些观点带到这个扩展包中。在他的演讲中，Caleb 提出了这样一个概念：将重点转移到使用 javascript 构建单页应用，包括负责检索所有数据以及路由和表单提交等功能。相反，他建议将 Laravel 的优势用于制作多平台通用的方法。从中获取灵感，我们将借助我们的控制器和 blade 视图传输数据给 Vue.js 组件，以实现必要的动态功能。[Laravel Mix](https://laravel.com/docs/5.7/mix) 将用于构建和编译包的组件。

### 路由

一开始，我们得告诉 Laravel 从哪儿加载我们的路由。一个方法就是在我们的扩展包的 `TranslationServiceProvider` 文件中使用 loadRoutesForm 方法。这个方法继承于父类 `Illuminate\Support\ServiceProvider`。

```php
$this->loadRoutesFrom(__DIR__.'/../routes/web.php');
```

这就允许了我们将所有包内的路由定义在一个文件，就好像你在 Laravel 应用程序中使用路由一样。

```php
Route::group(config('translation.route_group_config') + ['namespace' => 'JoeDixon\\Translation\\Http\\Controllers'], function ($router) {

    $router->get(config('translation.ui_url'), 'LanguageController@index')
        ->name('languages.index');

    $router->get(config('translation.ui_url').'/{$language}/translations', 'LanguageController@index')
        ->name('languages.translations.index');

    ...
});
```

在这个文件当中，我们使用了 `Route::group()` 方法来引入任何自定义的配置，以及扩展包内部的控制器的命名空间。

另外一个需要注意的地方是，配置被再用于根据用户需要动态地注册路由。如果引用的是默认的配置，`ui_url` 被设置为 `languages`。因此，以上路由将注册成下列方式：

```
my-app.test/languages
my-app.test/languages/{language}/translations
```

在这个文件里，主要定义了列举，新增以及修改语言和对应翻译的路由。

### 控制器

在服务提供者里面没有引入控制器。但只要能在定义路由的文件里找到对应的命名空间，一切就会正常执行。

在每个控制器里，我们在[之前的文章](https://laravel-news.com/wrangling-translations)中提到的翻译驱动，对于每个方法都是需要的。因此，我们在构造函数中注入它。

```php
public function __construct(Translation $translation)
{
    $this->translation = $translation;
}
```

现在，先不管驱动，这个功能现在暂时是微不足道的，因为我们已经构建了一些和翻译资料交互的功能。

```php
public function index(Request $reqeust)
{
    $languages = $this->translation->allLanguages();

    return view('translation::languages.index', compact('languages'));
}
```

现在唯一看起来还没做的就是视图文件的引入了。`translation::` 只是简单地告诉 Laravel 从翻译扩展包的命名空间中加载视图文件，Laravel 已经知道了服务提供者。我们接下来将介绍这方面的东西。

### 视图

首先，我们需要告诉 Laravel 去哪儿加载路由。

```php
$this->loadViewsFrom(__DIR__.'/../resources/views', 'translation');
```

通过在扩展包服务提供者中的 `boot` 方法中加载 `loadViewsFrom` 方法，Laravel 就会知道我们的路由应该从 `translation` 命名空间下加载 `/package/root/resources/views`。使用命名空间降低了扩展包和不同包甚至主应用程序的视图文件冲突。

```php
$this->publishes([
    __DIR__.'/../resources/views' => resource_path('views/vendor/translation'),
]);
```

上面那行代码告诉 Laravel 去哪找视图文件、复制到哪里以及包的使用者是否希望把它们加入应用程序当中。

在这个例子中，应该从 `/package/root/resources/views` 路径复制资源到 `views/vendor/translation` 路径，也就是主应用程序的[资源路径](https://laravel.com/docs/5.7/helpers#method-resource-path)下。

一般而言，这就一来包的使用者就可以根据自己需求自定义改变视图了。

### 资源

为了保持我的理智，我喜欢用 [Laravel Mix](https://laravel-mix.com/) 来为扩展包构建前端资源。它提供了一种很棒的开发机制，可以让开发者快速上手进行开发。

我在项目根目录下运行 `npm init` 开始，根据指示搭建环境。

现在，已经可以通过执行命令 `npm install laravel-mix --save-dev` 来安装 Laravel Mix 了。这个命令会安装 Laravel Mix 以及安装所有的依赖并作为开发依赖记录到 `package.json` 文件中。

现在，我们需要拷贝 Mix 自带的 `webpack.mix.js` 文件到项目根目录下，这样一来就可以开始配置构建了。

```shell
cp node_modules/laravel-mix/setup/webpack.mix.js ./
```

#### CSS

接下来，我们将安装配置 CSS 框架 Tailwind，并整合到我们的扩展包中。通过执行 `npm install tailwindcss --save-dev` 获取依赖包。

依赖包安装好之后，我们可以开始配置安装了。首先，我们生成一个 Tailwind 配置文件。可以通过执行 `./node_modules/.bin/tailwind init tailwind.js` 来实现，`tailwind.js` 是将要生成的配置文件名称。这个文件允许你调整基色设置、字体和字体大小、宽和高等等。花点时间阅读 [Tailwind 的文档](https://tailwindcss.com/docs/configuration) 获取更多信息是值得的。然而，出于本教程的目的，我们将保持默认的设置。

最后，我们需要告诉 Laravel Mix 使用 Tailwind 配置作为构建的一部分运行 PortCSS。

我们第一步需要在 `webpack.mix.js` 中引入 Tailwind PortCSS

```js
var tailwindcss = require('tailwindcss');
```

然后作为构建管道的一部分，我们可以使用 Mix 的 `postCss` 方法，传入存储在上文提到的 `tailwindcss` 变量中导出函数来构建配置。

```js
mix.portCss('resources/assets/css/main.css', 'css', [
    tailwindcss('./tailwind.js'),
]);
```

这个方法的意思是，获取文件 `resources/assets/css/main.css` 的内容，应用 tailwind PortCSS 插件并输出到 `css` 目录。

现在，我们可以执行 `npm run dev|production|watch`，进程将自动运行。

#### Javascript

我们

---

---
原文地址：[https://laravel-news.com/building-laravel-translation-package](https://laravel-news.com/building-laravel-translation-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


