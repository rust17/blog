---
title: "[译] —— 507 存储空间不足"
layout: post
date: 2019-08-24 22:00
headerImage: false
tag:
- php
- http status
category: blog
hidden: false
author: circle
description: http status 507
---

[507 存储空间不足][1] 是一个由 [WebDAV][2] 规范提出的状态码。它允许一个 HTTP 服务器告诉客户端，例如，客户端的 `PUT` 或 `POST` 由于请求太大而无法载入磁盘导致不能请求成功。

虽然该规范是由 WebDAV 撰写的，但是也可以用于除 WebDAV 以外的服务器。

例如：

```
HTTP/1.1 507 Insufficient Storage
Content-Type: text/plain

wow, that's a big file. Can you store it somewhere else? We're pretty cramped here.
```

许多 WebDAV 客户端都可以很好地处理这个状态，并且提醒用户磁盘已经存满。

## 我应该使用吗？

在我看来，即使该状态码在 WebDAV 以外也是可用的，但是现实情况是，该状态码的用处有些受限。

因为 `507` 是一个特殊的服务端错误，即已经明确指出了这个错是由于服务器引起的错误。那么磁盘存满的结果可能不是预先设计的或者故意为之的。

当使用一个 REST API 的状态码时，我感觉当用户耗尽磁盘空间的时候你更希望返回一个错误，也就是说，明确地发送一个信息告诉用户 “你已经消耗完配额了”，而不是告诉用户 “我们的磁盘已经存满了”。

如果意图是告诉用户让他们知道已经超出了配额，使用更为恰当  [413 载荷过大][3] 可能更好。

## 参考

[RFC4915,Section 11.5][4] - 507 存储空间不足

---

原文地址：[https://evertpot.com/http/507-insufficient-storage](https://evertpot.com/http/507-insufficient-storage)

作者：[Evert Pot](https://twitter.com/evertp)

---
[1](https://tools.ietf.org/html/rfc4918#section-11.5)
[2](https://tools.ietf.org/html/rfc4918)
[3](https://evertpot.com/http/413-payload-too-large)
[4](https://evertpot.com/http/413-payload-too-large)
