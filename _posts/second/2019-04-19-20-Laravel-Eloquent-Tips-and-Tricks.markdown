---
title: "[译] —— 二十个 Laravel Eloquent 使用小技巧"
layout: post
date: 2019-04-19 19:30
headerImage: false
tag:
- translation
- laravel
- eloquent
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 介绍一些 Laravel Eloquent 的使用技巧
---

Eloquent ORM 看起来像一个简单的机制，但是表面之下，有许多未暴露的方法以及不知名的方式，使用这些方法可以用来实现更强大的功能。在这篇文章里，我将向你展示一些使用技巧。

### 1. 自增和自减

与其这样：

```php
$article = Article::find($article_id);
$article->read_count++;
$article->save();
```

不如这样：

```php
$article = Article::find($article_id);
$article->increment('read_count');
```

这样也可以：

```php
Article::find($article_id)->increment('read_count');
Article::find($article_id)->increment('read_count', 10); // +10
Product::find($product_id)->increment('stock'); // -1
```

### 2. XorY 方法

Eloquent 有好几个包含了两个方法的函数，例如“执行 X，不然就执行 Y”。

**例子 1** - findOrFail():

与其这样：

```php
$user = User::find($id);
if (!$user) { abort (404); }
``` 

不如这样：

```php
$user = User::findOrFail($id);
```

**例子 2** - firstOrCreate():

与其这样：

```php
$user = User::where('email', $email)->first();
if (!$user) {
    User::create([
        'email' => $email
    ]);
}
```

只需要这样：

```php
$user = User::firstOrCreate(['email' => $email]);
```

### 3. 模型的 boot() 方法

在 Eloquent 模型内有一个叫 boot() 的神奇方法可以改掉默认的逻辑。

```php
class User extends Model
{
    public static function boot()
    {
        parent::boot();
        static::updating(function ($model) {
            // 可以作一些记录
            // 也可以覆盖掉原有的属性比如：$model->something = transform($something);
        })
    }
}
```

可能一个最显著的例子就是在模型创建并实例化的阶段设置一些属性的值。假如你想生成 [UUID][1] 字段。

```php
public static function boot()
{
    parent::boot();
    self::creating(function ($model) {
        $model->uuid = (string)Uuid::generate();
    });
}
```

### 4. 添加了条件和排序的关联关系

定义关联关系的一种典型方法是：

```php
public function users() {
    return $this->hasMany('App\User');
}
```

但是你知不知道这里我们已经可以使用 `where` 和 `orderBy` 了？

例如，如果你想获得某种类型的用户的关联关系，同时根据 email 排序，你可以这样：

```php
public function approvedUsers() {
    return $this->hasMany('App\User')->where('approved', 1)->orderBy('email');
}
```

### 5. 模型属性：时间戳，追加属性等等

Eloquent 模型中有一些以类的属性的形式存在的参数。最广为人知的可能是这些：

```php
class User extends Model {
    protected $table = 'users';
    protected $fillable = ['email', 'password']; // 定义了可以被 User::create() 填充的字段
    protected $dates = ['created_at', 'deleted_at']; // 定义了可以被 Carbon 化的字段
    protected $appends = ['field1', 'field2']; // 额外以 JSON 格式返回的字段
}
```

但是除此之外还有这些：

```php
protected $primaryKey = 'uuid'; // 主键不一定必须是 'id'
public $incrementing = false; // 并且不一定要自增性的!
protected $perpage = 25; // 是的，你可以覆盖掉模型默认的分页每页数量（默认是 15）
const CREATED_AT = 'created_at';
const UPDATED_AT = 'updated_at'; // 是的，这些字段名称也是可以被覆盖的
public $timestamps = false; // 或者干脆不使用时间戳字段
```

还有很多，我已经罗列了最有意思的部分，想要知道更多的话可以查看默认的 [抽象类][2] 代码，可以通过使用过的 trait 得知。 

### 6. 找到多个条目

每个人都知道 find() 方法，对吧？

```php
$user = User::find(1);
```

我相当惊讶很少人知道这个方法其实可以接收一个数组参数：

```php
$users = User::find([1, 2, 3]);
```

### 7. WhereX

有一个优雅的办法把这：

```php
$users = User::where('approved', 1)->get();
```

改成这样：

```php
$users = User::whereApproved(1)->get();
```

是的，你可以将字段名作为后缀拼接到 'where' 之后，它就会神奇的生效。

同样的，在 Eloquent 当中预定义了一些跟时间/日期相关的方法：

```php
User::whereDate('created_at', date('Y-m-d'));
User::whereDay('created_at', date('d'));
User::whereMonth('created_at', date('m'));
User::whereYear('created_at', date('Y'));
```

### 8. 在关联关系中使用 Order by 排序

这是一个稍稍复杂的“技巧”。如果你想把一个论坛的帖子按照最新**发布**排序应该怎么做？在论坛当中将最近更新的帖子置顶这是一个很常见的需求，对吧？

首先，在帖子模型中为**最近发布**定义一个单独的关联关系：

```php
public function latestPost()
{
    return $this->hasOne(\App\Post::class)->latest();
}
```

然后在控制器中，我们可以这样做，神奇的事情就发生了：

```php
$users = Topic::with('latestPost')->get()->sortByDesc('latestPost.created_at');
```

### 9. Eloquent::when() - 不再使用 if-else

我们经常会根据 'if-else' 写条件查询语句，就好像这样：

```php
if (request('filter_by') == 'likes') {
    $query->where('likes', '>', request('like_amount', 0));
}
if (request('filter_by') == 'date') {
    $query->orderBy('created_at', request('ordering_rule', 'desc'));
}
```

但是有一个更好的办法 —— 使用 when()：

```php
$query = Author::query();
$query->when(request('filter_by') == 'likes', function ($q) {
    return $q->where('likes', '>', request('like_amount', 0));
});
$query->when(request('filter_by') == 'date', function ($q) {
    return $q->orderBy('created_at', request('ordering_rule', 'desc'));
});
```

看起来好像不够简短优雅，更简洁有力的写法是传递参数：

```php
$query = User::query();
$query->when(request('role', false), function ($q, $role) {
    return $q->where('role_id', $role);
});
$authors = $query->get();
```

### 10. 从属关联关系的默认模型

假如你有一个 Post 模型从属于 Author，在 blade 模板中代码如下：

```php
{{ $post->author->name }}
```

但是如果作者被删掉了或者由于某个原因没有作者怎么办？你将得到一个错误，类似于“该属性找不到对象”。

当热，你可能会这样写来防止：

```php
{{ $post->author->name ?? '' }}
```

但是其实你可以在 Eloquent 关联关系这一层这样写就能避免：

```php
public function author()
{
    return $this->belongsTo('App\Author')->withDefault();
}
```

在这个例子中，如果 post 对象没有相应的 author 对象，那么 `author()` 方法将返回一个空的 `\App\Author` 对象。

更进一步地，我们可以给模型指定默认的属性值。

```php
public function author()
{
    return $this->belongsTo('App\Author')->withDefault([
        'name' => 'Guest Author'
    ]);
}
```


---
原文地址：[https://laravel-news.com/eloquent-tips-tricks](https://laravel-news.com/eloquent-tips-tricks)

作者：[POVILASKOROP](https://laravel-news.com/@povilaskorop)

---

[1]: https://github.com/webpatser/laravel-uuid
[2]: https://github.com/laravel/framework/blob/5.6/src/Illuminate/Database/Eloquent/Model.php
