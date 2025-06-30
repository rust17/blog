---
title: "在宿主机中通过虚拟机访问深信服"
layout: post
date: 2023-07-21 11:00
headerImage: false
tag:
- virtual machine
category: blog
hidden: false
author: circle
description: use sangfor in virtual machine
---

### 背景：
- 宿主机（用于开发）：ubuntu 20.04
- 虚拟机（用于安装深信服软件）：windows 11

### 适用范围：
- 所有 VPN

### 原理：
- 同一个局域网内两台机器可以互相通信

### 操作：
- 在宿主机中使用 VirtualBox 安装好 windows 11/10/7/xp（windows 11 内存最低要求为 4 G）
- 在 VirtualBox 选择虚拟机 - Network，将 Adapter 1 设置为 Bridged Adapter
- 在 VirtualBox - Tools 中新建一个 Host-only 的 Network，并将 ipv4 地址设置为 `192.168.137.1`（参考此[链接](https://www.virtualbox.org/manual/UserManual.html#network_hostonly)设置）
- 为虚拟机新建一个 Adapter 2，并将其设置为 Host-only Adapter，Name 选择上一步创建的 Network
- 启动 windows 虚拟机，在虚拟机中启动 VPN（本文只讨论 atrust 这种情况）
- 在 windows 网络连接界面将 VPN 共享给 Host-only 对应的网络
- 在 windows 网络连接界面修改 Host-only 网络的 ip 地址为 `192.168.137.2`（与 `192.168.137.1` 在同一个子网内）
- 在宿主机 ubuntu 中通过添加路由规则访问 windows 的 Host-only 网络（临时规则）：
```
sudo ip route add 172.18.0.0/16(此处是内网 ip) via 192.168.137.2
```

### 参考资料：
- [在宿主机中使用虚拟机的vpn连接](https://blog.zenggyu.com/zh/post/2022-05-04/%E5%9C%A8%E5%AE%BF%E4%B8%BB%E6%9C%BA%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%99%9A%E6%8B%9F%E6%9C%BA%E7%9A%84vpn%E8%BF%9E%E6%8E%A5/)
- [How to share Guest VM’s VPN Connection with Host](https://stackoverflow.com/questions/53573337/how-to-share-guest-vms-vpn-connection-with-host)
