---
title: "JSON API 的介绍"
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
JSON API 一个是由 Yehuda Katz 起草于 2013 年 5 月旨在更高效的 api 调用方式，并且在 2015 年 5 月达到一个稳定的版本。你可以根据你的需求获取数据，根据需求的改变添加或删除属性或关系。这样使得 API 在调用的时候可以最小化传输的数据。

### {json:api}（基本格式）

与其他的 API 格式一样，使用 JSON API，你可以发送请求给别的终端和接收你发送的文件。JSON API 规范定义了资源的结构。使用这个结构可以帮助你正常的使用 API。

例如当你需要通过一个简单请求获取`文章`资源的时候：

```json
GET /articles HTTP/1.1
Accept: application/vnd.api+json
```

你接收到的响应应该是这个样子的：

```json

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

看起来很简单。其中文章的`作者`包含了一个自我介绍的链接以及一些基础的关联信息。访问文档中的这些链接会得到相关的资源。

但是这只是一些毛皮。以下的几个特点使得 JSON API 使用起来是如此的优雅。

### 复合文本

> 为了减少 HTTP 请求数量，服务器允许响应中除了请求的主要资源外还会携带关联的资源。这样的响应被称为“复合文本”。

一个复合文本同时也是一个包含了关联信息的集合资源。例如，当请求了一个文章资源的时候，显示的资料当中还包含了文章的作者信息，这样就不需要发送第二个请求来获取作者信息了。

这简直太棒了，原因有几个。除非终端编写了特定的程序，否则一次性获取你想要使用的资源的完整数据是闻所未闻的。而在服务端，缓存和废止一个请求时很简单的。

来看一下这个返回一套单份文件的例子。

```json
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

如果你仔细查看关联属性的话会发现这篇文章的所有关联资源。每一个包含的文档都有一个表明返回资源类型的 `type` 属性以及一个关于文档的超链接。

你可能会觉得奇怪的地方是在 `article` 中仅仅依靠 `id`、`type` 和从 `included` 标签中装载的关联 `people` 资源来表明作者的信息。但是想象一下，当有很多文章都是一个相同的作者的时候，返回文档当中只包含了一处关联信息。太高效了。
