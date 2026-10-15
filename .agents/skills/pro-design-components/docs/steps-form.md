## API

### ProStepsForm

分步表单，通过 Provider 管理子表单数据。提供与 [ProForm](./form.md) 相同的 API，以下是独有 API。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| current | 当前表单的步骤数，从 `0` 开始 | `number` | `0` |
| steps | 配置分步内容（Antv Step 配置），额外支持 `formProps` | `(StepProps & { formProps?: BaseFormProps })[]` | `[]` |
| items | 表单定义，分步表单使用二维数组 | `ProFormItemType[][]` | `[]` |
| steps-props | 步骤条配置（Antv Steps） | `StepsProps` | - |
| container-style | 分步表单容器样式 | `CSSProperties` | - |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| current-change | current 发生改变的事件 | `(current: number) => void` |
| finish | 最后一步提交成功触发，返回 `true` 自动重置 | `(values: T) => Promise<void \| boolean>` |
| init | 表单初始化后回调事件 | `(values, action: ProFormActionType) => void` |
| reset | 点击重置按钮的回调 | `() => void` |
| finish-failed | 提交且验证失败后回调 | `({ values, errorFields }) => void` |
| values-change | 字段值变化时的回调 | `(values: any) => void` |
| loading-change | 加载动画变化后的回调 | `(loading: boolean) => void` |

### Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| submitter | 提交按钮区 | `{ props, action, defaultDoms }` |