---
title: ProModal 对话框
outline: deep
---

# ProModal 对话框

ProModal 是基于[Antv Modal](https://www.antdv.com/components/modal-cn)的扩展，支持`Antv Modal`的所有属性。

## 使用演示

通过 `description` 设置对话框描述，通过 `showFullscreen` 设置对话框全屏按钮显示，通过 `defaultFullscreen` 设置对话框默认全屏显示，通过 `draggable` 开启对话框页头拖动，其他使用示例请前往[Antv Modal](https://www.antdv.com/components/modal-cn)查看。

:::demo

modal/basic

:::

## API

### Props

| 参数                | 说明                                              | 类型                                                            | 默认值                |
| ------------------- | ------------------------------------------------- | --------------------------------------------------------------- | --------------------- |
| description         | 对话框描述                                        | `string`                                                        | -                     |
| show-fullscreen     | 显示全屏按钮                                      | `boolean`                                                       | `true`                |
| default-fullscreen  | 默认全屏显示                                      | `boolean`                                                       | `false`               |
| draggable           | 开启对话框页头拖动                                | `boolean`                                                       | `false`               |
| after-close         | Modal 完全关闭后的回调                            | `function`                                                      | -                     |
| body-style          | Modal body 样式                                   | `CSSProperties`                                                 | -                     |
| cancel-button-props | cancel 按钮 props                                 | [`ButtonProps`](https://www.antdv.com/components/button-cn#api) | -                     |
| cancelText          | 取消按钮文字                                      | `string`                                                        | 取消                  |
| centered            | 垂直居中展示 Modal                                | `boolean`                                                       | `false`               |
| closable            | 是否显示右上角的关闭按钮                          | `boolean`                                                       | `true`                |
| confirm-loading     | 确定按钮 loading                                  | `boolean`                                                       | -                     |
| destroy-on-close    | 关闭时销毁 Modal 里的子元素                       | `boolean`                                                       | `false`               |
| footer              | 当不需要默认底部按钮时，可以设为 `:footer="null"` | `string`                                                        | `确定取消按钮`        |
| force-render        | 强制渲染 Modal                                    | `boolean`                                                       | `false`               |
| get-container       | 指定 Modal 挂载的 HTML 节点                       | `(instance): HTMLElement`                                       | `() => document.body` |
| keyboard            | 是否支持键盘 esc 关闭                             | `boolean`                                                       | `true`                |
| mask                | 是否展示遮罩                                      | `boolean`                                                       | `true`                |
| maskClosable        | 点击蒙层是否允许关闭                              | `boolean`                                                       | `true`                |
| maskStyle           | 遮罩样式                                          | `CSSProperties`                                                 | -                     |
| okButtonProps       | ok 按钮 props                                     | [`ButtonProps`](https://www.antdv.com/components/button-cn#api) | -                     |
| okText              | 确认按钮文字                                      | `string`                                                        | `'确定'`              |
| okType              | 确认按钮类型                                      | `string`                                                        | `'primary'`           |
| title               | 标题                                              | `string`                                                        | -                     |
| open(v-model)       | 对话框是否可见                                    | `boolean`                                                       | -                     |
| width               | 宽度                                              | `string`\|`number`                                              | 520                   |
| wrap-class-name     | 对话框外层容器的类名                              | `string`                                                        | -                     |
| z-index             | 设置 Modal 的 `z-index`                           | `number`                                                        | 1000                  |

### Events

| 事件名      | 说明                                 | 类型                          |
| ----------- | ------------------------------------ | ----------------------------- |
| cancel      | 点击遮罩层或右上角叉或取消按钮的回调 | `(e: MouseEvent)=>void`       |
| ok          | 点击确定回调                         | `(e: MouseEvent)=>void`       |
| full-screen | 点击左上角全屏按钮的回调             | `(fullscreen: boolean)=>void` |

### Slots

| 插槽名      | 说明                   | 类型 |
| ----------- | ---------------------- | ---- |
| default     | 对话框的内容           | -    |
| title       | 对话框的标题           | -    |
| description | 对话框的描述           | -    |
| extra       | 对话框右上角的操作区域 | -    |
| footer      | 对话框的页脚           | -    |
