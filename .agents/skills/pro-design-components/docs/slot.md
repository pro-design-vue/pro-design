## API

### ProSlot

插槽透传组件，将父组件的 attrs 透传给第一个非注释子组件。

ProSlot 是一个工具性组件，用于在 ProTable/ProForm 等组件中自定义渲染时，将外部传入的 props/attrs 透传给子组件。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| - | 无额外 props，所有 attrs 透传 | `Record<string, any>` | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 需要透传 attrs 的子组件 |