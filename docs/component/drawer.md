---
title: ProDrawer 抽屉
outline: deep
---

# ProDrawer 抽屉

ProDrawer 是基于[Antv Drawer](https://www.antdv.com/components/drawer-cn)的扩展，支持`Antv Drawer`的所有属性。

## 使用演示

通过 `description` 设置抽屉描述，通过 `showFullscreen` 设置抽屉全屏按钮显示，通过 `defaultFullscreen` 设置抽屉默认全屏显示，其他使用示例请前往[Antv Drawer](https://www.antdv.com/components/drawer-cn)查看。

:::demo

drawer/basic

:::

## API

### Props

| 参数                  | 说明                                                                       | 类型                                           | 默认值              |
| --------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------- | --- |
| description           | 抽屉描述                                                                   | `string`                                       | -                   |
| show-fullscreen       | 显示全屏按钮                                                               | `boolean`                                      | `true`              |
| default-fullscreen    | 默认全屏显示                                                               | `boolean`                                      | `false`             |
| autofocus             | 抽屉展开后是否将焦点切换至其 Dom 节点                                      | `boolean`                                      | `true`              |
| body-style            | 可用于设置 Drawer 内容部分的样式                                           | `CSSProperties`                                | -                   |
| class                 | Drawer 容器外层 className 设置，如果需要设置最外层，请使用 rootClassName   | `string`                                       | -                   |
| closable              | 是否显示左上角的关闭按钮                                                   | `boolean`                                      | `true`              |     |
| content-wrapper-style | 可用于设置 Drawer 包裹内容部分的样式                                       | `CSSProperties`                                | -                   |
| destroy-on-close      | 关闭时销毁 Drawer 里的子元素                                               | `boolean`                                      | `false`             |
| footer-style          | 抽屉页脚部件的样式                                                         | `CSSProperties`                                | -                   |
| force-render          | 预渲染 Drawer 内元素                                                       | `boolean`                                      | `false`             |
| get-container         | 指定 Drawer 挂载的节点，**并在容器内展现**                                 | `() => HTMLElement` \| `Selectors`             | `'body'`            |
| header-style          | 用于设置 Drawer 头部的样式                                                 | `CSSProperties`                                | -                   |
| height                | 高度, 在 `placement` 为 `top` 或 `bottom` 时使用                           | `string` \| `number`                           | 378                 |
| keyboard              | 是否支持键盘 esc 关闭                                                      | `boolean`                                      | `true`              |
| mask                  | 是否展示遮罩                                                               | `boolean`                                      | `true`              |
| mask-closable         | 点击蒙层是否允许关闭                                                       | `boolean`                                      | `true`              |
| mask-style            | 遮罩样式                                                                   | `CSSProperties`                                | -                   |
| placement             | 抽屉的方向                                                                 | `'top'` \| `'right'` \| `'bottom'` \| `'left'` | `'right'`           |
| push                  | 用于设置多层 Drawer 的推动行为                                             | `boolean` \| `{distance: string \| number}`    | `{ distance: 180 }` |
| root-class-name       | 对话框外层容器的类名                                                       | `string`                                       | -                   |
| root-style            | 可用于设置 Drawer 最外层容器的样式，和 `style` 的区别是作用节点包括 `mask` | `CSSProperties`                                | -                   |
| size                  | 预设抽屉宽度（或高度），default `378px` 和 large `736px`                   | `default` \| `large`                           | `default`           |
| style                 | 设计 Drawer 容器样式，如果你只需要设置内容部分请使用 `bodyStyle`           | `CSSProperties`                                | -                   |
| title                 | 标题                                                                       | `string`                                       | -                   |
| open(v-model)         | Drawer 是否可见                                                            | `boolean`                                      | -                   |
| width                 | 宽度                                                                       | `string` \| `number`                           | 378                 |
| z-index               | 设置 Drawer 的 `z-index`                                                   | `number`                                       | 1000                |

### Events

| 事件名            | 说明                                 | 类型                          |
| ----------------- | ------------------------------------ | ----------------------------- |
| close             | 点击遮罩层或左上角叉或取消按钮的回调 | `(e: MouseEvent)=>void`       |
| after-open-change | 切换抽屉时动画结束后的回调           | `(open: boolean)=>void`       |
| full-screen       | 点击左上角全屏按钮的回调             | `(fullscreen: boolean)=>void` |

### Slots

| 插槽名      | 说明                 | 类型 |
| ----------- | -------------------- | ---- |
| default     | 抽屉的内容           | -    |
| title       | 抽屉的标题           | -    |
| description | 抽屉的描述           | -    |
| extra       | 抽屉右上角的操作区域 | -    |
| footer      | 抽屉的页脚           | -    |
