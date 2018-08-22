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
### 用到的扩展包

---
#### 1.[mews/captcha][1]

安装
```bash
composer require "mews/captcha:~2.0"
```
生成配置文件 `config/captcha.php`
```bash
$ php artisan vendor:publish --provider="Mews\Captcha\CaptchaServiceProvider"
```
使用

**1.前端展示**
```html
<img class="thumbnail captcha" src="{ { captcha_src('flat') }}" onclick="this.src='/captcha/flat?'+Math.random()" title="点击图片重新获取验证码">
```
**2.后端验证**
```php
'captcha' => 'required|captcha',
```
此表达式的第二个 `captcha` 是扩展包自定义的表单验证规则

#### 2.[overtrue/laravel-lang][2]

安装
```bash
$ composer require "overtrue/laravel-lang:~3.0"
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

相关链接：
[https://laravel-china.org/courses/laravel-intermediate-training-5.5](https://laravel-china.org/courses/laravel-intermediate-training-5.5)

[1]: https://github.com/mewebstudio/captcha
[2]: https://github.com/overtrue/laravel-lang
