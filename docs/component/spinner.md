---
title: ProSpinner 加载动画
outline: deep
---

# ProSpinner 加载动画

ProSpinner 是一个轻量级的加载动画组件，用于在异步操作期间提供视觉反馈。

## 使用演示

通过 `spinning` 控制加载动画的显示状态，通过 `minLoadingTime` 设置最小加载时间以避免闪烁。

:::demo

spinner/basic

:::

## API

### Props

| 参数           | 说明           | 类型      | 默认值 |
| -------------- | -------------- | --------- | ------ |
| spinning       | 是否为加载中状态 | `boolean` | -      |
| minLoadingTime | 最小加载时间（ms）| `number`  | 50     |