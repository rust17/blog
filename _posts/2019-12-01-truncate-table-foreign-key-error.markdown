---
title: "清空表时遇到外键限制"
layout: post
date: 2019-12-01 12:00
headerImage: false
tag:
- mysql
- truncate
category: blog
hidden: false
author: circle
description: mysql truncate table foreign key limit
---
在 laravel 项目中经常会遇到修改表结构时需要重新填充数据的情况，有时候甚至需要清空原有的数据，laravel 为开发者提供了很好的方式，只需要执行 `\App\xxxmodel::truncate();` 即可，可以在 tinker 环境中执行或者写在 seeder 中当运行数据库填充的时候再执行。

不过，有的时候当该模型对应的表有外键时，mysql 会阻止清空命令的执行：

```
Illuminate/Database/QueryException with message 'SQLSTATE[42000]: Syntax error or access violation: 1701 Cannot truncate a table referenced in a foreign key constraint (`shop`.`order_items`, CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `shop`.`orders` (`id`)) (SQL: truncate table `orders`)'
```
解决办法
1. 解除外键限制
2. 执行清空命令
3. 清空完后再重新加上约束

例如：
```
\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
\DB::table('table1')->truncate();
\DB::table('table2')->truncate();
\DB::statement('SET FOREIGN_KEY_CHECKS=1');
```