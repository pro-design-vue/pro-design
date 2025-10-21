---
outline: deep
---

# 暗黑模式

组件库提供了深色模式，以适配在操作系统深色模式下的展示体验，可以点击官网右上角开关切换整体浅色与深色模式体验。

## 在 ProConfigProvider 中配置暗黑模式

通过在 ProConfigProvider 中传入 `dark`，可以配置`Ant Design Vue`和`Pro Design Vue`组件为暗黑模式，以下是将配置暗黑模式示例：

```vue
<template>
  <ProConfigProvider dark>
    <app />
  </ProConfigProvider>
</template>

```

::: warning 注意
请一定使用`ProConfigProvider`配置暗黑模式，将同时实现`Ant Design Vue`和`Pro Design Vue`组件为暗黑模式，且配置简单。
:::