---
title: "[译] —— 展望 PHP 7.4 中令人兴奋的新特性"
layout: post
date: 2019-08-25 10:00
headerImage: false
tag:
- php
- php 7.4
category: blog
hidden: false
author: circle
description: php 7.4 features
---

在 PHP 7 之后，PHP 7.4 版本将于 2019 年，11 月 28 号发布。没有 alpha 或者 beta 版本，PHP 7.4 将直接发布成市面上的通用版本。

该版本的新特性当中最令人激动的部分无疑是将使得 [PHP 网站开发][1] 更加可靠和快速。

尽管早已得知 PHP 8 对于 PHP 而言将是一个真正的里程碑版本，但是距离发布还有相当长的时间。

接下来我们将聚焦于一些你将会使用到的 PHP 7.4 新特性。

## 构造函数 & 违约器

让我们来看一看传入的值是怎样被初始化的。如果规定了值是标量类型，那么可以为其提供默认值：

```php
class Foo
{
    public int $bar = 4;
    public ?string $baz = null;
    public array $list = [1,2,3];
}
```

如果是可为空类型你可以使用 "null" 来作为默认值。当然，这个理解起来很简单，但是该默认参数也带来了一些意料之外的行为表现，其中就包括了下面这个例子：

```php
function passNull(int $i = null)
{/*...*/}

passNull(null);
```

幸运的是，这种特殊情况的传入属性是不被允许的。对于 "object" 或者类类型也是一样，这样是不可能获取默认值的。如果需要设置这些属性的默认值，你可以使用构造函数。使用构造函数来初始化传入的值是很直观的：

```php
class Foo
{
    private int $a;
    public function __construct(int $a)
    {
        $this->a = $a;
    }
}
```

然而，你需要确保在构造函数之外为未初始化的属性初始化是有效的。未初始化检查将会在读取属性的时候执行。

## 未初始化


下面的代码是不是有效的？

```php
class Foo
{
    public int $bar;
}
$foo = new Foo;
```

即使 "$bar" 的默认值不是整型，当在实例化 "Foo" 之后 "$bar" 被访问时 PHP 将报告一个错误信息：

```php
var_dump($foo->bar);
Fatal Error: Uncaught Error: Typed propety Foo::$bar must not be accessed before initialization
```

如你所见，多了一种"状态变量"叫未初始化。如果 "$bar" 不包含任何值，那么它的值就是 "null"。这使得不管是确认设置的属性是否可为空或者是否可遗忘都不可能。这是因为 PHP 7.4 将引入新的变量 "uninitialised"。

### 让我们看一下关于未初始化变量的一些关键点：

* 读取未初始化的变量将会显示一个致命错误信息。
* 你可以在未初始化属性中创建对象，如果属性的类型不可为空，当访问属性的时候将被校验。
* 在读取之前，你可以声明一个未初始化的属性。
* unset 掉一个无类型的属性将值设置为 "null" 但是 unset 掉一个已声明的类型属性，值将会成为 "uninitialised"。

你可以从下面的代码得知：在创建对象之后为无类型和未初始化的属性赋值都是可以的：

```php
class Foo
{
    public int $a;
}
$foo = new Foo;
$foo->a = 1;
```

在赋值的时候已经完成了类型检查，只有在读取属性值的时候，才会分析未初始化的状态。这样确保了最终属性的值不会是无效的类型。

## 继承 & 类型变动

不管 PHP 7.4 有没有改善类型变动，类型属性仍然保持相同，即不变。

---

原文地址：[https://www.qltech.com.au/develop/php-development/exciting-features-look-forward-php-7-4/](https://www.qltech.com.au/develop/php-development/exciting-features-look-forward-php-7-4/)

作者：[QL Tech](https://www.qltech.com.au/author/admin/)

---

[1]: [https://www.qltech.com.au/php-development/]
