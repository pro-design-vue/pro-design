## API

### ProIcon

图标组件，支持组件图标、远程图标、类名图标。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon | 图标，支持组件、远程URL、class类名 | `Component \| (() => void) \| string` | - |
| fallback | 是否显示默认图标（无 icon 时） | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| component | 自定义 SVG 图标 |