---
title: ProIcon 图标
outline: deep
---

# ProIcon 图标

ProIcon 提供了一套图标方案，支持组件图标、远程图标、类名图标等多种图标使用方式。

## 使用演示

ProIcon 支持三种图标类型：Vue 组件、远程 URL 图片和 class 类名图标。当 `icon` 属性未设置时，可通过 `component` 插槽提供 SVG 图标；设置 `fallback` 可在无图标时显示默认图标。

:::demo

icon/basic

:::

## API

### Props

| 参数     | 说明                               | 类型                              | 默认值  |
| -------- | ---------------------------------- | --------------------------------- | ------- |
| icon     | 图标，支持组件、远程URL、class类名 | `Component` \| `(() => void)` \| `string` | -       |
| fallback | 是否显示默认图标（无 icon 时）     | `boolean`                         | `false` |

### Slots

| 插槽名    | 说明                         | 类型 |
| --------- | ---------------------------- | ---- |
| component | 自定义 SVG 图标，用于 Icon 组件 | -    |