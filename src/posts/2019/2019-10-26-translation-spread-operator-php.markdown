---
title: "[译] —— PHP 7.4 当中的数组散布运算符"
layout: post
date: 2019-10-26 12:00
headerImage: false
tag:
- php 7.4
- spread operator
category: blog
hidden: false
author: circle
description: spread operator for array
---

一项在数组中使用散布运算符的 RFC 提议以[压倒性的投票结果][2]使得这个特性添加到 PHP 7.4 中。

散布运算符第一次出现是在 PHP 5.6 中对参数的解构，这次的 RFC 将使用延伸到了数组上；支持 [Traversable][3] 的数组或者对象都可以被延伸。这是来自 RFC 的基本例子：

```php
$parts = ['apple', 'pear'];
$fruits = ['banana', 'orange', ...$parts, 'wartermelon'];
// ['banana', 'orange', 'apple', 'pear', 'wartermelon'];
```

以下是一些拓展例子：

```php
$arr1 = [1, 2, 3];
$arr2 = [...$arr1]; // [1, 2, 3]
$arr3 = [0, ...$arr1]; // [0, 1, 2, 3]
$arr4 = array(...$arr1, ...$arr2, 111); // [1, 2, 3, 1, 2, 3, 111]
$arr5 = [...$arr1, ...$arr1]; // [1, 2, 3, 1, 2, 3]

function getArr() {
    return ['a', 'b'];
}
$arr6 = [...getArr(), 'c']; // ['a', 'b', 'c']

$arr7 = [...new ArrayIterator(['a', 'b', 'c'])]; // ['a', 'b', 'c']

function arrGen() {
    for ($i = 11; $i < 15; $i++) {
        yield $i;
    }
}
$arr8 = [...arrGen()]; // [11, 12, 13, 14]
```

字符串的键暂时还不支持；你只能使用索引数组。RFC 的作者解释为何不支持字符数组：

> 为了与[参数解构][4]保持一致，字符串键将不被支持。一旦遇到字符串键将会抛出一个可挽回的错误。

相关：[PHP 将支持短箭头函数][5]

想要了解这项被接受的提案的所有细节，请查看 [PHP: rfc:spread_operator_for_array][6]。我们想要感谢 CHU Zhaowei 撰写这篇 RFC（以及每一个参与的人）。我们认为这对 PHP 将是一个出色的加持！

---

原文地址：[https://laravel-news.com/spread-operator-in-array-expressions-coming-to-php-7-4](https://laravel-news.com/spread-operator-in-array-expressions-coming-to-php-7-4)

作者：[PAUL REDMOND][1]

---

[1]: https://laravel-news.com/@paulredmond
[2]: https://wiki.php.net/rfc/spread_operator_for_array#vote
[3]: https://www.php.net/manual/en/class.traversable.php
[4]: https://wiki.php.net/rfc/argument_unpacking
[5]: https://laravel-news.com/short-arrow-functions
[6]: https://wiki.php.net/rfc/spread_operator_for_array
