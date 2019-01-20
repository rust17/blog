---
title: "翻译 —— 构建一个 Laravel 翻译包（连接前端）"
layout: post
date: 2018-12-16 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', 'first']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第四部分
---

在[上一部分](https://laravel-news.com/wrangling-translations)，我们讲解了通过特定的方式将翻译资料转变成我们应用程序的语言文件，现在我们就来跟这些文件进行交互。在本文章中，我们将建立前端界面，并希望通过该界面帮助用户管理翻译资料。

UI 界面将会使用社区里最受欢迎的 [Tailwind CSS](https://tailwindcss.com/) 和 [Vue.js](https://vuejs.org/)。

### 途径

不管是喜欢还是讨厌，我将 [Caleb Porzio](https://twitter.com/calebporzio) 一书 《[拥抱后端](https://www.youtube.com/watch?v=uQO4Xh1gMpY)》中的一些观点带到这个扩展包中。在他的演讲中，Caleb 提出了这样一个概念：将重心从使用 javascript 构建单页应用中转移，包括检索所有数据以及路由和表单提交等功能。相反，他建议将 Laravel 的优势充分发挥到制作跨平台通用的方法。从中获取灵感，我们将借助我们的控制器和 blade 视图传输数据给 Vue.js 组件，以实现必要的动态功能。[Laravel Mix](https://laravel.com/docs/5.7/mix) 将用于构建和编译包组件。

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
原文地址：[https://laravel-news.com/laravel-translation-package-frontend](https://laravel-news.com/laravel-translation-package-frontend)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---
