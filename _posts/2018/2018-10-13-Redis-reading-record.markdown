---
title: "读书笔记 —— 《Redis 设计与实现》"
layout: post
date: 2018-10-13 22:30
headerImage: false
tag:
- record
- redis
category: ['blog', '2018']
author: circle
description: redis 读书记录经验总结
---

&emsp;&emsp;作为一名 web 开发者，在平时的工作当中，经常会使用到缓存，缓存的目的是将数据存放到读取速度更快的存储器当中以应对频繁的请求。在过去的工作项目当中，我经常用到的缓存技术是 memcached 和 Redis，其中大多数时候只是使用一些命令实现自己的业务，并没有对其实现原理进行过了解，恰好最近在读《Redis 设计与实现》这本书，带着这样一个问题“我在使用这些常用命令的时候，Redis 内部在干什么？”开始，试图在书中寻找答案。

---

### 阅读顺序
&emsp;&emsp;一开始，我是按照书的编写顺序开始阅读的，也就是从第一页开始，按照顺序，一章一章往下翻，不过经常会碰到一个很头疼的问题：按照书籍编写顺序往下读，经常会受限于自己的知识点不过全。比如：作者在书的第一部分介绍了几种 Redis 数据结构与对象，从一些概念的引入开始： SDS 字符串、链表、字典等等。因为之前并没有数据结构的基础知识，所以刚开始，我在看这些概念的时候经常摸不着头脑，不知道引入这些概念有什么目的，许多概念还互相依赖。为了弄懂一个概念，经常需要往前几页翻一翻，记住了这个概念在这个基础上继续往下阅读。这就导致阅读变得很支离破碎，效率低下，而且阅读也变成了一件不愉悦的事情。于是，为了解决这样的困境，我开始不按照书中的顺序阅读，根据自己的一些使用经验，不断的给自己提问题，解决一个问题需要阅读书中对应的章节，这样的方法使得阅读的效率大大提高了。

### 当我在使用 Redis SET 的时候，Redis 在干什么？

> Redis 命令：SET key value，将字符串值 value 关联到 key，如果 key 已经持有其他值， SET 就覆写旧值，无视类型。

这个应该算是最常用的命令了，书中第8章第一节介绍了，每次当我们在 Redis 的数据库中新建一个键值对时，至少会创建两个对象，一个用作键值对的键（键对象），另一个用作键值对的值（值对象）。字符串对象的编码可以是 int、raw 和 embstr。当字符串值的长度大于39字节的时候，字符串对象使用一个简单动态字符串（SDS）来保存这个字符串值，并将对象的编码设置为 raw。

### 什么是 SDS？

书中的第一章第二节介绍，Redis 使用自己构建的一种名为简单动态字符串（SDS）的抽象类型作为默认字符串表示。

**SDS 的定义**

> 每个 sds.h/sdshdr (filename/functionname) 结构表示一个 SDS 值：
```c
struct sdshdr {
	// 记录 sds 保存字符串的长度
	int len;
	// 记录 buf 数组中未使用字节的数量
	int free;
	// 字节数组，用于保存字符串
	char buf[];
}
```

也就是说，一个 SDS 对象包含了3个基本属性：len、free 和 buf，这3个属性有什么作用呢？带着这个问题继续往下读，Redis 在获取字符串长度的时候，直接读取 len 属性即可知道，而不需要遍历整个字符串，降低了计算机的计算复杂度。

当一个 SDS 对象需要进行拼接操作时，Redis 不仅会为 SDS 分配修改所必须要的空间，还会分配额外的未使用空间。在进行修改之后，如果 SDS 的长度小于 1 MB，那么 SDS 的 len 属性的值和 free 属性的值相同；如果 SDS 的长度大于等于1 MB，那么程序会分配1 MB 的未使用空间。通过空间预分配策略，Redis 可以减少连续执行字符串增长操作所需的内存重分配次数。

### 列表对象

Redis list 也是 Redis 最重要的数据结构之一，可以用于实现关注列表、粉丝列表、最新消息排行以及消息队列等需求。列表对象的编码可以是 `ziplist` 或者 `linkedlist`，ziplist 使用`压缩列表`实现，每个列表节点（entry）保存了一个列表元素；linkedlist 使用`双端链表`实现，每个双端链表节点（node）保存了一个字符串对象，而每个字符串对象保存了一个列表元素。

### 什么是 ziplist？

ziplist 是列表键和哈希键的底层实现之一。当一个列表键只包含少量列表项，并且每个列表想要么是小整数值或者短字符串。另外，当一个哈希键只包含少量键值对，并且每个键值对的键和值要么是小整数值要么是短字符串，Redis 就会使用压缩列表（ziplist）来做底层实现。

**ziplist 的构成**

<style>
	table {
		border-spacing: 0;
		border-collapse: collapse;
	}
	table tr {
		border-top: 1px solid #ccc;
	}
	table th {
		border: 1px solid #ddd;
  		padding: 10px 15px;
	}
	table td {
		border: 1px solid #ddd;
  		padding: 10px 15px;
	}
</style>
| 属性 | 类型 | 长度 | 用途 |
| :-- | :-- | :-- | :-- |
| zlbytes | uint32_t | 4字节 | 记录 ziplist 的内存字节数，对压缩列表进行内存重分配，或计算 zlend 的位置时使用 |
| zltail | uint32_t | 4字节 | 记录 ziplist 列表表尾节点距离压缩列表的起始地址有多少字节 |
| zllen | uint16_t | 2字节 | 记录 ziplist 包含的节点数量，当这个属性值小于 UINT16_MAX(65535)时，属性值就是 ziplist 包含的节点数量，当这个属性值等于 UINT16_MAX 时，节点的真实数量需要遍历整个 ziplist 才能计算出 |
| entryX | 列表节点 | 不定 | ziplist 包含的各个节点，节点长度由内容决定 |
| zlend | uint8_t | 1字节 | 特殊值 0XFF，用于标记 ziplist 的末端 |

**entryX（压缩列表节点）的构成**

* previous_entry_length，记录了 ziplist 中前一个节点的长度。其值可以是 1 字节和 5 字节，如果前一节点长度小于 254 字节，那么 previous_entry_length 的值就是 1 字节；如果前一节点长度大于等于 254 字节，那么 previous_entry_length 的值就是 5 字节
* encoding，记录了节点的 content 属性所保存数据的类型以及长度
* content，负责保存节点的值，节点值可以是一个字节数组或者整数

### 什么是 linkedlist？

linkedlist 是双端链表节点，在了解 linkedlist 之前需要了解 Redis 的链表和链表节点的实现

Redis 每个链表节点使用一个 adlist.h/listNode 结构来表示
```c
typeof struct listNode {
	// 前置节点
	struct listNode *prev;
	// 后置节点
	struct listNode *next;
	// 节点的值
	void *value;
}listNode;
```

多个 listNode 可以通过 prev 和 next 指针组成双端链表（linkedlist）

### 哈希对象

哈希对象的编码可以是 ziplist 和 hashtable。ziplist 编码的哈希对象每当有新的键值对要加入到哈希对象时，程序会先将保存了键的压缩列表节点推入到压缩列表表尾，然后再将保存了值的压缩列表节点推入到压缩列表表尾。hashtable 使用字典作为底层实现，

### 什么是字典？

* 字典使用哈希表 dict.h/dictht 结构定义：
```c
typedef struct dictht {
	// 哈希表数组
	dictEntry **table;
	// 哈希表大小
	unsigned long size;
	// 哈希表大小掩码，用于计算索引
	unsigned long sizemask;
	// 哈希表已有的节点数量
	unsigned long used;
} dictht;
```
table 属性是一个数组，数组中的每一个元素是一个指向 dict.h/dictEntry 结构的指针，每个 dictEntry 结构保存着一个键值对

* 哈希表节点，哈希表节点使用 dictEntry 结构表示：
```c
typedef struct dictEntry {
	// 键
	void *key;
	// 值
	union {
		void *val;
		uint64_t u64;
		int64_t s64;
	} v;
	// 指向下一个哈希表节点，形成链表
	struct dictEntry *next;
} dictEntry;
```
key 属性保存键值对的键，v 属性保存键值对的值，其中值可以是一个指针，或者是一个 uint64_t 整数，又可以是一个 int64_t 整数

* 字典，Redis 中的字典由 dict.h/dict 结构表示：
```c
typedef struct dict {
	// 类型特定函数
	dictType *type;
	// 私有数据
	void *privdata;
	// 哈希表
	dictht ht[2];
	// rehash 索引
	int trehashidx;
} dict;
```
type 属性是一个指向 dictType 结构的指针，每个 dictType 结构保存了一簇用于操作特定类型键值对的函数；privdata 属性保存了需要传给那些函数的可选参数；ht 属性是一个两个项的数组，数组中每个项都是一个 dictht 哈希表

### 集合对象(set)

Redis set 可以自动排重，可以用于存放不希望出现重复数据的列表。Redis 为集合提供了求交集、并集、差集等操作，可以非常方便地实现共同关注、共同喜好、共同好友等功能。集合对象的编码可以是 intset 或者 hashtable。

### 什么是 intset (整数集合)？

**整数集合的实现**

每个 intset.h/intset 结构表示一个整数
```c
typedef struct intset {
	// 编码方式
	uint32_t encoding;
	// 集合包含的元素数量
	uint32_t length;
	// 保存元素的数组
	int8_t contents[];
} intset;
```

intset 的每个元素都是 contents 数组的一个数组项，各个项在数组中按值的大小从小到大有序地排列，并且数组中不包含任何重复项；length 属性记录了整数集合包含的元素数量，也即是 contents 数组的长度；contents 数组的真正类型取决于 encoding 属性的值

### 有序集合对象(sorted set)

Redis sorted set 与 set 类似，区别是 sorted set 可以提供一个优先级参数为成员排序，并且是根据插入顺序自动排序。有序集合的编码可以是 ziplist 和 skiplist。

**有序集合对象的 ziplist**

每个集合元素使用两个紧挨一起的压缩列表节点来保存，第一个节点保存元素的成员，第二个元素保存元素的分值。压缩列表内的集合元素按分值从小到大进行排序，分值较小的排在表头，分值较大的排在表尾。

**有序集合对象的 skiplist**

有序集合对象使用 zset 结构作为底层实现，一个 zset 结构同时包含一个字典和一个跳跃表

### 什么是跳跃表？

跳跃表是一种有序数据结构，跳跃表的结构：

* header：指向跳跃表表头节点
* tail：指向跳跃表表尾节点
* level：记录目前跳跃表内，层数最大的节点层数（表头不计入在内）
* length：跳跃表长度

跳跃表节点由 redis.h/zskiplistNode 结构定义：
```c
typedef struct zskiplistNode {
	// 后退指针
	struct zskiplistNode *backward;
	// 分值
	double score;
	// 成员对象
	robj *obj;
	// 层
	struct zskiplistLevel {
		// 前进指针
		struct zskiplistNode *forward;

		// 跨度
		unsigned int span;
	} level [];
} zskiplistNode;
```

### 参考链接

* [redis 数据类型详解 以及 redis适用场景场合](https://my.oschina.net/ydsakyclguozi/blog/404625)
