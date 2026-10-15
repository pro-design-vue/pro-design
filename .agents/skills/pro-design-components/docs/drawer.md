## API

### ProDrawer

基于 [Antv Drawer](https://www.antdv.com/components/drawer-cn) 扩展，支持 Antv Drawer 所有属性。

| 参数                  | 说明                                     | 类型                                        | 默认值              |
| --------------------- | ---------------------------------------- | ------------------------------------------- | ------------------- |
| description           | 抽屉描述                                 | `string`                                    | -                   |
| show-fullscreen       | 显示全屏按钮                             | `boolean`                                   | `true`              |
| default-fullscreen    | 默认全屏显示                             | `boolean`                                   | `false`             |
| autofocus             | 抽屉展开后是否将焦点切换至其 Dom 节点    | `boolean`                                   | `false`             |
| body-style            | 设置 Drawer 内容部分的样式               | `CSSProperties`                             | -                   |
| class                 | 容器外层 className                       | `string`                                    | -                   |
| closable              | 是否显示关闭按钮                         | `boolean`                                   | `true`              |
| content-wrapper-style | 包裹内容部分的样式                       | `CSSProperties`                             | -                   |
| destroy-on-close      | 关闭时销毁子元素                         | `boolean`                                   | `true`              |
| footer-style          | 页脚部件的样式                           | `CSSProperties`                             | -                   |
| force-render          | 预渲染 Drawer 内元素                     | `boolean`                                   | `false`             |
| get-container         | 指定挂载的节点                           | `() => HTMLElement \| Selectors`            | `'body'`            |
| header-style          | 头部的样式                               | `CSSProperties`                             | -                   |
| height                | 高度，placement 为 top/bottom 时使用     | `string \| number`                          | `378`               |
| keyboard              | 是否支持键盘 esc 关闭                    | `boolean`                                   | `true`              |
| mask                  | 是否展示遮罩                             | `boolean`                                   | `true`              |
| mask-closable         | 点击蒙层是否允许关闭                     | `boolean`                                   | `true`              |
| mask-style            | 遮罩样式                                 | `CSSProperties`                             | -                   |
| placement             | 抽屉的方向                               | `'top' \| 'right' \| 'bottom' \| 'left'`    | `'right'`           |
| push                  | 多层 Drawer 的推动行为                   | `boolean \| { distance: string \| number }` | `{ distance: 180 }` |
| root-class-name       | 最外层容器的类名                         | `string`                                    | -                   |
| root-style            | 最外层容器的样式                         | `CSSProperties`                             | -                   |
| size                  | 预设抽屉宽度，default=378px，large=736px | `'default' \| 'large'`                      | `'default'`         |
| style                 | 容器样式                                 | `CSSProperties`                             | -                   |
| title                 | 标题                                     | `string`                                    | -                   |
| open(v-model)         | Drawer 是否可见                          | `boolean`                                   | -                   |
| width                 | 宽度                                     | `string \| number`                          | `378`               |
| z-index               | z-index                                  | `number`                                    | `1000`              |

### Events

| 事件名            | 说明                       | 类型                            |
| ----------------- | -------------------------- | ------------------------------- |
| close             | 点击遮罩层或关闭按钮的回调 | `(e: MouseEvent) => void`       |
| after-open-change | 切换抽屉时动画结束后的回调 | `(open: boolean) => void`       |
| full-screen       | 点击全屏按钮的回调         | `(fullscreen: boolean) => void` |

### Slots

| 插槽名      | 说明             |
| ----------- | ---------------- |
| default     | 抽屉的内容       |
| title       | 抽屉的标题       |
| description | 抽屉的描述       |
| extra       | 右上角的操作区域 |
| footer      | 抽屉的页脚       |
