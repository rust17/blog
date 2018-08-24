---
title: "Laravel API 知识学习记录"
layout: post
date: 2018-08-24 09:58
headerImage: false
tag:
- learn
- 学习记录
category: blog
author: circle
description: 记录一些学习 Laravel API 的过程中的知识点
---
&emsp;&emsp;这篇文章主要目的在于记录一些在 [L03 Laravel 教程 - 实战构架 API 服务器](https://laravel-china.org/courses/laravel-advance-training-5.5)学到的知识点。原则是记录如何使用，侧重点在于用与记录。 

---
### 用 URL 定位资源

---
在 RESTful 的架构中，每一个 URL 都代表着一种资源。资源是名词，尽量不要在 URL 中出现动词。
```
GET /issues										列出所有的 issue
GET /orgs/:org/issues							列出某个项目的 issue
GET /repos/:owner/:repo/issues/:number  		获取某个项目的某个 issue
POST /repos/:owner/:repo/issues					为某个项目创建 issue
PATCH /repos/:owner/:repo/issues/:number		修改某个 issue
PUT /repos/:owner/:repo/issues/:number/lock 	锁住某个 issue
DELETE /repos/:owner/:repo/issues/:number/lock  接收某个 issue
```
### HTTP 动词描述

---
| 动词 | 描述 | 是否幂等 |
| :- | :- | :- |
| GET | 获取资源，单个或多个 | 是 |
| POST | 创建资源 | 否 |
| PUT | 更新资源，客户端提供完整的资源 | 是 |
| PATCH | 更新资源，客户端提供部分的资源 | 否 |
| DELETE | 删除资源 | 是 |

### 资源过滤

---
```
?state=closed: 不同状态的资源
?page=2&per_page=100: 访问第几页，每页多少条。
?sortby=name&order=asc: 指定返回结果按照哪个属性排序，以及排序顺序。
```
### HTTP 状态码

---
* 200 OK - 对成功的 GET、PUT、PATCH、DELETE 操作进行响应，也可以用于不创建资源的 POST 操作上
* 201 Created - 对创建新资源的 POST 操作进行响应。应该带着指向新资源地址的 Location 头
* 202 Accepted - 服务器接收了请求，但是还未处理，响应中应该包含相应的指示信息，告诉客户端去哪里查询关于本次请求的信息
* 204 No Content - 对不会返回响应体的成功请求进行响应（比如 DELETE 请求）
* 304 Not Modified - HTTP 缓存 header 生效的时候用
* 400 Bad Request - 请求异常，比如请求中的 body 无法解析
* 401 Unauthorized - 没有进行认证或者认证非法
* 403 Forbidden - 服务器已经理解了请求，但是拒绝执行它
* 404 Not Found - 请求一个不存在的资源
* 405 Method Not Allowed - 所请求的 HTTP 方法不允许当前认证用户访问
* 410 Gone - 表示当前请求的资源不再可用。当调用老版本 API 时很有用
* 415 Unsupported Media Type - 如果请求中的内容类型是错误的
* 422 Unprocessable Entity - 用来表示校验错误
* 429 Too Many Requests - 由于请求频次达到上限而被拒绝访问

### 数据响应格式

---
默认使用 JSON 作为数据响应格式，客户端有需求使用其它响应格式，需在 Accept 头中指定需要的格式
```
http://api.larabbs.com/
	Accept: application/prs.larabbs.v1+json
	Accept: application/prs.larabbs.v1+xml
```
对于错误数据
```
'message' => ':message',			// 错误的具体描述
'errors' => ':error',				// 参数的具体错误描述，422 等状态提供
'code' => ':code',					// 自定义的异常码
'status_code' => ':status_code',	// http 状态码
'debug' => ':debug',				// debug 信息，非生产环境提供
```
### 调用频率限制

---
* X-RateLimit-Limit : 100 最大访问次数
* X-RateLimit-Remaining : 93 剩余的访问次数
* X-RateLimit-Reset : 1234567 到该时间点，访问次数会重置为 X-RateLimit-Limit

### 修改数据库结构

---
在迁移文件中
```php
pubic function up()
{
	Schema::table('users', function (Blueprint $table) {
		$table->string('phone')->nullable()->unique()->after('name');
		$table->string('email')->nullable()->change();
	});
}

public function down()
{
	Schema::table('users', function (Blueprint $table) {
		$table->dropColumn('phone');
		$table->string('email')->nullable(false)->change();
	});
}
```
在执行迁移命令之前，需要先安装 `doctrine/dbal` 组件
```bash
$ composer require doctrine/dbal
```

### API 路由的写法

---
*route/api.php*
```php
<?php

use Illuminate\Http\Request;

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', [
	'namespace' => 'App\Http\Controller\Api', // 使得 v1 版本的路由都指向 App\Http\Controllers\Api
], function($api) {
	$api->post('verificationCodes', 'VerificationCodesController@store')
		->name('api.verificationCodes.store');
});
```
### API 的表单验证

---
```php
...
use Dingo\Api\Http\FormRequest;

class xxxRequest extends FormRequest
{
	public function authorize()
	{
		return true;
	}

	public function rules()
	{
		return [
			'phone' => [
				'required',
				'regex:/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/',
				'unique:users'
			]
		];
	}
}
```
### API 的返回数据

---
```php
return $this->response->array([xxx])->setStatusCode(xxx);
```
### 防止时序攻击的字符串比较

---
```php
hash_equals($verifyData['code'], $request->verification_code);
```
### 调用频率限制

---
通过中间件添加频率限制
```php
...
$api->version('v1', [
	'namespace' => 'App\Http\Controllers\Api',
], function ($api) {
	$api->group([
		// 设置为一分钟一次
		'middleware' => 'api.throttle',
		'limit' => 1,
		'expires' => 1,
	], function($api) {
		$api->post('xxx', 'xxx')->name('xxx');
	});
});
```
### OAuth 2.0 流程解释

---
1. 客户端（app/浏览器）将用户导向第三方认证服务器
2. 用户在第三方服务器，选择是否给予客户端授权
3. 用户同意授权后，认证服务器将用户导向客户端事先指定的 `重定向URI`，同时附上一个授权码
4. 客户端获取授权码发送至服务器，服务器通过授权码以及 `APP_SECRET` 向第三方服务器申请 `access_token`
5. 服务器通过 `access_token`，向第三方服务器申请用户数据，完成登录流程

### 用到的扩展包

---
#### 1. [dingo/api][1]

用途：一个 RestFul 工具包，帮助我们快速构建 RestFul Api

修改

*composer.json*
```json
...
	"config": {
		"preferred-install": "dist",
		"sort-packages": true,
		"optimize-autoloader": true
	},
	"minimum-stability": "dev", // 设定的最低稳定性的版本为 dev 也就是可以依赖开发版本的扩展包
	"prefer-stable": true // Composer 优先使用更稳定的包版本
```
安装 Laravel 5.5 的适配版本为dingo/api:v2.0.0-alpha2
```bash
$ composer require dingo/api:2.0.0-alpha2
```
配置
```bash
$ php artisan vendor:publish
```
使用

*.env*
```
...
API_STANDARS_TREE=prs // 未对外发布的，提供给公司app，单页应用，桌面应用等
API_SUBTYPE=larabbs // 项目的简称
API_PREFIX=api // 表示可以通过 www.larabbs.com/api 或者 api.larabbs.com 来访问
API_VERSION=v1
API_DEBUG=true
```
以上配置访问方式
```
http://larabbs.test/api
	Accept: application/prs.larabbs.v1+json
```
#### 2. [easy-sms][2]

用途：短信发送

安装
```bash
$ composer require "overtrue/easy-sms"
```
添加配置文件

*config/easysms.php*
```php
参照文档
```
新建 ServiceProvider
```bash
$ php artisan make:provider EasySmsServiceProvider
```

*app/providers/EasySmsServiceProvider.php*
```php
<?php

namespace App\Providers;

use Overtrue\EasySms\EasySms;
use Illuminate\Support\ServiceProvider;

class EasySmsServiceProvider extends ServiceProvider
{
	public function boot()
	{

	}

	public function register()
	{
		$this->app->singleton(EasySms::class, function ($app) {
			return new EasySms(config('easysms'));
		});

		$this->app->alias(EasySms::class, 'easysms');
	}
}
```
在 `config/app.php` 的 `providers` 中添加 `App\Providers\EasySmsServiceProvider::class`
```php
...
App\Providers\EventServiceProvider::class,
App\Providers\RouteServiceProvider::class,

App\Providers\EasySmsServiceProvider::class,
...
```
使用
```php
$sms = app('easysms');
try {
	$sms->send(1352435262, [
		'content' => 'xxxx(短信内容)',
	]);
} catch (\Overtrue\EasySms\Exceptions\NoGatewayAvailableException $exception) {
	$message = $exception->getException('xxx')->getMessage();
}
```
#### 3.[gregwar/captcha][3]

用途：生成图片验证码，不依赖 session

安装
```bash
$ composer require gregwar/captcha
```
使用
```php
use Gregwar\Captcha\CaptchBuilder;

$captcha = $captchaBuilder->build();

// 将验证码字符串存放于缓存当中，设置过期时间
\Cache::put($key, ['code' => $captcha->getPhrase()], $expiredAt);

// 得到 base64 格式的图片验证码
$captcha->inline();
```
#### 4.[socialiteproviders/weixin][4]

用途：提供第三方登录方式

安装
```bash
$ composer require socialiteproviders/weixin
```
设置 `EventServiceProvider`

*app/Providers/EventServiceProvider.php*
```php
...
protected $listen = [
	\SocialiteProviders\Manager\SocialiteWasCalled::class => [
		'SocialiteProviders\Weixin\WeixinExtendSocialite@handle',
	],
];
```
使用
```php
// 1.客户端已经获取了 access_token
$accessToken = 'ACCESS_TOKEN';
$openId = 'OPEN_ID';
$driver = Socialite::driver('weixin');
$driver->setOpenId($openId)
$oauthUser = $driver->userFromToken($accessToken);

// 2.客户端只获取授权码 code，需要在服务端配置 app_id 以及 app_secret
$code = 'CODE';
$driver = Socialite::driver('weixin');
$response = $driver->getAccessTokenResponse($code);
$driver->setOpenId($response['openid']);
$oauthUser = $driver->userFromToken($response['access_token']);

// 获取用户信息
$oauthUser->offsetExists('unionid'); // 判断是否存在
$oauthUser->offsetGet('unionid'); // 获取 unionid 
$oauthUser->getNickname(); //获取昵称
$oauthUser->getAvatar(); // 获取头像
$oauthUser->getId(); // 获取 openid
```
#### 5.[jwt-auth][5]

用途：使用 JWT 规范在用户与服务器之间传递用户信息

安装
```bash
$ composer require tymon/jwt-auth:1.0.0-rc.2
```
配置

生成并保存 `secret`
```bash
$ php artisan jwt:secret
```
修改

*config/auth.php*
```php
...
'guards' => [
	'web' => [
		'driver' => 'session',
		'provider' => 'users',
	],

	'api' => [
		'driver' => 'jwt',
		'provider' => 'users',
	],
],
...
```
*config/api.php*
```php
...
'auth' => [
	'jwt' => 'Dingo\Api\Auth\Provider\JWT',
],
...
```
User 模型需要继承 `Tymon\JWTAuth\Contracts\JWTSubject` 接口，并实现两个方法 `getJWTIdentifier()` 和 `getJWTCustomClaims()`

*app\Models\User.php*
```php
...
use Tymon\JWTAuth\Contracts\JWTSubject;
...
public function getJWTIdentifier()
{
	return $this->getKey();
}

public function getJWTCustomClaims()
{
	return [];
}
...
```
使用
```php
$user = App\Models\User::first();

// 根据用户信息获取 token 的方式： 
1. $token = Auth::guard('api')->fromUser($user);
2. $token = Auth::guard('api')->attempt($credentials);

// 设置过期时间
$token = Auth::guard('api')->setTTL(365 * 24 * 60)->fromUser($user);

// 获取 token 过期时间
$time = Auth::guard('api')->factory()->getTTL() * 60;

// 刷新 token
$token = Auth::guard('api')->refresh();

// 删除 token
Auth::guard('api')->logout();
```

相关链接：[https://laravel-china.org/courses/laravel-advance-training-5.5](https://laravel-china.org/courses/laravel-advance-training-5.5)

[1]: https://github.com/dingo/api/
[2]: https://github.com/overtrue/easy-sms
[3]: https://github.com/Gregwar/Captcha
[4]: https://socialiteproviders.github.io/
[5]: https://github.com/tymondesigns/jwt-auth
