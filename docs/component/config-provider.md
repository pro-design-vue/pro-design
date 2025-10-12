---
title: ProConfigProvider 全局化配置
outline: deep
---

# ProConfigProvider 全局化配置

基于Antv `ConfigProvider` 和 `App` 组件的二次包装，为组件提供统一的全局化配置。

## 使用演示

ConfigProvider 使用 Vue 的 `provide / inject` 特性，只需在应用外围包裹一次即可全局生效。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { ProConfigProvider } from '@pro-design-vue/components'

const token = ref({
  colorPrimary: '#1677ff',
})
</script>

<template>
  <ProConfigProvider
    :token
    dark
    pro-prefix-cls="pro1"
    prefix-cls="pro-ant"
    :modal="{
      showFullscreen: true,
      draggable: false,
    }"
    :drawer="{
      showFullscreen: true,
    }"
    :form="{
      resetOnSubmit: true,
    }"
    :table="{
      bordered: true,
      pagination: {
        pageSize: 25,
        pageSizeOptions: ['5', '10', '25', '50'],
      },
    }"
  >
    <RouterView />
  </ProConfigProvider>
</template>
```

## API

### Props

| 参数                     | 说明                                                                                                     | 类型                                                                                                                                                                                                                                                                                                                                                                            | 默认值                |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --- |
| autoInsertSpaceInButton  | 设置为 `false` 时，移除按钮中 2 个汉字之间的空格                                                         | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | `true`                |
| dark                     | 暗黑模式，内部实现`theme.darkAlgorithm`                                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | -                     |
| compact                  | 紧凑模式算法，内部实现`theme.compactAlgorithm`                                                           | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | -                     |
| token                    | 同`theme.token`                                                                                          | `AliasToken`                                                                                                                                                                                                                                                                                                                                                                    | -                     |
| theme                    | 设置主题，参考 [定制主题](https://www.antdv.com/docs/vue/customize-theme-cn)                             | `Theme`                                                                                                                                                                                                                                                                                                                                                                         | -                     |
| componentSize            | 设置 antd 组件大小                                                                                       | `'small'` \| `'middle'` \| `'large'`                                                                                                                                                                                                                                                                                                                                            | -                     |
| csp                      | 设置 [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 配置               | `{ nonce: string }`                                                                                                                                                                                                                                                                                                                                                             | -                     |
| direction                | 设置文本展示方向。                                    | `ltr` \| `rtl`                                                                                                                                                                                                                                                                                                                                                                  | `ltr`                 |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动     | boolean \| `number`                                                                                                                                                                                                                                                                                                                                                             | -                     |
| form                     | 设置 Form 组件的通用属性                                                                                 | `{  validateMessages?: ValidateMessages, requiredMark?: boolean \| 'optional', colon?: boolean, resetOnSubmit?: boolean, labelWidth?: number \| 'auto', searchText?: string, resetText?: string}`                                                                                                                                                                               | -                     |
| getPopupContainer        | 弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。                                     | `Function(triggerNode, dialogContext)`                                                                                                                                                                                                                                                                                                                                          | `() => document.body` | d   |
| getTargetContainer       | 配置 Affix、Anchor 滚动监听容器。                                                                        | `() => HTMLElement`                                                                                                                                                                                                                                                                                                                                                             | `() => window`        |
| input                    | 设置 Input 组件的通用属性                                                                                | `{ autocomplete?: string }`                                                                                                                                                                                                                                                                                                                                                     | -                     |
| locale                   | 语言包配置，语言包可到 [ant-design-vue/es/locale](http://unpkg.com/ant-design-vue/es/locale/) 目录下寻找 | `object`                                                                                                                                                                                                                                                                                                                                                                        | -                     |
| pageHeader               | 统一设置 pageHeader 的 ghost                            | `{ ghost: boolean }`                                                                                                                                                                                                                                                                                                                                                            | `true`                |
| prefixCls                | 设置统一样式前缀。注意：需要配合 `less` 变量 `@ant-prefix` 使用                                          | `string`                                                                                                                                                                                                                                                                                                                                                                        | `'ant'`               |
| proPrefixCls             | 设置`pro`组件统一样式前缀。注意：需要配合 `less` 变量 `@pro-prefix` 使用                                 | `string`                                                                                                                                                                                                                                                                                                                                                                        | `'pro'`               |
| space                    | 设置 Space 的 `size`，参考 [Space](https://www.antdv.com/components/space-cn#api)                                                    | `{ size: 'small' \| 'middle' \| 'large' \| 'number' }`                                                                                                                                                                                                                                                                                                                          | -                     |
| transformCellText        | Table 数据渲染前可以再次改变，一般用户空数据的默认配置                                                   | `Function({ text, column, record, index }) => any`                                                                                                                                                                                                                                                                                                                              | -                     |
| virtual                  | 设置 `false` 时关闭虚拟滚动                                                                              | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | -                     |
| wave                     | 设置水波纹特效                                                                                           | `{ disabled?: boolean }`                                                                                                                                                                                                                                                                                                                                                        | -                     |
| table                    | 设置 Table 组件的通用属性                                                                                | `{ animateRows?: boolean, bordered?: boolean, childrenColumnName?: string,  expandRowByClick?: boolean, rowKey?: string, rowHover?: boolean, summaryFixed?: boolean, columnEmptyText?: string, highlightSelectRow?: boolean, pagination?: ProTablePaginationConfig }`                                                                                                           | -                     |
| modal                    | 设置 Modal 组件的通用属性                                                                                | `{ draggable?: boolean, showFullscreen?: boolean }`                                                                                                                                                                                                                                                                                                                             | -                     |
| drawer                   | 设置 Drawer 组件的通用属性                                                                               | `{ showFullscreen?: boolean }`                                                                                                                                                                                                                                                                                                                                                  | -                     |
| app                      | 设置 App 组件的通用属性                                                                                  | `{ message?: { top?: number \| string, duration?: number, prefixCls?: string, getContainer?: () => HTMLElement, transitionName?: string, maxCount?: number, rtl?: boolean }, notification?: { top?: number \| string, bottom?: number \| string, prefixCls?: string, getContainer?: () => HTMLElement, placement?: NotificationPlacement, maxCount?: number, rtl?: boolean } }` | -                     |
