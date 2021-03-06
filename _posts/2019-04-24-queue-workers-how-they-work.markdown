---
title: "[译] —— 队列任务：是怎样工作的"
layout: post
date: 2019-04-24 13:00
headerImage: false
tag:
- translation
- laravel
- queue
category: blog
author: circle
description: 翻译文章 —— 描述了 Laravel 队列的工作原理
---

现在，我们已经知道了 Laravel 是怎样将任务推送到不同的队列，让我们来深入了解一下进程是怎样执行任务的。首先，我将这里的进程定义为一个简单的 PHP 工作进程，该进程在后台运行，从存储中取出任务，根据配置选项小心翼翼地执行。

```shell
php artisan queue:work
```

运行这条命令将指示 Laravel 创建一个应用实例，然后开始执行任务，这个实例将一直保持。也就是说，一旦执行了这个命令，Laravel 就会一直保持着启动，与此同时该实例还将执行各种任务。这样做的意义是：

* 避免了每执行一个任务都要启动整个程序从而节省了服务器资源
* 在应用程序中任何代码的改动，你都必须要手动重启这个进程

你也可以运行：

```shell
php artisan queue:work --once
```

这个命令会将启动应用程序，在执行完一次任务后结束掉整个脚本。

```shell
php artisan queue:listen
```

`queue:listen` 会在循环运行期间不断地执行 `queue:work --once`，该命令执行的过程如下：

* 每次循环启动一个应用程序实例
* 指派工作进程并挑选一个任务执行
* 结束该进程

使用 `queue:listen` 确保了每个任务都会产生一个新的应用实例，这就意味着即使你改动代码也不必每次手动去重启工作进程，但也意味着更多的服务器资源的消耗。

### queue:work 命令

现在，让我们来看一下 `Queue\Console\WorkCommand` 这个类内部的 `handle()` 方法，当你运行 `php artisan queue:work` 的时候，执行的就是这个方法。

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

可以看到，首先，我们检查了程序是否处于维护模式以及命令行是否使用了 `--once` 参数，如果这两个条件都符合，那么我们希望脚本能优雅地终止，而不必再执行任何任务。为此，在终止整个脚本之前我们将让工作进程进行一段设定时间的睡眠。

`Queue\Worker` 的 `sleep()` 方法大概是这样：

```php
public function sleep($seconds)
{
    sleep($seconds);
}
```

**在 handle() 方法中我们为什么不直接返回空来结束掉整个脚本呢？**

正如我们之前所说那样，`queue:listen` 是在一个循环内执行 `WorkCommand` 的：

```php
while (true) {
    // 循环过程只需要不断地调用 —— 'php artisan queue:work --once'
    $this->runProgress($process, $options->memory);
}
```

如果程序处于维护阶段，`WorkCommand` 命令将立即终止使得一次循环结束，并快速开启下一个工作进程。这比返回空而故意造成的延迟要好得多，因为那样将会创建大量我们不需要的应用实例从而造成过多的服务器资源消耗。

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

可以看到，在这个方法内部，我们进行了一系列工作进程触发事件的监听，这将允许我们在每个事件处理中、处理通过或者处理失败的时候打印一些信息给用户。

### 失败任务日志记录

一旦任务执行失败，`logFailedJob()` 方法将被调用：

```php
$this->laravel['queue.failer']->log(
    $event->connectionName, $event->job->getQueue(),
    $event->job->getRawBody(), $event->exception
);
```

其实，在 `Queue\QueueServiceProvider::registerFailedJobServices()` 方法中已经为 `queue.failer` 服务注册好了别名：

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
 * 创建一个数据库任务失败的服务提供者
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

一旦 `queue.failed` 配置好，数据库队列会将失败的任务记录到一张数据表当中：

```php
$this->getTable()->insertGetId(compact(
    'connection', 'queue', 'payload', 'exception', 'failed_at'
));
```

### 启动进程

为了启动进程，我们需要收集两方面的信息：

* 工作进程获取任务的连接
* 工作进程获取任务的队列

可以在 `queue:work` 命令中再添加一个 `--connection=default` 的配置项，表明如果你没有指明默认的连接，那么就采用 `queue.default` 中的配置。

同样，对于队列而言，可以再提供一个 `--queue=emails` 配置项或者使用选择的连接中的 `queue` 配置。

一旦这些东西设置好，`WorkCommand::handle()` 方法就可以执行 `runWorker()` 了：

```php
protected function runWorker($connection, $queue)
{
    $this->worker->setCache($this->laravel['cache']->driver());

    return $this->worker->{$this->option('once') ? 'runNextJob' : 'daemon'}(
        $connection, $queue, $this->gatherWorkerOptions()
    );
}
```

进程类的属性在构造的时候已经被设置好了：

```php
public function __construct(Worker $worker)
{
    parent::__construct();

    $this->worker = $worker;
}
```

可以看到，在该构造函数内我们从服务容器中解析出 `Queue\Worker` 实例，在执行 `runWorker()` 的时候，我们使用实例设置进程的缓存驱动，同时也设置好基于 `--once` 命令行参数将要调用的方法。

在 `--once` 参数配置好的前提下，我们将调用 `runNextJob` 方法执行下一个待执行的任务，然后脚本终止。否则，我们就调用 `daemon` 方法保持进程运行状态，从而可以一直处理任务。

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

现在，让来我们看下 `Worker::daemon()` 方法，该方法内的第一行就调用 `listenForSignals()`：

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

首先，该方法使用了 PHP7.1 的信号处理函数 `supportsAsyncSignals()` 方法检查了环境是否是 PHP7.1 以及 `pcntl` 模块是否加载成功。

然后，调用 `pcntl_async_signals()` 开启信号处理，接下来为多个信号注册对应的处理程序：

* `SIGTERM` 代表脚本将要关闭时会触发 
* `SIGUSR2` 是一个用户自定义的信号，Laravel 使用其表示脚本将要暂停
* `SIGOUT` 代表暂停的脚本要重新启动时会触发

这些信号是从一个类似于 [Supervisor][1] 的进程监控管理中发送过来的。

`Worker::daemon()` 方法的第二行获取了最后一个队列任务重启的时间戳，当我们调用 `queue:restart` 时该值会被保存起来，我们通过检查进程最后一次重启的时间与该值是否匹配来指示进程是否应该重启，更多详细见下文。

最终，该方法开启了一个循环，在循环内继续寻找并执行任务，并且在工作进程中执行一些操作：

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

#### 决定进程是否处理任务

调用 `daemonShouldRun()` 是为了确认以下情况：

* 应用程序不是处于维护模式
* 工作进程没有暂停
* 循环期间没有事件监听器试图停止循环

即使程序处于维护模式，你依然可以通过命令行带上 `--force` 参数来处理任务：

```shell
php artisan queue:work --force
```

在这当中，决定了进程是否继续运行的一个条件如下：

```php
$this->events->until(new \Events\Looping($connectionName, $queue)) === false
```

这行代码启动了一个 `Queue\Event\Looping` 事件并且检查内部的 `handle()` 有没有返回 false，使用这个判断可以强制进程暂时停止。

如果需要暂停进程，将调用`pauseWorker()`方法：

```php
protected function pauseWorker(WorkerOptions $options, $lastRestart)
{
    $this->sleep($options->sleep > 0 ? $options->sleep : 1);

    $this->stopIfNecessary($options, $lastRestart);
}
```

该方法内调用了 `sleep` 并且将 `--sleep` 参数传递到控制台：

```php
public function sleep($seconds)
{
    sleep($seconds);
}
```

在脚本休眠一段时间后，我们将检查进程是否应该退出，如果是那么结束掉该脚本，该结果将在 `stopIfNecessary()` 内给出，如果脚本不应该结束我们就调用 `continue`，又开启一个新的循环：

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

`getNextJob()` 方法接收一个待运行任务的队列连接实例和一个队列任务：

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

可以看到，我们将在队列任务中循环，每一次循环，都将根据选中的队列，到存储空间（数据库，redis，sqs 等等）中获取并返回一个任务。

我们将查询符合以下条件的任务并返回：

* 该任务试图推进 `queue` 当中
* 不是其他进程保留的任务
* 在规定时间内仍然可以运行的任务，因为有些任务是延迟运行的
* 我们也去获取那些保留了很长时间、被冻结的任务，并尝试重新运行

一旦我们找到了符合条件的任务，我们将标记该任务作为当前进程保留的，以确保其他进程将不会选中它，我们也将监控尝试运行任务的次数。

#### 监控任务超时

在下一个任务确定之后，我们将调用 `registerTimeoutHandler()` 方法：

```php
protected function registerTimeoutHandler($job, WorkerOptions $options)
{
    if ($this->supportsAsyncSignals()) {
        pcntl_signal(SIGALRM, function () {
            $this->kill(1);
        });the

        $timeout = $this->timeoutForJob($job, $options);

        pcntl_alarm($timeout > 0 ? $timeout : 0);
    }
}
```

可以看到，`pcntl` 模块再次加载，我们将注册一个终结超时进程的信号，我们在进程超过配置的超时时间后使用 `pcntl_alerm()` 来发送一个 `SIGALRM` 信号。

如果处理任务花费的时间超过超时时间，处理程序将结束掉整个脚本，如果没有找到下个循环执行的任务，那么将设置一个新警报覆盖上一个警报，因为这个过程中只允许存在单个警报。

任务超时仅在 PHP7.1 以上版本有效，在 Windows 上也无法工作 `¯\_(ツ)_/¯`。

### 处理一个任务

`runJob()` 调用了 `process()` 方法：

```php
public function process($connectionName, $job, WorkerOptions $options)
{
    try {
        $this->raiseBeforeJobEvent($connectionName, $job);

        $this->markJobAsFailedIfAlreadyExceedsMaxAttempts(
            $connectionName, $job, (int) $options->maxTries
        );

        $job->fire();

        $this->raiseAfterJobEvent($connectionName, $job);
    } catch (Exception $e) {
        $this->handleJobException($connectionName, $job, $options, $e);
    }
}
```

这里，`raiseBeforeJobEvent()` 启动了 `Queue\Events\JobProcessing` 事件，并且 `raiseAfterJobEvent()` 启动了 `Queue\Events\JobProcessed` 事件。

`markJobAsFailedIfAlreadyExceedsMaxAttempts()` 方法检查了进程是否已经到达了最大尝试次数并且决定是否将任务标记为失败状态：

```php
protected function markJobAsFailedIfAlreadyExceedsMaxAttempts($connectionName, $job, $maxTries)
{
    $maxTries = ! is_null($job->maxTries()) ? $job->maxTries() : $maxTries;

    if ($maxTries === 0 || $job->attempts() <= $maxTries) {
        return;
    }

    $this->failJob($connectionName, $job, $e = new MaxAttemptsExceededException(
        'A queued job has been attempted too many times. The job may have previously timed out.'
    ));

    throw $e;
}
```

如果任务没有标记为失败，我们将基于任务对象调用 `fire()` 方法执行任务。

#### 去哪里获取任务对象？

`getNextJob()` 方法返回了一个 `Contracts\Queue\Job` 实例，同时，我们将根据队列驱动使用相应的队列实例，例如，在该例子中 `Queue\Jobs\DatabaseJob` 对应的是数据库队列驱动。

#### 循环结束

在循环结尾，我们调用 `stopIfNeccessary()` 来检查我们是否需要在下一次循环开启之前终止该进程：

```php
protected function stopIfNeccessary(WorkerOptions $options, $lastRestart)
{
    if ($this->shouldQuit) {
        $this->kill();
    }

    if ($this->memoryExceeded($options->memory)) {
        $this->stop(12);
    } elseif ($this->queueShouldRestart($lastRestart)) {
        $this->stop();
    }
}
```

`shouldQuit` 属性设置分两种情况，一种是在 `listenForSignals()` 内设置的 `SIGTERM` 信号处理器，另一种是在 `stopWorkerIfLostConnection()` 中：

```php
protected function stopWorkerIfLostConnection($e)
{
    if ($this->causedByLostConnection($e)) {
        $this->shouldQuit = true;
    }
}
```

当任务回收以及处理任务的时候，该方法会在好几个 try...catch 中被调用，确保了该进程会终止，从而让控制台发起一个新的数据库连接。

`causedByLostConnection()` 方法可以在 `Database\DetectsLostConnections` 这个 trait 中找到。

`memoryExceeded()` 检查了内存是否超出当前内存限制，你可以在 `queue:work` 命令中使用 `--memory` 参数设置限制。

最后 `queueShouldRestart()` 方法对比了重启信号与启动进程的时间戳是否一致，如果不一致意味着循环期间已经有一个重启信号发送了，那样的话我们将终止那个进程从而可以稍后在控制台中重启。



---
原文地址：[https://divinglaravel.com/queue-workers-how-they-work](https://divinglaravel.com/queue-workers-how-they-work)

作者：[Mohamed Said](https://twitter.com/themsaid)

---

[1]: http://supervisord.org/
