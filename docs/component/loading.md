---
title: ProLoading 加载中
outline: deep
---

# ProLoading 加载中

ProLoading 用于页面和区块的加载中状态。

## 使用演示

:::demo

loading/basic

:::

## API

### Props

| 参数             | 说明             | 类型      | 默认值  |
| ---------------- | ---------------- | --------- | ------- |
| spinning         | 是否为加载中状态 | `boolean` | `false` |
| min-loading-time | 最小加载时间     | `number`  | 50      |
| text             | 加载提示文本     | `string`  | -       |

### Slots

| 插槽名  | 说明               | 类型 |
| ------- | ------------------ | ---- |
| default | 包裹内容           | -    |
| icon    | 自定义加载动画图标 | -    |
