---
title: "翻译 —— 使用 Laravel 和 Vue.js 制作一个留言板"
layout: post
date: 2018-11-27 21:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: blog
author: circle
description: 翻译文章 —— 使用 Laravel 和 Vue.js 制作一个留言板
---

### 介绍

[Scotch.io](https://scotch.io) 的读者们，再次欢迎回来，今天我们将学习创建一个留言板。

> ### 内容清单
> 1. [介绍][1]
> 2. [安装 Laravel][2]
> 3. [数据库配置][3]
> 4. [模型与数据迁移][4]
> 5. [模型工厂][5]
> 6. [路由与控制器][6]
> 7. [创建变形器][7]
> 8. [使用 Postman 终端测试][8]
> 9. [前端搭建][9]
> 10. [使用 Laravel 预设][10]
> 11. [Vue.js 组件][11]
> 12. [显示所有的签名][12]
> 13. [签署留言板][13]
> 14. [结语][14]

看起来很酷，对不对？

你将学到的不仅仅是如何搭建一个留言板还有一些关于 Laravel 和 Vue.js 的知识：

* Laravel 5.5 的模型工厂结构
* 使用 Postman 进行终端测试以及导出结果以供团队成员使用
* Laravel 5.5 的预设功能
* Laravel 5.5 的变形器
* 创建以及使用 Vue.js 组件
* 在 Laravel 当中使用 Axios 进行 Ajax 请求

### 安装 Laravel

安装 Laravel 只需要简单地在你的电脑上执行执行以下命令，cd 到你的 www 目录然后执行：

```shell
composer create-project --prefer-dist laravel/laravel guestbook
```

在这之后，你需要创建一个配置文件将你的域名指向 public 这个目录（我的域名是 [http://guestbook.dev](http://guestbook.dev)）,同时还要确认服务器拥有 **storage** 目录和 **bootstrap/cache** 目录的写权限不然 Laravel 将不会运行。

> 注意：通常通过 composer 下载 laravel 将会为你设置好 application key，但是有时候不知道什么原因会不生效访问会得到 "No application encryption key has been specified." 或 "The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths." 的错误，运行以下命令可以修复这个问题：

```shell
php artisan key:generate
```

如果你已经按照步骤做好了一切，访问 [http://guestbook.dev](http://guestbook.dev) 你将会看到网站的页面。

### 数据库配置

Laravel 的数据库配置项保存在环境变量文件当中，将 .env.example 文件的内容复制进 .env 文件中，设置好配置信息：

```shell
cp .env.example .env
```

我们感兴趣的是这部分：

```
DB_CONNECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```

我个人使用的是 **SQLite**，意味着需要将 **DB_CONNECTION** 设置成 sqlite 然后移除其余的配置项。

如果你移除了 **DB_CONNECTION** 这个配置项，Laravel 会认为你的工作数据库位于 database/database.sqlite 下。通过以下命令确认你已经创建该文件：

```shell
touch database/database.sqlite
```

### 模型与数据迁移

对于留言板我们只需要创建一个模型文件以及迁移文件，我们将其命名为 **Signature**。

通过以下命令同时创建这两个文件：

```shell
php artisan make:model Sinature -m
```

当在 `php artisan make:model` 命令中携带一个 `-m` 参数时，将会自动为你生成迁移文件。这个小技巧会帮助你节省许多时间以及敲击键盘的次数。

这就是我们的迁移文件的内容：

```php
class CreateSianaturesTable extends Migration
{
    /**
     **_ Run the migrations.
     _**
     **_ @return void
    _**/
    public function up()
    {
        Schema::create('signatures', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email');
            $table->text('body');
            $table->timestamp('flagged_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     _ Reverse the migrations.
     _
     _ @return void
     _/
    public function down()
    {
        Schema::dropIfExists('signatures');
    }
}
```

列名已经自我解释清楚了但是如果你对 **flagged_at** 这个字段有疑问，这个字段的功能基本上就是保存了一个签名被报道或者标记的时候的时间和日期，如果未被标记该字段可以为空，就跟 **created_at**,**updated_at** 和 **deleted_at** 这种字段保存的差不多。

更新你的迁移文件后，点击保存执行迁移命令：

```shell
php artisan migrate
```

该部分的最后一件事是将我们的字段添加到模型文件的可填充数组以便允许批量填充。

```php
/_*
 _ Field to be mass-assigned.
 _
 _ @var array
 */
 protected $fillable = ['name', 'email', 'body', 'flagged_at'];
```

如果你不知道这样做的目的是什么，这里有一个解释说明：

> 当用户在一次批量填充的请求中携带了一个额外参数的时候，就会存在漏洞，因为这个参数会导致数据库中的一列发生无法预期的更改。例如，一个恶意用户可能会在 HTTP 请求中携带一个 is_admin 参数，经过模型新建方法后，会使得用户将自己升级为一个管理员。

### 模型工厂

下一步，我们将使用 Laravel 的[模型工厂](https://laravel.com/docs/5.5/seeding#using-model-factories)来帮助我们制造一些假数据。幸运的是，Laravel 5.5 自带了一种简洁的数据工厂存放方式 —— 将每一个模型工厂都放进一个文件，然后我们可以通过命令行的方式生产数据。

让我们从执行以下命令开始：

```shell
php artisan make:factory SignatureFactory
```

然后使用 [Faker](https://github.com/fzaninotto/Faker) 来获取符合我们的表结构的假数据：

```php
    $factory->define(App\Signature::class, function (Faker $faker) {
        return [
            'name' => $faker->name,
            'email' => $faker->safeEmail,
            'body' => $faker->sentence
        ];
    });
```

我们的模型工厂已经制作好了，是时候生产一些假数据了。

在你的命令行界面输入：`php artisan tinker` 然后：

```shell
factory(App\Signature::class, 100)->create();
```

通过替换 100 成为你想要的数值，你可以生产想要的记录数。

### 路由与控制器

#### 定义我们的路由

我们可以通过注册一个新的 `resource` 路由来定义这三个路由，同时也可以将我们不需要的路由排除掉：

* GET: **api/signatures** 这个是用来获取所有签名的路由。
* GET: **api/signature/:id** 这个是通过签名 ID 值获取对应签名的路由。
* POST: **api/signatures** 这个是用来产生一个新的签名并保存下来的路由。

routes/api.php

```php
    Route::resource('signatures', 'Api\SignatureController')
        ->only(['index', 'store', 'show']);
```

* PUT: **api/:id/report** 这个是用来报道一个签名的路由。

routes/api.php

```php
    Route::put('signatures/{signature}/report', 'Api\ReportSignature@update');
```

---  
原文地址：[https://scotch.io/tutorials/build-a-guestbook-with-laravel-and-vuejs](https://scotch.io/tutorials/build-a-guestbook-with-laravel-and-vuejs)

作者：[Rachid Laasri](https://scotch.io/@RachidLaasri)

---

[1]: #介绍
[2]: #安装-laravel
[3]: #数据库配置
[4]: #模型与数据迁移
[5]: #模型工厂
[6]: #路由与控制器
[7]: #创建变形器
[8]: #使用-postman-终端测试
[9]: #前端搭建
[10]: #使用-laravel-预设
[11]: #vue.js-组件
[12]: #显示所有的签名
[13]: #签署留言板
[14]: #结语
