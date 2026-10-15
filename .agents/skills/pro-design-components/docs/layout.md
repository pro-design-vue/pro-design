## API

### ProLayout

中后台标准布局组件，提供一键切换布局形态、自动生成菜单、面包屑、Tabbar 等功能。

| 参数                    | 说明                                        | 类型                                                                                                                                  | 默认值          |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| layout                  | 布局方式                                    | `'sidebar-nav' \| 'sidebar-mixed-nav' \| 'header-nav' \| 'header-sidebar-nav' \| 'mixed-nav' \| 'header-mixed-nav' \| 'full-content'` | `'sidebar-nav'` |
| content-compact         | 内容区模式，wide=自适应，compact=定宽1200px | `'wide' \| 'compact'`                                                                                                                 | `'wide'`        |
| content-compact-width   | 内容区定宽布局宽度                          | `number`                                                                                                                              | `1200`          |
| content-padding         | 内容区边距                                  | `number`                                                                                                                              | `16`            |
| content-padding-top     | 内容区上边距                                | `number`                                                                                                                              | `16`            |
| content-padding-bottom  | 内容区下边距                                | `number`                                                                                                                              | `16`            |
| content-padding-left    | 内容区左边距                                | `number`                                                                                                                              | `16`            |
| content-padding-right   | 内容区右边距                                | `number`                                                                                                                              | `16`            |
| collapsed(v-model)      | 侧边栏折叠状态                              | `boolean`                                                                                                                             | -               |
| collapsible             | 是否可折叠                                  | `boolean`                                                                                                                             | `true`          |
| collapsed-width         | 折叠宽度                                    | `number`                                                                                                                              | `48`            |
| logo                    | 侧边栏/顶栏 logo                            | `string \| VNode`                                                                                                                     | -               |
| title                   | 标题                                        | `string`                                                                                                                              | -               |
| header-height           | 顶栏高度                                    | `number`                                                                                                                              | `48`            |
| header-theme            | 顶栏主题                                    | `'auto' \| 'dark' \| 'light'`                                                                                                         | `'light'`       |
| menu-data               | 菜单数据                                    | `MenuItemType[]`                                                                                                                      | `[]`            |
| menu-props              | Antv Menu 的所有属性                        | `MenuProps`                                                                                                                           | -               |
| sidebar-collapsed-width | 侧边菜单折叠宽度                            | `number`                                                                                                                              | `48`            |
| sidebar-mixed-width     | 混合侧边栏宽度                              | `number`                                                                                                                              | `80`            |
| sidebar-theme           | 侧边栏主题                                  | `'auto' \| 'dark' \| 'light'`                                                                                                         | `'light'`       |
| sidebar-width           | 侧边栏宽度                                  | `number`                                                                                                                              | `210`           |
| tabbar-enable           | tab 是否显示                                | `boolean`                                                                                                                             | `true`          |
| tabbar-height           | tab 高度                                    | `number`                                                                                                                              | `30`            |
| z-index                 | zIndex                                      | `number`                                                                                                                              | `100`           |

### Events

| 事件名           | 说明                 | 类型         |
| ---------------- | -------------------- | ------------ |
| side-mouse-leave | 侧边菜单鼠标移出事件 | `() => void` |
| toggle-sidebar   | 侧边菜显示隐藏事件   | `() => void` |

### Slots

| 插槽名           | 说明               |
| ---------------- | ------------------ |
| logo             | 侧边栏/顶栏 logo   |
| header           | 顶栏区域           |
| mixed-menu       | 侧边栏混合菜单区域 |
| menu             | 侧边栏菜单区域     |
| side-extra       | 侧边栏额外区域     |
| side-extra-title | 侧边栏额外区域标题 |
| tabbar           | tabbar 区域        |
| content          | 内容区域           |
| content-overlay  | 内容区域遮罩       |
| footer           | 页脚区域           |
| extra            | 额外扩展           |
