---
title: "[译] —— 怎样检查 DNS 服务器的速度"
layout: post
date: 2019-08-28 09:00
headerImage: false
tag:
- dns
- command line
category: blog
hidden: false
author: circle
description: how to check for dns server speeds
---

可能你已经知道 DNS 的作用是一个给浏览器或其他软件将域名转换为 IP4 或 IP6 地址的系统。我们每访问依次网站，浏览器就需要使用 DNS 服务器将域名转成一个 IP4/IP6 的地址。可能你电脑的 DNS 服务器配置已经被服务提供商自动选好或硬编码写死。一个快速的 DNS 服务器是体验快速浏览网站的关键因素。

有许许多多的 DNS 服务器，每一个 DNS 提供了不同的响应时间。这里有一个可供选择的[免费公用 DNS 服务器][1] 列表。

## 使用 Dig 检查 DNS 服务器速度

正如之前提到的，一个快速的 DNS 服务器提高了你的上网体验。你可以使用 Linux 的 'dig' 命令检查随便一个 DNS 服务器的请求响应时间。Dig (域名信息搜索器) 是一个用于查询 DNS 服务器的 Linux 工具，该工具可以快速定位 DNS 问题。你可以像下面这样执行一下 dig 命令。默认使用的是你电脑上配置的 DNS 服务器。我们这里请求 dig 帮助查询 'wordpress.org'。

```
$ dig wordpress.org
 
; <<>> DiG 9.10.3-P4-Ubuntu <<>> wordpress.org
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 27986
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
 
;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1280
;; QUESTION SECTION:
;wordpress.org.         IN  A
 
;; ANSWER SECTION:
wordpress.org.      0   IN  A   198.143.164.252
 
;; Query time: 46 msec
;; SERVER: 127.0.1.1#53(127.0.1.1)
;; WHEN: Tue Aug 07 08:23:06 IST 2018
;; MSG SIZE  rcvd: 58
```

关键看 'Query time' 这一行，上面的例子是 '46 毫秒'。该时间代表了解析域名 'wordpress.org' 到它的 IP 地址 '198.143.164.252' 所花费的时间。时间越小越好 —— 意味着 DNS 服务器可以短时间内转换并返回结果。多执行几次命令就可得到查询时间的平均值。

你也可以使用其他的 DNS 服务器取代你的电脑默认 DNS 服务器，规则是使用 @ 符号后面带着主机名或者服务器的 IP 地址。下面的例子展示了如何检查 DNS 服务器 '1.1.1.1'(Cloudflare) 的速度。正如上面所说的，多次执行 dig 命令以获取平均读取时间。

```
$ dig @1.1.1.1 wordpress.org
 
; <<>> DiG 9.10.3-P4-Ubuntu <<>> @1.1.1.1 wordpress.org
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14396
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
 
;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1452
;; QUESTION SECTION:
;wordpress.org.         IN  A
 
;; ANSWER SECTION:
wordpress.org.      109 IN  A   198.143.164.252
 
;; Query time: 61 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Tue Aug 07 08:14:23 IST 2018
;; MSG SIZE  rcvd: 58
```

你可以使用额外的参数以减少输出信息。

```
$ dig @1.1.1.1 wordpress.org +noall +stats
 
; <<>> DiG 9.10.3-P4-Ubuntu <<>> @1.1.1.1 wordpress.org +noall +stats
; (1 server found)
;; global options: +cmd
;; Query time: 96 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Tue Aug 07 08:28:18 IST 2018
;; MSG SIZE  rcvd: 58
```

对于 Windows 平台，你可以从 isc.org 网站[下载][2] dig 工具。

## 使用桌面版

如果你更喜欢使用桌面应用，你可以使用 Gibson Research 的 [DNS Benchmark][3] 桌面程序来检查不同 DNS 服务器的性能指标。

DNS Benchmark 会执行一个详细的分析以及对比不同的执行参数选项，并且支持同时最大 200 个 DNS 服务器的检测。

> 注意：当使用 dig 运行测速检查的时候请确保没有其他的应用程序正在使用网络（比如 youtube 或者其他后台下载），因为这会影响最终检测的结果。

---

原文地址：[https://www.codediesel.com/linux/how-to-check-for-dns-server-speeds/](https://www.codediesel.com/linux/how-to-check-for-dns-server-speeds/)

作者：[sameer](https://www.codediesel.com/author/admin/)

---

[1]: https://www.lifewire.com/free-and-public-dns-servers-2626062
[2]: https://www.isc.org/downloads/
[3]: https://www.grc.com/dns/benchmark.htm
