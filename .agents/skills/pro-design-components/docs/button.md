## API

### ProButton

基于 [Antv Button](https://www.antdv.com/components/button-cn) 扩展，支持 Antv Button 所有属性。

| 参数            | 说明                                                                                     | 类型                                                                | 默认值      |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------- |
| mode            | 按钮模式：`default`普通按钮，`popconfirm`气泡确认框，`confirm`对话框，`dropdown`下拉菜单 | `'default' \| 'popconfirm' \| 'confirm' \| 'dropdown'`              | `'default'` |
| tooltip         | 按钮文字提示                                                                             | `string`                                                            | -           |
| tooltipProps    | [Antv Tooltip](https://www.antdv.com/components/tooltip-cn#api) 的所有属性               | `TooltipProps`                                                      | -           |
| title           | 按钮原生 title 属性                                                                      | `string`                                                            | -           |
| stop            | 是否阻止事件冒泡                                                                         | `boolean`                                                           | -           |
| accessCode      | 权限码，配合 ProConfigProvider 的 accessCodes 使用                                       | `string`                                                            | -           |
| data            | 传递给回调事件的数据                                                                     | `any`                                                               | -           |
| icon            | 按钮图标，支持 ProIcon 图标名称、VNode 或渲染函数                                        | `string \| VNode \| Function`                                       | -           |
| dropdownProps   | mode=`dropdown` 时有效，Antv Dropdown 所有属性                                           | `DropdownProps`                                                     | -           |
| menuProps       | mode=`dropdown` 时有效，Antv Menu 所有属性                                               | `MenuProps`                                                         | -           |
| items           | 下拉菜单项，mode=`dropdown`时有效                                                        | `{ key, label, accessCode?, hidden?, disabled?, ... }[]`            | -           |
| popconfirmProps | mode=`popconfirm` 时有效，Antv Popconfirm 所有属性                                       | `PopconfirmProps`                                                   | -           |
| confirmProps    | mode=`confirm` 时有效，Antv Modal.confirm 所有属性                                       | `ModalFuncProps & { type?: 'danger' \| 'warning' }`                 | -           |
| icon-style      | 按钮图标的 style                                                                         | `CSSProperties`                                                     | -           |
| block           | 将按钮宽度调整为其父宽度的选项                                                           | `boolean`                                                           | `false`     |
| danger          | 设置危险按钮                                                                             | `boolean`                                                           | `false`     |
| disabled        | 按钮失效状态                                                                             | `boolean`                                                           | `false`     |
| ghost           | 幽灵属性，使按钮背景透明                                                                 | `boolean`                                                           | `false`     |
| href            | 点击跳转的地址                                                                           | `string`                                                            | -           |
| htmlType        | button 原生的 type 值                                                                    | `string`                                                            | `'button'`  |
| loading         | 设置按钮载入状态                                                                         | `boolean \| { delay: number }`                                      | `false`     |
| shape           | 设置按钮形状                                                                             | `'default' \| 'circle' \| 'round'`                                  | `'default'` |
| size            | 设置按钮大小                                                                             | `'large' \| 'middle' \| 'small'`                                    | `'middle'`  |
| target          | 相当于 a 链接的 target 属性，href 存在时生效                                             | `string`                                                            | -           |
| type            | 设置按钮类型                                                                             | `'primary' \| 'ghost' \| 'dashed' \| 'link' \| 'text' \| 'default'` | `'default'` |

### Events

| 事件名     | 说明                                                | 类型                                      |
| ---------- | --------------------------------------------------- | ----------------------------------------- |
| click      | 点击按钮时的回调，mode=`default` 时生效             | `(event: MouseEvent, data?: any) => void` |
| confirm    | 点击确定时的回调，mode=`popconfirm\|confirm` 时生效 | `(data?: any) => void`                    |
| cancel     | 点击取消时的回调，mode=`popconfirm\|confirm` 时生效 | `(data?: any) => void`                    |
| menu-click | 点击下拉菜单项时的回调，mode=`dropdown` 时生效      | `(item, key, keyPath, data?) => void`     |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |
| icon    | 自定义图标组件 |
