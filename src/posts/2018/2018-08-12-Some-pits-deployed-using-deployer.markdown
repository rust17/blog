---
title:  "使用 deployer 部署项目遇到的一些坑"
layout: post
date: 2018-08-12 09:02
headerImage: false
tag:
- learn
- 踩坑纪录
category: blog
author: circle
description: 记录一些踩过的坑
---
&emsp;&emsp;使用 [deployer](https://deployer.org/) 进行 `php` 项目部署已经有一段时间了，确实感觉到在部署时只需要一条命令，节省了许多工作，这种方式很方便。不仅如此，`deployer` 还可以备份项目代码，随时可以进行回滚，比起传统的代码上传发布方式让人放心了多了。当然，采用这种方式要求使用者对 linux 的使用、英语阅读能力都要有一定基础，这篇文章的目的就是记录一些自己使用过程中遇到的问题。

---
&emsp;&emsp;问题：`deploy:vendor` 没有完整安装依赖包

&emsp;&emsp;描述：当 `deployer` 运行到 `deploy:vendor` 这一步的时候，观察命令行是这样的：
```
cd /var/www/demo-app/releases/19 && /usr/bin/php /usr/local/bin/composer install --verbose --prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader
```
&emsp;&emsp;执行这条命令后，输出的日志记录：
```
[111.230.206.231] < Loading composer repositories with package information
[111.230.206.231] < Installing dependencies from lock file
[111.230.206.231] < Dependency resolution completed in 0.000 seconds
[111.230.206.231] < Analyzed 112 packages to resolve dependencies
[111.230.206.231] < Analyzed 235 rules to resolve dependencies
[111.230.206.231] < Package operations: 53 installs, 0 updates, 0 removals
[111.230.206.231] < Installs: doctrine/inflector:v1.3.0, doctrine/lexer:v1.0.1, erusev/parsedown:1.7.1, vlucas/phpdotenv:v2.5.0, symfony/css-selector:v4.1.1, tijsverkoyen/css-to-inline-styles:2.2.1, symfony/polyfill-mbstring:v1.8.0, symfony/var-dumper:v3.4.12, symfony/routing:v3.4.12, symfony/process:v3.4.12, symfony/polyfill-ctype:v1.8.0, paragonie/random_compat:v2.0.17, symfony/polyfill-php70:v1.8.0, symfony/http-foundation:v3.4.12, symfony/event-dispatcher:v4.1.1, psr/log:1.0.2, symfony/debug:v3.4.12, symfony/http-kernel:v3.4.12, symfony/finder:v3.4.12, symfony/console:v3.4.12, egulias/email-validator:2.1.4, swiftmailer/swiftmailer:v6.1.2, ramsey/uuid:3.7.3, psr/simple-cache:1.0.1, psr/container:1.0.0, symfony/translation:v4.1.1, nesbot/carbon:1.32.0, mtdowling/cron-expression:v1.2.1, monolog/monolog:1.23.0, league/flysystem:1.0.45, laravel/framework:v5.5.40, fideloper/proxy:3.3.4, psr/http-message:1.0.1, guzzlehttp/psr7:1.4.2, guzzlehttp/promises:v1.3.1, guzzlehttp/guzzle:6.3.3, hieu-le/active:3.5.1, jakub-onderka/php-console-color:0.1, predis/predis:v1.1.1, cakephp/chronos:1.2.2, laravel/horizon:v1.3.1, nikic/php-parser:v4.0.3, jakub-onderka/php-console-highlighter:v0.3.2, dnoegel/php-xdg-base-dir:0.1, psy/psysh:v0.9.6, laravel/tinker:v1.0.7, intervention/image:2.4.2, mews/captcha:2.2.0, ezyang/htmlpurifier:v4.10.0, mews/purifier:2.1.0, caouecs/laravel-lang:3.0.54, overtrue/laravel-lang:3.0.8, overtrue/pinyin:3.0.6
[111.230.206.231] <   - Installing doctrine/inflector (v1.3.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing doctrine/lexer (v1.0.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing erusev/parsedown (1.7.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing vlucas/phpdotenv (v2.5.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/css-selector (v4.1.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing tijsverkoyen/css-to-inline-styles (2.2.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/polyfill-mbstring (v1.8.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/var-dumper (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/routing (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing symfony/process (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/polyfill-ctype (v1.8.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing paragonie/random_compat (v2.0.17): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/polyfill-php70 (v1.8.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/http-foundation (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/event-dispatcher (v4.1.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing psr/log (1.0.2): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/debug (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/http-kernel (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/finder (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/console (v3.4.12): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing egulias/email-validator (2.1.4): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing swiftmailer/swiftmailer (v6.1.2): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing ramsey/uuid (3.7.3): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing psr/simple-cache (1.0.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing psr/container (1.0.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing symfony/translation (v4.1.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing nesbot/carbon (1.32.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing mtdowling/cron-expression (v1.2.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing monolog/monolog (1.23.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing league/flysystem (1.0.45): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing laravel/framework (v5.5.40): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing fideloper/proxy (3.3.4): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing psr/http-message (1.0.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing guzzlehttp/psr7 (1.4.2): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing guzzlehttp/promises (v1.3.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing guzzlehttp/guzzle (6.3.3): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing hieu-le/active (3.5.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing jakub-onderka/php-console-color (0.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing predis/predis (v1.1.1): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing cakephp/chronos (1.2.2): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing laravel/horizon (v1.3.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing nikic/php-parser (v4.0.3): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing jakub-onderka/php-console-highlighter (v0.3.2): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing dnoegel/php-xdg-base-dir (0.1): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing psy/psysh (v0.9.6): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing laravel/tinker (v1.0.7): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing intervention/image (2.4.2): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing mews/captcha (2.2.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing ezyang/htmlpurifier (v4.10.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing mews/purifier (2.1.0): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing caouecs/laravel-lang (3.0.54): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] <   - Installing overtrue/laravel-lang (3.0.8): Loading from cache
[111.230.206.231] <  Extracting archive  - Installing overtrue/pinyin (3.0.6): Loading from cache
[111.230.206.231] <  Extracting archive
[111.230.206.231] < Generating optimized autoload files
[111.230.206.231] < > post-autoload-dump: Illuminate\Foundation\ComposerScripts::postAutoloadDump
[111.230.206.231] < > post-autoload-dump: @php artisan package:discover
[111.230.206.231] < Discovered Package: fideloper/proxy
[111.230.206.231] < Discovered Package: hieu-le/active
[111.230.206.231] < Discovered Package: intervention/image
[111.230.206.231] < Discovered Package: laravel/horizon
[111.230.206.231] < Discovered Package: laravel/tinker
[111.230.206.231] < Discovered Package: mews/captcha
[111.230.206.231] < Discovered Package: mews/purifier
[111.230.206.231] < Discovered Package: nesbot/carbon
[111.230.206.231] < Discovered Package: overtrue/laravel-lang
[111.230.206.231] < Package manifest generated successfully.
```
&emsp;&emsp;上面是 `deploy:vendor` 的时候安装的项目中的依赖包，安装完成之后，我在发布版本的依赖包目录内(`current/vendor`)看到的包是这些：
```
autoload.php  cakephp  composer  doctrine  erusev  fideloper   hieu-le       jakub-onderka  league  monolog    nesbot  overtrue   predis  psy     swiftmailer  tijsverkoyen
bin           caouecs  dnoegel   egulias   ezyang  guzzlehttp  intervention  laravel        mews    mtdowling  nikic   paragonie  psr     ramsey  symfony      vlucas
```
&emsp;&emsp;然后我回到项目目录下执行 `composer install` 发现 `composer`  又另外安装了一些依赖包，最终完整的依赖包列表如下：
```
autoload.php  cakephp   dnoegel   erusev     filp        hamcrest      jakub-onderka  maximebf  monolog    nesbot    paragonie      phpspec  psr     sebastian    symfony       vlucas
barryvdh      caouecs   doctrine  ezyang     fzaninotto  hieu-le       laravel        mews      mtdowling  nikic     phar-io        phpunit  psy     summerblue   theseer       webmozart
bin           composer  egulias   fideloper  guzzlehttp  intervention  league         mockery   myclabs    overtrue  phpdocumentor  predis   ramsey  swiftmailer  tijsverkoyen
```
&emsp;&emsp;可以看到，`deploy:vendor` 这一步所安装的并不是所有的依赖包，一些包如 `barryvdh/laravel-debugbar` 缺失了。

---
&emsp;&emsp;分析原因：一开始，我以为是 `deploy.php` 文件中配置地有问题，于是到 `deploy` 的文档中查看，发现文档中关于这方面的信息只有一句话
```
Install composer dependencies. You can configure composer options with the composer_options parameter.
```
&emsp;&emsp;得到不了什么有帮助的信息，于是只能在 issues 中查找了，在 issues 中搜索关键词`is:issue is:closed composer`，幸运的是，找到了两个有用的 issues。分别是
* [Unable to deploy with composer with dev-master #1298](https://github.com/deployphp/deployer/issues/1298)
* [[SF_RECIPE] Add conditional statement for composer options #878](https://github.com/deployphp/deployer/issues/878)

&emsp;&emsp;查看这两个 issues，发现共同点是都提到了 `composer install` 的时候有一些放在 `require-dev` 中的包没装上，查阅 `composer` 文档发现这些放在 `require-dev` 的包是开发版的依赖包，开发环境中安装这些依赖包，在正式环境中不会安装这些依赖包。查看我的 `composer.json` 发现没装上的依赖包确实是处于 `require-dev` 中，于是这就解释了为什么 `deploy:vendor` 没有安装所有的依赖包。

---
&emsp;&emsp;解决办法：既然找到了原因，那解决办法就很容易了，如果希望 	`deploy` 在执行 `deploy:vendor` 的时候把开发版的依赖包也安装上，需要在部署脚本 `deploy.php` 中为 `composer` 单独设置一个执行命令：
```
set('composer_options', 'install --verbose --prefer-dist --no-progress --no-interaction --optimize-autoloader');
```
这条命令相比于默认执行的安装命令去掉了`--no-dev`，再次执行部署发现所有依赖包成功安装上，问题解决！

相关链接：
[https://github.com/deployphp/deployer/issues/1672](https://github.com/deployphp/deployer/issues/1672)
