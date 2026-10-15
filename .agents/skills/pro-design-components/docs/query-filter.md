## API

### ProQueryFilter

筛选表单，与 Table/List 等组件配合使用。提供与 [ProForm](./form.md) 相同的 API，以下是独有 API。

| 参数                      | 说明                                   | 类型                                    | 默认值   |
| ------------------------- | -------------------------------------- | --------------------------------------- | -------- |
| collapsed                 | 是否折叠超出的表单项（受控）           | `boolean`                               | -        |
| default-collapsed         | 默认状态下是否折叠                     | `boolean`                               | `true`   |
| label-width               | label 宽度                             | `number \| 'auto'`                      | -        |
| span                      | 表单项宽度，支持响应式对象             | `number \| { xs, sm, md, lg, xl, xxl }` | -        |
| search-text               | 搜索按钮文本                           | `string`                                | `'查询'` |
| reset-text                | 重置按钮文本                           | `string`                                | `'重置'` |
| ignore-rules              | 忽略所有表单项 rule                    | `boolean`                               | -        |
| reset-on-submit           | 重置时是否执行提交                     | `boolean`                               | `false`  |
| search-gutter             | 表单项之间的间距                       | `number`                                | `24`     |
| show-hidden-num           | 折叠时是否显示隐藏的表单项数量         | `boolean`                               | -        |
| default-cols-number       | 默认显示列数                           | `number`                                | -        |
| default-form-items-number | 自定义折叠状态下默认显示的表单控件数量 | `number`                                | -        |
| preserve                  | 表单卸载后是否保留字段值               | `boolean`                               | `true`   |

### Events

| 事件名         | 说明                         | 类型                                          |
| -------------- | ---------------------------- | --------------------------------------------- |
| collapse       | 切换表单折叠状态时的回调     | `(collapsed: boolean) => void`                |
| resize         | 宽高变化时的回调             | `(width, height) => void`                     |
| finish         | 提交表单且数据验证成功后回调 | `(values: T) => Promise<void>`                |
| init           | 表单初始化后回调事件         | `(values, action: ProFormActionType) => void` |
| reset          | 点击重置按钮的回调           | `() => void`                                  |
| finish-failed  | 提交且验证失败后回调         | `({ values, errorFields }) => void`           |
| values-change  | 字段值变化时的回调           | `(values: any) => void`                       |
| loading-change | 加载动画变化后的回调         | `(loading: boolean) => void`                  |

### Slots

| 插槽名    | 说明       | 作用域                           |
| --------- | ---------- | -------------------------------- |
| submitter | 提交按钮区 | `{ props, action, defaultDoms }` |

### 响应式断点规则

| 容器宽度断点          | 单行展示列数 | 默认布局   |
| --------------------- | ------------ | ---------- |
| `≧ 1352px`            | 4 列         | horizontal |
| `≧ 1062px`            | 3 列         | horizontal |
| `≧ 701px && < 1063px` | 3 列         | horizontal |
| `≧ 513px && < 701px`  | 2 列         | vertical   |
| `< 513px`             | 1 列         | vertical   |
