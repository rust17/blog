---
title: "[译] —— PHP 7.4 中的预加载"
layout: post
date: 2019-09-05 16:00
headerImage: false
tag:
- preloading
- php 7.4
category: blog
hidden: false
author: circle
description: preloading in php 7.4
---

PHP 7.4 添加了预加载支持，这是一个可以显著提升你的代码性能的功能。

简而言之，这就是预加载：

* 为了提前加载一些文件，你需要写一个 PHP 脚本
* 服务器启动后该脚本立马被执行
* 所有的预加载文件放到内存当中等待所有的请求
* 源文件代码改动对预加载没有影响，除非服务器重启

让我们来深入了解一番。

## 不只是 Opcache

当预加载在构建最顶层缓存 opcache 的时候，有点不太一样。Opcache 会将你的 PHP 源文件编译成 "opcodes"，并且将它们存放到磁盘上。

你可以认为 "opcodes" 就是底层代码，可以在执行的时候轻松地被解读。因此 opcache 跳过了从源代码到运行时底层代码的翻译阶段。一个巨大的进步！

但是，其实还有很大的操作空间。Opcache 缓存的文件不知道其他文件。如果你使用 `A` 类继承 `B` 类，依旧需要在运行时将它们连接到一块。更进一步，opcache 扮演了检查源文件是否被修改过的角色，并且决定是否清除该缓存。

因此这里就是预加载介入的地方了：它不仅仅将文件编译成 opcodes，而且连接有关联的类，traits 以及接口。它将“编译过的”可执行 blob —— 就是可以被 PHP 编译器执行的代码 —— 保存在内存中。

当一个请求到达服务器，就可以使用早已存储在内存中的那部分代码库，而不需要任何的上层的执行。

因此，我们是在讨论哪“部分代码库”呢？

## 练习预加载

为了让预加载工作，你，也就是开发者，必须告诉服务器加载哪些文件。这其实用一个简单的 PHP 脚本就能实现，所以不必担心。

规则很简单：

* 提供一个预加载脚本并使用 `opcache.preload` 连接到 php.ini 文件。

* 包含在预加载脚本当中的每一个预加载 PHP 文件都必须经过 `opcache_compile_file()` 函数处理。

假设你希望预加载一个框架，比如 Laravel。你的脚本必须循环遍历所有在 `vendor/laravel` 目录下的文件，并且一个个 include 进来。

这就是将脚本连接到 php.ini 的方法：

```
opcache.preload=/path/to/project/preload.php
```

以下是一个脚本的例子：

```php
$files = /* 一个包含所有你希望预加载文件的数组 */;

foreach ($files as $file) {
    opcache_compile_file($file);
}
```

需要注意的是你也可以使用 `include` 替代 `opcache_compile_file`。尽管这貌似是一个 [bug][1]，因为当这样写的时候并不生效。

## 警告：不能预加载无关联的类

但是，有一点，请注意！为了使文件能预加载，它们的依赖 —— 接口，traits 以及 父类 —— 必须可以被预加载。

如果类的依赖关系有任何问题，你都将在服务启动时注意到：

```
Can't preload unlinked class
Illuminate\Database\Query\JoinClause:
Unknown parent
Illuminate\Database\Query\Builder
```

可以看到，`opcache_compile_file()` 只会解析一个文件，但并不会执行它。这也就意味着吐过一个类有未加载的依赖，这个类也不会被预加载。

这不是一个致命问题，你的服务器依然会正常工作；但是你将不能预加载所有希望加载的文件。

这就是为什么你应该注意哪些文件需要预加载，为了确保所有的依赖都能被解析。因为这个很大程度上像是一件苦差事，所以自热人们更热衷早已实现的自动加载方案。

## Composer 支持

现在最流行的自动加载方案是采用 composer，已经被大多数现代化 PHP 项目所采用。

开发者只需在 `composer.json` 中添加一个预加载配置参数，就可以为你自动生成一个预加载脚本！就好像预加载一样，该功能仍然还在实现中，但是你可以在[这里][2]看到进展。

幸运的是，你不需要手动配置预加载文件如果你不想，composer 将会自动帮你实现。

## 服务器要求

还有两个重要的地方要提一下，是关于 devops 运维需要注意的地方。

你早已知道为了实现预加载必须在 php.ini 中指定一个入口。这就意味着如果你正在使用共享主机，你将不能随性所欲地配置 PHP。

在实践中，你必须有一个专用（虚拟）服务器来对单个项目预加载进行优化。所以请记住这点。

同时请记住，每次希望重新加载进内存文件中时，你还需要重启服务器（其实重启 `php-fpm` 就够了）。这对于大多数人来说有点奇怪，但是仍旧值得一提。

## 性能

现在最重要的问题来了：预加载真的提升性能了吗？

答案当然是肯定的：Ben Morel 分享了一些 benchmarks 压测结果，可以在同一个 [composer issue][3] 链接当中找到。

有趣的是，你可以决定仅仅预加载“热门类”:指的是在你的代码当中那些经常使用到的类。Ben 的 benchmarks 压测结果显示仅仅加载了 100 个热门类，实际产生的效果比预加载所有文件更好。性能大约提升了 13% 到 17%。

哪些文件应该被预加载却决于你的项目实现的过程。一开始应该尽可能简单地预加载尽可能多的文件。如果你实际上只需要小幅度性能提升，你应该在代码运行的过程中监控它。

所有的这些实现过程都应该被自动化，并且可能将来会实现。

目前，需要记住的一点是 composer 将添加支持，因此你不需要手动书写预加载脚本，并且这个功能在你的服务器上实现非常简单，前提是你可以完全控制它。

---

一旦 PHP 7.4 到来，你会使用预加载功能吗？在读完这篇文章之后，你有没有评论或者想法？通过我的 [Twitter][4] 或者[邮件][5] 让我知道吧。

---

原文地址：[https://stitcher.io/blog/preloading-in-php-74](https://stitcher.io/blog/preloading-in-php-74)

作者：[brendt][4]

---

[1]: https://bugs.php.net/bug.php?id=78240
[2]: https://github.com/composer/composer/issues/7777
[3]: https://github.com/composer/composer/issues/7777#issuecomment-440268416
[4]: https://twitter.com/brendt_gd
[5]: mailto:brendt@stitcher.io
