---
outline: deep
---

# 最佳实践 {#best-practices}
欢迎使用  `Pro Design Admin`, 快速搭建你的项目!

[在线预览](https://pro-design-admin.shene.org.cn/)｜[代码仓库](https://github.com/pro-design-vue/pro-design-admin.git) 

![pro design admin](/guide/admin_02.png)

## 项目简介

Pro Design Admin 是一个基于 ProDesignVue + Vue3 + Vite7 + TypeScript + MicroApp开发，可进行个性化主题配置，旨在提供项目开箱即用的、配置式的中后台项目。该项目拥有如下特性：

- 内置多种常用的中后台页面
- 完善的目录结构
- 完善的代码规范配置
- 支持国际化
- 支持暗黑模式
- 自定义主题颜色
- 多种空间布局
- 内置 Mock 数据方案
- 内置微前端解决方案

## 启动项目

### 获取源码

::: code-group

```sh [GitHub]
# clone 代码
git clone https://github.com/pro-design-vue/pro-design-admin.git
```

```sh [Gitee]
# clone 代码
# Gitee 的代码可能不是最新的
git clone https://gitee.com/pro-design-vue/pro-design-admin.git
```

:::

::: danger 注意

在启动项目前，你需要确保你的环境满足以下要求：

- [Node.js](https://nodejs.org/en) 20.15.0 及以上版本，推荐使用 [fnm](https://github.com/Schniz/fnm) 、 [nvm](https://github.com/nvm-sh/nvm) 或者直接使用[pnpm](https://pnpm.io/cli/env) 进行版本管理。
- [Git](https://git-scm.com/) 任意版本。
- 注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

### 安装依赖

在你的代码目录内打开终端，并执行以下命令:

```bash
# 进入项目目录
cd pro-design-admin

# 安装依赖
pnpm install
```

### 运行项目

执行以下命令运行项目:

```bash
# 启动项目
pnpm dev
```

现在，你可以在浏览器访问 `http://localhost:8090` 查看项目。