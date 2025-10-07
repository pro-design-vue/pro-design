---
title: 组件设计
outline: deep
---

# 组件设计

Pro Design Vue 是基于Ant Design Vue 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著地提升制作 CRUD 页面的效率，更加专注于页面。

::: info 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，大可以直接使用原生组件，亦或亲手封装一个适合的组件。使用与否，完全取决于你的需求与自由。

:::

- [ProLayout](/component/layout) 解决布局的问题，提供开箱即用的菜单和面包屑功能
- [ProPage](/component/page) 通用页面设计，减少繁杂的tablist配置和标题
- [ProTable](/component/table) 表格模板组件，抽象网络请求和表格格式化
- [ProForm](/component/form) 表单模板组件，预设常见布局和行为
- [ProButton](/component/button) 解决业务常用的行为，使用更便捷

## 与网络请求库配置使用

ProTable 和 ProForm 都集成了请求网络数据的能力，如果你使用了我们约定的参数使用起来会非常简单。

```ts
// ProTable
export type Request<T = DefaultRecordType, U = Record<string, any>> = (
  params: U & {
    pageSize?: number
    current?: number
    keyword?: string
  },
  sorters?: SorterResult<T>[],
  filter?: Record<string, (string | number)[] | null>,
) => Promise<Partial<RequestData<T>>>

export type RequestData<T = DefaultRecordType> = {
  data: T[] | undefined
  success?: boolean
  total?: number
} & Record<string, any>
```

```ts
// ProForm
export type ProRequestData<T = Entity, U = Record<string, any>> = (params: U) => Promise<T>
```

ProForm 部分 Field 也集成了请求网络数据的能力

```ts
export type FieldRequestData<U = any> = (
  params: U,
) => Promise<(string | number | RequestOptionsType)[]>
```
