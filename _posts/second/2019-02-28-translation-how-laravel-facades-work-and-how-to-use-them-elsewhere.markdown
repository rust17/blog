---
title: "译 —— Laravel 门面模式是如果工作的以及在其它框架中如何使用"
layout: post
date: 2018-02-28 13:30
headerImage: false
tag:
- translation
- laravel
- facade
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 介绍了 Laravel 的门面模式以及如何移植到别的框架中
---

门面模式是一种常用的面向对象软件设计模式。实际上，一个门面就是指一个通过封装功能复杂的类库并提供简单易读接口的类。门面模式也可以用于为复杂和糟糕设计 API 提供统一的、精心设计的 API。

Laravel 框架当中有一个特性类似于这种模式，也被称作门面。在这篇教程我们将学到如何将 Laravel 的门面模式带到别的框架。在此之前，你需要对 [Ioc 容器](https://www.sitepoint.com/inversion-of-control-the-hollywood-principle/)有一点基本的理解。

首先，让我们看看 Laravel 门面的内部工作部分，然后，我们将讨论如何将这个特性改写适配到别的框架中。

### Laravel 中的门面模式

Laravel 的一个门面，是指一个提供了类似静态接口访问容器内部服务的类。根据官方文档的说明，这些门面，作为访问容器服务的底层实现提供了一个代理途径。

然而，关于[这个命名](https://www.brandonsavage.net/lets-talk-about-facades/)，PHP 社区存在着许多争论。一些人认为这个术语应该改变以避免开发者的疑惑，因为它并没有完全遵循门面模式实行。如果你对这个命名感到迷惑了，你可以以自己的方式随意去理解，不过请注意，我们将要使用的基类在 Laravel 框架当中被称作门面。

### 在 Laravel 当中门面模式是怎样实现的

你可能知道，Laravel 容器内的每一个服务都有唯一的名字。在一个 Laravel 应用中，我们想要直接访问容器内的服务，可以使用 `App::make()` 方法或者 `app()` 帮助函数。

```php
<?php 

App::make('some_service')->methodName();
```

正如之前所说，Laravel 使用了门面类使得开发者可以以一种更加可读的方式访问服务。通过使用门面类，我们只需要写以下代码就可以做相同的事情。

```php
//...
someService::methodName();
//...
```

在 Laravel 当中，所有的服务都有一个门面类。这些门面类继承了 `Illuminate/Support` 内的门面基类。类唯一需要做的事情就是实现 `getFacadeAccesor` 方法，该方法返回了容器内的服务名称。

在上面的代码中，`someService` 指的就是门面类。`methodName` 实际上就是容器内的原始服务。如果我们脱离了 Laravel 的上下文来看待这个写法，这意味着有一个叫 `someService` 的类暴露了一个名字叫 `methodName()` 的静态方法，但这并不是 Laravel 实现这个接口的原理。在下一部分，我们将会看到表面之下的 Laravel 门面基类是如何工作的。

### 门面基类

门面基类定义了一个叫 `$app` 的私有属性用来保存了指向服务容器的实例。如果我们需要在 Laravel 之外使用门面，那么必须先在容器内明确设置使用 `setFacadeApplication()` 方法。我们很快就会讲到这点。

在门面基类内部，已经定义好了魔术方法 `__callStatic`，该方法用于处理调用类内不存在的静态方法的情况。当我们针对 Laravel 门面类调用静态方法时，因为类内没有实现该方法，那么 `__callStatic` 方法就会被触发。所以，`__callStatic` 方法从容器中取出服务并调用对应的方法。

这就是一个门面基类内部的 `__callStatic` 方法的实现：

```php
<?php
//...
/**
    * Handle dynamic, static calls to the object.
    *
    * @param string $method
    * @param array $args
    * @return mixed
    */
    public static function __callStatic($method, $arg)
    {
        $instance = static::getFacadeRoot();

        switch (count($args)) {
            case 0:
                return $instance->$method();

            case 1:
                return $instance->$method($args[0]);

            case 2:
                return $instance->$method($args[0], $args[1]);

            case 3:
                return $instance->$method($args[0], $args[1], $args[2]);

            case 4:
                return $instance->$method($args[0], $args[1], $args[2], $args[3]);

            default:
                return call_user_func_array([$instance, $method], $args);
        }
    }
```

上述方法内部的 `getFacadeRoot()` 负责从容器内部获取服务。

### 解剖一个门面类

每一个门面类都继承自门面基类。我们唯一需要做的就是实现 `getFacadeAccessor()` 方法。该方法的唯一作用是返回容器内的服务名称。

```php
<?php namespace App\Facades;

use Illuminate\Support\Facades\Facade as BaseFacade;

class SomeServiceFacade extends BaseFacade {

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor() { return 'some.service'; }
}
```

### 别名

由于 Laravel 门面类是 PHP 类，在使用之前我们需要先引入。感谢 PHP 的命名空间以及自动加载机制，当我们以合法的名称访问门面类的时候，所有的类都已经被自动加载过了。PHP 还支持通过使用 `use` 指令给类起别名。

```php
use App\Facades\SomeServiceFacade

SomeServiceFacade::SomeMethod();
```

然而，我们如果需要某个特定的门面类，就必须在每个类中重复这段代码。而 Laravel 已经通过别名自动加载器的方式加载别名对应的门面类。

### Laravel 是怎样对门面进行别名的

所有的别名都保存在配置文件 `app.php` 内的 `aliases` 数组当中，该文件位于 `/config` 文件夹内。

让我们看一下这个数组，我们可以看到每一个别名都映射到一个完全合法的类名。 这就意味着我们可以为门面类起**任意的**别名：

```php
//...
'aliases' => [
    //...
    'FancyName' => 'App\Facades\SomeServiceFacade',
],
```

好，现在让我们来看看 Laravel 是怎样使用这个数组关联到门面类的。在自动加载阶段，Laravel 调用了一个 `Illuminate\Foundation` 内部叫 `AliasLoader` 的服务。`AliasLoader` 接收 `aliases` 数组，遍历所有的元素，然后使用 [spl_autoload_register](http://php.net/manual/en/function.spl-autoload-register.php) 方法创建一个 `__autoload` 函数队列。每一个 `__autoload` 函数通过使用 PHP 的 [class_alias](http://php.net/manual/en/function.class-alias.php) 函数为对应的门面类创建一个别名。

这样做的结果是，我们不需要在使用这些类之前引入每一个类并且通过 `use` 指令给每个类起别名。因此每当我们访问一个不存在的类时，PHP 就会检查 `__autoload` 队列获取合适的自动加载器。到那个时候，`AliasLoader` 早已注册好了所有的 `__autoload` 函数。每个自动加载器将别名类名根据 `aliases` 数组解析到原始的类名。最后，为这些类创建别名类。想象下以下方法的调用：

```php
// 根据 aliases 数组 FancyName 被解析到了 App\Facades\SomeServiceFacade

FancyName::someMethod()
```

表面之下，`FancyName` 被解析到了 `App\Facades\SomeServiceFacade` 这个类下了。

---
原文地址：[https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/](https://www.sitepoint.com/how-laravel-facades-work-and-how-to-use-them-elsewhere/)

作者：[Reza Lavarian](https://www.sitepoint.com/author/mrezalav/)

---


