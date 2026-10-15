## API

### ProForm

核心表单组件，根据 JSON Schema 生成表单。基于 antdv Form 封装，支持数据录入、校验、联动。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| items | 表单配置项列表（JSON Schema），**必要参数** | `ProFormItemType[]` | - |
| layout-type | 表单布局类型 | `'Form' \| 'ModalForm' \| 'DrawerForm' \| 'QueryFilter' \| 'StepsForm'` | `'Form'` |
| layout | 表单布局方式 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| title | 表单标题 | `string` | - |
| request | 请求数据源，返回表单初始值 | `(params) => Promise<T>` | - |
| params | request 请求参数 | `Record<string, any>` | - |
| initial-values | 表单初始值 | `Record<string, any>` | - |
| row | 栅格化 Row 配置 | `RowProps` | - |
| col | 栅格化 Col 配置 | `ColProps` | - |
| label-width | label 宽度 | `number \| 'auto'` | - |
| label-align | label 对齐方式 | `'left' \| 'right'` | - |
| label-col | label 栅格配置 | `ColProps` | - |
| wrapper-col | wrapper 栅格配置 | `ColProps` | - |
| colon | 是否显示 label 后面的冒号 | `boolean` | - |
| validate-messages | 验证提示模板 | `ValidateMessages` | - |
| required-mark | 必选样式 | `boolean \| 'optional'` | `true` |
| submitter | 提交按钮相关配置，false 不显示 | `false \| SubmitterProps` | `true` |
| submit-text | 提交按钮文本 | `string` | `'提交'` |
| reset-text | 重置按钮文本 | `string` | `'重置'` |
| loading | 表单 loading 状态 | `boolean` | - |
| disabled | 禁用所有表单项 | `boolean` | - |
| readonly | 只读所有表单项 | `boolean` | - |
| grid | 是否使用栅格布局 | `boolean` | `false` |
| auto-focus-first-input | 自动聚焦第一个输入框 | `boolean` | `true` |
| scroll-to-first-error | 提交失败自动滚动到第一个错误字段 | `boolean` | - |
| date-formatter | 日期格式化 | `'string' \| 'number' \| false` | `'string'` |
| omit-nil | 是否忽略值为 undefined/null 的字段 | `boolean` | `true` |
| ignore-rules | 忽略所有表单项 rule | `boolean` | - |
| preserve | 表单卸载后是否保留字段值 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| finish | 提交表单且数据验证成功后回调 | `(values: T) => Promise<void \| any>` |
| finish-failed | 提交表单且数据验证失败后回调 | `({ values, errorFields }) => void` |
| reset | 点击重置按钮的回调 | `() => void` |
| init | 表单初始化后回调事件 | `(values, action: ProFormActionType) => void` |
| values-change | 表单字段值变化时的回调 | `(values) => void` |
| loading-change | 加载动画变化后的回调 | `(loading: boolean) => void` |
| open-change | 浮层打开关闭后的回调（模态表单有效） | `(open: boolean) => void` |

### Exposes (ProFormActionType)

| 方法 | 说明 | 类型 |
|------|------|------|
| submit | 提交表单，与点击提交按钮效果相同 | `() => void` |
| reset | 重置所有字段到 initialValues | `() => void` |
| getFieldValue | 获取对应字段名的值 | `(name: NamePath) => any` |
| getFieldsValue | 获取一组字段值，传入 `true` 返回所有值 | `(nameList?: true \| NamePath[]) => Partial<T>` |
| getFieldFormatValue | 获取格式化后的单个数据 | `(name: NamePath) => T \| undefined` |
| getFieldFormatValueObject | 获取格式化后的单个数据（含 name） | `(name: NamePath) => T \| undefined` |
| setFieldValue | 设置单个字段的值 | `(name: NamePath, value: any) => void` |
| setFieldsValue | 设置多个字段的值 | `(values: T, isMerge?: boolean) => void` |
| validateFields | 触发表单验证 | `(nameList?: NamePath[]) => Promise<T>` |
| validateFieldsReturnFormatValue | 验证后返回格式化之后的所有数据 | `(nameList?: NamePath[]) => Promise<any>` |
| clearValidate | 移除表单项的校验结果 | `(name?: NamePath) => void` |
| resetInitialValues | 重置一组字段到 initialValues | `(values: Entity) => void` |
| resetField | 重置单个字段到 initialValues | `(name: NamePath) => void` |

### Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| default | 表单内容区 | `{ action: ProFormActionType }` |
| submitter | 提交按钮区 | `{ props, action, defaultDoms }` |

---

### ProFormItemType 表单项配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 字段名，支持 `a.b.c` 嵌套路径 | `string \| string[]` | - |
| title | 标签名称 | `string \| VNode \| ((formData) => VNode)` | - |
| fieldType | 表单控件类型 | `ProFieldType` | `ProFieldType.TEXT` |
| options | 可选项 | `RequestOptionsType[] \| ((formData, rowData?) => RequestOptionsType[])` | - |
| request | 异步请求选项数据 | `(params) => Promise<RequestOptionsType[]>` | - |
| params | request 请求参数 | `Record<string, any> \| ((record) => Record<string, any>)` | - |
| dependencies | 依赖的 values 变化后触发 request 重新执行 | `NamePath[]` | - |
| initialValue | 初始值 | `any` | - |
| width | 表单项宽度，支持 `'xs'\|'sm'\|'md'\|'lg'\|'xl'` 或数字 | `string \| number` | - |
| placeholder | 占位符 | `string \| string[]` | - |
### fieldType 列表

| fieldType | 枚举 | 说明 |
|-----------|------|------|
| `text` | `ProFieldType.TEXT` | 文本框 |
| `password` | `ProFieldType.PASSWORD` | 密码输入框 |
| `digit` | `ProFieldType.DIGIT` | 数字输入框 |
| `digitRange` | `ProFieldType.DIGIT_RANGE` | 数字区间输入框 |
| `select` | `ProFieldType.SELECT` | 下拉框 |
| `treeSelect` | `ProFieldType.TREE_SELECT` | 树形下拉框 |
| `cascader` | `ProFieldType.CASCADER` | 级联选择器 |
| `checkbox` | `ProFieldType.CHECKBOX` | 复选框 |
| `checkboxGroup` | `ProFieldType.CHECKBOX_GROUP` | 复选框组 |
| `radioGroup` | `ProFieldType.RADIO_GROUP` | 单选框组 |
| `switch` | `ProFieldType.SWITCH` | 开关 |
| `slider` | `ProFieldType.SLIDER` | 滑动输入条 |
| `rate` | `ProFieldType.RATE` | 评分 |
| `date` | `ProFieldType.DATE` | 日期选择 |
| `dateRange` | `ProFieldType.DATE_RANGE` | 日期区间 |
| `time` | `ProFieldType.TIME` | 时间选择 |
| `timeRange` | `ProFieldType.TIME_RANGE` | 时间区间 |
| `textarea` | `ProFieldType.TEXTAREA` | 文本域 |
| `uploadButton` | `ProFieldType.UPLOAD_BUTTON` | 上传按钮 |
| `uploadDragger` | `ProFieldType.UPLOAD_DRAGGER` | 拖拽上传 |
| `uploadPicture` | `ProFieldType.UPLOAD_PICTURE` | 图片上传 |
| `uploadPictureList` | `ProFieldType.UPLOAD_PICTURE_LIST` | 图片列表上传 |
| `editor` | `ProFieldType.EDITOR` | 富文本编辑器 |
| `group` | `ProFieldType.GROUP` | 表单项分组（children 中配置子项） |
| `formList` | `ProFieldType.FORM_LIST` | 动态增减表单项列表 |
| `formSet` | `ProFieldType.FORM_SET` | 动态增减表单项集合 |
| `divider` | `ProFieldType.DIVIDER` | 分割线 |
| tooltip | label 后的提示 | `string` | - |
| disabled | 禁用 | `boolean \| ((formData, rowData?) => boolean)` | - |
| readonly | 只读 | `boolean \| ((formData, rowData?) => boolean)` | - |
| rules | 校验规则 | `FormItemProps['rules'] \| ((formData, action) => FormItemProps['rules'])` | - |
| formItemProps | antdv Form.Item 的其他属性 | `Record<string, any> \| ((formData, config) => Record<string, any>)` | - |
| fieldProps | 传递给实际渲染组件的 props | `Record<string, any> \| ((formData) => Record<string, any>)` | - |
| linkage | 联动功能：支持 `disabled`/`hidden`/`clear`/`request` | `{ disabled?: Key[] \| fn, hidden?: Key[] \| fn, clear?: NamePath[] \| fn, request?: Key[] \| fn }` | - |
| renderFormItem | 自定义渲染表单项 | `string \| (({ value, onChange, defaultDom, formData, rowData?, action }) => VNode)` | - |
| render | 自定义渲染表单项含 label | `VNode \| (({ formData, defaultDom, rowData? }) => VNode)` | - |
| onChange | value 变化时的回调 | `(...args) => void` | - |
| onInit | 初始化时的回调，可获取 Field ref | `(ref) => void` | - |
| transform | 提交时转换值的函数 | `(value, path) => any` | - |
| extra | 表单项额外信息 | `{ item?: VNode, ... }` | - |
| children | 子表单项，`group/formList/formSet` 下有效 | `ProFormItemType[] \| ((formData, rowData?) => ProFormItemType[])` | - |
| hideInForm | 在表单中隐藏 | `boolean` | - |
| hideInSearch | 在查询表单中隐藏 | `boolean` | - |
| hideInTable | 在表格中隐藏 | `boolean` | - |