---
title: "翻译 —— 构建一个 Laravel 翻译包（处理遗漏的翻译键）"
layout: post
date: 2018-12-24 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', '2018']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第六部分
---

在该系列的[上一篇文章](https://laravel-news.com/building-a-laravel-translation-package-building-the-frontend)当中，我们介绍了构建前端的管理工具。在这篇文章当中，我们将注意力从前端移走，并开始构建后端的另一个功能。

在 Laravel 翻译管理应用里面最令人沮丧的事情是忘记了添加翻译到相应的语言文件里。在页面上呈现的不是既当前语言的翻译也不是默认语言的翻译，这是不可取的。

为了避免这个问题，Laravel 应用程序为翻译扩展包提供了一个方式——通过扫描整个项目检查所有的语言翻译文件找出没有翻译到的语言。

我们通过 [Laravel translation retrieval](https://laravel.com/docs/5.6/localization#retrieving-translation-strings)(例如__()，trans()) 中的方法实例递归查询所有配置文件规定的文件以实现扫描的过程。这些方法使用了一些正则表达式来捕获或者从翻译的字符串中提取。这些字符串可以用来和已有的翻译对比看看是否已经存在需不需要一些新的字符串。

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
原文地址：[https://laravel-news.com/building-a-laravel-translation-package-handling-missing-translation-keys](https://laravel-news.com/building-a-laravel-translation-package-handling-missing-translation-keys)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


