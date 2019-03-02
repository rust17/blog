---
title: "[译] —— 构建一个 Laravel 翻译包（构建前端）"
layout: post
date: 2018-12-23 08:30
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', 'first']
author: circle
description: 翻译文章 —— 构建一个 Laravel 翻译包第五部分
---

在[上一部分](https://laravel-news.com/laravel-translation-package-frontend)中，我想你介绍了我的方式，将所有需要的东西放在一个地方构建前端。这篇文章将在上一篇文章的基础上完成用户界面。

### 用户操作界面可以做什么？

首先，我们需要定义任务的清单。用户操作界面的目的是什么以及允许用户做什么？有时候，这种限定范围的任务可能太具挑战性了。不过幸运的是，对我来说，这是我经常要碰到的问题，因此我有一个好办法——最小化需求以解决我的问题：

* 列出所有的语言
* 新增语言
* 列出一种语言的所有翻译
* 切换不同语言的翻译
* 搜索所有键和翻译
* 新增翻译
* 修改已有的翻译

正如我在上一篇文章中提到的那样，我很高兴可以使用 Laravel 强大的后端功能来进行繁重的构建工作。你可能认为我这样做很老派，但是实际上我更喜欢页面加载的视觉显示因为这样可以让我知道某件事正在发生。唯一一个我不想看到页面加载的情况是修改现有的翻译的时候——如果这个工作在后台进行将会变得更优雅。

### 路由

基于上面的列举，看起来我们需要定义七个路由。

* GET /languages
* GET /languages/create
* POST /languages
* GET /languages/{language}/translations
* GET /languages/{language}/translations/create
* POST /languages/{language}/translations
* PUT /languages/{language}/translations

### 控制器

在控制器里，我们严重依赖于[先前文章](https://laravel-news.com/wrangling-translations)建立的类。事实上，我们将从 Laravel 的服务容器中注入该类以解决这个问题。

```php
public function __construct(Translation $translation)
{
    $this->translation = $translation;
}
```

现在，在控制器当中与翻译交互已经是一件相当简单的工作了。例如，获取一个语言列表然后返回给视图就这么简单：

```php
public function index(Request $request)
{
    $languages = $this->translation->allLanguages();

    return view('translation::languages.index', compact('languages'));
}
```

*注意* 你可能注意到了，上面的视图路径中包含了不同寻常的 `translation::`，这样做的目的是告诉 Laravel 在服务提供者中根据定义好的扩展包命名空间来加载视图文件。

```php
$this->loadViewsFrom(__DIR__.'/../resources/views', 'translation');
```

这个控制器里唯一复杂的方法是关于翻译的 index 方法，该方法复杂是因为我们不仅需要列出所有的翻译也会根据搜索条件以及筛选条件列出符合条件的翻译资料。

```php
$translation = $this->translation->filterTranslationsFor($language, $request->get('filter'));

if ($request->get('group') === 'single') {
    $translations = $translations->get('single');
    $translations = new Collection(['single' => $translations]);
} else {
    $translations = $translations->get('group')->filter(function ($values, $group) use ($request) {
        return $group === $request->get('group');
    });
    $translations = new Collection(['group' => $translations]);
}

return view('translations::languages.translastions.index', compact('translations'));
```
这里，我们根据用户传递的搜索条件获取到了符合条件的翻译资料。然后决定是筛选 `单个` 还是 `多个`，再有根据性地返回数据集合给视图文件。

### 视图 & 资源

每个视图都继承了 `layout.blade.php` 视图文件，该文件包含了基本的 HTML 骨架以及通过 [Laravel Mix](https://laravel.com/docs/5.7/mix) 编译加载的 Javascript 和 CSS 资源链接。

#### 样式

对于没听过 Tailwind CSS 的人来说，该框架是一个效率第一的框架。 它提供了一些简易的类便于有层次地制作复杂的页面。如果希望了解更多信息可以阅读[官方文档](https://tailwindcss.com/docs/what-is-tailwind/)，我是这样子使用 Tailwind 发挥其威力的。

Tailwind 自带的配置文件，其中设置好了颜色基调和默认字体。该文件规定了一些不错的默认设置，因此通常我不会去修改任何地方，除非我需要打上一些个人的风格印记。

通常，我会将 Tailwind 的样式类运用到 HTML 组件上，直到它们看起来是我想要的样子。如果是一个我不需要复用的组件的话，我经常会把它们留在 HTML 标签中。

```html
<div class="bg-red-lightest text-red-darker p-6 shadow-md" role="alert">
    <div class="flex justify-center">
        <p>{!! Session::get('error') !!}</p>
    </div>
</div>
```

然而，如果是一些我会在应用程序中复用的类。我会使用 Tailwind 的 `@apply` 标明以提取到公共组件的样式类库。

```html
// before 
<div class="p-4 text-lg border-b flex items-center font-thin">
    { {__('translation::languages.languages') } }
</div>

// after
.panel-header {
    @apply p-4 text-lg border-b flex items-center font-thin
}

<div class="panel-header">
    { {__('translation::languages.languages') } }
</div>
```

在[上一篇文章](https://laravel-news.com/laravel-translation-package-frontend)中，我解释了如何将 PortCSS 和 Tailwind 风格的 PortCSS 插件嵌入到 Laravel Mix 的构建管道中。当这个插件运行的时候，它将寻找项目中 `@apply` 标明的部分，从类库中抽取出样式并注入到所包含的类当中。

下面这张图展示了我用 Tailwind 创建的用户界面风格。

#### Javascript

正如前面提到的那样，在这个扩展包里面我们打算让后端参与许多繁重的工作。这样，我们就可以使用 Javascript 来专注于提升用户体验了。

翻译是一项烦人的工作，因此我们必须确保此扩展包对于我们的用户来说尽可能地可靠，操作尽可能地人性化。我所能想到的一个使用 Javascript 帮助提升体验的地方就是当用户浏览翻译列表的时候自动保存内容。这个提升减少了一个额外不必要的点击按钮和一次页面刷新。为了进一步提升用户体验，我们将添加一个虚拟提示以让用户知道他们将要做出的改变。

我们将新建一个 Vue 组件命名为 `TranslationInput` 以实现该功能。

```js
export default {
    props: ['initialTranslation', 'language', 'group', 'translationKey', 'route'],

    data: function() {
        return {
            isActive: false,
            hasSaved: false,
            hasErrored: false,
            isLoading: false,
            hasChanged: false,
            translation: this.initialTranslation
        }
    },
    ....
}
```

在这里，我们定义了组件应该能接收 `initialTranslation`、`language`、`group`、`translationKey` 和 `route` 这些属性。这些属性无论什么时候都能用的到，这些属性提供了所有需要用到的数据，这些数据将传递给保存翻译的 `update` 路由。

数据属性设置了一系列组件的状态。需要指出的是我们设置 `translation` 的值为 `initialTranslation` 并传递给组件。

在组件模板里，我们将 `translation` 属性的值绑定到文本输入框。

```html
<textarea
    v-model="translation"
    v-bind:class="{ active: isActive }"
    v-on:focus="setActive"
    v-on:blur="storeTranslation"
></textarea>
```

另外，当数据对象里的 `isActive` 属性为真时，我们将输入框的类切换为已激活状态。当输入框聚焦的时候，`setActive` 方法监听着该属性的变化。

```js
setActive: function() {
    this.isActive = true;
},
```

当用户从输入框过来的时候，我们需要调用我们的 `update` 方法并将用户修改过的数据发送。你可以在上面看到我们使用了 Vue 的 `v-on` 直接监听 `blur` 事件，同时调用了 `storeTranslation` 方法。下面是该方法的详细代码。

```js
storeTranslation: function () {
    this.isActive = false;
    this.isLoading = true;
    window.axios.put(`/${this.route}/${this.language}`, {
        language: this.language,
        group: this.group,
        key: this.translationKey,
        value: this.translation,
    }).then((response) => {
        this.hasSaved = true;
        this.isLoading = false;
        this.hasChanged = false;
    }).catch((error) => {
        this.hasErrored = true;
        this.isLoading = false;
    });
}
```

这里，我们使用了 [axios](https://github.com/axios/axios)，一个 Javascript 的 HTTP 客户端，发起一个对 `update` 路由的请求。我们将所有属性传递给该组件然后生成 URL 再根据这些数据生成用户想要的翻译。

我们依据请求的结果更新组件的状态并返回给用户一个操作是否成功的虚拟提示。我们通过渲染一个合适的 SVG 图标来实现。

```
<svg v-show="!isActive && isLoading">...</svg> // default state, pencil icon
<svg v-show="!isActive && hasSaved">...</svg> // success state, green check icon
<svg v-show="!isActive && hasErrored">...</svg> // error state, red cross icon
<svg v-show="!isActive && !hasSaved && !hasErrored && !isLoading">...</svg> // saving state, disk icon
```

在这篇文章当中，我们介绍了构建前端过程中最重要的两个部分。我们制作了一个不仅美观而且功能强大的用户界面。

在下一部分当中，我们将添加一个可以扫描整个项目中可能会被遗漏的语言文件的功能。同时，如果你有任何问题，欢迎来 [Twitter](https://twitter.com/_joedixon) 向我提问。

---
原文地址：[https://laravel-news.com/building-a-laravel-translation-package-building-the-frontend](https://laravel-news.com/building-a-laravel-translation-package-building-the-frontend)

作者：[Joe Dixon](https://laravel-news.com/@joedixon)

---


