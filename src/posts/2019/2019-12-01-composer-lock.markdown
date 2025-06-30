---
title: "composer install 遇到 lock 文件 warning"
layout: post
date: 2019-12-01 12:00
headerImage: false
tag:
- composer
category: blog
hidden: false
author: circle
description: composer install lock problem
---
composer 在安装时遇到了一个 warning：

```
The lock file is not up to date with the latest changes in composer.json. You may be getting outdated dependencies. Run update to update them.

```
这是因为 composer 安装时会检查 composer.json 与 composer.lock 文件，保持两者的同步（通过对比文件中的 hash 值），如果发现不一样就会提示上面的警告。

解决办法（升级 lock 文件的 hash）：
```
composer update --lock
```
或者
```
composer updata nothing
```
