## API

### ProModalForm / ProDrawerForm

浮层表单，组合 ProForm 和 ProModal/ProDrawer，减少状态管理。提供与 [ProForm](./form.md) 相同的 API，以下是独有 API。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| open(v-model) | 是否打开 | `boolean` | - |
| title | 弹框的标题 | `string` | - |
| width | 弹框的宽度 | `string \| number` | `800` |
| submit-timeout | 提交时禁用取消按钮的超时时间（ms） | `number` | - |
| confirm-on-values-change | 数据变化后关闭弹窗时是否需要确认 | `boolean` | `true` |
| close-on-finish | 提交成功后是否自动关闭弹窗 | `boolean` | `true` |
| modal-props | [ProModalForm 独有] Modal 的 props | `ProModalProps` | - |
| drawer-props | [ProDrawerForm 独有] Drawer 的 props | `ProDrawerProps` | - |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| finish | 提交数据时触发，返回 true 会关闭浮层 | `(values: T) => Promise<void \| boolean \| any>` |
| init | 表单初始化后回调，可获取 form action | `(values: any, action: ProFormActionType) => void` |
| reset | 点击重置按钮的回调 | `() => void` |
| finish-failed | 提交且验证失败后回调 | `({ values, errorFields }) => void` |
| values-change | 字段值变化时的回调 | `(values: any) => void` |
| loading-change | 加载动画变化后的回调 | `(loading: boolean) => void` |
| open-change | 浮层打开关闭后的回调 | `(open: boolean) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| trigger | 用于触发 Modal/Drawer 打开的 dom |
| title | 浮层的标题 |
| closeIcon | 自定义关闭图标（ProModalForm 有效） |
| extra | 浮层右上角额外内容（ProDrawerForm 有效） |
| footer | 自定义底部内容 |