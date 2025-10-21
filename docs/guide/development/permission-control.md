---
outline: deep
---

# 权限控制

许多系统需要通过权限，控制用户有哪些权限访问部分菜单和路由，常见的控制权限的方式有`后端权限控制`和`前端权限控制`。

`Pro Design Admin` 放弃了`前端权限控制`，因为觉得用处不大。

## 后端权限控制

通过后端权限控制，可以达到更细颗粒度的权限控制，包括图标、顺序、菜单命名等细节。

使用后端权限控制，需要后端配合一个菜单请求的接口，根据用户身份信息，返回具体的序列化后的菜单列表，模板会将它转换为路由和菜单。 由于是序列化的菜单列表，与路由与菜单章节相比，需要在返回的菜单接口中将几个非序列化的字段进行序列化。

* `component 字段`：
  - 非具体页面路由，不需要添加，因为根路由已经配置`BasicLayout`
  - 具体页面路由，请设置为对应页面在项目中的相对路径，如基础列表页对应的是`/list/base/index`，不需要`/views`和`.vue`
* `icon 字段`：项目内使用的是 `Iconify`图标，你可以替换成你常用的如`iconfont`。

```ts
[
    {
      id: '1',
      order: 1,
      parentId: '0',
      icon: 'lucide:layout-dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      redirect: '/analytics',
      title: lang === 'zh-CN' ? '概览' : 'Dashboard',
    },
    {
      id: '1-1',
      parentId: '1',
      order: 1,
      icon: 'lucide:area-chart',
      name: 'Analytics',
      path: '/analytics',
      component: '/dashboard/analytics/index',
      title: '分析页',
      keepAlive: true,
      affixTab: true,
    },
    {
      id: '1-2',
      parentId: '1',
      order: 2,
      icon: 'carbon:workspace',
      name: 'Workspace',
      path: '/workspace',
      keepAlive: true,
      title: '工作台',
    },
    // 内部 demo
    {
      id: '2',
      order: 2,
      parentId: '0',
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/form',
      title: '示例',
    },
    {
      id: '2-2',
      parentId: '2',
      order: 1,
      name: 'Form',
      path: '/demos/form',
      component: '/demos/form/index',
      title:'表单',
      keepAlive: true,
    },
    {
      id: '2-1',
      parentId: '2',
      order: 2,
      name: 'Table',
      path: '/demos/table',
      component: '/demos/table/index',
      title: '表格',
      keepAlive: true,
    },
    //iframe demo
    {
      id: '8',
      order: 8,
      parentId: '0',
      name: 'IframeDemos',
      path: '/iframe',
      redirect: '/iframe/elemnt-plus/doc',
      title: 'Iframe',
    },
    {
      id: '8-1',
      parentId: '8',
      order: 1,
      name: 'IframeElementDoc',
      path: '/iframe/elemnt-plus/doc',
      iframeSrc: 'https://element-plus.org/zh-CN/',
      title:'Elemnt Plus',
      keepAlive: true,
    },
    {
      id: '8-2',
      parentId: '8',
      order: 2,
      name: 'IframeAntdvDoc',
      path: '/iframe/antv/doc',
      iframeSrc: 'https://www.antdv.com/components/overview-cn',
      title: 'Ant Design Vue',
      keepAlive: true,
    },
    {
      id: '8-5',
      parentId: '8',
      order: 5,
      name: 'IframeNewWin',
      path: '/iframe/new/window',
      iframeSrc: 'https://www.antdv.com/components/overview-cn',
      title: '新窗口打开',
      keepAlive: true,
      openInNewWindow: true,
    },
    {
      id: '9',
      parentId: '0',
      order: 9,
      name: 'Jump',
      path: 'https://www.antdv.com/components/overview-cn',
      title: 'Ant Design Vue',
    },
    {
      id: '10',
      order: 10,
      parentId: '0',
      name: 'About',
      path: '/about',
      component: '/about/index',
      icon: 'lucide:copyright',
      title: '关于',
      keepAlive: true,
    },
  ]

```