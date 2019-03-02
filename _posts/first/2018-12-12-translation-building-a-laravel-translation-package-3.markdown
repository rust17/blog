---
title: "[译] —— 构建一个 Laravel 翻译包（扯扯翻译）"
layout: post
date: 2018-12-12 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', 'first']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第三部分
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
原文地址：[https://laravel-news.com/wrangling-translations](https://laravel-news.com/wrangling-translations)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


