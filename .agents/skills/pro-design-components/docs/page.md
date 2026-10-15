## API

### ProPage

页面容器，简化页面标题、描述、标签栏、操作按钮等配置。

| 参数                | 说明                                           | 类型                                       | 默认值  |
| ------------------- | ---------------------------------------------- | ------------------------------------------ | ------- |
| title               | 页面标题                                       | `string`                                   | -       |
| page-style          | 页面容器样式                                   | `CSSProperties`                            | -       |
| description         | 页面描述（标题下的内容）                       | `string`                                   | -       |
| content-class       | 内容区域的 class                               | `string`                                   | -       |
| content-style       | 内容区域的 style                               | `CSSProperties`                            | -       |
| content-padding     | 内容区域的内边距                               | `number`                                   | `16`    |
| header-class        | 头部区域的 class                               | `string`                                   | -       |
| header-style        | 头部区域的样式                                 | `CSSProperties`                            | -       |
| footer-class        | 底部区域的 class                               | `string`                                   | -       |
| auto-content-height | 内容区域高度自适应                             | `boolean`                                  | `false` |
| height-offset       | 配合 autoContentHeight，自定义高度偏移值（px） | `number`                                   | `0`     |
| tab-list            | tab 标题列表                                   | `(TabPaneProps & { key?, accessCode? })[]` | -       |
| active-key(v-model) | 激活的 tab key                                 | `string \| number`                         | -       |
| tab-props           | Antv Tabs 的所有属性                           | `TabsProps`                                | -       |
| loading             | 页面级加载状态                                 | `boolean \| SpinProps`                     | -       |
| content-loading     | 内容级加载状态                                 | `boolean \| SpinProps`                     | -       |

### Events

| 事件名     | 说明            | 类型                  |
| ---------- | --------------- | --------------------- |
| tab-change | 切换 tab 的回调 | `(activeKey) => void` |

### Slots

| 插槽名      | 说明           | 作用域                                   |
| ----------- | -------------- | ---------------------------------------- |
| default     | 页面内容       | `{ activeKey, offset: { top, bottom } }` |
| header      | 自定义页面头部 | -                                        |
| title       | 自定义页面标题 | -                                        |
| description | 自定义页面描述 | -                                        |
| extra       | 自定义页面扩展 | -                                        |
| footer      | 自定义页面底部 | -                                        |
| tabs        | 自定义标签内容 | `{ activeKey, offset: { top, bottom } }` |
