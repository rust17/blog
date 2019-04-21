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

### 11. Order by 赋值函数

想象一下这样子：

```php
function getFullNameAttribute()
{
    return $this->attributes['first_name'] . ' ' . $this->attributes['last_name'];
}
```

现在，如果你想根据 full_name 排序？这样可不行哦：

```php
$cilents = Client::orderBy('full_name')->get(); // 这样写是不起作用的
```

解决办法很简单。我们需要在得到结果**之后**再排序。

```php
$clients = Client::get()->sortBy('full_name'); // 这样是可以的！
```

需要注意的是函数名称是不一样的 —— 不是 **orderBy**，而是 **sortBy**。

### 12. 全局作用域下的默认排序

如果你总是希望 User::all() 返回的数据可以按照 name 字段排序应该怎么做呢？你可以注册一个全局的作用域。让我们回到我们前面提到过的 boot() 方法。

```php
protected static function boot()
{
    parent::boot();

    // 按照 name 升序进行排序
    static::addGlobalScope('order', function (Builder $builder) {
        $builder->orderBy('name', 'asc');
    });
}
```

在这阅读更多[查询作用域][3]相关的知识。

### 13. 原生的查询方法

有时候我们需要在 Eloquent 的基础上添加原生的查询。幸运的是，有几个函数就是为此而存在的。

```php
// whereRaw
$orders = DB::table('orders')
    ->whereRaw('price > IF(state = "TX", ?, 100)', [200])
    ->get();

// havingRaw
Product::groupBy('category_id')->havingRaw('COUNT(*) > 1')->get();

// orderByRaw
User::where('created_at', '>', '2016-01-01')
    ->orderByRaw('(updated_at - created_at) desc')
    ->get();
```

### 14. Replicate: 复制一个跟原生一模一样的条目

这是一个简短的技巧。不需要深刻的解释，这就是复制一个数据库条目最好的方法：

```php
$task = Tasks::find(1);
$newTask = $task->replicate();
$newTask->save();
```

### 15. 用来处理大数据的 Chunk() 方法

准确的说跟 Eloquent 没有关系，更多的是关于 Collection。但是仍然是强大的 —— 处理较大的数据集的时候，你可以把它们分成块来处理。

与其这样：

```php
$users = User::all();
foreach ($users as $user) {
    // ...
}
```

还不如这样：

```php
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // ...
    }
})
```

### 16. 新建模型的时候顺带新建相关的文件

我们都知道这个 Artisan 命令：

```shell
php artisan make model Company
```

但是你知不知道有三个有用的标记可以帮助生成模型相关的文件？

```shell
php artisan make:model Company -mcr
```

* -m 将生成一个**迁移**文件
* -c 将生成一个**控制器**
* -r 将指定该控制器是**资源控制器**

### 17. 保存的时候覆盖 updated_at

你知道 save() 方法可以接收参数吗？结果是，我们可以让它“忽略”默认更新 updated_at 的功能，使用指定的时间来填充。看这样：

```php
$product = Product::find($id);
$product->updated_at = '2019-01-01 10:00:00';
$product->save(['timestamps' => false]);
```

这样我们就使用我们自己预定义的时间覆盖掉了 updated_at 的默认值了。

### 18. update() 方法的结果是什么？

你有没有想过这行代码会返回什么？

```php
$result = $products->whereNull('category_id')->update(['category_id' => 2]);
```

我的意思是，update 方法是在数据库中执行，但是 $result 包含了什么呢？

答案是**受影响的行数**。因此，如果你需要检查有更新了多少行，你不需要调用任何方法 —— update() 方法将返回受影响的结果数。

### 19. 将括号转换为 Eloquent 查询语句

如果你有一个混合了且与或的 SQL 语句，好比这样：

```SQL
... WHERE (gender = 'Male' and age >= 18) or (gender = 'Female' and age >= 65)
```

怎样把它转成 Eloquent 语句呢？这是错误的方式：

```php
$q->where('gender', 'Male');
$q->orWhere('age', '>=', 18);
$q->where('gender', 'Female');
$q->orWhere('age', '>=', 65);
```

这样查询的顺序是不正确的。正确的做法稍微有点复杂，使用了闭包作为子查询语句：

```php
$q->where(function ($query) {
    $query->where('gender', 'Male')
        ->where('age', '>=', 18);
})->orWhere(function ($query) {
    $query->where('gender', 'Female')
        ->where('age', '>=', 65);
});
```

### 20. 携带了多个参数的 orWhere

最后，你可以给 `orWhere()` 传递一个数组，通常：

```php
$q->where('a', 1);
$q->orWhere('b', 2);
$q->orWhere('c', 3);
```

你可以像这样：

```php
$q->where('a', 1);
$q->orWhere(['b' => 2, 'c' => 3]);
```

如果你喜欢这些 Eloquent 小技巧，可以来看看我的在线课程 [Eloquent: Expert Level][4]，从中可以学习新建关联关系，有效地查询数据以及发现你可能不知道的 Eloquent 特色。

---
原文地址：[https://laravel-news.com/eloquent-tips-tricks](https://laravel-news.com/eloquent-tips-tricks)

作者：[POVILASKOROP](https://laravel-news.com/@povilaskorop)

---

[1]: https://github.com/webpatser/laravel-uuid
[2]: https://github.com/laravel/framework/blob/5.6/src/Illuminate/Database/Eloquent/Model.php
[3]: https://laravel.com/docs/5.6/eloquent#query-scopes
[4]: https://laraveldaily.teachable.com/p/laravel-eloquent-expert-level
