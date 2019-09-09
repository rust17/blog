---
title: "面试准备"
layout: post
date: 2019-09-09 16:00
headerImage: false
tag:
- interview
- prepare
category: blog
hidden: true
author: circle
description: prepare interview
---

# 操作系统

## 进程和线程的概念

进程是具有独立功能的程序关于某个数据集合上的一次运行活动，是系统进行资源分配和调度的独立单位

linux 与进程有关的命令：
- ps -a 列出所有运行中的主进程
- ps -ef 列出所有运行中的进程，包括子进程
- pstree 以可视化的方式显示进程
- top 监控进程的资源调度，实时显示进程的状态信息，包括 PID、进程属主、优先级、CPU、memory
- nice 设置进程的优先级：nice --数字 进程名
- renice 设置正在运行的进程优先级：renice -n 优先级数字 -p 进程 pid
- kill 杀死一个进程
- kill -9 立即杀死进程
- killall -9 立即杀死具有同样名字的进程
- pgrep -u 用户 进程名 通过名字检索输出该用户的进程
- jobs 列出所有后台进程

线程是进程派生出的，是进程的一个运行实体，是 CPU 的调度单位，可以理解为轻量级进程

## 什么是上下文切换

## 多线程和多进程各自的优势

## 进程间通信的方式

## 进程基本状态

## 抢占式调度和非抢占式调度

## 进程线程同步，死锁

## 理解协程
