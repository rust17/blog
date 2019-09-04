---
title: "[译] —— 508 环路检测"
layout: post
date: 2019-09-01 15:00
headerImage: false
tag:
- http status
- loop detected
category: blog
hidden: true
author: circle
description: 508 loop detected
---

`508 环路检测` 是一个由 [WebDAV 规范扩展][1] 引入的状态码。

该扩展为“绑定”特性增加了支持。相比于 HTTP，WebDAV 本身更像一个文件协议，绑定扩展通过 `BIND` 和 `UNBIND` 方法为类似“硬链接”的特性添加了支持。

WebDAV 允许一个客户端从服务器获取信息并且请求整个目录树结构。绑定扩展使得链接一个资源成为可能，并且可以在整个树状结构中创建一个目标链接。

这就使得创建一个“无限深层”的目录结构成为一种可能，因为它可以一直指向它自己。

当这种情况发生，一个服务器就会返回一个 `508 环路检测` 状态码告诉客户端，不可能返回一个无穷大的结果。

由于很少 WebDAV 服务器支持该特性，因此进入它的速度会非常快。

```
HTTP/1.1 508 Loop Detected
Content-Tpye: text/plain

There was a loop detected in the directory tree, which means that we're not able to return a full directory tree.
```

## 我应该使用吗？

可能。即使只是一个 WebDAV 规范，其它种类的 API 也许也许也可以支持递归链接结构。如果这种 API 也有一个可以压平并返回整个树的功能，这种状态码毫无副作用可谓再合适不过了。

然而，选择返回 5xx 系列状态码有点奇怪。如果一个系统允许递归链接结构的资源，并且用户请求调用该资源，那其实客户端是有问题的。

## 参考

* [RFC5842, Section 7.2][2] - 508 环路检测。

---

原文地址：[https://evertpot.com/http/508-loop-detected](https://evertpot.com/http/508-loop-detected)

---

[1]: https://tools.ietf.org/html/rfc5842
[2]: https://tools.ietf.org/html/rfc5842#section-7.2
