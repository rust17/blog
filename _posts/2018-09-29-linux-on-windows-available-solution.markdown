---
title: "使用 wsl 代替虚拟机的可行性方案"
layout: post
date: 2018-09-28 17:30
headerImage: false
tag:
- summary
- wsl
category: blog
author: circle
description: 经验总结
---

&emsp;&emsp;在 Windows 上进行 web 开发，比较普遍的方案是使用 phpstudy 或者别的一些集成环境软件进行环境搭建，写好代码后将代码上传至版本管理工具 git/svn，再将代码同步到 Linux 服务器，这个过程当中开发者的开发环境（Windows）与代码最终执行的环境（Linux）不一致经常会导致一些奇奇怪怪的问题，想在 Windows 上进行 web 开发（毕竟没钱买 mac），又不想使用虚拟机（分配内存会导致机器变得卡顿），这时候，wsl 的出现就完美解决了这些问题。无需通过虚拟机以及双系统的形式体验 Linux ，并且可以实现系统级别的文件互操作，实在是太具有吸引力了。

---

### 什么是 wsl

> 在 Windows 10 内置了 Linux，子系统 Linux 运行在 Windows 10 上，微软将这个 Linux 系统命名为：Windows Subsystem for Linux。

### 启动 Linux 子系统

系统要求：Windows 10 且必须是 64 位。在 『控制面板』 --> 『程序和功能』 --> 『启用和关闭 Windows 功能』 中勾选 『适用于 Linux 的 Windows 子系统』，确定后重启。重启后，在 Microsoft Store 中搜索 Linux，我喜欢比较通用的 Ubuntu，然后点击安装，安装好了之后，在 『开始』 菜单中就可以找到 Ubuntu 应用了，这个应用就是 Windows 当中的子系统 Linux。

### 基本的设置

打开 Ubuntu 应用，第一次打开会进行初始化安装，一般持续几分钟，之后会提示设置 Linux 用户名和密码，按照提示进行操作即可。

### 更换 Linux 子系统的软件源并更新

使用 Ubuntu 系统的好处就是可以使用 『软件源』 进行软件安装，因为默认的软件源是 Ubuntu 的官网，需要设置成国内阿里的镜像以提高速度。

切换 root 用户

```bash
sudo -i
```

备份当前软件源

```bash
cp /etc/apt/sources.list /etc/apt/sources.list.old
```

编辑源管理文件

```bash
vim /etc/apt/sources.list
```

将以下代码复制添加到文件当中

```
# deb cdrom:[Ubuntu 16.04 LTS _Xenial Xerus_ - Release amd64 (20160420.1)]/ xenial main restricted
deb-src http://archive.ubuntu.com/ubuntu xenial main restricted #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb http://mirrors.aliyun.com/ubuntu/ xenial multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse #Added by software-properties
deb http://archive.canonical.com/ubuntu xenial partner
deb-src http://archive.canonical.com/ubuntu xenial partner
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-security multiverse
```

保存退出后执行跟新

```bash
apt-get update
```

这样就成功的将 Ubuntu 的软件源切换到阿里云的源了。

### 启动 ssh 并使用 ssh 客户端登录

Ubuntu 应用的使用需要 Windows 的 CMD 或者 PowerShell 来操作 Linux，对于大多数开发者来说不如直接使用 Xshell 或者 SFTP 来的更方便。因此配置 ssh 远程登录是非常必要的。为了避免使用 `sudo -i` 进行提权操作，需要为 root 用户设置密码

```bash
sudo passwd root
```

备份 ssh 相关配置文件

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

编辑 ssh 配置文件

```bash
sudo vim /etc/ssh/sshd_config
```

编辑调整以下设置项

```
Port 8022(更换新的端口)
(去掉前面的 #)ListenAddress 0.0.0.0
UsePrivilegeSeparation no(原来是 yes)
PermitRootLogin yes(修改成 yes)
(在前面加上 #)StrictModes yes
PasswordAuthentication yes(原来是 no)
```

配置完成后启动 ssh

```bash
sudo /etc/init.d/ssh start
```

接下来就可以使用 Xshell 来登录了，地址是 127.0.0.1，端口号 8022，用户名和密码分别是 root，初始化设置的密码。

### 使用脚本搭建环境

徒手搭建环境需要一个个安装软件，容易漏装或者装错，这里我使用了脚本的方式进行 LNMP 环境部署，首先，执行`sudo -H -s`切换为 root 账户

安装执行

```bash
wget -qO- https://raw.githubusercontent.com/summerblue/laravel-ubuntu-init/master/download.sh - | bash
```

此脚本会安装 Git、PHP 7.2、Nginx、MySql、Sqlite3、Composer、Nodejs 8、Yarn、Redis、Beansalkd、Memcached，安装结束会输出 Mysql 的 root 账号的密码，需要保存。

脚本自带的新增 Nginx 站点命令

```bash
./laravel-ubuntu-init/16.04/nginx_add_site.sh
```

会提示输入站点名称、域名，确认后会创建对于的 Nginx 配置并重启 Nginx，为了测试，创建两个项目，分别是 example、example2，域名为 example.com、example2.com
