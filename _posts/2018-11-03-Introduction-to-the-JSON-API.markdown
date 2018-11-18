---
title: "翻译 —— JSON API 的介绍"
layout: post
date: 2018-11-03 22:00
headerImage: false
tag:
- translation
- api
category: blog
author: circle
description: 翻译文章——关于 json api 的一些用法介绍
---
JSON API 是由 Yehuda Katz 于 2013 年 5 月起草的，一个目的在于编写更高效的 api 调用方式，并在 2015 年 5 月达到一个稳定的版本。可以根据需求获取数据，根据需求的改变添加或删除属性以及关联关系。这样使得 API 在调用的时候可以最小化传输的数据。

### {json:api}（基本格式）

与其他的 API 格式一样，通过使用 JSON API，你可以发送请求或者发送的文档给别的终端。JSON API 规范定义了资源的结构。使用这个结构可以帮助你正确的使用 API。

例如当你需要通过一个简单请求获取 `articles` 资源的时候：

```
GET /articles HTTP/1.1
Accept: application/vnd.api+json
```

你接收到的响应应该是这个样子的：

```

//...
{
	"type": "articles",
	"id": "1",
	"attributes": {
		"title": "Rails is Omakase"
	},
	"relationships": {
		"author": {
			"link": {
				"self": "http://example.com/articles/1/relationships/author",
				"related": "http://example.com/articles/1/author"
			},
			"data": {
				"type": "people",
				"id": "9"
			}
		}
	},
	"links": {
		"self": "http://example.com/articles/1"
	}
} //...
```

看起来很简单。其中文章的 `author` 包含了一个自我介绍的链接以及一些基础的关联信息。访问文档中的这些链接会得到相关的资源。

但是这只是一些毛皮。以下的几个特点使得 JSON API 使用起来是如此的优雅。

### 复合文本

> 为了减少 HTTP 请求数量，服务器允许一次响应中除了请求的主要请求资源外还会携带关联的资源。这样的响应被称为“复合文本”。

一个复合文本同时也是一个包含了关联信息的集合资源。例如，当请求了一个文章资源的时候，显示的资料当中还包含了文章的作者信息，这样就不需要发送第二个请求来获取作者信息了。

这简直太棒了，原因有几个。除非依靠终端编写特定的程序，否则一次性获取你想要使用的资源的完整数据是闻所未闻的。在服务端，缓存和使这样的请求无效是很容易的。

来看一下这个返回一套单份文件的例子。

```
{
	"data": [{
		"type": "articles",
		"id": "1",
		"attributes": {
			"title": "JSON API paints my bikeshed!"
		},
		"links": {
			"self": "http://example.com/articles/1"
		},
		"relationships": {
			"author": {
				"links": {
					"self": "http://example.com/articles/1/relationships/author",
					"related": "http://example.com/articles/1/author"
				},
				"data": {
					"type": "people",
					"id": "9"
				}
			},
			"comments": {
				"links": {
					"self": "http://example.com/articles/1/relationships/comments",
					"related": "http://example.com/articles/1/comments"
				},
				"data": [{
					"type": "comments",
					"id": "5"
				}, {
					"type": "comments",
					"id": "12"
				}]
			}
		}
	}],
	"included": [{
		"type": "people",
		"id": "9",
		"attributes": {
			"first-name": "Dan",
			"last-name": "Gebhardt",
			"twitter": "dgeb"
		},
		"links": {
			"self": "http://example.com/people/9"
		}
	}, {
		"type": "comments",
		"id": "5",
		"attributes": {
			"body": "First!"
		},
		"relationships": {
			"author": {
				"data": {
					"type": "people",
					"id": "2"
				}
			}
		},
		"links": {
			"self": "http://example.com/comments/5"
		}
	}, {
		"type": "comments",
		"id": "12",
		"attributes": {
			"body": "I like XML better"
		},
		"relationships": {
			"author": {
				"data": {
					"type": "people",
					"id": "9"
				}
			}
		},
		"links": {
			"self": "http://example.com/comments/12"
		}
	}]
}
```

如果你仔细查看关联属性的话会发现这篇文章的所有关联信息。每一个包含的文档都有一个表明返回资源类型的 `type` 属性以及一个关于文档的超链接。

你可能会觉得奇怪的地方是在 `article` 中仅仅依靠 `id`、`type` 和从 `included` 标签中装载的关联 `people` 资源来表明作者的信息。但是想象一下，当有很多文章都是一个相同的作者的时候，返回文档当中只包含了一处关联信息。太高效了。

### 包含关联的资源

上面的例子中，服务端在响应中返回了所有的关联信息，但是你可能不需要在响应中默认带上这些东西，因为这样会导致响应变得臃肿。因此，规范指明了什么样的关联资源应该被包含在响应中。

例如，如果你只需要 `author` 关系包含在响应中，你只需要在请求中携带上 `include` 参数。这样服务器就会知道在响应中返回特指的关联资源。

```
GET /articles/1?include=author HTTP/1.1
Accept: application/vnd.api+json
```

如果你需要在响应中返回多重关联资源，只需要用逗号隔开关联参数。你甚至可以更进一步地定义嵌套资源。例如，你需要 `comments`，需要携带 `comments` 的 `author` 只需要在参数中这样写 `comments.author`：

```
GET /articles/1?include=author,comments.author HTTP/1.1
Accept: application/vnd.api+json
```

这样的灵活性使得你只需要根据需要做出轻微的调整即可获取需要的资源。

### 用得少的字段

当你需要携带复合文档的时候，请求可能会因此快速变得庞大。特别是关联关系包含了大量数据的时候。许多时候，你不需要每一个资源中定义的属性只需要像 `author name` 这样的属性。针对这种情况 JSON API 提供了一种稀疏字段集。

你只需要设置 `fields` 请求参数就能指定需要检索的内容。格式是 `字段名[类型]`，因此你可以根据自己的需求在请求中特指每一个需要返回的资源。


```
GET /articles?include=author&fields[article]=title,body&fields[people]=name HTTP/1.1
Accept: application/vnd.api + json
```

这样就可以把 `title` 和 `body` 字段从 `articles` 和 `people` 信息表中获取。

### 其他的特性

服务器还可以执行几个被规范定义的特性。这些特性是嵌套、排序、分页和过滤。

#### 过滤

如果服务器支持这个特性，你就可以在请求中使用 `sort` 参数来排序你的记录。排序规则默认是升序，你可以通过在字段前置符号 `-` 来实现降序。

```
GET /articles?sort=-created,title HTTP/1.1
Accept: application/vnd.api+json
```

#### 分页

如果服务器支持分页则会在元属性中提供一些分页信息。服务器可以决定如何分页，通过偏移，或者直接用页数。以下是一个使用特定的链接连到其他页面以及在元标签里包含了一些元数据的例子。

```
{
	links: {
		first: "http://example.com/articles?page=1",
		last: "http://example.com/articles?page=262",
		prev: "http://example.com/articles?page=261",
		next: null
	},
	meta: {
		current_page: 262,
		from: 3916,
		last_page: 262,
		per_page: 15,
		to: 3924,
		total: 3924
	}
}
```

#### 过滤

规范当中关于过滤的部分很少，只是列举了可能有一个 `filter` 参数用于在服务端实现过滤。具体实现方式可以是根据业务需求的任意方式。

### 新增、修改和删除资源

当你熟悉了文档的结构之后，新增和修改资源是相当容易的。使用标准的 HTTP 动词来与请求希望的动作进行通信。`GET` 是用来获取，`POST` 用来新增，`PATCH` 用来(部分)修改以及 `DELETE` 用来删除资源。

#### 新增资源

```
POST /photos HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
	"data": {
		"type": "photos",
		"attributes": {
			"title": "Ember Hamster",
			"src": "http://example.com/images/productivity.png"
		},
		"relationships": {
			"photographer": {
				"data": { "type": "people", "id": "9" }
			}
		}
	}
}
```

这就是一个新增一张图片的例子。注意关联关系已经包含在请求当中的 `relationships` 特性里了。

#### 修改资源

```
PATCH /articles/1 HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
	"data": {
		"type": "articles",
		"id": "1",
		"attributes": {
			"title": "To TDD or Not"
		}
	}
}
```

当更新一个资源时只会更新提交的字段的信息。没有提供的字段将不会更新。

#### 更新关联关系

有两种方式更新关联关系。一种是在 `PATCH` 请求中包含关系。就像上面的例子一样。另一种方式是使用特定的关系点。

```
PATCH /articles/1/relationships/author HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
	"data": { "type": "people", "id": "12" }
}
```

这样就会更新 `article` 的一对一关联关系。如果希望删除这个关系，可以传递 `null` 作为提交值。

如果你希望更新一个对多的关联关系，你只需要发送一个包含了关系的数组。这样就会替换所有相关的成员了。

```
PATCH /articles/1/relationships/tags HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
	"data": [
		{ "type": "tags", "id": "2" },
		{ "type": "tags", "id": "3" }
	]
}
```

如果希望清空对多的关系，只需要发送一个空数组作为传递值。

#### 删除资源

关于这部分没有什么可以多说的，你只需要发送 `DELETE` 请求即可。

```
DELETE /photos/1 HTTP/1.1
Accept: application/vnd.api+json
```

### 了解更多

如果你希望了解更多 {json:api} 的细节和用途，可以看看[jsonapi.org](https://jsonapi.org/)。他们的规范定义地相当清晰，并且服务端不需要强制性实施许多特性。另一方面，[这里](http://jsonapi.org/implementations/)有一份客户端和服务器的实施方案可供快速使用。

目前规范的版本是 1.1。对于 1.0 版本是完全兼容的，只是添加了一些新特性，并没有移除任何特性。

### {json:api} < 3

希望你已经学习了如何使得规范变得美妙。对我个人而言，我喜欢这个规范，一致性与灵活性，这样的特性使得对接 API 变成一件轻松的事。你总是知道得到什么，并且不需要在请求中加载太多的数据。

由于这个原因，我们已经写了一个给服务端以 {json:api} 的方式描绘资源的[包](https://github.com/swisnl/json-api-client)。还有一个从 Eloquent 模型生成 `{json:api}` 的[包](https://github.com/swisnl/json-api-server/)。

---  
原文地址：[https://laravel-news.com/json-api-introduction](https://laravel-news.com/json-api-introduction)

作者：[Björn Brala](https://laravel-news.com/@bbrala)

---
