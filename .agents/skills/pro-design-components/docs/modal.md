## API

### ProModal

基于 [Antv Modal](https://www.antdv.com/components/modal-cn) 扩展，支持 Antv Modal 所有属性。

| 参数                | 说明                              | 类型                        | 默认值                |
| ------------------- | --------------------------------- | --------------------------- | --------------------- |
| description         | 对话框描述                        | `string`                    | -                     |
| top                 | 距离页面顶部的距离（px）          | `number`                    | `100`                 |
| show-fullscreen     | 显示全屏按钮                      | `boolean`                   | `true`                |
| default-fullscreen  | 默认全屏显示                      | `boolean`                   | `false`               |
| draggable           | 开启对话框页头拖动                | `boolean`                   | `false`               |
| after-close         | Modal 完全关闭后的回调            | `function`                  | -                     |
| body-style          | Modal body 样式                   | `CSSProperties`             | -                     |
| cancel-button-props | cancel 按钮 props                 | `ButtonProps`               | -                     |
| cancelText          | 取消按钮文字                      | `string`                    | `'取消'`              |
| centered            | 垂直居中展示 Modal                | `boolean`                   | `false`               |
| closable            | 是否显示关闭按钮                  | `boolean`                   | `true`                |
| confirm-loading     | 确定按钮 loading                  | `boolean`                   | -                     |
| destroy-on-close    | 关闭时销毁子元素                  | `boolean`                   | `true`                |
| footer              | 底部内容，`:footer="null"` 不显示 | `string`                    | 确定取消按钮          |
| force-render        | 强制渲染 Modal                    | `boolean`                   | `false`               |
| get-container       | 指定挂载的 HTML 节点              | `(instance) => HTMLElement` | `() => document.body` |
| keyboard            | 是否支持键盘 esc 关闭             | `boolean`                   | `true`                |
| mask                | 是否展示遮罩                      | `boolean`                   | `true`                |
| maskClosable        | 点击蒙层是否允许关闭              | `boolean`                   | `true`                |
| maskStyle           | 遮罩样式                          | `CSSProperties`             | -                     |
| okButtonProps       | ok 按钮 props                     | `ButtonProps`               | -                     |
| okText              | 确认按钮文字                      | `string`                    | `'确定'`              |
| okType              | 确认按钮类型                      | `string`                    | `'primary'`           |
| title               | 标题                              | `string`                    | -                     |
| open(v-model)       | 对话框是否可见                    | `boolean`                   | -                     |
| width               | 宽度                              | `string \| number`          | `520`                 |
| wrap-class-name     | 外层容器的类名                    | `string`                    | -                     |
| z-index             | z-index                           | `number`                    | `1000`                |

### Events

| 事件名      | 说明                       | 类型                            |
| ----------- | -------------------------- | ------------------------------- |
| cancel      | 点击遮罩层或关闭按钮的回调 | `(e: MouseEvent) => void`       |
| ok          | 点击确定回调               | `(e: MouseEvent) => void`       |
| full-screen | 点击全屏按钮的回调         | `(fullscreen: boolean) => void` |

### Slots

| 插槽名      | 说明             |
| ----------- | ---------------- |
| default     | 对话框的内容     |
| title       | 对话框的标题     |
| description | 对话框的描述     |
| extra       | 右上角的操作区域 |
| footer      | 对话框的页脚     |
