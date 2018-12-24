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

接下来，我们将使用 `mapWithKeys` 方法遍历所有的目录，从路径中抽取语言名字（这一部分在最后）然后返回一个键值对数组。

```php
return $directories->mapWithKeys(function ($directory) {
    $language = basename($directory);
    return [$language => $language];
})
```

返回的结果结构是这样的：

```
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

为了获取多个翻译版本，我们首先使用文件系统函数来从我们使用语言命名的文件夹下获取所有文件。

```php
$groups Collection($this->disk->allFiles("{$this->languageFilePath}/{$language}"))
```

然后，我们遍历从该文件夹中取出的所有文件，使用文件系统函数 `getRequire` 获取直接访问该文件的地址。

```php
$group->mapWithKeys(function ($group) {
    return [$group->getBasename('.php') => $this->disk->getRequire($group->getPathname())];
});
```

返回的结果大概是这样：

```
[
    'auth' => [
        'failed' => 'These credentials do not match our records',
    ],
]
```

*单个*

我们可以通过 `json_decode` 方法解码文件内容从而获取单个翻译版本。

```php
if ($this->disk->exists($this->languageFilesPath."/$language.json")) {
    return new Collection(json_decode($this->disk->get($singlePath), true));
}
```

结果大概是这个样子：

```
[
    'hello' => 'hello',
]
```

### 新增/修改翻译资料

新增和修改翻译资料大多数时候都是相似的。首先，我们获取文件内容，并将内容（也就是翻译资料）以数组格式保存。然后，我们检查数组的键是否已经存在。如果已存在，我们就更新对应数组的值，如果不存在，就在数组中新增一个键值对。最后，将整个数组写进文件中。

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

为了凸显思路一些代码片段已经被截断。你可以在下方的链接看到完整的代码：

[驱动接口](https://github.com/joedixon/laravel-translation/blob/master/src/Drivers/DriverInterface.php)

[文件驱动](https://github.com/joedixon/laravel-translation/blob/master/src/Drivers/File.php)

这个驱动为我们奠定了将要构建扩展的包的基础。接下来，我们将为扩展包新建用户界面。将使用了 [Tailwind CSS](https://tailwindcss.com/) 和 [Vue.js](https://vuejs.org/)，这两个框架都已被 Laravel 社区广泛地使用了。 

---
## 第四部分 —— 连接前端
---
在[上一部分](https://laravel-news.com/wrangling-translations)，我们讲解了通过特定的方式将翻译资料转变成我们应用程序的语言文件，现在我们就来跟这些文件进行交互。在本文章中，我们将建立前端界面，并希望通过该界面帮助用户管理翻译资料。

UI 界面将会使用社区里最受欢迎的 [Tailwind CSS](https://tailwindcss.com/) 和 [Vue.js](https://vuejs.org/)。

### 途径

不管是喜欢还是讨厌，我将 [Caleb Porzio](https://twitter.com/calebporzio) 的一本书 《[拥抱后端](https://www.youtube.com/watch?v=uQO4Xh1gMpY)》中的一些观点带到这个扩展包中。在他的演讲中，Caleb 提出了这样一个概念：将重心从使用 javascript 构建单页应用中转移，包括检索所有数据以及路由和表单提交等功能。相反，他建议将 Laravel 的优势充分发挥到制作跨平台通用的方法。从中获取灵感，我们将借助我们的控制器和 blade 视图传输数据给 Vue.js 组件，以实现必要的动态功能。[Laravel Mix](https://laravel.com/docs/5.7/mix) 将用于构建和编译包组件。

### 路由

一开始，我们得告诉 Laravel 从哪加载我们的路由。一个方法就是在我们的扩展包的服务提供者文件 `TranslationServiceProvider` 中使用 loadRoutesForm 方法。这个方法继承于父类 `Illuminate\Support\ServiceProvider`。

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

另外一个需要注意的地方是，当用户需要动态注册路由时，这个配置将被再次利用。如果引用的是默认的配置，`ui_url` 被设置为 `languages`。因此，以上路由将注册成下列方式：

```
my-app.test/languages
my-app.test/languages/{language}/translations
```

在这个文件里，主要定义了列举，新增以及修改语言和对应翻译的路由。

### 控制器

在服务提供者里面没有引入需要的控制器。但只要能在路由文件里找到对应的命名空间，一切就会正常执行。

在每个控制器里，我们在[之前的文章](https://laravel-news.com/wrangling-translations)中提到的翻译驱动，对于每个方法都是需要的。因此，我们在构造函数中注入它。

```php
public function __construct(Translation $translation)
{
    $this->translation = $translation;
}
```

现在，先不管驱动，这个功能现在暂时是微不足道的，因为我们已经构建了一些与翻译资料有关的交互功能。

```php
public function index(Request $reqeust)
{
    $languages = $this->translation->allLanguages();

    return view('translation::languages.index', compact('languages'));
}
```

现在唯一看起来还没做的就是视图文件的引入了。`translation::` 只是简单地告诉 Laravel 从翻译扩展包的命名空间中加载视图文件，Laravel 已经在服务提供者中定义好了该命名空间。我们接下来将介绍这方面的东西。

### 视图

首先，我们需要告诉 Laravel 去哪加载路由。

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

在这个例子中，资源将从 `/package/root/resources/views` 路径复制到 `views/vendor/translation` 路径下，也就是主应用程序的[资源路径](https://laravel.com/docs/5.7/helpers#method-resource-path)下。

一般而言，这就一来包的使用者就可以根据自己的需求自定义改变视图了。

### 资源

为了保持我的理智，我喜欢用 [Laravel Mix](https://laravel-mix.com/) 来为扩展包构建前端资源。它提供了一种很棒的开发机制，可以让开发者快速上手进行开发。

我在项目根目录下运行 `npm init` 开始，根据指示搭建环境。

现在，已经可以通过执行命令 `npm install laravel-mix --save-dev` 来安装 Laravel Mix 了。这个命令会安装 Laravel Mix 以及安装所有的依赖并记录到 `package.json` 文件中。

现在，我们需要拷贝 Mix 自带的 `webpack.mix.js` 文件到项目根目录下，这样一来就可以开始配置构建了。

```shell
cp node_modules/laravel-mix/setup/webpack.mix.js ./
```

#### CSS

接下来，我们将安装并配置 CSS 框架 Tailwind，并整合到我们的扩展包中。通过执行 `npm install tailwindcss --save-dev` 获取依赖包。

依赖包安装好之后，我们就可以开始配置了。首先，我们生成一个 Tailwind 配置文件。可以通过执行 `./node_modules/.bin/tailwind init tailwind.js` 来实现，`tailwind.js` 是将要生成的配置文件名称。这个文件允许你调整基调颜色、字样和字体大小、宽和高等等。值得花点时间阅读 [Tailwind 的文档](https://tailwindcss.com/docs/configuration) 以获取更多信息。然而，本教程由于边幅限制，我们将保持默认的设置。

最后，我们需要告诉 Laravel Mix 使用 Tailwind 相关的配置作为构建的一部分运行 PortCSS。

我们第一步需要在 `webpack.mix.js` 中引入 Tailwind PortCSS

```js
var tailwindcss = require('tailwindcss');
```

然后我们可以使用 Mix 的 `postCss` 方法，传入存储 `tailwindcss` 变量中引入的函数来构建配置。

```js
mix.portCss('resources/assets/css/main.css', 'css', [
    tailwindcss('./tailwind.js'),
]);
```

这个方法的意思是，获取文件 `resources/assets/css/main.css` 的内容，使用 tailwind PortCSS 插件输出到 `css` 文件夹下。

现在，我们可以执行 `npm run dev|production|watch`，进程将自动编译。

#### Javascript

我们将使用 Vue.js 开发 UI，因此需要获取这方面的依赖包。我们还需要使用到 ajax 功能所以安装流行的 [axios](https://github.com/axios/axios) 包来帮助我们处理繁重的任务。

```shell
npm install vue axios
``` 

#### 发布

以上，我们已经使用 Mix 构建好了资源并且放到 `css` 和 `js` 目录下，但是我们还需要告诉它在 `webpack.mix.js` 文件中如何找到这些资源。可以使用下面的方法。

```js
mix.setPublicPath('public/assets');
```

在一个标准的 Laravel 应用程序中，这些资源将被发布到一个公共的可访问的路径下。然而，在我们的扩展包的范围内，我们需要将其放到一个可以被轻松发布的路径，只需要执行 `php artisan publish` 即可。这个命令允许终端用户发布文件到应用程序，他们可以自由修改以及加上版本控制。

最后，我们需要告诉 Laravel 去哪找发布的文件。再一次，在服务提供者中添加

```php
$this->publishes([
    __DIR__.'/../public/assets' => public_path('vendor/translation'),
], 'assets');
```

第一个参数是一个数组，键代表着扩展包的资源路径，值代表着它们发布在应用程序中的位置。第二个参数是一个发布文件类型的定义标志。这样，在发布命令中提供一个选项，达到了提供给用户自由选择发布文件类型的目的。

*注意*

在开发的过程中，你可能不想每次改动过前端资源后，为了测试你的改动，都执行发布命令。为了减轻负担，修改 `mix.setPublicPath` 方法，将该路径改成从测试目录中加载资源的方式。然而，在发布之前别忘了将它改回来！解决这类问题一个很好的办法就是使用环境变量。

我们现在已经建立好了基础，初步搭建好了路由、控制器、视图，还需要构建用户操作界面的资源，我们将在下一部分介绍。

---
## 第五部分——构建前端
---
在[上一部分](https://laravel-news.com/laravel-translation-package-frontend)中，我告诉了你通过我的方式，将所有需要的东西放在一个地方开始构建前端。这篇文章将在上一篇文章的基础上完成用户界面。

### 用户操作界面可以做什么？

首先，我们需要定义任务的清单。用户操作界面的目的是什么以及允许用户做什么？有时候，通过这样的任务，限定范围可能具有挑战性。对我来说，幸运的是，这是我长期的需要，因此我有一个好办法最小化需求以解决我的问题：

* 列出所有的语言
* 新增语言
* 列出一种语言的所有翻译
* 切换不同语言的翻译
* 搜索的键和翻译
* 新增翻译
* 修改已有的翻译

正如我在上一篇文章中提到的那样，我很高兴可以使用 Laravel 后端来进行构建这个工具的繁重工作。你可能认为我这样做很老派，但是实际上我更喜欢页面加载的视觉显示因为这样可以让我知道某件事正在发生。唯一一个我不想看到页面加载的情况是修改现有的翻译的时候——如果这个工作在后台进行将会变得更优雅。

### 路由

基于上面的列举，看起来我们需要定义七个路由。

* GET /languages
* GET /languages/create
* POST /languages
* GET /languages/{language}/translations
* GET /languages/{language}/translations/create
* POST /languages/{languages}/translations
* POST /languages/{language}/translations

### 控制器

在控制器里，我们严重依赖于[先前文章](https://laravel-news.com/wrangling-translations)建立的类。事实上，我们将控制器的构造函数中注入 Laravel 的容器来解决这个问题。

```php
public function __construct(Translation $translation)
{
    $this->translation = $translation;
}
```

现在，在控制器里与翻译交互已经是一件相当简单的工作了。例如，获取一个语言的列表然后返回给视图就这么简单：

```php
public function index(Request $request)
{
    $languages = $this->translation->allLanguages();

    return view('translation::languages.index', compact('languages'));
}
```

*注意* 你可能注意到了上面不同寻常的视图路径包含了 `translation::`，这个是告诉 Laravel 根据在服务提供者中定义好的扩展包命名空间加载视图。

```php
$this->loadViewsFrom(__DIR__.'/../resources/views', 'translation');
```

这个控制器唯一复杂的方法是翻译的 index 方法，该方法复杂是因为我们不仅要列出所有的翻译也会根据搜索条件以及筛选条件列出符合条件的翻译资料。

```php
$translation = $this->translation->filterTranslationsFor($language, $request->get('filter'));

if ($request->get('group') === 'single') {
    $translations = $translations->get('single');
    $translations = new Collection(['single' => $translations]);
} else {
    $translations = $translations->get('group')->filter(function ($values, $group) use ($request) {
        return $group === $request->get('group');
    });
    $translations = new Collection(['group' => $translations]);
}

return view('translations::languages.translastions.index', compact('translations'));
```
这里，我们根据用户传递的搜索条件获取到了符合条件的翻译资料。然后决定是筛选 `单个` 还是 `多个`，然后根据性地返回数据集合给视图文件。

### 视图 & 资源

每个视图都继承自 `layout.blade.php` 视图文件，该文件包含了基本的 HTML 骨架以及通过 [Laravel Mix](https://laravel.com/docs/5.7/mix) 编译加载的 Javascript 和 CSS 资源链接。

#### 样式

对于没听过的人来说，Tailwind CSS 是一个效率第一的框架。 它提供了一些简易的类可用于有层次地制作复杂的页面设计。如果希望了解更多信息可以阅读[官方文档](https://tailwindcss.com/docs/what-is-tailwind/)，我是这样子使用 Tailwind 发挥其威力的。

Tailwind 自带的配置文件，其中设置好了颜色基调和默认字体。该文件规定了一些不错的默认设置，因此通常我不会去修改任何地方，除非我需要打上一些个人风格印记。

通常，我会将类实例运用到 HTML 组件上，直到它们看起来是我想要的样子。如果是一个我不需要复用的组件的话，我会经常把它们留在标签中。

```html
<div class="bg-red-lightest text-red-darker p-6 shadow-md" role="alert">
    <div class="flex justify-center">
        <p>{!! Session::get('error') !!}</p>
    </div>
</div>
```

然而，如果是一些我会在应用中复用的类的话。我会使用 Tailwind 的 `@apply` 标明以提取到公共组件类。

```html
// before 
<div class="p-4 text-lg border-b flex items-center font-thin">
    { {__('translation::languages.languages') } }
</div>

// after
.panel-header {
    @apply p-4 text-lg border-b flex items-center font-thin
}

<div class="panel-header">
    { {__('translation::languages.languages') } }
</div>
```

在[上一篇文章](https://laravel-news.com/laravel-translation-package-frontend)中，我解释了如何将 PortCSS 和 Tailwind 风格的 PortCSS 作为插件嵌入到 Laravel Mix 的编译管道中。当这个插件运行的时候，它将寻找项目中 `@apply` 标明的部分，从实例中抽取出并注入到所包含的类当中。

下面这张图展示了我用 Tailwind 创建的用户界面风格。

#### Javascript

正如前面提到的那样，在这个扩展包里面我们打算让后端参与许多繁重的工作。这样，我们就可以专注于使用 Javascript 来提升用户体验了。

翻译是一项烦人的工作，因此我们必须确保此扩展包对于我们的用户来说经可能地可靠，操作人性化。我能想到的一个使用 Javascript 帮助提升体验的地方就是当用户浏览翻译列表的时候自动保存内容。这个提升减少了一个额外不必要的点击按钮和一次页面刷新。为了进一步提升用户体验，我们将新建一个虚拟提示以让用户知道他们将要做出的改变。

我们将新建一个 Vue 组件叫做 `TranslationInput` 以实现该功能。

```js
export default {
    props: ['initialTranslation', 'language', 'group', 'translationKey', 'route'],

    data: function() {
        return {
            isActive: false,
            hasSaved: false,
            hasErrored: false,
            isLoading: false,
            hasChanged: false,
            translation: this.initialTranslation
        }
    },
    ....
}
```

在这里，我们定义的组件应该接收 `initialTranslation`、`language`、`group`、`translationKey` 和 `route` 作为无论什么时候都能用到的属性。这些属性提供了所有需要用到的数据，这些数据用于提供给保存翻译的 `update` 路由。

数据属性设置了一些组件的状态。需要指出的是我们设置了 `translation` 为 `initialTranslation` 传递给组件的值。

在组件模板里，我们把 `translation` 属性的值绑定到输入框。

```html
<textarea
    v-model="translation"
    v-bind:class="{ active: isActive }"
    v-on:focus="setActive"
    v-on:blur="storeTranslation"
></textarea>
```

另外，当数据对象里的 `isActive` 属性为真时，我们将输入框的类切换为已激活状态。当输入框聚焦的时候，`setActive` 方法监听着该属性的变化。

```js
setActive: function() {
    this.isActive = true;
},
```

当用户从输入框导航过来的时候，我们需要调用我们的 `update` 方法并将用户的修改过的数据发送。你可以在上面看到我们使用了 Vue 的 `v-on` 直接监听 `blur` 事件，同时调用了 `storeTranslation` 方法。下面是该方法的详细代码。

```js
storeTranslation: function () {
    this.isActive = false;
    this.isLoading = true;
    window.axios.put(`/${this.route}/${this.language}`, {
        language: this.language,
        group: this.group,
        key: this.translationKey,
        value: this.translation,
    }).then((response) => {
        this.hasSaved = true;
        this.isLoading = false;
        this.hasChanged = false;
    }).catch((error) => {
        this.hasErrored = true;
        this.isLoading = false;
    });
}
```

这里，我们使用了 [axios](https://github.com/axios/axios)，一个 Javascript 的 HTTP 客户端，发起一个对 `update` 路由的请求。我们使用了所有传递给组件的属性以生成 URL 然后根据这些数据生成用户想要的翻译。

我们依据请求的结果更新组件的状态并返回给用户一个操作是否成功的虚拟提示。我们通过渲染一个合适的 SVG 图标来实现。

```
<svg v-show="!isActive && isLoading">...</svg> // default state, pencil icon
<svg v-show="!isActive && hasSaved">...</svg> // success state, green check icon
<svg v-show="!isActive && hasErrored">...</svg> // error state, red cross icon
<svg v-show="!isActive && !hasSaved && !hasErrored && !isLoading">...</svg> // saving state, disk icon
```

在这篇文章当中，我们介绍了前端当中最重要的两个组件。我们制作了一个不仅美观而且功能强大的用户界面。

在下一部分当中，我们将构建一个可以扫描整个项目中可能会被遗漏的语言文件的功能。同时，如果你有任何问题，欢迎来 [Twitter](https://twitter.com/_joedixon) 向我提问。

---
## 第六部分 —— 处理遗漏的翻译键
---
在该系列的[上一篇文章](https://laravel-news.com/building-a-laravel-translation-package-building-the-frontend)当中，我们介绍了构建前端管理工具。在这篇文章当中，我们将注意力从前端移走，并开始构建另一个后端功能。

在 Laravel 翻译管理应用里面最令人沮丧的事情是忘记了添加翻译到相应的语言文件里。在页面上呈现的不是既当前语言的翻译也不是默认语言的翻译是不可取的。

为了避免这个问题，Laravel 应用程序为翻译扩展包提供了一个方式通过扫描整个项目检查所有的语言翻译文件中没有翻译到的语言。

我们通过 [Laravel translation retrieval](https://laravel.com/docs/5.6/localization#retrieving-translation-strings)(例如__()，trans()) 方法的实例递归查询所有配置好的文件夹下的所有文件以实现该过程的一部分。这些方法使用了一些指定的表达式来捕获或者从翻译的字符串中提取。这些字符串可以用来和已有的翻译对比看看是否已经存在需不需要一些新的字符串。

### 配置

在扩展包的配置项里，定义了两个键可以使得扫描更加灵活高效。

```
'translation_methods' => ['trans', '__']
```

`translation_methods` 参数允许用户提供一个数组是扫描仪用于查找密钥的翻译检索方法。

```
'scan_paths' => [app_path(), resource_path()]
```

`scan_paths` 键允许用户定义一个数组，放置将要进行扫描翻译键的目录。

当然，这里用户有可能使用 `base_path()` 进行整个项目的搜索。但是如果对整个项目进行搜索会严重影响扫描速度的。

### 履行

扫描功能由单个类处理。这个类接收一个 Laravel 的 `Illuminate\Filesystem\Filesystem` 实例，该实例用于横跨整个项目目录并与文件进行交互，携带了上文提到的翻译方法以及扫描路径。

该类包含了一个单一方法 `findTranslations`，负责取出任务。该方法使用以下特定的表达式，这些表达式受到了 [Barry vd](https://twitter.com/barryvdh)、[Heuvel 的 Laravel 翻译扩展包](https://github.com/barryvdh/laravel-translation-manager/blob/master/src/Manager.php#L160-L179) 以及 [Mohamed Said 的 Laravel 语言管理包](https://twitter.com/themsaid) 的影响。

```php
$matchingPattern = 
    '[^\w]'. // 不能以字母或下划线开头
    '?<!->'. // 不能以 -> 开头
    '('.implode('|', $this->translationMethods).')'. // 必须以其中的一个方法开始
    "\(". // 匹配括号开启标签
    "[\'\"]". // 匹配 " 或者 '
    '('. // 匹配一个组
    '.+'. // 必须以组开始
    ')'. // 括号关闭
    "[\'\"]". // 引号关闭
    "[\),]"; // 匹配模式结束或者开始新的匹配模式
```

该方法使用正则表达式递归迭代所提供目录中的所有文件，以查找所提供的翻译检索方法的实例，返回一个匹配的数组。

每个匹配当中，会执行一个额外检查决定是组翻译(php 数组风格)还是单个翻译(JSON 风格)。这是通过简单地匹配是否包含句点来实现的。如果是的话，在句点之前的都是文件，每一个句点后面的是键（例如，你可以通过从 `validation.php` 文件中获得的 `accepted` 键找到 `validation.accepted` 的翻译）。

在最后，我们定义了一个像下面这样的数组：

```
[
    'single' => [
        'Welcome' => 'Welcome'
    ],
    'group' => [
        'validation' => [
            'accepted' => 'The :attribute must be accepted.',
        ],
    ],
]
```

当然，这样做会为我们提供配置文件中找到的每个翻译，因此我们如何定义哪些是遗漏的呢？相当简单，我们现在已经将应用程序的所有翻译标记并放到一个数组里了，我们可以使用我们新建的[文件驱动](https://laravel-news.com/wrangling-translations)获取所有的翻译并以数组的格式存放到语言文件当中。

不仅如此，两个数组的格式都将是一样的，因此我们需要做的只是对比他们的差异。我们可以下结论的是，通过扫描应用程序收集的翻译数组中的任何内容如果没有在语言文件翻译中出现都需要被添加进相应的语言文件当中。

为了达到这样的目的，我们只需要简单地遍历所有遗漏的翻译然后使用早已在文件驱动中构建好的方法添加他们。

```php
$missingTranslations = $this->findMissingTranslations($language);

if (isset($missingTranslations['single'])) {
    foreach ($missingTranslations['single'] as $key => $value) {
        $this->addSingleTranslations($language, $key);
    }
}

if (isset($missingTranslations['group'])) {
    foreach ($missingTranslations['group'] as $group => $keys) {
        foreach ($keys as $key => $value) {
            $this->addGroupTranslation($language, "{$group}.{$key}");
        }
    }
}
```

通过这篇文章扩展包的基于文件的翻译功能就讲完啦。下一篇文章当中，我们将使用这个作为基础开始制作我们的数据库驱动应用程序。下一篇文章再见，和往常一样，如果你有任何问题，请到 [Twitter](https://twitter.com/_joedixon) 与我联系。

---
---
原文地址：[https://laravel-news.com/building-laravel-translation-package](https://laravel-news.com/building-laravel-translation-package)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


