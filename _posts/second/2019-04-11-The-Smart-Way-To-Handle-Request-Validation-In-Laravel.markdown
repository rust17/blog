---
title: "[译] —— 在 Laravel 中处理请求验证最优雅的方法 😎"
layout: post
date: 2019-04-11 10:30
headerImage: false
tag:
- translation
- laravel
- validation
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 介绍了一种在 Laravel 中处理请求验证的方法
---

Laravel 是一个为 web 艺术家开发的 PHP 框架，可以帮助我们构建功能强大的应用程序以及 API 接口。在任何应用中处理请求验证都是非常关键的部分，也许你们早已知道在 Laravel 中有许多处理验证请求的方式。Laravel 拥有一些很棒的特性，从而让它可以很优雅地处理请求。

### 开始

也许，我们大多数人熟悉在控制器中使用验证器，因为这是处理输入请求非常普遍的方式。

以下是在 `UserController` 控制器中我们的验证器例子

```php
<?php

namespace App\Http\Controllers\API\v1\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Entities\Models\User;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // 验证输入的请求

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:50',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            Session::flash('error', $validator->messages()->first);
            return redirect()->back()->withInput();
        }

        // 然后存储我们的用户
    }
}
```

在控制器中验证输入的请求并没有什么错，但这并不是最好的方式并且会让你的控制器看起来很杂乱。在我看来，这是一个反例。**控制应该只做一件事情那就是处理从路由分发过来的请求以及返回一个合适的响应。**

在控制器中写验证器逻辑会打破 **单一职责原则**。我们都知道需求会随着时间推移而改变，并且每次需求变化会使得你的类的职责也会发生改变。因此一个类承担了太多职责会使其难以维护。

Laravel 具有[表单请求][1]功能，就是指单独的一个包含了验证逻辑的请求类。你可以通过以下 Artisan 命令新建一个验证请求类。

```shell
php artisan make:request UserStoreRequest
```

这将在 `app\Http\Request\UserRequest` 下新建一个验证请求类

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:50',
            'password' => 'required'
        ];
    }
     /**
     * Custom message for validation
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.required' => 'Email is required!',
            'name.required' => 'Name is required!',
            'password.required' => 'Password is required!'
        ];
    }
}
```

Laravel 表单请求类自带了两个默认方法 `auth()` 和 `rules()`。你可以在 `auth()` 方法中执行任意用户认证逻辑来确认当前用户是否可以继续请求。在 `rules()` 方法中你可以书写所有的验证规则。除此之外，还有一个 `messages()` 方法，你可以以数组的方式传递验证不通过返回的消息。

现在修改我们的 `UserController` 使用 `UserStoreRequest`。你可以提供类型提示明确要求注入的类，Laravel 会自动解析注入以及在调用控制器方法之前执行校验逻辑。

```php
<?php

namespace App\Http\Controllers\API\v1\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;

class UserController extends Controller
{
    public function store(UserStoreRequest $request)
    {
        // 将仅返回验证过的数据

        $validated = $request->validated();
    }
}
```

现在，我们的控制器现在变得精简以及便于维护。我们的控制器不需要关心任何验证逻辑。我们拥有了我们自己的验证类，该类仅仅处理验证逻辑，让控制器可以做其它事情。

如果验证不通过，将重定向至预定义的地址以及携带错误信息返回给用户。该错误信息是否暂存在 sessions 中取决于你的请求类型。如果请求是一个 AJAX 请求则返回一个 JSON 格式的错误信息并携带 422 状态码。

### ✨ 福利

通过过滤输入来保持你的应用程序和用户安全。在你的项目中使用过滤器可以确保数据是经过格式化并且一致的。在许多情况下，验证失败往往是由愚蠢的格式问题引起的。

一个用户可能像这样输入移动号码 +99-9999-999999 或者 +99-(9999)-(999999)。我们不能强迫用户重新输入相同的信息，这是非常常见的错误。

一个别的例子是像用户输入邮箱像 FOO@Bar.COM 或者 FOO@Bar.com。或者输入姓名像 **FOO bAR** 或者 **foo baR**。

过滤器包含了转换的方法，可以将数据过滤成通用的格式后再提供给验证器。

我正在使用 [`Waavi/Sanitizer`][2] 扩展包，该扩展包拥有许多过滤器。

这里让我们为表单请求新建一个 `BaseFormRequest` 抽象类并且使用 `SanitizesInput` trait。

```php
<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Waavi\Sanitizer\Laravel\SanitizesInput;

abstract class BaseFormRequest extends FormRequest
{
    use ApiResponse, SanitizesInput;

    /**
     * 打开 https://github.com/Waavi/Sanitizer 查看更多关于消毒器的使用
     */
    public function validateResolved()
    {
        {
            $this->sanitize();
            parent::validateResolved();
        }
    }

    /**
     * 获取适用于请求的验证规则
     *
     * @return array
     */
    abstract public function rules();

    /**
     * 判断用户是否已授权访问该请求
     *
     * @return bool
     */
    abstract public function authorize();
}

```
现在，我们可以这样写我们的 `UsersStoreRequest`。从基类继承表单输入类，这样我们就不需要在所有的请求类里单独引入 trait 了。

```php
<?php

namespace App\Http\Requests;

class UserStoreRequest extends BaseFormRequest
{
    /**
     * 决定了该用户是否有权限进行请求
     * 
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * 定义了申请请求的验证规则
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:50',
            'password' => 'required',
        ];
    }

    public function message()
    {
        return [
            'email.required' => 'Email is required!',
            'name.required' => 'Name is required',
            'password.required' => 'Password is required',
        ];
    }

    /**
     * 应用于输入的过滤器
     *
     * @return array
     */
    public function filters()
    {
        return [
            'email' => 'trim|lowercase',
            'name' => 'trim|capitalize|escape',
        ];
    }
}
```

`SanitizesInput` 的 trait 提供了一个 `filters()` 方法，该方法用于在我们提供数据给验证器之前先格式化该数据。`filters()` 方法会返回一个验证过滤过的数组。这里，我们将用户输入的邮箱转换成小写以及去除多余空格，同理将姓名转换成大写以及过滤掉 HTML 标签。

你可以在[这里][3]阅读更多关于该过滤器的可用规则。

### 结论

刚开始的时候，将请求类单独分离出来看似是不必要的。但是想象一下，如果你将所有验证逻辑存放于一个控制器当中，当你或者接手的人 😛 想要去维护代码的时候简直就是噩梦啊 👻。

感谢阅读。

我很乐意听到你的想法。如果你有任何的疑问或者建议，请在下方留下评论。

祝你有美好的一天。 

---
原文地址：[https://medium.com/@kamerk22/the-smart-way-to-handle-request-validation-in-laravel-5e8886279271](https://medium.com/@kamerk22/the-smart-way-to-handle-request-validation-in-laravel-5e8886279271)

作者：[KashYap Merai](https://medium.com/@kamerk22)

---

[1]: https://laravel.com/docs/5.6/validation#form-request-validation
[2]: https://github.com/Waavi/Sanitizer
[3]: https://github.com/Waavi/Sanitizer
