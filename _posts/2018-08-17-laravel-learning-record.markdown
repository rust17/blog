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

**常用的定义数据表字段方法**

```php
$table->increments('id');
```
创建一个 integer 类型的自增 id
```php
$table->string('name', 12);
```
创建一个字符串类型的 name 字段，最大长度为 12
```php
$table->string('email')->unique();
```
创建一个字符串类型的 email 字段，并指定为唯一
```php
$table->timestamps();
```
分别创建一个 `created_at` 和 `updated_at` 字段

**数据模型**

1.模型属性

```php
protected $table = 'users';
```
指定交互数据表为 `users`
```php
protected $fillable = ['name', 'email', 'password'];
```
指定数据表允许更新的字段
```php
protected $hidden = ['password', 'remember_token'];
```
指定通过模型实例显示时需要隐藏的字段

2.查找模型

```php
User::find(1)
```
查找 id 为 1 的 user 模型，不存在返回 null
```php
User::findOrFail(5)
```
查找 id 为 5 的 user 模型，不存在报错
```php
User::first()
User::all()
```
查找首个以及查找所有模型
```php
User::paginate(10)
{!! $users->render() !!} // 视图中的分页标记
```
分页返回数据

3.表单数据验证

```php
'name' => 'required'
```
指定字段不能为空
```php
'name' => 'min:3|max:50'
```
字段长度验证
```php
'email' => 'email'
```
格式验证
```php
'email' => 'unique:users'
```
唯一性验证
```php
'password' => 'confirmed'
```
密码匹配验证，保证两次输入密码一致

4.用户登录

```php
Auth::attempt(['email' => $email, 'password' => $password]);
```
`attempt` 方法接收一个数组作为参数，用于寻找用户数据
```php
Auth::check();
```
验证是否已登录
```php
Auth::login($user);
```
用户登录
```php
Auth::logout();
```
退出登录
```php
Auth::attempt($credentials, $request->has('remember');
```
登录后记住我，登录状态为五年

5.简单的用户权限

* 使用中间件

```php
$this->middleware('auth', [            
    'except' => ['show', 'create', 'store']
]);
```
利用 `auth` 中间件过滤，使用 `except` 指定 `show`、`create`、`store` 不使用中间件过滤，目的是让用户必须先登录再进行下一步操作

* 使用授权策略

步骤：

①需要创建授权策略文件

*app/Policies/UserPolicy.php*
```php
...
public function update(User $currentUser, User $user)
{
    return $currentUser->id === $user->id;
}
```
授权策略表示，在用户模型进行 CRUD 操作前，使用授权策略对操作权限进行验证。上面的代码表示，当前用户进行编辑资料操作的时候需要验证当前用户是不是自己，如果不是，则 Laravel 默认返回 403。

②需要在 `AuthServiceProvider` 进行设置

*app/Providers/AuthServiceProvider.php*
```php
protected $policies = [
    'App\Model' => 'App\Policies\ModelPolicy',
    \App\Models\User::class  => \App\Policies\UserPolicy::class,
];
```
`AuthServiceProvider` 中的 `policies` 属性表示模型对应到管理它们授权策略上。以上代码表示，`user` 模型的管理策略是 `UserPolicy`。

③在需要进行授权验证的地方加上如下代码：
```php
$this->authorize('update', $user);
```

④授权策略在视图中可以使用 `@can` 判断：
```php
@can('destroy', $user)
... // 使用 @can 指定了模型 $user 才能看到的部分，指定了策略为 destroy
@endcan
```

6.模型工厂 - 对要生成假数据的模型指定字段进行赋值

生成模型工厂文件

*database/factories/UserFactory.php*
```php
...
$factory->define(App\Models\User::class, function (Faker $faker) {
    $date_time = $faker->date . ' ' . $faker->time;
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
        'created_at' => $date_time,
        'updated_at' => $date_time,
    ];
});
```
模型工厂的 `define` 接收两个参数，参数一表示需要生成假数据的模型类，参数二为闭包，为模型的指定字段赋值。

7.数据填充

生成数据填充文件

*database/seeds/UsersTableSeeder.php*
```php
...
public function run()
{
    $users = factory(User::class)->times(50)->make();
    User::insert($users->makeVisible(['password', 'remember_token'])->toArray());
}
```
填充文件的 `run` 方法定义了填充的逻辑，`times` 表示需要创建的模型数量，`make` 方法表示创建一个模型集合。

填充前，需要在 `DatabaseSeeder` 调用 `call` 指定要运行的假数据填充文件：

*database/seeds/DatabaseSeeder.php*
```php
...
public function run()
{
    Model::unguard();
    $this->call(UsersTableSeeder::class);
    Model::reguard();
}
```

8.数据表迁移 - 改变表结构，新增删除或修改字段

生成迁移文件
```
$ php artisan make:migration add_is_admin_to_users_table --table=users
```
*database/migrations/[timestamp]_add_is_admin_to_users_table.php*
```php
...
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->boolean('is_admin')->default(false); //添加一个名为 is_admin 的字段
    });
}
...
public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('is_admin'); // 删除一个名为 is_admin 的字段
    });
}
```
迁移文件中，`up` 方法定义了迁移执行的逻辑，`down` 方法定义了回滚的逻辑

9.模型监听事件

`creating` 用户监听模型被创建之前的事件，`created` 用户监听模型被创建之后的事件，用法：

在模型中添加 `created` 方法。

*app/Models/User.php*
```php
...
public static function boot()
{
    parent::boot();

    static::creating(function ($user) {
        $user->activation_token = str_random(30);
    });
}
```

10.模型关联

一对多 - 一个用户拥有多条微博

*app/Models/Status.php*
```php
public function user()
{
    return $this->belongsTo(User::class);
}
```
*app/Models/User.php*
```php
public function statuses()
{
    return $this->hasMany(Status::class);
}
```

多对多 - 一个用户能关注多个人，被关注者能拥有多个粉丝

*app/Models/User.php*
```php
...
public function followers()
{
	return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
}

public function followings()
{
	return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
}
```
获取关联模型
```php
$statuses = $user->statuses()->orderBy('created_at', 'desc')->paginate(30);
```
一对多 -- 获取一个用户的所有微博，按照创建时间倒序排列，以每页 30 条返回。
```php
$user->followers(); // 多对多，获取一个用户的所有粉丝
$user->followings(); // 对对多，获取一个用户的所有关注人
```
多对多关联模型，可以使用 `attach` 或 `sync` 方法在中间表创建一个多对多记录，使用 `detach` 移除记录
```php
$user->followings()->attach([2, 3]); // 当前用户关注 2 和 3 号用户
$user->followings()->sync([3], false); // 当前用户关注 3 号用户并且保持之前的关注记录
$user->followings()->detach([2, 3]); // 当前用户取消关注 2 和 3 号用户
```
用 `contains` 方法可以判断两个模型是否存在关系
```php
return $this->followings->contains($user_id); // 当前用户是否关注了 $user_id 用户
```

**基本视图命令**

```php
@extends('layouts.default') // 继承视图模板
@section('title', $user->name) // 指定页面 title
@yield('content') // 可以扩展的区域
@section('content') // 页面代码开始区域
html 代码
@stop // 页面代码结束区域
```
Laravel 会将错误信息自动绑定到视图上，使用 `errors` 变量读取

**发送邮件**

```php
use Mail;
...
$view = 'emails.confirm';
$data = compact('user');
$from = 'xxx@xxx.com';
$name = 'xxx';
$to = $user->email;
$subject = '主题';

Mail::send($view, $data, function ($message) use ($from, $name, $to, $subject) {
	$message->from($from, $name)->to($to)->subject($subject);
});
```

**密码重置**

Laravel 内置了密码重置功能，只需要把密码重置相关路由指定到控制器上

| HTTP 请求 | URL | 动作 | 作用 |
| :- | :- | :- | :- |
| GET | /password/reset | Auth\ForgotPasswordController@showLinkRequest | 显示密码重置邮件发送界面 |
| POST | /password/email | Auth\ForgotPasswordController@sendResetLinkEmail | 邮箱发送重置链接 |
| GET | /password/reset/{token} | Auth\ResetPasswordController@showResetForm | 密码更新页面 |
| POST | /password/reset | Auth\ResetPasswordController@reset | 执行密码更新操作 |

密码重置后，发送邮件需要：

1.生成消息通知文件：
```
$ php artisan make:notification ResetPassword
```
2.定制消息通知文件

*app/Notifications/ResetPassword.php*
```php
public function toMail($notifiable)
{
    return (new MailMessage)
        ->subject('重置密码')
        ->line('这是一封密码重置邮件，如果是您本人操作，请点击以下按钮继续：')
        ->action('重置密码', url(route('password.reset', $this->token, false)))
        ->line('如果您并没有执行此操作，您可以选择忽略此邮件。');
}
```
3.模型中调用

*app/Models/User.php*
```php
public function sendPasswordResetNotification($token)
{
    $this->notify(new ResetPassword($token));
}
```
4.发布密码重置的 Email 视图
```
$ php artisan vendor:publish --tag=laravel-notifications
```

**基本的路由信息**

| HTTP 请求 | URL | 方法 |
| :- | :- | :- |
| GET | /users | UsersController@index |
| GET | /users/{user} | UsersController@show |
| GET | /users/create | UsersController@create |
| POST | /users | UsersController@store |
| GET | /users/{user}/edit | UsersController@edit |
| PATCH | /users/{user} | UsersController@update |
| DELETE | /users/{user} | UsersController@destroy |

重定向到路由并携带数据
```php
redirect()->route('路由', 数据);
```
重定向到上一次的页面
```php
return redirect()->back();
```
重定向到上一次请求尝试访问的页面，并且默认跳转到地址参数
```php
return redirect()->intended(route('users.show', [Auth::user()]));
```
