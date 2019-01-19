---
title: "翻译 —— 使用 Laravel 和 VueJS 实现文件的上传"
layout: post
date: 2018-11-14 18:00
headerImage: false
tag:
- translation
- laravel
- vuejs
category: ['blog', '2018']
author: circle
description: 翻译文章 —— Laravel 的上传功能实现
---

在搭建一个系统的过程中，每个开发者都会碰到文件上传的功能。当然了，对于缺乏经验的开发者来说，这可能是一个棘手的问题。并且，当你希望系统更简单并且对用户更友好的时候，这就会成为一个头痛的问题。这篇教程的目的就在于逐步促进此过程的开发。

### 前提

这篇教程的前提是，你已经有一个 laravel 项目以及掌握了一些关于 php、[VueJS](https://vuejs.org/) 和 laravel 的知识点。

另外还有一个前提条件是我认为你已经掌握一个支持现代化表单数据提交的浏览器的使用。

### 后端

首先，我们的系统应该将我们的文件保存在某个目录下。Laravel 自带了一个配置简单并且功能强大的文件系统。我们可以使用本地目录来存储文件，或者存储于云端服务器，比如 Amazon S3。这篇教程当中，我们将使用本地路径作为存储目录。

在你的 Laravel 项目中，打开 `config/filesystems.php` 这个文件。找到 `disks` 这个配置项。你会看到一些已经预设好的硬盘选项。让我们来新建一个硬盘选项用来存储我们的新文件。在 `local` 下方，添加如下代码：

```
'uploads' => [
    'driver' => 'local',
    'root' => storage_path().'/files/uploads',
],
```

我们将新建一个名为 “uploads” 的硬盘选项。它将使用 “local” 作为驱动，就是指上传的文件会保存在你自己的电脑或者保存在服务器上。最后，文件的保存路径位于 laravel 项目的 `storage/files/uploads` 文件路径下。

现在，我们已经有存放文件的地方了，我们还希望将你的引用路径存放到数据库，这样一来，我们就能更方便的访问它们了。

在命令行界面，输入以下命令：

> php artisan make:migration create_file_entries_table

这个命令将新建一个数据库建表的文件，文件的位置是 `database/migrations`。在迁移文件中添加一些需要的字段，像这样：

```
class CreateFileEntriesTable extends Migration
{
	/**
	 * 执行数据库迁移
	 *
	 * @return void
	 */
	public function up()
	{
	 	Schema::create('file_entries', function (Blueprint $table) {
	 		$table->increments('id');
	 		$table->string('filename');
	 		$table->string('mime');
	 		$table->string('path');
	 		$table->integer('size');
	 		$table->timestamps();
	 	});
	}

	 /**
	  * 回滚迁移
	  *
	  * @return void
	  */
	public function down()
	{
		Schema::dropIfExists('file_entries');
	}
}
```

我将这个表命名为 file_entries，不过你可以起你自己想要的名字。这个文件表示，在默认字段 `id` 和 `timestamps`(`created_at`、`updated_at` 字段)之间，我们新建了以下字段：

1. filename：上传文件名；
2. mime：文件的 mime 类型；
3. path：文件将要存放的内部路径（我会解释为什么要这样做）；
4. size：文件大小。

现在，我们需要新建一个模型类和控制器来管理我们的上传文件。在终端命令行输入以下命令：

> php artisan make:model FileEntry
> php artisan make:controller FileEntriesController

在模型类当中，我们应该添加一些上传文件时需要填充的字段。像这样：

```
class FileEntry extends Model
{
	protected $fillable = ['filename', 'mime', 'path', 'size'];
}
```

在控制器里，我们必须添加一个方法用于接收文件上传表单提交过来的数据，并经过处理，将正确的路径保存到数据库当中。打开 `app/Http/Controllers/FileEntriesControlle.php` 控制器文件新建 `uploadFile` 方法：

```
public function uploadFile(Request $request) {
	$file = Input::file('file');
	$filename = $file->getClientOriginalName();

	$path = hash( 'sha256', time());

	if(Storage::disk('uploads')->put($path.'/'.$filename, File::get($file))) {
		$input['filename'] = $filename;
		$input['mime'] = $file->getClientMimeType();
		$input['path'] = $path;
		$input['size'] = $file->getClientSize();
		$file = FileEntry::create($input);

		return response()->json([
			'success' => true,
			'id' => $file->id
		], 200);
	}

	return response()->json([
		'success' => false
	], 500);
}
```

首先，我们将接收表单提交过来的数据：`$file = Input::file('file')`，'file' 表示表单数据中的文件名。然后，获取文件名：`$filename = $file->getClientOriginalName()`。之后创建将文件存储在硬盘中的路径：`$path = hash('sha256', time())`。我选择用这种方式新建一个路径，用一个基于当前日期时间的随机哈希值代表文件路径，这样比直接访问文件更安全。因为文件地址将是像以下这样：
`storage/files/uploads/3e8f4a2e6d26c205e52ebcf6518e84bba96ccc9499f01c24448e939cbcb9f8d4/filename.jpg`。

接下来，我们将选择我们新建的硬盘路径 (uploads)，获取上传的文件 (`File::get($file)`)，然后将使用 `put` 方法：`Storage::disk('uploads')->put($path.'/'.$filename, File::get($file))` 把它存放在指定的目录下 (`$path.'/'.$filename`)。

如果保存成功，我们将保存信息存放进新建的数据表中：$file = FileEntry::create($input)，然后返回一个携带了新建文件记录 id 值的 JSON 响应。如果保存上传文件失败，将返回包含失败提示信息的 JSON 响应。

### 前端

为了简化项目开发，更专注于文件的上传功能，我将使用 laravel 自带的默认 CSS 样式。首先，为了使我们的文件系统更安全，采用默认的布局方式，在项目根目录以命令行的方式执行以下命令：

> php artisan make:auth

这条命令将会新建登录，注册以及密码找回的相关页面。

现在新建文件夹 `resources/views/files` 以及新建文件 `index.blade.php` 填写入以下代码：

```
@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">Files <a href="{ { url('files/create') } }" class="btn btn-info">Add files</a> </div>
				<div class="card-body">
					@if($files->count())
						<table class="table">
							<th>Name</th>
							<th>Size</th>
							@foreach($files as $file)
								<tr>
									<td>{ { $file->filename } }</td>
									<td>{ { $file->size } } Bytes</td>
								</tr>
							@endforeach
						</table>
					@else
						You have no files yet!
					@endif
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
```

基本上我们的 index 页面会获取所有保存于数据库的文件并且将它们展示在一个 HTML 列表中。

在控制器 `app/Http/Controllers/FileEntriesController.php` 中新建 index 方法：

```
public function index() {
	$files = FileEntry::all();

	return view('files.index', compact('files'));
}
```

这里，我们将获取到的存放于数据库的文件信息写入变量(`$files = FileEntry::all()`)，然后返回给我们的视图(`return view('files.index', compact('files'))`)。

最后，我们需要将路由注册，使得外界可通过 URL 的方式访问。在 `routes/web.php` 文件中添加以下代码片段：

```
Route::group(['middleware' => 'auth'], function () {
	Route::get('files', 'FileEntriesController@index');
});
``` 

写在 `Route::group(['middleware' => 'auth'], function () {})` 当中的代码会只允许已登录的用户访问。我们添加了 "get" 路由方式：`Route::get('files', 'FileEntriesController@index')`，第一个参数代表了路由的名字，第二个参数代表将要匹配的路由。

在浏览器中访问该 url，将会看到上传表单。

### 使用 VueJS 上传

现在是时候制作我们的 vue 组件来帮助我们上传文件了，使用 vue 的原因，除了实用，优雅还有对终端用户来说非常简单。

在开始开发 VueJS 之前，我们必须要安装一些必备的依赖。只需要在项目的根目录下执行以下命令：

> npm install

稍等几分钟，这个命令会自动安装好了依赖并放在项目目录中。注意：当部署到 web 服务器的时候，你必须要在服务器上再次执行这个命令。

现在，新建文件 `resources/assets/js/components/UploadFiles.vue`

Vue 组件的基本结构如下：

```
<template>
</template>
<script>
	export default {

	}
</script>

<style>

</style>
```

`<template></template>` 标签之间的代码限定了显示在页面的 HTML。`<script></script>` 标签之间的代码定义了程序如何执行。`<style></style>` 标签之间的代码定义了组件的样式。后者是可选的。

### Template

在文件中，`<template></template>` 标签之间，添加如下代码：

```
<template>
	<div class="container">
		<div class="large-12 medium-12 small-12 filezone">
			<input type="file" id="files" ref="files" multiple v-on:change="handleFiles()" />
			<p>
				Drop your files here <br>or click to search
			</p>
		</div>

		<div v-for="(file, key) in files" class="file-listing">
			<img class="preview" v-bind:ref="'preview'+parseInt(key)" />
			{{ file.name }}
			<div class="success-container" v-if="file.id > 0">
				Success
			</div>
			<div class="remove-container" v-else>
				<a class="remove" v-on:click="removeFile(key)">Revome</a>
			</div>
		</div>

		<a class="submit-button" v-on:click="submitFiles()" v-show="files.length > 0">Submit</a>
	</div>
</template>
```

有些地方需要重点说明一下：

#### 输入

首先，在 `<input>` 标签里有 `"ref"` 属性，声明了输入，这样一来我们就可以在 VueJS 中访问到输入的文件。接着，`handleFiles` 方法会监听输入有变化时执行。

#### 预览和移除

下边是一个 `<div>` 标签中的 `for 循环`，每个由 `files` 变量映射出的文件会一一显示出来。在 `div` 标签内部进行了图片的预览，根据文件所在的数组中的索引显示，显示顺序依次是文件名、两个 div：分别是成功和移除的选项。两个 div 受到了 v-if 和 v-else 的限制，如果文件没有被提交时，显示移除的选项。如果该文件已被提交，则该文件不能被移除，“成功”信息则会显示，表明该文件已被正确的发送了。

#### 提交

最后，提交按钮中的 `"submitFiles"` 方法会在该按钮被点击时触发(`v-on: click`)。根据 Vue 的 `v-show` 规则，该按钮只会在文件没提交的时候显示。

### Script

首先，实例化需要的变量：

```
data() {
	return {
		files: []
	}
}
```

`files` 是一个存放上传文件的数组变量，初始值是空。

接下来，创建方法，应该包含在 methods 当中：

```
methods: {
	// 在这里书写方法的代码
}
```

第一个方法是 `handleFiles()`：

```
handleFiles() {
	let uploadedFiles = this.$refs.files.files;

	for(var i = 0; i < uploadFiles.length; i++) {
		this.files.push(uploadedFiles[i]);
	}
	this.getImagePreviews();
}
```

这个方法的作用是将添加到 input 标签中的文件整理到一个文件数组变量中。最后，调用显示图片预览的方法 `getImagePreviews`。

```
getImagePreviews() {
	for( let i = 0; i < this.files.length; i++) {
		if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name)) {
			let reader = new FileReader();
			reader.addEventListener("load", function(){
				this.$refs['preview'+parseInt(i)][0].src = reader.result;
			}.bind(this), false);
			reader.readAsDataURL( this.files[i]);
		} else {
			this.$nextTick(function(){
				this.$refs['preview'+parseInt(i)][0].src = '/img/generic.png';
			});
		}
	}
},
```

基本上，该方法遍历了整个上传文件数组变量，第一步判断变量是否是图片，如果是，则生成一个预览文件并将其展示到 div 标签当中。如果不是，则展示一个默认图片。默认展示的图片的存放路径是 `public/img/generic.png`。

接下来是移除文件的方法：

```
removeFile(key) {
	this.files.splice(key, 1);
	this.getImagePreviews();
},
```

这个方法仅仅是移除选中的文件，然后更新预览图片。

最后是提交方法：

```
submitFiles() {
	for ( let i = 0; i < this.files.length; i++) {
		if(this.files[i].id) {
			continue;
		}
		let formData = new FormData();
		formData().append('file', this.files[i]);

		axios.post('/' + this.post_url, 
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		).then(function(data) {
			this.files[i].id = data['data']['id'];
			this.files.splice(i, 1, this.files[i]);
			console.log('success');
		}.bind(this)).catch(function(data) {
			console.log('error');
		});
	}
}
```

这个方法遍历了整个文件数组，确认文件是否被发送（如果文件有 id 值，则代表以经被提交过）然后一个一个发送。如果成功，更新模板当中的 `files` 变量。让我们来仔细看看这个方法做了什么：

首先新建一个表单：`let formData = new FormData()`，然后将文件添加进待发送的表单：`formData.append('file', this.files[i])`。

使用 `axios` 发送 `"post"` 表单请求。该方法有三个参数。第一个是目标 url，在本例子当中是 `"/files/upload-file"`。第二个参数是需要发送的内容，在本例子当中是前面创建的表单数据 `formData`。第三个参数当中添加了请求头部信息，包含了 `'Content-Type':'multipart/form-data'` 以明确表示可以通过表单发送文件。

最后，对于成功与失败都有对应的回调函数。注意没有成功更新时将会使用新上传文件的 ID 信息来更新文件数组变量 `files`。

### Style

我不会在 CSS 上面钻研太深以免得造成文章篇幅太长，这部分基本上就是隐藏文件的输入框，渲染可拖放的虚线框。

```
<style scoped>
    input[type="file"]{
        opacity: 0;
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }
    .filezone {
        outline: 2px dashed grey;
        outline-offset: -10px;
        background: #ccc;
        color: dimgray;
        padding: 10px 10px;
        min-height: 200px;
        position: relative;
        cursor: pointer;
    }
    .filezone:hover {
        background: #c0c0c0;
    }

    .filezone p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 50px 50px 50px;
    }
    div.file-listing img{
        max-width: 90%;
    }

    div.file-listing{
        margin: auto;
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    div.file-listing img{
        height: 100px;
    }
    div.success-container{
        text-align: center;
        color: green;
    }

    div.remove-container{
        text-align: center;
    }

    div.remove-container a{
        color: red;
        cursor: pointer;
    }

    a.submit-button{
        display: block;
        margin: auto;
        text-align: center;
        width: 200px;
        padding: 10px;
        text-transform: uppercase;
        background-color: #CCC;
        color: white;
        font-weight: bold;
        margin-top: 20px;
    }
</style>
```

### 注册组件以及编译

我们已经完成了我们的 Vue 组件，接下来必须注册组件名字以用于在视图中调用。打开文件 `resources/assets/js/app.js` 然后在示例组件下添加如下代码：

```
Vue.component('upload-files', 
require('./components/UploadFiles.vue'));
```

你可以根据自己的需要命名。在这篇教程里，我选择以 `"upload-files"` 来命名。

一旦编写完程序，就可以编译 Vue 项目了。在你的 laravel 项目根目录下，执行以下命令：

> npm run watch

也可以使用 `run dev` 或者 `run build` 命令，但是由于项目还在编写中，我更倾向于用 `watch`，因为每当代码改变的时候，就会自动重新编译。

### 提交文件

现在我们开发好了组件，就可以在 laravel 中创建上传文件的视图了。新建文件 `resources/views/files/create.blade.php` 然后输入以下代码：

```
@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">Add files</div>

				<div class="card-body">
					<upload-files></upload-files>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
```

注意添加了新建的 `<upload-files></upload-files>` 组件。

现在只需要新建各自的控制器方法已及对应的路由。在文件 `FileEntriesController` 当中添加以下方法：

```
public function create()
{
	return view('files.create');
}
```

在文件 `routes/web.php` 文件中添加这个视图的路由，以及接收 `Axios` POST 请求的路由：

```
Route::get('files/create', 'FileEntriesController@create');
Route::post('files/upload-file',
'FileEntriesController@uploadFile');
```

测试一下吧。

我们的脚本将提交的文件保存到数据库当中了。如果返回列表视图文件，已上传的文件就会显示出来。

如果通过点击文件就下载，只需要添加如下路由：

```
Route::get('files/{path_file}/{file}', function($path_file = null, $file = null) {
	$path = storage_path().'/files/uploads/'.$path_file.'/'.$file;
	if(file_exists($path) {
		return Response::download($path);
	})
});
```

以及在文件名处添加：

```
<a href="{ { url('files/'.$file->path.'/'.$file->filename) } }">{ { $file->filename } }</a>
```

### 额外奖励：将文件添加到其他模型

我们的组件已经完美地运行并且将文件保存到了各自的文件表当中，但是通常希望将文件与其他的模型比如用户个人文档联系起来。通过添加一点点小改动，就可以让新建的组件变得多重功能以及在整个项目中复用。

为了达到这点，在 Vue 组件当中，我们必须新增一些将要通过视图发送的参数。它们对于每个模型都是必要的，Axios 发送的文件地址可能会改变，以及文件输入框的名字可能会改变。打开文件 `resources/assets/js/components/UploadFiles.vue` 在模板中添加以下加粗的改变：

```
<template>
    <div class="container">
        <div class="large-12 medium-12 small-12 filezone">
            <input type="file" id="files" ref="files" multiple v-on:change="handleFiles()"/>
            <p>
                Drop your files here <br>or click to search
            </p>
        </div>
        <div v-for="(file, key) in files" class="file-listing">
            <img class="preview" v-bind:ref="'preview'+parseInt(key)"/>
            {{ file.name }}
            <div class="success-container" v-if="file.id > 0">
                Success
                <input type="hidden" :name="input_name" :value="file.id"/> <-- 修改的地方
            </div>
            <div class="remove-container" v-else>
                <a class="remove" v-on:click="removeFile(key)">Remove</a>
            </div>
        </div>
        <a class="submit-button" v-on:click="submitFiles()" v-show="files.length > 0">Submit</a>
    </div>
</template>
```

注意我们新加了一个只有文件有 id 值的时候才会显示的输入框，就是说当文件已经被发送到指定路径时才会显示。输入框被命名为 `"input_name"`，它的名称将会通过 VueJS 的 `props` 传递。由于上传文件的 URL 会取决于模型，我们新建一个名叫 `"post_url"` 的 props 来接收它。添加以下加粗的代码到 script 开始处：

```
<script>
	export default {
		props: ['input_name', 'post_url'],  <-- 修改的地方
		data() {
			return {
				files: []
			}
		},
```

接着，在 Axios 请求中添加 URL prop。新的上传文件 id 值是以前保存的，所以是不变的。`submitFiles` 方法是这样的：

```
submitFiles() {
	for( let i = 0; i < this.files.length; i++) {
		if (this.files[i].id) {
			continue;
		}
		let formData = new FormData();
		formData.append('file', this.files[i]);

		axios.post('/' + this.post_url,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		).then(function(data) {
			this.files[i].id = data['data']['id'];
			this.files.splice(i, 1, this.files[i]);
			console.log('success');
		}.bind(this)).catch(function(data) {
			console.log('error');
		});
	}
}
``` 

添加了两个 props 到 Vue 组件中，我们需要在使用到这个组件的地方像下面这样传递参数：

```
<upload-files :input_name="'users[]'" :post_url="'files/upload-file'"></upload-files>
```

在这个例子中，我们自定义的输入是 `users[]` 以及附属 URL 是 `files/upload-file`。现在已经可以在任意表单中使用了，只需要简单的指定输入的名称（由于上传可以是多个文件，所以要用括号 [] 来指定是数组），还有提交文件的 URL 路径。

每一个成功上传的文件，你的 ID 都将存放于输入框中并通过表单提交，这样就跟模型联系起来了。

在处理表单提交的结果的时候，还需要这样做：

```
foreach($input['users'] as $file) {
	// 保存文件的 id 
}
```

以上就是所有内容。希望能有所帮助。尽管在下方的评论链接中问问题。我还制作了这个项目的 GITHUB 教程链接来给有需要的人。

[Project on GitHub](https://github.com/arthursorriso/laravueupload)

---
译者注：在使用 Laravel 的上传功能的时候，如需访问上传的文件，需要在 public 文件夹下新建一个指向文件实际存放的路径的软链接。例如，在本例子中，访问上传好的图片，需要新建一个软链接 `ln -s /mnt/d/WWW/learn/laravel/Laravel/storage/files/uploads/ /var/www/Laravel/public/storage`。使用 Laravel 内置的建立符号链接命令 `php artisan storage:link` 建立的软链接指向的是 `storage/app/public` 目录。参考：[https://laravel-china.org/docs/laravel/5.7/filesystem/2281#69e36e](https://laravel-china.org/docs/laravel/5.7/filesystem/2281#69e36e)  

---

### 更多关于这篇文章的来源信息

这篇文章是发布于 [Noteworthy](https://blog.usejournal.com/)，每天都有数千人访问学习关于塑造我们想要的产品以及想法。

关注我们的出版物以及 [Journal团队](https://usejournal.com/?utm_source=usejournal.com&utm_medium=blog&utm_campaign=guest_post)的特色设计故事。

---  
原文地址：[https://blog.usejournal.com/file-upload-with-laravel-and-vuejs-a70ae85e34a1](https://blog.usejournal.com/file-upload-with-laravel-and-vuejs-a70ae85e34a1)

作者：[Arthur Henrique](https://blog.usejournal.com/@arthursorriso)

---
