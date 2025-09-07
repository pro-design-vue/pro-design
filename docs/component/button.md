---
title: ProButton 按钮
outline: deep
---

# ProButton 按钮

ProButton 是基于[Antv Button](https://www.antdv.com/components/button-cn)的扩展，支持`Antv Button`的所有属性。

## 使用演示

ProButton 支持Tooltip、Popconfirm、Dropdown等扩展功能。

:::demo

button/demo

:::

## API

### Props

`Antv Button`的Props没有列出，请查看[Antv Button](https://www.antdv.com/components/button-cn#api)。

| 参数            | 说明                                                                                                             | 类型                                                 | 默认值      |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| mode            | 按钮模式，default：普通按钮，popconfirm：气泡确认框按钮，confirm：对话框按钮，dropdown：下拉菜单按钮             | `default` \| `popconfirm` \| `confirm` \| `dropdown` | `'default'` |
| tooltip         | 按钮文字提示                                                                                                     | `string`                                             | -           |
| tooltipProps    | [Antv Tooltip](https://www.antdv.com/components/tooltip-cn#api) 的所有属性                                       | `TooltipProps`                                       | -           |
| dropdownProps   | [Antv Dropdown](https://www.antdv.com/components/dropdown-cn#api) 的所有属性，mode值为`dropdown`时有效           | `DropdownProps`                                      | -           |
| menuProps       | [Antv Menu](https://www.antdv.com/components/menu-cn#api) 的所有属性，mode值为`dropdown`时有效                   | `MenuProps`                                          | -           |
| items           | [Antv Menu](https://www.antdv.com/components/menu-cn#itemtype) 的菜单内容，mode值为`dropdown`时有效              | `ItemType[]`                                         | -           |
| popconfirmProps | [Antv Popconfirm](https://www.antdv.com/components/popconfirm-cn#api) 的所有属性，mode值为`popconfirm`时有效     | `PopconfirmProps`                                    | -           |
| confirmProps    | [Antv Modal.confirm](https://www.antdv.com/components/modal-cn#modal-method) 的所有属性，mode值为`confirm`时有效 | `PopconfirmProps`                                    | -           |
| icon-style      | 按钮图标的style                                                                                                  | `CSSProperties`                                      | -           |

### Events

| 事件名     | 说明                                                      | 类型                               |
| ---------- | --------------------------------------------------------- | ---------------------------------- |
| click      | 点击按钮时的回调，mode值为`default`时生效                 | `(event) => void	`                  |
| confirm    | 点击确定时的回调，mode值为`popconfirm` \| `confirm`时生效 | `() => void	`                       |
| cancel     | 点击取消时的回调，mode值为`popconfirm` \| `confirm`时生效 | `() => void	`                       |
| menu-click | 点击下拉菜单项时的回调，mode值为`dropdown`时生效          | `({ item, key, keyPath }) => void	` |

### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |
| icon    | 自定义图标组件 | -    |
