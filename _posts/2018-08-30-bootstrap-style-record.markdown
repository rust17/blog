---
title: "学习总结 —— bootstrap 中的组件、样式类"
layout: post
date: 2018-08-30 22:19
headerImage: false
tag:
- record
- learn
category: blog
author: circle
description: 记录前端框架bootstrap的使用
---

### Bootstrap
```html
<a class="btn btn-primary btn-lg" role="button">Learn more <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span></a>
```

```html
<div class="jumbotron">
	<div class="container">
	</div>
</div>
```

```html
<div class="navbar navbar-default topnav">
<div class="container">
  <div class="navbar-header">
	<a href="/" class="navbar-brand">
	  <span class="title">{{ logo.title }}</span>
	  <img :src="logo.src" :alt="logo.title">
	</a>
  </div>
</div>
</div>
```

```html
<div class="navbar-right">
	<div class="nav navbar-nav github-login">
	  <a href="#" class="btn btn-default login-btn">
		<i class="fa fa-user"></i> 登 录
	  </a>
	  <a href="#" class="btn btn-default login-btn">
		<i class="fa fa-user-plus"></i> 注 册
	  </a>
	</div>
</div>
```

```html
<div class="row">
<div class="col-md-4 col-md-offset-4 floating-box">
  <div class="panel panel-default">
	<div class="panel-heading">
	  <h3 class="panel-title">请注册</h3>
	</div>

	<div class="panel-body">
	  <div class="form-group">
		<label class="control-label">用户名</label>
		<input type="text" class="form-control" placeholder="请填写用户名">
	  </div>
	  ...
	  <button type="submit" class="btn btn-lg btn-success btn-block">
		<i class="fa fa-btn fa-sign-in"></i> 注册
	  </button>
	</div>
  </div>
</div>
</div>
```

```html
<div id="top-navbar-collapse" class="collapse navbar-collapse">
<ul class="nav navbar-nav">
  <li v-for="item in navList">
	<a href="#">{{ item }}</a>
  </li>
</ul>
</div>
```

```html
<button type="button" class="navbar-toggle" @click="toggleNav">
  <span class="sr-only">Toggle navigation</span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
</button>
```

```html
<div class="row footer-top">
```

```html
<div class="col-sm-5 col-lg-5"></div>
```

```html
<p class="padding-top-xsm"></p>
```

```html
<div class="text-md"></div>
```

```html
<ul class="list-unstyled">
	<li></li>
</ul>
```

```html
<div v-show="show" :class="`alert alert-${type} alert-dismissible`">
	...
</div>
```

```html
<ul v-if="auth" class="nav navbar-nav github-login">
  <li>
	<a href="javascript:;">
	  <span v-if="user">
		<img v-if="user.avatar" :src="user.avatar" class="avatar-topnav">
		<span v-if="user.name">{{ user.name }}</span>
	  </span>
	  <span v-else>佚名</span>
	  <span class="caret"></span>
	</a>
	<ul class="dropdown-menu">
	  <li><a href="#"><i class="fa fa-sign-out text-md"></i>退出</a></li>
	</ul>
  </li>
</ul>
```

```html
<div class="col-md-3 main-col">
	<div class="box">
		<div class="padding-md">
		  <div class="list-group text-center">
		    <a class="list-group-item" href="xxx">
		      <i :class="`text-md fa fa-${link.icon}`"></i>
		    </a>
		  </div>
		</div>
	</div>
</div>
```

### Font-Awesome
```html
<i class="fa fa-camera"></i>
<i class="fa fa-camera fa-2x"></i>
<i class="fa fa-camera fa-3x"></i>
<i class="fa fa-camera fa-4x"></i>
<i class="fa fa-camera fa-5x"></i>
<i class="fa fa-spinner fa-spin"></i>
<i class="fa fa-cog text-md i-middle"></i>
```
