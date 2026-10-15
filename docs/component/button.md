---
title: ProButton 按钮
outline: deep
---

# ProButton 按钮

ProButton 是基于[Antv Button](https://www.antdv.com/components/button-cn)的扩展，支持`Antv Button`的所有属性。

## 使用演示

ProButton 支持`Tooltip`、`Confirm`、`Popconfirm`、`Dropdown`等扩展功能，其他使用示例请前往[Antv Button](https://www.antdv.com/components/button-cn)查看。

:::demo

button/demo

:::

### 权限控制

通过 `ProConfigProvider` 的 `accessCodes` 全局配置权限码，按钮通过 `accessCode` 属性判断是否有权限渲染。无权限的按钮将完全不渲染。

:::demo

button/access

:::

## API

### Props

| 参数            | 说明                                                                                                                                 | 类型                                                              | 默认值      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ----------- |
| mode            | 按钮模式，default：普通按钮，popconfirm：气泡确认框按钮，confirm：对话框按钮，dropdown：下拉菜单按钮                                 | `default` \| `popconfirm` \| `confirm` \| `dropdown`              | `'default'` |
| tooltip         | 按钮文字提示                                                                                                                         | `string`                                                          | -           |
| tooltipProps    | [Antv Tooltip](https://www.antdv.com/components/tooltip-cn#api) 的所有属性                                                           | `TooltipProps`                                                    | -           |
| title           | 按钮原生 title 属性，hover 时的原生提示 | `string` | - |
| stop            | 是否阻止事件冒泡 | `boolean` | - |
| accessCode      | 权限码，配合 ProConfigProvider 的 accessCodes 使用，无权限时按钮不渲染 | `string` | - |
| data            | 传递给回调事件的数据 | `any` | - |
| icon            | 按钮图标，支持 ProIcon 图标名称、VNode 或渲染函数 | `string` \| `VNode` \| `Function` | - |
| dropdownProps   | [Antv Dropdown](https://www.antdv.com/components/dropdown-cn#api) 的所有属性，mode值为`dropdown`时有效                               | `DropdownProps`                                                   | -           |
| menuProps       | [Antv Menu](https://www.antdv.com/components/menu-cn#api) 的所有属性，mode值为`dropdown`时有效                                       | `MenuProps`                                                       | -           |
| items           | 下拉菜单项，mode值为`dropdown`时有效 | `{ key: string \| number, label: string, accessCode?: string, hidden?: boolean \| ((data: any) => boolean), disabled?: boolean \| ((data: any) => boolean), [key: string]: any }[]` | - |
| popconfirmProps | [Antv Popconfirm](https://www.antdv.com/components/popconfirm-cn#api) 的所有属性，mode值为`popconfirm`时有效                         | `PopconfirmProps`                                                 | -           |
| confirmProps    | [Antv Modal.confirm](https://www.antdv.com/components/modal-cn#modal-method) 的所有属性，mode值为`confirm`时有效 | `Omit<ModalFuncProps, "type" | "onCancel" | "onOk"> & { type?: "danger" | "warning" }` | - |
| icon-style      | 按钮图标的style                                                                                                                      | `CSSProperties`                                                   | -           |
| block           | 将按钮宽度调整为其父宽度的选项                                                                                                       | `boolean`                                                         | `false`     |
| danger          | 设置危险按钮                                                                                                                         | `boolean`                                                         | `false`     |
| disabled        | 按钮失效状态                                                                                                                         | `boolean`                                                         | `false`     |
| ghost           | 幽灵属性，使按钮背景透明                                                                                                             | `boolean`                                                         | `false`     |
| href            | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致                                                                                | `string`                                                          | -           |
| htmlType        | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | `string`                                                          | `button`    |
| loading         | 设置按钮载入状态                                                                                                                     | `boolean` \| `{ delay: number }`                                  | `false`     |
| shape           | 设置按钮形状                                                                                                                         | `default` \| `circle` \| `round`                                  | `default`   |
| size            | 设置按钮大小                                                                                                                         | `large` \| `middle` \| `small`                                    | `middle`    |
| target          | 相当于 a 链接的 target 属性，href 存在时生效                                                                                         | `string`                                                          | -           |
| type            | 设置按钮类型                                                                                                                         | `primary` \| `ghost` \| `dashed` \| `link` \| `text` \| `default` | `default`   |

### Events

| 事件名     | 说明                                                      | 类型                               |
| ---------- | --------------------------------------------------------- | ---------------------------------- |
| click      | 点击按钮时的回调，mode值为`default`时生效                 | `(event: MouseEvent, data?: any) => void`                  |
| confirm    | 点击确定时的回调，mode值为`popconfirm` \| `confirm`时生效 | `(data?: any) => void`                       |
| cancel     | 点击取消时的回调，mode值为`popconfirm` \| `confirm`时生效 | `(data?: any) => void`                       |
| menu-click | 点击下拉菜单项时的回调，mode值为`dropdown`时生效          | `(item: any, key: string, keyPath: string[], data?: any) => void` |

### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |
| icon    | 自定义图标组件 | -    |
