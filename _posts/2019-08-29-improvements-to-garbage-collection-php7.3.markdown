---
title: "[译] —— PHP 7.3 中垃圾回收机制 (GC) 的改进，测试显示性能提高 5 倍！"
layout: post
date: 2019-08-29 15:00
headerImage: false
tag:
- php
- php 7.3
- garbage collection
- boost performance
category: blog
hidden: false
author: circle
description: improvements to garbage collection in php 7.3, 5x boost performance in tests
---

php 继续保持着长期世界上最受喜爱的服务端语言地位。这门普及的语言依然在持续发展中，核心开发团队在 PHP 7.3 版本中推出了新的 GC 改进机制。

垃圾回收是一个许多编程语言中都带有的内存管理机制。与非托管性语言相反：**C**, **C++** 和 **Objective C**，用户需要手动收集内存，带有 GC 机制的语言：**Java**, **javaScript** 和 **PHP** 可以自动管理内存。

通常而言，内存管理允许用户**高性能**地指定内存在堆栈当中的分配。然而，用户需要花费大量时间练习，这就是被高级计算任务所采用的垃圾回收型语言为什么会需要**高效**运行的原因。这当中就包含了最适合 web 开发的 PHP 语言。

在 Zend 核心 PHP 运行开发组工作的 **Dmitry Stogov**已经给该语言合并了一个重大的 PR。[PR 3165][1] 被谦虚的贴上 "**GC 改进**" 的标签，但是其中的工作对 PHP 应用程序处理内存有着巨大的影响。

垃圾回收总是会带着一些惩罚性的性能消耗，因此提升带来的影响是全局性的 - 但是影响程度会根据手头任务而有所不同。

## PHP 7.3 进一步改进内存管理，PHP 8.0 的 JIT

上一个主要版本 PHP 7.0 的发布给 PHP 运行时带来了性能方面显著的提升。主要在内存管理上带来了着巨大的提升。再加上快速 VPS 主机（[25 美元尝试高性能 SSD VPS][2]）解决方案，PHP 可以真正将 5.X 版本甩在身后。随着 [PHP 8.0 引入 JIT][3]，PHP 将更进一步得到提升。

自 PHP 7.X 以来的每一个版本都带来了性能的显著提升。随着 [PHP 7.3 于 2018 年底发布][4]，用户可以很快在他们的应用中感受到这个 GC 改进带来的提升。与现实世界程序相比，对大多数应用程序而言，**benchmarks** 上显示的测试结果显著提升。

```
// 超多对象时
GC       |    OLD |   NEW
disabled |  1.32s | 1.50s
enabled  | 12.75s | 2.32s

// 很多对象时
GC       |    OLD |   NEW
disabled |  0.87s | 0.87s
enabled  |  1.48s | 0.94s

// 少量对象时
GC       |    OLD |   NEW
disabled |  1.65s | 1.62s
enabled  |  1.75s | 1.62s
```

该结果清晰的显示了仍然具有很大的提升空间。对于一个庞大数目的对象而言 PHP 大幅度地变快了。这对于全栈框架像 **Laravel** 或者 **Symfony** 而言带来了非常大的帮助。大对象在内容管理或者电商程序领域采用地较多。

以下是 Dmitry 描述他的发现：

> * 打开 GC 后，仍然会比 GC 关闭的情况慢 1.5 倍（之前慢了将近 10 倍）。这是因为对这种情况而言，（线性）GC 阀值避让发生得太慢了。我认为这是一个好的开始。
> * 关闭 GC (运行时) 之后，从旧的版本到新的版本我们有一个减速（1.32s 到 1.50s）。perf 显示 10% 的时间花费在 `gc_remove_compressed` 上。因为这个工作量碰巧使用了足够的对象，导致压缩对象成为了一个问题...
> - [https://github.com/php/php-src/pull/3165#pullrequestreview-100399813][5]

Jorge 于 2018,03,02 在 tweet 上发布的

---

原文地址：[https://react-etc.net/entry/improvements-to-garbage-collection-gc-php-7-3-boosts-performance-in-benchmark](https://react-etc.net/entry/improvements-to-garbage-collection-gc-php-7-3-boosts-performance-in-benchmark)

---

[1]: https://github.com/php/php-src/pull/3165
[2]: https://upcloud.com/signup/?promo=KJ8BMX
[3]: https://react-etc.net/entry/php-8-0-0-release-date-and-jit-status
[4]: https://react-etc.net/page/php-7-3-features-release-date
[5]: https://github.com/php/php-src/pull/3165#pullrequestreview-100399813
