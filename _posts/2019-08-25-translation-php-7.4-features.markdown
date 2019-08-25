---
title: "[译] —— 展望 PHP 7.4 中令人兴奋的新特性"
layout: post
date: 2019-08-25 10:00
headerImage: false
tag:
- php
- php 7.4
category: blog
hidden: true
author: circle
description: php 7.4 features
---

在 PHP 7 之后，PHP 7.4 版本将于 2019 年，11 月 28 号发布。没有 alpha 或者 beta 版本，PHP 7.4 将直接发布成市面上的通用版本。

该版本的新特性当中最令人激动的部分使得 [PHP 网站开发][1] 更加可靠和快速了。

尽管早已得知 PHP 8 对于 PHP 而言将会是一个真正的里程碑版本，但是距离发布还有相当长的时间。

接下来我们将聚焦于一些你将会使用到的 PHP 7.4 新特性。

## 构造函数 & 违约器

我们来看一看传入的值是怎样被初始化的。如果规定了值是标量类型，那么可以为其提供默认值：

```php
class Foo
{
    public int $bar = 4;
    public ?string $baz = null;
    public array $list = [1,2,3];
}
```

如果是可为空类型你可以使用 "null" 来作为默认值。当然，这个理解起来很简单，但是默认为空的参数也带来了一些意料之外的影响，其中就包括了下面这个例子：

```php
function passNull(int $i = null)
{/*...*/}

passNull(null);
```

幸运的是，这种特殊情况的传入属性是不被允许的。对于 "object" 类型或者 "class" 类型也是一样，这样是不可能获取默认值的。如果需要设置这些属性的默认值，你可以使用构造函数。使用构造函数来初始化传值是很直观的：

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

尽管 "$bar" 的默认值不是整型，当在实例化 "Foo" 之后 "$bar" 被访问时 PHP 将报告一个错误信息：

```php
var_dump($foo->bar);
Fatal Error: Uncaught Error: Typed propety Foo::$bar must not be accessed before initialization
```

如你所见，多了一种"状态变量"叫未初始化。如果 "$bar" 不包含任何值，那么它的值就是 "null"。这使得不管是确认设置的属性是否可为空或者遗忘掉赋值都不可能。这是因为 PHP 7.4 将引入新的变量 "uninitialised"。

### 让我们看一下关于未初始化变量的一些关键点：

* 读取未初始化的变量将会显示一个致命错误信息。
* 你可以在未初始化属性之前创建对象，如果属性的类型不可为空，当访问属性的时候将被校验。
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

## 继承 & 类型差异

不管 PHP 7.4 有没有改善类型差异，类型属性仍然保持相同，即不变。为了更好地解释，请看下面的代码：

```php
class A {}
class B extends A {}
class Foo
{
    public A $prop;
}
class Bar extends Foo
{
    public B $prop;
}
Fatal error: Type of Bar::$prop must be A (as in class Foo)
```

如果没看懂上面的例子也不要紧，来看一看下面这个例子：

```php
class Foo
{
    public self $prop;
}
class Bar extends Foo
{
    public self $prop;
}
```

[新版本的 php][2] 在执行代码之前会在后台将当前代码中的 "self" 替换成子类。解决办法是下面这样：

```php
class Foo
{
    public Foo $prop;
}
class Bar extends Foo
{
    public Foo $prop;
}
```

如果我们讨论继承，你很难提出有更好的用例来替代继承属性的类型。

对于每个内部继承属性都可能发生改变是很奇怪的特性。然而，只有当属性的访问修饰符从“私有”变成“受保护”或者“公有”时，这一切才有可能。

### 来看一下下面的合法的代码：

```php
class Foo
{
    private int $prop;
}
class Bar extends Foo
{
    public string $prop;
}
```

但是，新版本的 PHP 7.4 中改变类型将类型从可为空转变为不可为空或者反之都是不被允许的。

```php
class Foo
{
    public int $a;
    public ?int $b;
}
class Bar extends Foo
{
    public ?int $a;
    public int $b;
}
Fatal error: Type of Bar::$a must be int (as in class Foo)
```

## 类型

让我们来看看什么可以传入以及以何种方式传入。然而，需要确保传入的属性在当前类下是可行的。为了标记它们可行，需要在它们前面加上访问修饰符或者关键字 “var”。

在 PHP 7.4 当中，几乎每一种类型都可以被排除在 "void" 和 "callable" 之外。"void" 是指缺少一个值，明确指出不能确定类型的任意值。跟 "callable" 类似，似乎更细微。

下列代码显示了一个在 PHP 中的 "callable" 类型：

```php
class Foo
{
    public callable $callable;
    public function __construct(callable $callable)
    {/*...*/}
}
class Bar
{
    public Foo $foo;
    public function __construct()
    {
        $this->foo = new Foo([$this, 'method'])
    }
    private function method()
    {/*...*/}
}
$bar = new Bar;
($bar->foo->callable)();
```

在这，"callable" 是一个私有的 "Bar::method"，虽然根据上下文它是指 "Foo"。由于这个问题，PHP 7.4 并没有支持 "callable"。

然而，这并不是什么大问题，因为"闭包"早已引入到 PHP 当中，所以根据上下文当需要的时候将调用 "$this"。

### 一些在 PHP 7.4 中可用的类型：

* int
* float
* bool
* array
* string
* iterable
* object
* self & parent
* ?(nullable)
* Classes & interfaces

## 严格类型 & 限制

PHP [动态编程语言][3] 的特点被许多开发者喜欢或者讨厌。如果在传递一个字符串给一个希望得到整型的函数，现在的 PHP 会通过自动转换类型来实现：

```php
function coerce(int $i)
{/*...*/}
coerce('1'); // 1
```

同样的规则也适用于类型属性。看一下下面的代码，将字符串 '1' 转成了整型 1。

```php
class Bar
{
    public int $i;
}
$bar = new Bar;
$bar->i = '1'; // 1
```

如果你不希望发生类型转换，最好的方法是，你可以通过使用严格模式来禁用掉：

```php
declare(stict_types = 1);
$bar = new Bar;
$bar->i = '1'; // 1
Fatal error: Uncaught TypeError:
Typed property Bar::$i must be int, string used
```

好了，这些就是你将会在 PHP 7.4 通用版本中看到的一些重要属性类型了。你可以联系我们获知更多关于 [PHP web 开发服务][4] 的信息

---

原文地址：[https://www.qltech.com.au/develop/php-development/exciting-features-look-forward-php-7-4/](https://www.qltech.com.au/develop/php-development/exciting-features-look-forward-php-7-4/)

作者：[QL Tech](https://www.qltech.com.au/author/admin/)

---

[1]: https://www.qltech.com.au/php-development/
[2]: https://www.qltech.com.au/category/develop/php-development/
[3]: https://www.qltech.com.au/develop/web-development/how-to-empower-web-apps-nowadays-with-laravel-application-development/
[4]: https://www.qltech.com.au/
