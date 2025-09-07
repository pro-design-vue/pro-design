---
title: ProPage 页面容器
outline: deep
---

# ProPage 页面容器

ProPage 是为了简化页面标题、描述、标签栏、操作按钮等配置，很多页面都需要这些配置，并且风格样式统一，当然可以完全自定义。

## 使用演示

页面包含标题、标签栏、扩展、内容以及尾部区域。

:::demo

page/basic

:::

## API

### Props

| 参数                | 说明                                                                | 类型                           | 默认值  |
| ------------------- | ------------------------------------------------------------------- | ------------------------------ | ------- |
| title               | 页面标题                                                            | `string`                       | -       |
| description         | 页面描述（标题下的内容）                                            | `string`                       | -       |
| content-class       | 内容区域的class                                                     | `string`                       | -       |
| content-style       | 内容区域的style                                                     | `CSSProperties`                | -       |
| content-padding     | 内容区域的内边距                                                    | `number`                       | 16      |
| header-class        | 头部区域的class                                                     | `string`                       | -       |
| footer-class        | 底部区域的class                                                     | `string`                       | -       |
| auto-content-height | 内容区域高度自适应                                                  | `boolean`                      | `false` |
| tab-list            | tab 标题列表                                                        | `{key: string, tab: string}[]` | -       |
| active-key(v-model) | 激活的tab key                                                       | `string` \| `number`           | -       |
| tab-props           | [Antv Tabs](https://www.antdv.com/components/tabs-cn#api)的所有属性 | `TabsProps`                    | -       |

### Events

| 事件名     | 说明          | 类型                  |
| ---------- | ------------- | --------------------- |
| tab-change | 切换tab的回调 | `(activeKey) => void` |

### Slots

| 插槽名      | 说明           | 类型                                                                 |
| ----------- | -------------- | -------------------------------------------------------------------- |
| default     | 页面内容       | `{activeKey: string\|number, offset: {top: number, bottom: number}}` |
| header      | 自定义页面头部 | -                                                                    |
| title       | 自定义页面标题 | -                                                                    |
| description | 自定义页面描述 | -                                                                    |
| extra       | 自定义页面扩展 | -                                                                    |
| footer      | 自定义页面底部 | -                                                                    |
| tabs        | 自定义标签内容 | `{activeKey: string\|number, offset: {top: number, bottom: number}}` |
