---
title:  "Laravel 进阶知识学习记录"
layout: post
date: 2018-08-22 10:51
headerImage: false
tag:
- learn
- 学习记录
category: blog
author: circle
description: 记录一些学习 laravel 的过程中的知识点
---
&emsp;&emsp;接着上一篇『Laravel 基础知识学习记录』，这篇文章的目的在于记录一些在[L02 Laravel 教程 - Web 开发实战进阶 ( Laravel 5.5 ) ](https://laravel-china.org/courses/laravel-intermediate-training-5.5)学到的知识点。原则是记录如何使用框架的各种功能，侧重点在于如何使用。

---
### 访问配置

---

在全局访问 `config` 中的配置值，使用点语法
```php
$value = config('app.xxx');
```
在运行时设置配置值
```php
config(['app.xxx' => 'string']);
```

### 快速生成用户认证代码

---
运行命令
```bash
$ php artisan make:auth
$ php artisan migrate // 数据迁移
```
第一个命令将生成 *app/Http/Controllers/HomeController.php* 、相应的视图文件以及添加以下路由到路由文件：
```php
// 登录
Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');
Route::post('logout', 'Auth\LoginController@logout')->name('logout');
// 注册
Route::get('register', 'Auth\RegisterController@showRegistrationForm')->name('register');
Route::post('register', 'Auth\RegisterController@register');
// 重置密码
Route::get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm')->name('password.request');
Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
Route::get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset');
Route::post('password/reset', 'Auth\ResetPasswordController@reset');
```
### resource 路由

---
使用 `resource` 方法可以节省许多代码，且严格遵循 `RESTful URI` 的规范
```php
Route::resource('users', 'UsersController', ['only' => ['show', 'update', 'edit']]);
```
相当于
```php
Route::get('/users/{user}', 'UsersController@show')->name('users.show');
Route::get('/users/{user}/edit', 'UsersController@edit')->name('users.edit');
Route::post('/users/{user}', 'UsersController@update')->name('users.update');
```
### 表单请求验证 FormRequest

---
创建
```bash
$ php artisan make:request UserRequest
```
在生成的文件 *app/Http/Requests/UserRequest.php* 上，在 `rules()` 方法定制验证规则
```php
<?php
...
public function rules()
{
    return [
        'name' => 'required|between:3,25|regex:/^[A-Za-z0-9\-\_]+$/|unique:users,name,' . Auth::id(),
        'email' => 'required|email',
        'introduction' => 'max:80',
    ];
}
...
```
如果需要自定义表单验证提示信息，在该文件中增加 `messages()` 方法，命名规范 —— 键：字段名 + 规则名称，值：对应的消息提示内容。
```php
...
public function messages()
{
    return [
        'name.unique' => '用户名已被占用，请重新填写',
        'name.regex' => '用户名只支持英文、数字、横杠和下划线。',
        'name.between' => '用户名必须介于 3 - 25 个字符之间。',
        'name.required' => '用户名不能为空。',
    ];
}
...
```
### 上传图片

---
表单的 `html` 代码
```html
<form action="{ { route('users.update', $user->id) }}" methods="POST" accept-charset="UTF-8" enctype="multiplart/form-data">
    <input type="file" name="avatar"/>
</form>
```
图片的表单验证
```html
'avatar' => 'mines:jepg,bmp,png,gif|dimensions:min_width=200,min_height=200',
```
获取图片 API
```php
// 获取图片信息
$request->avatar

// 获取后缀名
$request->avatar->getClientOrinalExtension()

// 移动图片
$request->avatar->move($upload_path, $filename)
```
### 生成数据模型和迁移文件

---
```bash
$ php artisan make:model Models/Category -m
```
### Faker 假数据库 API

---
```php
$faker->name,
$faker->unique()->safeEmail,
$faker->sentence(), // 随机生成 『小段落』 文本
$faker->randomElement($avatar), // 从头像数组中随机取出一个
$faker->dateTimeThisMonth(), // 随机取出一个月以内的时间
$faker->dateTimeThisMonth($updated_at), // 随机取出的时间不超过 $updated_at
$faker->text(), // 随机生成大段文本
```
### Carbon DateTime 扩展 API

---
```php
Carbon::now()->toDateTimeString() // 生成格式如 `2018-08-23 10:10:11` 的时间戳
```

### 解决 N + 1 问题

---
思路：在需要获取关联数据的地方使用预加载方法 `with()`
```php
$topic = Topic::with('user', 'category')->paginate(30);
```

### 本地作用域

---
说明：本地作用域允许定义通用的约束集合以便在应用中复用。要定义一个作用域，只需在 Eloquent 模型方法前加上一个 scope 前缀，作用域总是返回查询构造器。在方法调用时不需要加上 scope 前缀。
```php
public function scopeWithOrder($query, $order)
{
    switch ($order) {
        case 'recent':
            $query->recent();
            break;

        default: 
            $query->recentReplied();
            break;
    }
    return $query->with('user', 'category');
}
public function scopeRecentReplied($query)
{
    return $query->orderBy('updated_at', 'desc');
}

public function scopeRecent($query)
{
    return $query->orderBy('created_at', 'desc');
}
```
控制器调用
```php
$topics = $topic->withOrder($request->order)->paginate(20);
```
### 模型观察器

---
Eloquent 模型会触发许多事件，我们可以对模型的生命周期内多个时间点进行监控：creating,created,
updating,updated,saving,saved,deleting,deleted,restoring,restored。Eloquent 观察者类的方法名对应 Eloquent 想监听的事件，每种方法接收 `model` 作为其唯一的参数。

*app/Observers/TopicObserver.php*
```php
<?php

namespace App\Observers;

use App\Models\Topic;

class TopicObserver
{
    public function saving(Topic $topic)
    {
        $topic->excerpt = make_excerpt($topic->body);
    }
}
```
### 返回带参数的路由

---
```php
$params = [];
return route('topics.show', array_merge([$this->id, $this->slug], $params));
```

### 继承 URI 中的请求参数

---
```php
// 继承 uri 中除了 page 参数以外的其他参数
// http://xxx.com?page=1&tab=replies -> http://xxx.com?tab=replies
appends(Request::expect('page'));
```
### 永久重定向

---
```php
return redirect($link, 301);
```
### 使用队列

---
**1. 配置队列**

安装 `redis` 依赖
```bash
$ composer require "predis/predis:~1.0"
```
修改环境变量

*.env*
```php
QUEUE_DRIVER=redis
```
失败任务

说明：Laravel 内置了一个方式指定重试的最大次数，当任务超出这个重试次数，它就会被插入到 `failed_jobs` 数据表里。使用以下命令来创建 `failed_jobs` 表迁移文件
```bash
$ php artisan queue:failed-table // 生成迁移文件
$ php artisan migrate // 执行迁移
```
**2. 生成任务类**
```bash
$ php artisan make:job TranslateSlug
```
`handle` 方法会在队列任务时被调用，在任务队列中，要避免使用 Eloquent 模型接口防止陷入调用死循环
*app/Jobs/TranslateSlug*
```php
...
public function __construct(Topic $topic)
{
    $this->topic = $topic;
}

public function handle()
{
    // 调用 API 接口将话题的标题翻译
    $slug = app(SlugTranslateHandler::class)->translate($this->topic->title);

    \DB::table('topics')->where('id', $this->topic->id)->update(['slug' => $slug]);
}
...
```
**3. 任务分发**

在需要调用执行队列的地方写入以下代码
```php
use App\Jobs\TranslateSlug;

...
dispatch(new TranslateSlug($topic));
...
```
**4. 启动队列监听**
```bash
$ php artisan queue:listen
```
### 模型某个字段加 1 减 1

---
```php
$model->increment('xxx', 1); // + 1
$model->decrement('xxx', 1); // - 1
```
### 消息通知

---
说明：Laravel 自带了一套消息通知系统，支持多种通知频道，有数据库、邮件、短信以及 Slack。

**数据库通知**

**1. 准备数据库**

数据通知频道会在一张数据表里存储所有的通知信息，使用以下命令创建这张表
```bash
$ php artisan notifications:table // 生成数据通知表迁移文件
$ php artisan migrate // 执行迁移
```
还需要在 `users` 表新增 `notification_count` 来记录有多少未读通知

**2. 生成通知类**
```bash
$ php artisan make:notification TopicReplied
```
修改文件

*app/Notifications/TopicReplied.php*
```php
...
public function __construct(Reply $reply)
{
    $this->reply = $reply;
}

public function via($notifiable)
{
    // 开启通知的频道
    return ['database'];
}

public function toDatabase($notifiable)
{
    // 存入数据库的数据
    return [
        'reply_id' => $this->reply->id,
        'reply_content' => $this->reply->content,
        'user_id' => $this->reply->user->id,
        'user_name' => $this->reply->user->name,
        'user_avatar' => $this->reply->user->avatar,
        'topic_link' => $link,
        'topic_id' => $topic->id,
        'topic_title' => $topic->title,
    ];
}
...
```
说明：Laravel 中一条通知就是一个类（通常位于 app/Notifications 文件夹下），每个通知都有一个 `via()` 方法，决定了通知在哪个频道上发送。使用数据库通知频道，需要定义 `toDatabase()`。这个方法接收 `$notifiable` 实例参数并返回普通的 PHP 数组。这个返回的数组将被转成 JSON 存储到数据库的 `data` 字段中。

**3. 触发通知**

在需要触发的地方调用以下代码
```php
// 通知 user 
$reply = xxx;
$model->user->notify(new TopicReplied($reply));
```
*app/Models/User.php*
```php
...
use Notifiable {
    notify as protected laravelNotify;
}
public function notify($instance)
{
    // 排除掉本人是要通知的人
    if ($this->id == Auth::id()) {
        return;
    }
    $this->increment('notification_count');
    $this->laravelNotify($instance);
}
...
```

**4. 清除未读消息标示**

在 User 模型新增 `markAsRead()` 方法

*app/Models/User.php*
```php
...
public function markAsRead()
{
    $this->notification_count = 0;
    $this->save();
    $this->unreadNotifications->markAsRead();
}
...
```
**邮件通知**

**1. 配置**

*.env*

```php
...
MAIL_DRIVER=smtp // 使用支持 ESMTP 的 SMTP 服务器发送邮件
MAIL_HOST=smtp.qq.com // QQ 邮箱的 SMTP 服务器地址
MAIL_PORT=25 // QQ 邮箱的 SMTP 服务器端口
MAIL_USERNAME=xxxxxxxxxxxxxx@qq.com
MAIL_PASSWORD=xxxxxxxxx
MAIL_ENCRYPTION=tls // 加密类型，
MAIL_FROM_ADDRESS=xxxxxxxxxxxxxx@qq.com
MAIL_FROM_NAME=LaraBBS // 邮件发送者名称
...
```

**2. 添加邮件通知频道**

*app/Notifications/TopicReplied.php*
```php
...
public function via($notifiable)
{
    return ['database', 'mail'];
}

public function toMail($notifiable)
{
    $url = 'xxx';
    return (new MailMessage)
                ->line('您的话题有新回复！')
                ->action('查看回复', $url);
}
...
```

**3. 使用队列发送邮件**

只需要对通知类添加 ShouldQueue 接口，Laravel 会自动将通知发送放入队列中
```php
class TopicReplied extends Notification implements ShouldQueue
```
### 权限部署

---
说明：在策略中定义一个 `before()` 方法，`before()` 方法会在策略中其它所有方法之前执行，在 `before()` 中存在三种返回值：
* `true` —— 授权通过；
* `false` —— 拒绝授权；
* `null` —— 通过其他策略方法来决定授权是否通过

*app/Policies/Policy.php*
```php
<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;

class Policy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        if ($user->can('manage_contents')) {
            return true;
        }
    } 
}
```

### 用到的扩展包

---
#### 1. [mews/captcha][1]

用途：生成验证码

安装
```bash
composer require "mews/captcha:~2.0"
```
生成配置文件 `config/captcha.php`
```bash
$ php artisan vendor:publish --provider="Mews\Captcha\CaptchaServiceProvider"
```
使用

**1. 前端展示**
```html
<img class="thumbnail captcha" src="{ { captcha_src('flat') }}" onclick="this.src='/captcha/flat?'+Math.random()" title="点击图片重新获取验证码">
```
**2. 后端验证**
```php
'captcha' => 'required|captcha',
```
此表达式的第二个 `captcha` 是扩展包自定义的表单验证规则

#### 2. [overtrue/laravel-lang][2]

用途：语言处理

安装
```bash
$ composer require "overtrue/laravel-lang:~3.0"
```
#### 3. [intervention/image][3]

用途：处理图片裁剪

安装
```bash
$ composer require intervention/image
```
生成配置信息文件 `config/image.php`
```bash
$ php artisan vendor:publish --provider="Intervention\Image\ImageServiceProviderLaravel5"
```
使用

**1. 实例化**
```php
// 参数是文件磁盘物理路径
$image = Image::make($file_path)
```
**2. 大小调整**
```php
$image->resize($max_width, null, function ($constraint) {
    // 设定宽度是 $max_width，高度等比例双方缩放
    $constraint->aspectRatio();

    // 防止图片裁剪时图片尺寸变大
    $constraint->upsize();
});
```
**3. 保存**
```php
$image->save();
```
#### 4. [summerblue/generator][4]

用途：代码生成器，一条命令完成注册路由、新建模型、新建表单验证类、新建资源控制器以及所需视图文件

安装
```bash
$ composer require "summerblue/generator:~0.5" --dev
```
使用
```bash
$ php artisan make:scaffold Topic --schema="title:string:index,body:text,user_id:integer:unsigned:index,category_id:integer:unsigned:index,reply_count:integer:unsigned:default(0),view_count:integer:unsigned:default(0),last_reply_user_id:integer:default(0),order:integer:unsigned:default(0),excerpt:text,slug:string:nullable"
```
执行结果

1. 创建话题的数据库迁移文件 —— xxx_xx_xx_create_topics_table.php;
2. 创建话题数据工厂文件 —— TopicFactory.php;
3. 创建话题数据填充文件 —— TopicsTableSeeder.php;
4. 创建模型基类文件 —— Model.php，并创建话题数据模型;
5. 创建话题控制器 —— TopicsController;
6. 创建表单请求的基类文件 —— Request.php，并创建话题表单请求验证类;
7. 创建话题模型事件监控器 `TopicObserver` 并在 `AppServiceProvider` 中注册;
8. 创建策略授权基类文件 —— Policy.php，同时创建话题授权类，并在 `AppServiceProvider` 中注册;
9. 在 `web.php` 中更新路由，新增话题相关的资源路由;
10. 新建符合资源控制器要求的三个话题视图文件，并存放于 `resource/views/topics` 目录中;
11. 执行了数据库迁移命令 `artisan migrate`;
12. 因此次操作新建了多个文件，最终执行 `composer dump-autoload` 来生成 `classmap`。

#### 5. [laravel-debugbar][5]

用途：Laravel 开发者调试工具

安装
```bash
$ composer require "barryvdh/laravel-debugbar:~3.1" --dev
```
生成配置文件 `config/debugbar.php`
```bash
$ php artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"
```
使用

修改 `config/debugbar.php` 的配置
```php
'enabled' => env('APP_DEBUG', false),
```
修改后，Debugbar 启动状态由 `.env` 文件中的 `APP_DEBUG` 值决定

#### 6. [hieu-le/active][6]

用途：通过判断 『路由命名』 和 『路由参数』 为导航栏添加 `active` 类

安装
```bash
$ composer require "hieu-le/active:~3.5"
```
使用
```html
<ul class="nav navbar-nav">
    <li class="{ { active_class(if_route('topics.index')) }}"><a href="{ { route('topics.index') }}">话题</a></li>
    <li class="{ { active_class((if_route('categories.show') && if_route_param('category', 1))) }}"><a href="{ { route('categories.show', 1) }}">分享</a></li>
</ul>
```
说明
```php
function active_class($condition, $activeClass = 'active', $inactiveClass = '')
```
如果满足指定条件 `$condition` ，此函数将返回 `$activeClass` ，否则将返回 `$inactiveClass` 。

API

1. if_route() - 判断当前对应的路由是否是指定的路由；
2. if_route_param() - 判断当前 url 有无指定的参数；
3. if_query() - 判断指定的 GET 变量是否符合设置的值；
4. if_uri() - 判断当前的 url 是否满足指定的 url；
5. if_route_pattern() - 判断当前路由是否包含指定的字符；
6. if_uri_pattern() - 判断当前 url 是否包含指定的字符。

#### 7. [HTMLPurifier for Laravel][7]

用途：运用 『白名单机制』 对 HTML 文本信息进行 XSS 过滤

安装
```bash
$ composer require "mews/purifier:~2.0"
```
发布配置文件 `config/purifier.php`
```bash
$ php artisan vendor:publish --provider="Mews\Purifier\PurifierServiceProvider"
```
使用

**1. 修改配置信息**
```php
<?php

return [
    'encoding'      => 'UTF-8',
    'finalize'      => true,
    'cachePath'     => storage_path('app/purifier'),
    'cacheFileMode' => 0755,
    'settings'      => [
        'user_topic_body' => [
            'HTML.Doctype'             => 'XHTML 1.0 Transitional',
            'HTML.Allowed'             => 'div,b,strong,i,em,a[href|title],ul,ol,ol[start],li,p[style],br,span[style],img[width|height|alt|src],*[style|class],pre,hr,code,h2,h3,h4,h5,h6,blockquote,del,table,thead,tbody,tr,th,td',
            'CSS.AllowedProperties'    => 'font,font-size,font-weight,font-style,margin,width,height,font-family,text-decoration,padding-left,color,background-color,text-align',
            'AutoFormat.AutoParagraph' => true,
            'AutoFormat.RemoveEmpty'   => true,
        ],
    ],
];
```
**2. 调用 `clean()` 方法**
```php
$topic->body = clean($topic->body, 'user_topic_body');
```
#### 8. [Guzzle][8]

用途：PHP HTTP 请求组件

安装
```bash
$ composer require "guzzlehttp/guzzle:~6.3"
```
使用
```php
use GuzzleHttp\Client;
// 实例化 HTTP 客户端
$http = new Client;
// 请求地址
$api = 'xxx';
// 构建请求参数
$query = http_build_query([xxx]);
// 发送 HTTP Get 请求
$response = $http->get($api.$query);
```

#### 9. [overtrue/pinyin][9]

用途：一套优质的汉字转拼音解决方案

安装
```bash
$ composer require "overtrue/pinyin:~3.0"
```
使用
```php
use Overtrue\Pinyin\Pinyin;

str_slug(app(Pinyin::class)->permalink($text));
```

#### 10. [Horizon][10]

用途：Horizon 为 Laravel Redis 提供了一个漂亮的仪表盘界面，可以很方便的查看和管理 Redis 队列执行任务

安装
```bash
$ composer require "laravel/horizon:~1.0"
```
发布配置文件 `config/horizon.php` 和存放在 `public/vendor/horizon` 中的 CSS、JS 等资源文件。
```bash
$ php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"
```
使用

打开 `http://xxx.com/horizon` 访问控制台

启动（Horizon是一个监控程序，需要常驻运行）
```bash
$ php artisan horizon
```
定义访问策略
```php
\Horizon::auth(function ($request) {
    // 根据返回 `true` 或 `false` 决定是否有权限访问
    return \Auth::user()->hasRole('Founder');
})
```
#### 11. [Laravel-permission][11]

用途：用户授权管理

安装
```bash
$ composer require "spatie/laravel-permission:~2.7"
```
生成数据库迁移文件
```bash
$ php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="migrations"
```
将生成数据表：

* roles —— 角色的模型表；
* permissions —— 权限的模型表；
* model_has_roles —— 模型与角色的关联表，用户拥有什么角色在此表中定义，一个用户能拥有多个角色；
* role_has_permissions —— 角色拥有的权限关联表，如管理员拥有查看后台的权限都是在此表定义，一个角色能拥有多个权限；
* model_has_permissions —— 模型与权限关联表，一个模型能拥有多个权限。

生成配置文件 `config/permissions.php`：
```bash
$ php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="config"
```
使用

**1. 加载 HasRoles**

*app/Models/User.php*
```php
<?php

use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRole;
    ...
}
```
**2. 创建权限**

```php
use Spatie\Permission\Models\Permission;
// 清除缓存
app()['cache']->forget('spatie.permission.cache');

Permission::create(['name' => 'manage_contents']);
Permission::create(['name' => 'manage_users']);
Permission::create(['name' => 'edit_settings']);
```

**3. 创建角色**
```php
use Spatie\Permission\Models\Role;
// 创建站长角色
$founder = Role::create(['name' => 'Founder']);
$founder->givePermissionTo('manage_contents');
$founder->givePermissionTo('manage_users');
$founder->givePermissionTo('edit_settings');

// 创建管理员角色
$maintainer = Role::create(['name' => 'Maintainer']);
$maintainer->givePermissionTo('manage_contents');
```
**4. 初始化角色**
```php
// 初始化用户为 Founder 角色
$user->assignRole('Founder');

// 初始化用户为 Maintainer 角色
$user->assignRole('Maintainer');

// 多个角色
$user->assignRole('writer', 'admin');
$user->assignRole(['writer', 'admin']);
```
**5. 检查用户角色**
```php
// 是否是站长
$user->hasRole('Founder');

// 是否拥有至少一个角色
$user->hasAnyRole(Role::all());

// 是否拥有所有角色
$user->hasAllRoles(Role::all());
```
**6. 检查权限**
```php
// 检查用户是否有某个权限
$user->can('manage_contents');

// 检查角色是否有某个权限
$role->hasPermissionTo('manage_contents');
```
**7. 直接给用户添加权限**
```php
// 为用户添加权限
$user->givePermissionTo('manage_contents');

// 获取所有直接权限
$user->getDirectPermissions()
```
#### 12.[sudo-su][12]

用途：用户切换工具

安装
```bash
$ composer require "viacreative/sudo-su:~1.1"
```
添加 Provider

*app/Providers/AppServiceProvider.php*
```php
...
public function register()
{
    if (app()->isLocal()) {
        $this->app->register(\VIACreative\SudoSu\ServiceProvider::class);
    }
}
...
```
发布资源文件
```bash
$ php artisan vendor:publish --provider="VIACreative\SudoSu\ServiceProvider"
```
会生成 `/public/sudo-su` 前端资源文件、`config/sudosu.php` 配置信息文件

修改配置信息

*config/sudosu.php*
```php
<?php

return [
    // 允许使用的顶级域名
    'allowed_tlds' => ['dev', 'local', 'test'],

    // 用户模型
    'user_model' => App\Models\User::class
];
```
使用

在模板文件中写入调用代码
```html
include('sudosu:user-selector')
```

相关链接：
[https://laravel-china.org/courses/laravel-intermediate-training-5.5](https://laravel-china.org/courses/laravel-intermediate-training-5.5)

[1]: https://github.com/mewebstudio/captcha
[2]: https://github.com/overtrue/laravel-lang
[3]: https://github.com/Intervention/image
[4]: https://github.com/summerblue/generator
[5]: https://github.com/barryvdh/laravel-debugbar
[6]: https://github.com/letrunghieu/active
[7]: https://github.com/mewebstudio/Purifier
[8]: https://github.com/guzzle/guzzle
[9]: https://github.com/overtrue/pinyin
[10]: https://laravel-china.org/docs/laravel/5.5/horizon/1345
[11]: https://github.com/spatie/laravel-permission
[12]: https://github.com/viacreative/sudo-su
