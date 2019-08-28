---
title: "[译] —— 使用命令行检查 PHP 语法"
layout: post
date: 2019-08-27 10:00
headerImage: false
tag:
- php
- command line
- syntax
category: blog
hidden: false
author: circle
description: use php command line check syntax
---

PHP 的命令行模式(CLI)包含了一个巧妙的参数可用于快速检查文件源代码的语法错误。一个简单的例子如下。检查的选项参数是 -l (小写的 'L')。

```php
$ php -l example.php
```

如果文件没有包含语法错误，该命令会返回如下信息。

```
No syntax errors detected in example.php
```

如果文件当中存在一个错误，CLI 命令会根据错误内容的上下文返回错误信息。

```
Parse error: syntax error, unexpected '$dom' (T_VARIABLE) in example.php on line 6
Errors parsing example.php
```

在当前目录下，我们还可以使用 BASH shell 命令批量检查 PHP 文件。

```php
$ for i in *.php; do php -l $i; done
```

该命令会便利当前目录下所有的 PHP 文件，检查其中的语法错误并返回相应信息。

在 Windows 上，你可以在 command 界面使用下面的命令做同样的事情。假设你的 command 工具已经定位到了 PHP 文件所在的目录。

```
c:\localhost\test\> for %x in (*.php) do @php -l "%x"
```

除了返回错误信息，该命令还会返回一个退出代码：'-1' 代表检查到了错误，'0' 代表没有发现错误。如果你希望通过 shell 脚本或者其他的 PHP 程序测试代码，这将变得非常有用。

---

原文地址：[https://www.codediesel.com/php/check-php-syntax-from-the-command-line/](https://www.codediesel.com/php/check-php-syntax-from-the-command-line/)

作者：[sameer](https://www.codediesel.com/author/admin/)

---
