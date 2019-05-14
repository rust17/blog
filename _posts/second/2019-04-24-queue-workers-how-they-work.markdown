---
title: "[译] —— 队列任务：是怎样工作的"
layout: post
date: 2019-04-24 13:00
headerImage: false
tag:
- translation
- laravel
- queue
category: ['blog', 'second']
author: circle
description: 翻译文章 —— 描述了 Laravel 队列的工作原理
---

现在，我们已经知道了 Laravel 将任务推送到不同的队列，让我们来深入了解工作人员是怎样执行任务的。首先，我将这里的工作人员定义为一个简单的 PHP 工作进程，该进程在后台运行，从存储空间中取出任务，小心翼翼地根据一些配置选项执行。

```shell
php artisan queue:work
```

执行这条命令将指示 Laravel 创建一个应用实例，然后开始执行任务，这个实例将一直保持着。也就意味着一旦这个命令执行了，Laravel 就会一直保持着启动，同时该实例还将被用于执行任务。也就是说：

* 避免了每次执行任务都要启动整个程序从而节省了服务器资源
* 在应用程序中任何代码的改动，你都必须要手动重启这个工员

你也可以执行：

```shell
php artisan queue:work --once
```

这个命令会将启动应用程序，执行一次任务，然后就结束掉整个脚本了。

```shell
php artisan queue:listen
```

`queue:listen` 命令会在循环运行期间执行 `queue:work --once` 命令，这个命令执行的过程如下：

* 每次循环启动一个应用程序实例
* 指派的工作进程将挑选一个任务并执行
* 结束该进程

使用 `queue:listen` 确保了每个任务都会诞生一个新的应用实例，这就意味着你如果改动代码也不必每次都去手动重启工作进程了，但也意味着更多的服务器资源将被消耗。

### queue:work 命令

让我们来看一下 `Queue\Console\WorkCommand` 这个类内部的 `handle()` 方法，当你运行 `php artisan queue:work` 的时候，执行的就是这个方法。

```php
public function handle()
{
    if ($this->downForMaintenance() && $this->option('once')) {
        return $this->worker->sleep($this->option('sleep'));
    }

    $this->listenForEvents();

    $connection = $this->argument('connection')
                    ?: $this->laravel['config']['queue.default'];

    $queue = $this->getQueue($connection);

    $this->runWorker(
        $connection, $queue
    );
}
```

首先，我们检查了程序是否处于维护模式以及命令行是否使用了 `--once` 参数，如果这两个条件都符合，那么我们希望脚本能优雅地终止，而不必再执行任何任务。为此，在终止整个脚本之前我们将让工作进程进行一段设定时间的睡眠。

`Queue\Worker` 的 `sleep()` 方法大概就是这个样子：

```php
public function sleep($seconds)
{
    sleep($seconds);
}
```

**在 handle() 方法中我们为什么不直接返回空来结束掉整个脚本呢？**

正如我们之前所说那样，`queue:listen` 命令是在一个循环内执行 `WorkCommand` 的：

```php
while (true) {
    // 这个过程只需要调用 —— 'php artisan queue:work --once'
    $this->runProgress($process, $options->memory);
}
```

如果程序处于维护阶段，`WorkCommand` 命令立即终止将会使得一次循环结束，并快速开启下一个工作进程。这比故意造成延迟要好得多，因为那样将会创建大量我们不需要的应用实例从而造成消耗过多的服务器资源。

### 监听事件

在 `handle()` 方法内部我们调用了 `listenForEvents()` 方法：

```php
protected function listenForEvents()
{
    $this->laravel['events']->listen(JobProcessing::class, function ($event) {
        $this->writeOutput($event->job, 'starting');
    });

    $this->laravel['events']->listen(JobProcessed::class, function ($event) {
        $this->writeOutput($event->job, 'success');
    });

    $this->laravel['events']->listen(JobFailed::class, function ($event) {
        $this->writeOutput($event->job, 'failed');

        $this->logFailedJob($event);
    });
}
```

在这个方法内部，我们监听了一系列工作进程会触发的事件，这将允许我们在每个事件处理、通过或者失败的阶段打印一些信息给用户。

### 失败任务日志记录

一旦任务执行失败，`logFailedJon()` 方法将被调用：

```php
$this->laravel['queue.failer']->log(
    $event->connectionName, $event->job->getQueue(),
    $event->job->getRawBody(), $event->exception
);
```

在 `Queue\QueueServiceProvider::registerFailedJobServices()` 方法中已经注册好了 `queue.failer` 容器别名：

```php
protected function registerFailedJobServices()
{
    $this->app->singleton('queue.failer', function () {

        return isset($config['table'])
                    ? $this->databaseFailedJobProvider($config)
                    : new NullFailedJobProvider;
    });
}

/**
 * 创建一个新的数据库失败任务服务提供者
 *
 * @param array $config
 * @return \Illuminate\Queue\Failed\DatabaseFailedJobProvider
 */
protected function databaseFailedJobProvider($config)
{
    return new DatabaseFailedJobProvider(
        $this->app['db'], $config['database'], $config['table']
    );
}
```

一旦 `queue.failed` 配置信息设置好，数据库队列将启动并且将失败的任务记录到一张数据表当中：

```php
$this->getTable()->insertGetId(compact(
    'connection', 'queue', 'payload', 'exception', 'failed_at'
));
```

### 启动进程

为了启动进程我们需要收集两方面信息：

* 该进程获取任务的前后关系
* 该进程寻找任务的队列

你可以在 `queue:work` 命令中添加一个 `--connection=default` 配置项，如果你没有指明默认的连接，那么 `queue.default` 中的配置就将被使用。

同样对于队列方式而言，你可以提供一个 `--queue=emails` 配置项或者使用你选择的连接配置当中的 `queue` 配置。

一旦这些东西设置好，`WorkCommand::handle()` 方法将执行 `runWorker()`：

```php
protected function runWorker($connection, $queue)
{
    $this->worker->setCache($this->laravel['cache']->driver());

    return $this->worker->{$this->option('once') ? 'runNextJob' : 'daemon'}(
        $connection, $queue, $this->gatherWorkerOptions()
    );
}
```

进程类属性在构造命令的时候已经被设置好了：

```php
public function __construct(Worker $worker)
{
    parent::__construct();

    $this->worker = $worker;
}
```

从服务容器中解析出 `Queue\Worker` 实例，在 `runWorker()` 内部我们设置进程将要使用的缓存驱动，同时也设置好基于 `--once` 命令行参数将要调用的方法。

在 `--once` 配置的方法使用过后，我们将调用 `runNextJob` 方法执行下一个待执行的任务，然后脚本终止。不然我们就调用 `daemon` 方法保持进程运行从而一直处理任务。

```php
protected function gatherWorkerOptions()
{
    return new WorkerOptions(
        $this->option('delay'), $this->option('memory'),
        $this->option('timeout'), $this->option('sleep'),
        $this->option('tries'), $this->option('force')
    );
}
```

### 守护进程

让来我们看下 `Worker::daemon()` 方法，该方法内部的第一行就调用 `listenForSignals()` 方法：

```php
protected function listenForSignals()
{
    if ($this->supportsAsyncSignals()) {
        pcntl_async_signals(true);

        pcntl_signal(SIGTERM, function () {
            $this->shouldQuit = true;
        });

        pcntl_signal(SIGUSR2, function () {
            $this->paused = true;
        });

        pcntl_signal(SIGCONT, function () {
            $this->paused = false;
        });
    }
}
```

该方法使用了 PHP7.1 的信号处理程序，`supportsAsyncSignals()` 方法检查了我们的 PHP 版本是否是 7.1 然后加载 `pcntl` 模块。

然后调用 `pcntl_async_signals()` 开启信号处理，再然后为多个信号注册处理程序：

* 脚本指示将要关闭时会引发 `SIGTERM`
* `SIGUSR2` 是一个用户自定义的信号，Laravel 使用其指示脚本将要暂停
* 暂停的脚本要重新启动时会引发 `SIGOUT`

这些信号是从一个诸如 [Supervisor][1] 的进程监控发送过来的。

`Worker::daemon()` 方法的第二行获取了最后一个队列重启的时间戳，当我们调用 `queue:restart` 的时候该值会被缓存起来，我们通过检查最后重启的时间不匹配来指示进程应该重启，更多内容稍后将介绍。

最终该方法开启了一个循环，我们将继续寻找剩余任务，执行它们，并且在工作进程中执行一些操作。

```php
while (true) {
    if (! $this->daemonShouldRun($options, $connectionName, $queue)) {
        $this->pauseWorker($options, $lastRestart);

        continue;
    }

    $job = $this->getNextJob(
        $this->manager->connection($connectionName), $queue
    );

    $this->registerTimeoutHandler($job, $options);

    if ($job) {
        $this->runJob($job, $connectionName, $options);
    } else {
        $this->sleep($options->sleep);
    }

    $this->stopIfNecessary($options, $lastRestart);
}
```

#### 决定了进程是否处理任务

调用 `daemonShouldRun()` 主要是为了确认以下情况：

* 应用程序不是处于维护模式
* 进程没有暂停
* 循环期间没有事件监听器试图停止循环

即使程序处于维护模式，你依然可以通过命令行带上 `--force` 参数来处理任务：

```shell
php artisan queue:work --force
```

其中决定了进程是否继续运行的一个条件如下：

```php
$this->events->until(new \Events\Looping($connectionName, $queue)) === false
```

这行代码启动了一个 `Queue\Event\Looping` 事件并且检查 `handle()` 有没有监听到返回 false，使用这个判断你可以偶尔强制进程暂时结束。

如果进程需要暂停，将调用`pauseWorker()`方法：

```php
protected function pauseWorker(WorkerOptions $options, $lastRestart)
{
    $this->sleep($options->sleep > 0 ? $options->sleep : 1);

    $this->stopIfNecessary($options, $lastRestart);
}
```

该方法调用了 `sleep` 方法并且将 `--sleep` 参数传递到控制台：

```php
public function sleep($seconds)
{
    sleep($seconds);
}
```

在脚本休眠一段时间后，我们将检查进程是否应该退出，如果是的话结束掉该脚本，我们之后将继续跟踪 `stopIfNecessary()` 方法，如果脚本不应该被结束我们就调用 `continue`，开启一个新的循环：

```php
if (! $this->daemonShouldRun($options, $connectionName, $queue)) {
    $this->pauseWorker($options, $lastRestart);

    continue;
}
```

#### 检索仍要进行的任务

```php
$job = $this->getNextJob(
    $this->manager->connection($connectionName), $queue
);
```

`getNextJob()` 方法接收一个待运行的队列连接实例以及应该获取任务的队列：

```php
protected function getNextJob($connection, $queue)
{
    try {
        foreach (explode(',', $queue) as $queue) {
            if (! is_null($job = $connection->pop($queue))) {
                return $job;
            }
        }
    } catch (Exception $e) {
        $this->exceptions->report($e);

        $this->stopWorkerIfLostConnection($e);
    }
}
```

我们仅仅循环给定的队列，

---
原文地址：[https://divinglaravel.com/queue-workers-how-they-work](https://divinglaravel.com/queue-workers-how-they-work)

作者：[Mohamed Said](https://twitter.com/themsaid)

---

[1]: http://supervisord.org/
