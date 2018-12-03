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
php artisan make:model Signature -m
```

当在 `php artisan make:model` 命令中携带一个 `-m` 参数时，将会自动为你生成迁移文件。这个小技巧会帮助你节省许多时间以及敲击键盘的次数。

这就是我们的迁移文件的内容：

```php
class CreateSignaturesTable extends Migration
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

> 当用户在一次批量填充的请求中携带了一个额外参数的时候，就会存在漏洞，因为这个参数又可能会导致数据库中的一列发生无法预期的更改。例如，一个恶意用户可能会在 HTTP 请求中携带一个 is_admin 参数，经过模型新建方法后，会使得用户将自己升级为一个管理员。

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

#### 创建控制器

在定义路由部分你已经看到了，我们需要的控制器是 **SignatureController** 和 **ReportSignature**。

* 创建并编写 SignatureController

```shell
php artisan make:controller Api/SignatureController
```

控制器的内容如下：

```php
<?php

namespace App\Http\Controllers\Api;

use App\Signature;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\SignatureResource;

class SignatureController extends Controller
{
    /**
     **_ Return a paginated list of signatures.
     _**
     **_ @return SignatureResource
     _**/
    public function index()
    {
        $signatures = Signature::latest()
            ->ignoreFlagged()
            ->paginate(20);

        return SignatureResource::collection($signatures);
    }

    /**
     _ Fetch and return the signature.
     _
     _ @param Signature @signature
     _ @return SignatureResource
     _/
    public function show(Signature $signature)
    {
        return new SignatureResource($signature);
    }

    /**
    _ Validate and save a new signature to the database.
    _
    _ @param Request $request
    _ @return SignatureResource
    _/
    public function store(Request $request)
    {
        $signature = $this->validate($request, [
            'name' => 'required|min:3|max:50',
            'email' => 'required|email',
            'body' => 'required|min:3',
        ]);

        $signature = Signature::create($signature);

        return new SignatureResource($signature);
    }
}
```

正如你所见，在我们的 **index** 方法中，我们使用了一个名为 **ignoreFlagged** 的作用域来限制返回没有被标记过的签名。你可以在 **Signature** 模型中添加下列代码：

```php
/_*
 _ Ignore flagged signatures.
 _
 _ @param $query
 _ @return mixed
 _/
public function scopeIgnoreFlagged($query)
{
    return $query->where('flagged_at', null);
}
```

* 创建以及编写 ReportSignature

```shell
php artisan make:controller Api/ReportSignature
```

以下是该文件所包含的内容：

```php
<?php

namespace App\Http\Controllers\Api;

use App\Signature;
use App\Http\Controllers\Controller;

class ReportSignature extends Controller
{
    /_*
     _ Flag the given signature.
     _
     _ @param Signature $signature
     _ @return Signature
     _/
    public function update(Signature $signature)
    {
        $signature->flag();

        return $signature;
    }
}
```

当我们收到使用 Laravel 模型绑定的签名模型实例时，我们就调用一个 flag 方法将该实例的 **flagged_at** 属性值设置成当前时间，跟 Laravel 软删除的工作原理一致。你可以在 **Signature** 模型中通过定义这个方法添加这个功能。

```php
/_*
 _ Flag the given signature.
 _ 
 _ @return bool
 */
public function flag()
{
    return $this->update(['flagged_at' => \Carbon\Carbon::now()]);
}
```

### 创建变形器

Laravel 5.5 自带了一个非常棒的特性，如果你熟悉构建 API 那你肯定清楚一个痛点是经常要改变你的数据以防止暴漏你的数据表结构给你的客户端，因为如果你出于安全考虑而改变表结构，你就会打破任何依赖于 API 的东西。暴漏你的表结构对你没有任何好处。

在我们的这个例子当中，我们只需要一个 Signature 变形器，我们可以通过运行该命令来创建它：

```shell
php artisan make:resource SignatureResource
```

该文件的内容如下：

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class SignatureResource extends Resource
{
    /_*
     _ Transform the signature into an array.
     _ 
     _ @param \Illuminate\Http\Request
     _ @return array
     _/
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->avatar,
            'body' => $this->body,
            'date' => $this->created_at->diffForHumans()
        ];
    }
}
```

由于我们使用了一个不存在的 **avatar** 属性，我们需要为此写一个访问器。把这个放在我们的 **Signature** 模型中最合适了，因为我们不希望暴漏我们的用户邮件地址。

```php
/_*
 _ Get the user Gravatar by their email address.
 _
 _ @return string */
public function getAvatarAttribute()
{
    return sprintf('https://www.gravatar.com/avatar/%s?s=100', md5($this->email));
} 
```

### 使用 Postman 终端测试

创建好了路由，控制器以及变形器之后，就可以开始测试啦！让我们确保一切都是按照预期进行的。你可能会问我，“但是，理查德，为什么要用 Postman 呢？我们不是可以直接用浏览器访问吗？”是的！我同意，我们确实可以用浏览器访问 API，但是如果你没有真正针对代码写过测试，我建议你还是使用 Postman 来测试，因为至少可以在保存代码改动过后保存立即执行而不是每次打开浏览器查看效果。

如需安装 Postman，请访问该网站 [Postman Supercharge your API workflow](https://www.getpostman.com/) 然后选择对应系统的版本。

我新建了一个叫 **Scotch Guestbook** 的集合，将我所有的测试用例都放在里面，你也可以按照像我一样的方式，点击 **New** 按钮选择 **Collection** 选项。

在创建完测试用例之后，点击 **Save** 输入命名，添加描述，选择所属集合点击 **Save**：

#### 测试我们的 API

* 所有签名的列表；
* 根据 ID 值查找一个签名；
* 新建一个签名；
* 报道一个签名；

我会把这一部分连同项目代码一起打包放到 [GitHub](https://github.com/rashidlaasri/build-a-guestbook-with-laravel-and-vuejs)。

### 前端搭建

目前为止，我们已经差不多完成了后端的工作，剩下的就是将后端与前端连接起来。

#### 建立首页

GET:/ 这个路由是我们的留言板入口，主要是负责渲染首页。

routes/web.php:

```php
Route::get('/', 'SignaturesController@index')->name('home');
```

然后通过执行以下命令新建控制器：

```shell
php artisan make:controller SignaturesController
```

控制器的内容如下：

```php
<?php 

namespace App\Http\Controllers;

class SignaturesController extends Controller
{
    /_*
     _ Display the GuestBook homepage.
     _
     _ @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public functionn index()
    {
        return view('signatures.index');
    }
}
```

然后，我们需要新建我们的 **signatures.index** 视图。在 **/resources/views/** 目录下新建一个文件 **master.blade.php**，该文件主要是制定了整个网站的布局以及允许其他页面的继承。

```php
<!doctype html>
<html lang="{ { app()->getLocale() } }">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Scoth.io GuestBook</title>
    <meta name="csrf-token" content="{ { csrf_token() } }">
    <link rel="stylesheet" type="text/css" href="{ { mix('css/app.css') } }">
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-findcond">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="{ { route('home') } }">GuestBook</a>
                </div>
                <div class="collapse navbar-collapse" id="navbar">
                    <ul class="nav navbar-nav navbar-right">
                        <li class="active">
                            <a href="{ { route('sign') } }">Sign the GuestBook</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        @yield('content')
    </div>
    <script src="{ { mix('js/app.js') } }"></script>
</body>
</html>
```

然后，我们将在 **signatures** 文件夹下新建一个视图文件 **index.blade.php**

```php
@extends('master')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <signatures></signatures>
        </div>
    </div>
</div>
@endsection
```

#### 建立签名新增页面

GET:/sign 这个页面负责显示新增签名的表单

```php
Route::get('sign', 'SignaturesController@create')->name('sign');
```

我们早已新建了这个控制器，现在让我们新增这个方法：

```php
/_*
 _ Display the GuestBook form page.
 _ 
 _ @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
 */
public function create()
{
    return view('signatures.sign');
}
```

在 **resources/views/signatures/** 目录下新建视图文件 **sign.blade.php**

```php
@extends('master')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <signature-form></signature-form>
        </div>
    </div>
</div>
@endsection
```

### 使用 Laravel 预设

在 Laravel 5.5 版本之前，Laravel 自带了 Bootstrap 和 Vue.js 的脚手架。但是并不是每个人都想使用这些技术，因此在 Laravel 5.5 当中你可以通过执行命令直接替换成你喜欢的框架：

```shell
php artisan preset react
```

或者你只希望安装 Bootstrap 不需要任何 JS 框架：

```shell
php artisan preset bootstrap
```

或者你完全不需要任何脚手架工具：

```shell
php artisan preset none
```

在我们的例子当中，我们会保留 Vue.js 和 Bootstrap 的预设，因此执行以下命令来安装所需的依赖：

```shell
npm install
```

打开文件 **/resources/assets/sass/app.scss** ，我早已为项目创建好了 css 样式，添加以下代码：

```css
$color_1: #f14444;
$color_2: #444;
$color_3: #fff;
$border_color_1: #ccc;
$border_color_2: #fff;
$border_color_3: #f14444;

nav.navbar-findcond {
  background: #fff;
  border-color: $border_color_1;
  box-shadow: 0 0 2px 0 #ccc;
  a {
    color: $color_1;
  }
  ul.navbar-nav {
    a {
      color: $color_1;
      border-style: solid;
      border-width: 0 0 2px 0;
      border-color: $border_color_2;
      &:hover {
        background: #fff;
        border-color: $border_color_3;
      }
      &:visited {
        background: #fff;
      }
      &:focus {
        background: #fff;
      }
      &:active {
        background: #fff;
      }
    }
  }
  ul.dropdown-menu {
    >li {
      >a {
        color: $color_2;
        &:hover {
          background: #f14444;
          color: $color_3;
        }
      }
    }
  }
}
button[type="submit"] {
  border-radius: 2px;
  color: $color_3;
  background: #e74c3c;
  padding: 10px;
  font-size: 13px;
  text-transform: uppercase;
  margin: 0;
  font-weight: 400;
  text-align: center;
  border: none;
  cursor: pointer;
  width: 10%;
  transition: background .5s;
  &:hover {
    background: #2f3c4e;
  }
}
```

执行以下命令编译：

```shell
npm run dev
```

### Vue.js 组件

到此，在运行我们的应用之前还需要新建我们提到过的两个组件：

```html
<signatures></signatures> <!-- In index.blade.php -->
<signature-form></signature-form> <!-- In sign.blade.php -->
```

在 **/resources/assets/components/js/** 目录下新建以下文件

* Signatures.vue

```html
<template>
    <div>
        // Our HTML template
    </div>
</template>

<script>
    export default {
        // Our Javascript logic
    }
</script>
```

* SignatureForm.vue

```html
<template>
    <div>
        // Our HTML template
    </div>
</template>

<script>
    export default {
        // Our Javascript logic
    }
</script>
```

再将组件注册好之后（就在我们创建 Vue 实例之前），我们的应用就能使用它们了。打开 **/resources/assets/app.js**

```js
Vue.component('signatures', require('./components/Signatures.vue'));
Vue.component('signature-form', require('./components/SignatureForm.vue'));

const app = new Vue({
    el: '#app'
});
```

### 显示所有的签名

为了将签名以分页的形式显示，我们将使用这个[依赖包](https://www.npmjs.com/package/vuejs-paginate)，你可以通过执行以下命令安装：

```shell
npm install vuejs-paginate --save
```

然后在 **/resources/assets/app.js** 文件中注册：

```js
Vue.component('paginate', require('vuejs-paginate'));
```

我们的 Signatures 组件内容如下：

```html
<template>
    <div>
        <div class="panel panel-default" v-for="signature in signatures">
            <div class="panel-heading">
                <span class="glyphicon glyphicon-user" id="start"></span>
                <label id="started">By</label> { { signature.name } }
            </div>
            <div class="panel-body">
                <div class="col-md-2">
                    <div class="thumbnail">
                        <img :src="signature.avatar" :alt="signature.name">
                    </div>
                </div>
                <p>{ { signature.body } }</p>
            </div>
            <div class="panel-footer">
                <span class="glyphicon glyphicon-calendar" id="visit"></span> { { signature.date } } |
                <span class="glyphicon glyphicon-flag" id="comment"></span>
                <a href="#" id="comments" @click="report(signature.id)">Report</a>
            </div>
        </div>
        <paginate 
            :page-content="pageCount"
            :click-handler="fetch"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
        ></paginate>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signatures: [],
            pageCount: 1,
            endpoint: 'api/signatures?page='
        };
    },
    
    created() {
        this.fetch();
    },

    methods: {
        fetch(page = 1) {
            axios.get(this.endpoint + page)
                .then(({data}) => {
                    this.signature = data.data;
                    this.pageCount = data.meta.last_page;
                });
        },

        report(id) {
            if (confirm('Are you sure you want to report this signature?')) {
                axios.put('api/signatures/'+id+'/report')
                .then(response => this.removeSignature(id));
            }
        },

        removeSignature(id) {
            this.signatures = _.remove(this.signatures, function (signature) {
                return signature.id !== id;
            });
        }
    }
}
</script>
```

正如你所见，当组件创建的时候我们调用了 **fetch** 方法，并且对在 **data object** 当中定义好的 url 发起一个 **GET** 请求，然后我们将 api 返回的数据设置到 **signatures** 当中。

在 HTML 代码当中，我们通过迭代的方式显示 **signatures**。当用户点击报道的链接时，我们就调用 **report** 方法，并将签名的 ID 值作为一个参数，发起一个 **PUT** 请求使得被报道的签名记录隐藏掉，然后再调用 **removeSignature** 方法将该 ID 从数组中移除。

### 签署留言板

对于 **SignatureForm** 组件，我们需要添加表单，将输入框与 **data object** 绑定在一起。当用户输入了信息然后点击提交按钮之后，我们将发起一个 **POST** 请求来保存新的签名，如果保存成功，我们将改变 **saved** 属性然后重置表单，如果失败，我们将 Laravel 验证过的返回信息注入到 **assign** 变量中然后显示出来。

```html
<template>
    <div>
        <div class="alert alert-success" v-if="saved">
            <strong>Success!</strong> Your signature has been saved successfully.
        </div>

        <div class="well well-sm" id="signature-form">
            <form class="form-horizontal" method="post" @submit.prevent="onSubmit">
                <fieldset>
                    <legend class="text-center">Sign the GuestBook</legend>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="name">Name</label>
                        <div class="col-md-9" :class="{'has-error': errors.name}">
                            <input id="name" 
                                   v-model="signature.name"
                                   type="text" 
                                   placeholder="Your name"
                                   class="form-control">
                            <span v-if="errors.name" class="help-block text-danger">{{ errors.name[0] }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="email">Your E-mail</label>
                        <div class="col-md-9" :class="{'has-error': errors.email}">
                            <input id="email" 
                                   v-model="signature.email"
                                   type="text"
                                   placeholder="Your email"
                                   class="form-control">
                            <span v-if="errors.email" class="help-block text-danger">{{ errors.email[0] }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="body">Your message</label>
                        <div class="col-md-9" :class="{'has-error': errors.body}">
                            <textarea class="form-control"
                                      id="body"
                                      v-model="signature.body"
                                      placeholder="Please enter your message here..."
                                      rows="5"></textarea>
                            <span v-if="errors.body" class="help-block text-danger">{{ errors.body[0] }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-md-12 text-right">
                            <button type="submit" class="btn btn-primary btn-lg">Submit</button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errors: [],
            saved: false,
            signature: {
                name: null,
                email: null,
                body: null,
            }
        }
    },

    methods: {
        onSubmit() {
            this.saved = false;

            axios.post('api/signatures', this.signature)
                .then(({data}) => this.setSuccessMessage())
                .catch(({response}) => this.setErrors(response));
        },

        setErrors(response) {
            this.errors = response.data.errors;
        },

        setSuccessMessage() {
            this.reset();
            this.saved = true;
        },

        reset() {
            this.errors = [];
            this.signature = {name: null, email: null, body: null};
        }
    }
}
</script>
```

在新建了这两个组件后，一旦改动了它们，别忘了执行以下命令重新编译：

```shell
npm run dev
```

### 结语

我希望你能从这篇文章中学到一点东西，如果你在独自完成的过程中遇到问题的话，我可以帮助你，请在下方留下评论。如果你希望找我谈谈，我的 Twitter 账号是 [RashidLaasri](https://twitter.com/rashidlaasri)，欢迎过来打招呼！

敬请关注更多的 Vue.js 教程，再见！


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
