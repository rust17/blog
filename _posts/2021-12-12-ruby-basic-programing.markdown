---
title: "Ruby 基础知识点"
layout: post
date: 2021-12-12 12:00
headerImage: false
tag:
- Ruby
category: blog
hidden: false
author: circle
description: Ruby
---
<center><h2>Ruby</h2></center>

### 对象

* 在 Ruby 中，对象是什么？
    * 对象是用于表现数据的基本单位，如：数值对象：1、-10，字符串对象："hello"等等
* 在 Ruby 中，类是什么？
    * 类是对象的种类，如：1 对应于 Numeric 类，"hello" 对应于 String 类

### 条件判断

* 在 Ruby 中，真假的定义？
    * 假：false 与 nil
    * 真：false 与 nil 以外的所有对象

### 循环

* Ruby 中的循环有几种方式？
    * 使用循环语句：while、for、until
    * 使用方法 + 块 do ~ end 实现：times、each、loop
* Ruby 中的循环控制方法？
    * break：跳出循环，终止程序
    * next：跳到下一次循环
    * redo：在相同的条件下重复刚才的处理
* do ~ end 与 { ~ } 的区别？
    * do ~ end：表示要执行的程序逻辑跨行
    * { ~ }：表示要执行的程序逻辑只有一行

### 方法

* Ruby 方法调用的本质：把参数和方法名一起发送给对象的过程，对象被称为接收者
* Ruby 中方法的调用方式？
    * 对象.方法名（参数 1，参数 2，...，参数 n），括号可以省略
    * 使用块 do ～ end 或者 { ～ } 的形式调用
    * 运算符的形式调用：
        * obj + arg1
        * obj =~ arg1
        * -obj
        * !obj
        * obj[arg1]
        * obj[arg1] = arg2
* Ruby 方法的种类：
    * 实例方法：对象作为接收者，对象内的方法就是实例方法，形式：obj.func()
    * 类方法：
        * 类名.方法名()
        * 类名::方法名()
    * 函数式方法：省略了接收者的方法，如：print、sleep

### 类和模块

* Ruby 中类的特性：
    * initialize 方法：使用 new 方法生成新对象时，initialize 方法会被调用，new 方法的参数也会传给 initialize 方法
    * 实例变量：以 @ 开头的变量，在同一个实例中，实例变量是共享的
    * 存取器：本质是一种访问实例变量属性的形式
        * attr_reader :name，定义了只读 name 属性
        * attr_writer :name，定义了只写 name 属性
        * attr_accessor :name，定义了读写 name 属性
    * 特殊变量 self：本质是实例方法的默认接收者，也可以用来实现后期动态绑定
    * 类方法：方法的接收者是类本身，这里的类一般就是指单例类，在 Ruby 中，定义单例类一般有两种方法：
        * `class << 类名 ~ end`
        * def 类名/self.方法名 ~ end
    * 类变量：在类的所有实例当中，类变量是共享的
    * 可见性：
        * public：外部可以访问
        * private：外部无法访问，只能在类内部访问
        * protected：外部可以访问
* 模块与类的区别：
    * 模块不能拥有实例
    * 模块不能被继承
    * 模块的使用场景是作为 Mix-in 混合到类中，复用模块的方法
    * 模块提供了命名空间，不同模块中的同名方法被认为是独立的
* 模块查找的规则：
    * 类中存在同名的方法，优先使用该方法
    * 类中/模块中包含多个模块，优先使用最后一个模块
    * 相同模块被包含两次以上时，会被省略
* extend 与 include 的区别：
    * extend：在类中 extend 模块代表给类追加类方法
    * include：在类中 include 模块代表给类追加实例方法

### 运算符

* 逻辑运算符的特性：
    * 执行顺序从左到右
    * 如果已经确认了逻辑的真假，则不会再判断剩余的表达式
    * 最后一个表达式的值为整体逻辑表达式的值
* 安全运算符(nil safe)：&.
* 范围运算符：
    * x..y：从 x 到 y
    * x...y：从 x 到 y 的前一个元素
* inspect：p 方法把对象当成字符串处理时，会调用该方法

### 错误处理

* Ruby 错误处理的写法：begin ~ rescue ~ end
* Ruby 发生异常会自动赋值的变量：
    * $!：最后发生异常的对象
    * $@：最后在哪一行代码发生了异常
* 异常对象的方法：
    * message()：异常信息
    * backtrace()：异常发生的位置信息
* ensure：不管是否发生异常都希望执行的处理，类似于 PHP 的 Finally
* rescue：
    * 表达式 1 rescue 表达式 2：代表如果表达式 1 发生了异常，表达式 2 的值就会成为整体表达式的值
    * 可以用多个 rescue 来分开处理多个类型的异常
* raise：主动抛出异常

### 块

* Ruby 中的块是什么：本质是一个多行程序的集合，该集合可以与参数一起传递给某个方法
* 块的使用：
    * 将块传递给迭代器方法
    * 将块传递给一些方法替换其内部逻辑
* 块的定义：
    * 在定义的方法中，使用 yield 关键字，执行方法的块，块是作为方法的一个参数传递进来的
    * 在定义的方法中，使用 `block_given?` 判断是否有块传递给方法
    * 在块中使用 break，会马上返回到调用块的地方
    * 使用 Proc 把块封装为对象，或者在方法的末尾参数使用 &block 的形式
* 块变量：块变量是指只能在块内部使用的变量，不能覆盖外部的局部变量

### 数值类

* 构成：
    * Integer：Fixnum（普通整数）、Bignum（大整数）
    * Float
    * Rational（有理数）
    * Complex（复数）
* 数值的字面量：
    * 以 0b 开头：二进制数
    * 以 0 或 0o 开头：八进制数
    * 以 0d 开头：十进制数
    * 以 0x 开头：十六进制数
    * 字面量中的 _ ：表示间隔
* 数值类型转换：
    * to_f：转成 Float 对象
    * to_i：转成 Integer 对象
    * to_r: 转成 Rational 对象
    * to_c：转成 Complex 对象
* 计数方法：
    * `n.times { |i| ... }`：循环 n 次
    * `from.upto(to) { |i| ... }`：循环对 i 加 1
    * `from.downto(to) { |i| ... }`：循环对 i 减 1
    * `from.step(to, step) { |i| ... }`：循环对 i 处理

### 数组类

* 数组索引的形式：获取单个：a[n]，获取多个：a[n..m]、a[n...m]、a[n, len]
* 数组作为集合的使用场景：交集、并集、差
* 使用 "|" 或 "+" 连接数组，区别是 "|" 会去重，"+" 不会
* 数组方法：
    * 添加元素：unshift、push、concat
    * 禁止改动数组：freeze
    * 删除元素：compact、delete、delete_at、delete_if、reject、slice、uniq、shift、pop
    * 替换元素：collect、map、fill、flatten、reverse、sort、sort_by

### 字符串类

* 字符串长度：length、size 方法
* 字符串连接：
    * +：连接后的字符串对象是新建的
    * `<<、concat`：会改变原有的字符串对象
* 字符编码方式：将字符分配与之对应的数值
* 字符串检索：include?
* 字符串替换：sub、gsub
* 字符串连接、反转相关的方法：concat、delete、reverse、
* 字符串其他方法：
    * 删除开头和结尾空白：strip
    * 转换大小写：upcase、downcase、swapcase
    * 首字母大写：capitalize
* 字符串编码转换：encode

### 正则表达式类

* 创建：
    * Regexp.new(str)
    * /[A-D]\d+/
    * %r(模式)
    * %r< 模式 >
    * %r| 模式 |
    * %r! 模式 !
* 匹配模式：
    * 正则表达式 =~ 字符串
    * 匹配普通字符串：/ABC/
    * 匹配行首与行尾：/^ABC$/
    * 匹配字符范围：[A-B] 代表 'A 或 B'
    * 匹配任意字符：/A.C/ 代表 'ABC'
    * 使用反斜杠的模式：
        * '\s' 代表匹配空白、制表符 Tab、换行符、换页符
        * '\d' 代表匹配 0 - 9 的数字
        * '\w' 代表匹配英文字母和数字
        * '\A' 代表匹配字符串开头
        * '\z' 代表匹配字符串末尾
    * 匹配多次相同的字符：
        * '*' 代表重复 0 次以上
        * '+' 代表重复 1 次以上
        * '?' 代表重复 0 次或 1 次
        * '{n}' 代表重复了 n 次
        * '{n, m}' 代表重复了 n~m 次
    * 匹配尽可能少的字符：
        * '*?' 代表匹配 0 次以上重复出现的最短部分
        * '+?' 代表匹配 1 次以上重复出现的最短部分
    * 匹配多个重复字符串："()"
    * 匹配几个候补中任意一个：'/^(ABC|DEF)$/'
* 正则表达式选项：
    * i：忽略大小写
    * x：忽略空白字符以及 # 后面的字符

---

<center><h2>Ruby 生态的一些工具链</h2></center>

* RVM 是什么：Ruby Version Manager，Ruby 的版本管理工具，类似于 node.js 的 NVM
* gem 是什么：Ruby 的包管理工具，当 Ruby 程序需要引入别的依赖时，会去 $LOAD_PATH（Ruby 自带的环境变量） + Gems Install Path（Gem 安装的依赖）里面查找，类似于 PHP 的 composer
* bundle 是什么：gem 的版本管理工具，不同的 Ruby 版本对应 gem 也不同，使用 bundle 可以选择符合当前 Ruby 版本的 gem，省略了切换的过程
* unicorn 是什么：可以代理 Rack 应用的服务器
* puma 是什么：可以代理 Rack 应用的服务器
* puma 与 unicorn 有什么区别：
    * puma：I/O 模型是多进程多线程，master 进程 fork 出多个 worker 进程，每个 worker 进程又创建出多个线程，通过线程处理请求，内存占用低
    * unicorn：I/O 模型是多进程，master 进程 fork 出多个 worker 进程，worker 进程监听 socket，来自客户端的请求会通过 nginx 分配到不同的 worker 进程，worker 再进一步交给 Ruby 程序处理
* Rack
    * Rack 是什么：Ruby 应用程序一般分三层：框架（Rails）、Rack、服务器（Puma、Unicorn），Rack 层就是一个协议，在服务器与应用之间提供一个接口，把服务器的请求信息传递给框架，再把框架处理完的结果返回给服务器
    * Rack 协议：将 Rack 应用定义为一个可以响应 call 方法的 Ruby 对象，接受来自服务器的参数（env），然后返回一个只包含三个值（状态码、HTTP 头、响应正文）的数组
    * Rack 中间件是什么：本质就是定义符合需求的类，需要实现两个方法 .initialize 和 call，可以在上层改变响应或请求
* Rake 是什么：本质是一个 Ruby 命令行应用程序，可以读取 rakefile 来执行脚本任务
