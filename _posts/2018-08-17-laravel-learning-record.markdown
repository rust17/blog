---
title:  "Laravel 学习记录"
layout: post
date: 2018-08-17 22:00
headerImage: false
tag:
- learn
- 学习记录
category: blog
author: circle
description: 记录一些学习 laravel 的过程中的知识点
---
&emsp;&emsp;接触 Laravel 已经有半年左右，这半年间，一直在进行基础性的学习，比如这个框架的一些基本使用：用户注册登录、邮件发送、数据模型 CRUD、用户数据获取等。在学习使用的过程中，积累了许多相关资料，也一直在尝试了解一些框架的底层原理。虽然到现在许多底层知识还是一知半解，不过却不妨碍基本使用，通过持续性、不间断的练习得以掌握了一些常规操作。这篇文章的目的就是记录一些 Laravel 的常规操作。

---
**利用 composer 创建一个 laravel 项目**

运行命令：
```
composer create-project laravel/laravel 项目名称 --prefer-dist "5.5.*"
```
**基本的 Artisan 命令**

<style>
	table {
		border-spacing: 0;
		border-collapse: collapse;
	}
	table tr {
		border-top: 1px solid #ccc;
	}
	table th {
		border: 1px solid #ddd;
  		padding: 10px 15px;
	}
	table td {
		border: 1px solid #ddd;
  		padding: 10px 15px;
	}
</style>
| 命令 | 说明 |
| :- | :- |
| php artisan key:generate | 生成 App Key |
| php artisan make:controller | 生成控制器 |
| php artisan make:model | 生成模型 |
| php artisan make:policy | 生成授权策略 |
| php artisan make:seeder | 生成 Seeder 文件 |
| php artisan migrate | 执行迁移 |
| php artisan migrate:rollback | 回滚迁移 |
| php artisan migrate:refresh | 重置数据库 |
| php artisan db:seed | 填充数据库 |
| php artisan tinker | 进入 Tinker 环境 |
| php artisan route:list | 查看路由列表 |

