---
title: "翻译 —— 使用 Laravel 和 VueJS 实现文件的上传"
layout: post
date: 2018-11-14 18:00
headerImage: false
tag:
- translation
- laravel
- vuejs
category: blog
author: circle
description: 翻译文章 —— Laravel 的上传功能实现
---

在搭建一个系统的过程中，每个开发者都会碰到文件上传的功能。当然了，对于缺乏经验的开发者来说，这可能是一个棘手的问题。并且，当你希望系统更简单并且对用户更友好的时候，这个任务就会成为一个头痛的问题。这篇教程的目的就在于逐步促进此过程的开发。

### 前提

这篇教程的前提是，假设你已经有一个 laravel 项目以及掌握了一些关于 php、[VueJS](https://vuejs.org/) 和 laravel 自身的知识点。

另外还有一个前提条件是我认为你已经掌握一个支持表单类型数据的现代化浏览器的使用。

### 后端

首先，我们的系统应该将我们的文件保存在某个目录下。Laravel 自带了一个配置简单并且功能强大的文件系统。我们可以使用本地目录来存储文件，或者存储于云端服务器，比如 Amazon S3。这篇教程，我们将使用本地路径作为存储目录。

在你的 Laravel 项目中，打开 `config/filesystems.php` 这个文件。找到 `disks` 这个配置项。你会看到已经预设好了一些硬盘选项。让我们来新建一个硬盘选项用来存储我们的新文件。在 `local` 路径下方，添加如下代码：

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

这个命令将新建一个用于数据库建表的文件，文件的位置是 `database/migrations`。在迁移文件中添加一些需要的字段，就好像这样：

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

我将这个表命名为 file_entries，不过你可以起你自己想要的名字。在这个文件中，在默认字段 `id` 和 `timestamps`(`created_at`、`updated_at` 字段)，我们新建了以下字段：

1. filename：上传文件名；
2. mime：文件的 mime 类型；
3. path：文件将要存放的内部路径（我会解释为什么要这样做）；
4. size：文件大小。

现在，我们需要新建一个模型类和控制器来管理我们的上传文件。在终端命令行输入以下命令：

> php artisan make:model FileEntry
> php artisan make:controller FileEntriesController

在模型类当中，我们应该添加一些上传文件时需要填充的字段。就像这样：

```
class FileEntry extends Model
{
	protected $fillable = ['filename', 'mime', 'path', 'size'];
}
```

在控制器里，我们必须添加一个方法用于接收文件上传表单提交过来的数据，并经过处理，保存在正确的路径以及数据库当中。打开 `app/Http/Controllers/FileEntriesControlle.php` 控制器文件新建 `uploadFile` 方法：

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

这条命令将会新建登录，注册以及密码找回相关的页面。

现在新建文件夹 `resources/views/files` 以及新建文件 `index.blade.php` 填写入以下代码：

```
@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">Files <a href="{{ url('files/create') }}" class="btn btn-info">Add files</a> </div>
				<div class="card-body">
					@if($files->count())
						<table class="table">
							<th>Name</th>
							<th>Size</th>
							@foreach($files as $file)
								<tr>
									<td>{{ $file->filename }}</td>
									<td>{{ $file->size }} Bytes</td>
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

这里，我们将获取到的存放于数据库的文件信息写入文件变量(`$files = FileEntry::all()`)，然后返回给我们的视图(`return view('files.index', compact('files'))`)。

最后，我们需要将路由注册到可通过 URL 的方式访问。在 `routes/web.php` 文件中添加以下代码片段：

```
Route::group(['middleware' => 'auth'], function () {
	Route::get('files', 'FileEntriesController@index');
});
``` 

写在 `Route::group(['middleware' => 'auth'], function () {})` 当中的代码会只允许已登录的用户访问。我们添加了 "get" 路由方式：`Route::get('files', 'FileEntriesController@index')`，第一个参数代表了路由的名字，第二个参数代表将要匹配的路由。

在浏览器中访问该 url，将会看到上传表单。
