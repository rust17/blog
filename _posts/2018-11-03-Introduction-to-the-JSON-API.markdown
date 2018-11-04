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

> 为了减少 HTTP 请求数量，服务器会在一个响应中携带
