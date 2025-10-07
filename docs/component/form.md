---
title: ProForm 高级表单
outline: deep
---

# ProForm 高级表单

ProForm 是核心组件之一，高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。解决复杂表单控件数据联动，使用配置解决大部分业务问题，使复杂功能简单化实现。ProForm 是根据 JSON Schema 来生成表单。ProForm 会根据 fieldType 来映射成不同的[表单项](#proformitemtype)。

## 何时使用 ProForm？

当你想快速实现一个表单但不想花太多时间去布局时 ProForm 是最好的选择。

ProForm 是基于 antdv Form 的JSON Schema封装，但是在其之上还增加一些预设行为和多种布局。这些布局之间可以无缝切换，并且拥有公共的 API。

| 布局                                        | 使用场景                                                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [ProForm](#props)                           | 标准 Form，增加了 `onFinish` 中自动 `loading` 和根据 `request` 自动获取默认值的功能。通过设置 `layoutType` 可以实现所有布局。 |
| [ProModalForm\|ProDrawerForm](./modal-form) | 在 ProForm 的基础上增加了 `trigger` ，无需维护 `open` 状态。                                                                  |
| [ProQueryFilter](./query-filter)            | 一般用于作为筛选表单，需要配合其他数据展示组件使用。                                                                          |
| [ProStepsForm](./steps-form)                | 分步表单，需要配置 `steps` 生成步骤使用。                                                                                     |

## 使用演示

分步表单、Modal 表单、Drawer 表单、查询表单等多种 layout 可以覆盖大部分的使用场景，让我们脱离复杂而且繁琐的表单布局工作，用更少的代码完成更多的功能。

### 基本使用

:::demo

form/basic

:::

### 标签与表单项布局

除了 `ProQueryFilter` 这样固定布局的表单样式，其他表单布局支持配置与 antdv 一致的二种布局方式，不支持`inline`布局方式。

:::demo

form/layout

:::

### 栅格化布局

同时支持在 `ProForm`, `ProModalForm`, `ProDrawerForm`, `ProStepsForm` 中使用，`ProQueryFilter` 默认使用栅格化布局，无法更改。

:::demo

form/grid

:::

### 表单联动

表单联动是及其常用的功能，由于场景非常多，实现时比较复杂，组件内部支持了各种联动方式，可以满足大多数业务场景。大多数情况下，你不再需要使用`onChange`事件手动处理表单联动。

1. 使用表单项`linkage`配置，支持`clear`、`disabled`、`hidden`三种配置，还支持函数方式使用，例如：`{hidden: ['name'], clear: ['name'], disabled: ['name']}`。
2. 使用函数，表单项很多配置都支持函数类型，如：`title`、`options`、`formItemProps`、`readonly`、`disabled`、`rules`、`fieldProps`、`render`、`renderFormItem`。
3. 使用表单项`dependencies`配置，此配置只针对使用request请求的Field有效，会根据dependencies配置的`namePath`值变化重新请求，非常适合下拉多级联动功能。

::: details 表单项部分配置类型

```ts
{
  linkage?: {
    disabled?: Key[] | ((value: any, formData: any) => Key[])
    hidden?: Key[] | ((value: any, formData: any) => Key[])
    clear?: NamePath[] | ((value: any, formData: any) => NamePath[])
  };
  title?: ProVNode | ((formData: T) => ProVNode);
  options?:
    | (string | number | RequestOptionsType)[]
    | ((formData: T, rowData?: Entity) => (string | number | RequestOptionsType)[]);
  formItemProps?:
    | Record<string, any>
    | ((formData: T, config: ProFormItemType<T, FieldType>) => Record<string, any>);
  readonly?: ((formData: T, rowData?: Entity) => boolean) | boolean
  disabled?: ((formData: T, rowData?: Entity) => boolean) | boolean
  rules?:
    | ((formData: T, action: ProFormActionType) => FormItemProps['rules'])
    | FormItemProps['rules']
  fieldProps?: ((formData: T) => Record<string, any>) | Record<string, any>
  renderFormItem?:
    | string
    | ((config: {
        value: any
        onChange: <T = any>(value: T, ...args: any[]) => void
        defaultDom: VNode
        formData: T
        action: ProFormActionType
      }) => VNode | string)
  render?: ProVNode | ((formData: T) => ProVNode)
  /** @name 依赖字段的name，暂时只在拥有 request 的项目中生效，会自动注入到 params 中 */
  dependencies?: NamePath[]
}
```

:::

:::demo

form/linkage

:::

### 表单方法调用

你可以通过 `formRef` 获取到表单实例的引用，通过引用可以调用表单方法实现表单重置，设置表单，获取表单值等功能。仅在 `ProForm标准模式下`和`ProQueryFilter` 中支持。

在`ProModalForm|ProDrawerForm` 浮层表单中，由于默认浮层内部的Form是不渲染的，只有打开后才渲染，关闭后销毁，所以无法直接获取到表单实例，可以通过`init` 自定义事件的第二个参数 `action` 调用表单方法。

在`ProStepsForm` 分步表单中，无法直接获取内部表单实例，通过`formRef.value.formArrayRef[current]`方式获取当前步骤表单实例。

表单项配置`onChange`事件最后一个参数都是`action`，可以在`onChange`事件内直接使用表单方法，不需要使用`formRef`，这个所有布局都支持。

:::demo

form/method

:::

### 自定义提交

ProForm 默认内置验证提交，只需要在`finish`回调事件中执行业务逻辑即可，比如执行网络请求，当然完全可以自定义提交逻辑。

自定义提交按钮需要使用 `submitter.render` 或 `submitter插槽` 来进行自定义，使用 `submitter.render` 自定义按钮时可以使用`jsx|tsx`的方式或使用`h`函数，submitter.render和submitter插槽的参数完全一致。

ProForm 支持修改提交按钮到位置，使用 `submitter.teleport` 配置可以实现提交按钮放到你想要的任意位置，`teleport` 使用的vue3内置的组件[Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html)。

1. 使用 `submitter.onSubmit` 事件自定义提交，如果返回一个 `false`，会阻止默认提交，当然如果你确定不使用默认提交时，请一定要返回`false`，否会默认提交也会执行。

2. 使用`submitter插槽`自定义提交按钮配合`validateFields`表单实例方法，实现完全自定义。

::: details submitter 配置类型

```ts
type SubmitterProps<T = Record<string, any>> = {
  /** @name 提交方法 */
  onSubmit?: (formData: T, action?: ProFormActionType) => Promise<boolean | void> | boolean | void
  /** @name 重置方法 */
  onReset?: (formData: T, action?: ProFormActionType) => Promise<boolean | void> | boolean | void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: {
    /** @name 重置按钮的文本 */
    resetText?: ProVNode
    /** @name 提交按钮的文本 */
    submitText?: ProVNode
  }
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 操作按钮渲染位置 */
  teleport?: string | HTMLElement
  /** @name 反转提交及重置按钮 */
  reverse?: boolean
  /** @name grid布局下 */
  colProps?: ColProps
  /** @name 自定义操作的渲染 */
  render?:
    | ((paramer: {
        props: SubmitterProps & {
          submit: () => void
          reset: () => void
        }
        action: ProFormActionType
        defaultDoms: VNode | VNode[]
      }) => VNode | false)
    | false
}
```

:::

:::demo

form/submitter

:::

### 自定义渲染

ProForm 内置了很多[Field](#fieldtype-列表)，基本能满足大多数业务场景，当然任何组件不支持自定义，那是不完美的，ProForm 不仅仅支持自定义 `Field`，还支持自定义`title、extra、render`等，并且所有都支持使用`函数|插槽` 两种方式实现，且参数一致。

自定义Field支持局部和全局配置，局部使用`renderFormItem`配置，全局使用`registerField`注册。如果自定义组件如果希望 `Form.Item` 进行校验展示，你需要 `const {id, onFieldChange, onFieldBlur} = useInjectFormItemContext()` 注入，并调用相应的方法。

支持Antv FormItem的`'extra'、'help'`自定义插槽，使用方式：`formItemProps: {extra: '::custom-item-extra', help: '::custom-item-help'}`。

支持Antv Form Field的自定义插槽，如：`Input|Select|Checkbox`，根据定义的`fieldType`使用，使用方式：`fieldProps: {addonAfter: '::addonAfter', suffix: '::suffix'}`。

1. 使用函数时，需要返回 `jsx|tsx` 或 `h函数` 的VNode，`((params: { formData: T }) => VNode)`。
2. 使用插槽时，没有固定的`slot name`，内部约定使用`::slot-name`开头的字符串代表使用自定义插槽，如：`title: '::custom-title'`，需要在 ProForm 下使用插槽，`<template #custom-title={formData}>我是自定义标题</template>`。

::: tip
在 script setup 下使用`jsx|tsx`时，需要设置语言`<script setup lang="tsx">`。

全局注册：

```ts
import { registerField } from 'pro-design-vue'
import CustomField from '@/components/custom-field'
registerField('custom-field', CustomField)
```

使用时`fieldType:'custom-field'`即可，当然全局注册组件也需要满足一些基本条件，参考下方详情。
:::

:::demo

form/render

:::

::: details custom-item.vue

```vue
<script setup lang="ts">
import {
  ProTable,
  type ProTableColumnsType,
  type ProTableRowSelection,
  type ProFormItemType,
} from 'pro-design-vue'
import { type PropType } from 'vue'
import { Form } from 'ant-design-vue'

defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  onChange: {
    type: Function as PropType<ProFormItemType['onChange']>,
  },
})
const emit = defineEmits(['change', 'update:value'])

const formItemContext = Form.useInjectFormItemContext()

const columns: ProTableColumnsType = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
]

const dataSource = [
  { id: '1', name: 'pro design' },
  { id: '2', name: 'pro design admin' },
  { id: '3', name: 'pro design vue' },
]

const rowSelection: ProTableRowSelection = {
  type: 'checkbox',
  onChange(selectedRowKeys) {
    emit('change', selectedRowKeys)
    emit('update:value', selectedRowKeys)
    formItemContext.onFieldChange()
  },
}
</script>

<template>
  <ProTable
    :selected-row-keys="value"
    :row-selection="rowSelection"
    :columns="columns"
    :tool-bar="false"
    :card-props="false"
    :pagination="false"
    :data-source="dataSource"
  >
  </ProTable>
</template>

<style scoped lang="less"></style>
```

:::

::: details 全局注册的自定义Field，此处是参考代码

```vue
<script setup lang="ts">
import { ref, useAttrs, computed, PropType } from 'vue'
import { Form, Input } from 'ant-design-vue'
import { ProFieldReadonly, ProFormItemType, ProModal } from 'pro-design-vue'
import { SCron } from '@micro-front/components'
import type { SCronInstance } from '@micro-front/components'

defineOptions({
  name: 'CronField',
})

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  readonly: {
    type: Boolean,
    default: undefined,
  },
  readonlyProps: {
    type: Object as PropType<ProFormItemType['readonlyProps']>,
    default: undefined,
  },
  onChange: {
    type: Function as PropType<ProFormItemType['onChange']>,
  },
})
const emit = defineEmits(['change', 'update:value'])
const attrs = useAttrs()
const cronRef = ref<SCronInstance>()
const open = ref(false)
const cronValue = ref('')
const formItemContext = Form.useInjectFormItemContext()

const internalValue = computed({
  get: () => {
    return props.value
  },
  set: (val) => {
    emit('change', val)
    emit('update:value', val)
  },
})

const onInputChange = (e: any) => {
  emit('change', e.target.value)
  emit('update:value', e.target.value)
  formItemContext.onFieldChange()
}

const onShowCron = () => {
  open.value = true
  cronValue.value = internalValue.value
}

const onConfirm = () => {
  const cronValue = cronRef.value?.getCurrentCrobValue()
  emit('change', cronValue)
  emit('update:value', cronValue)
  formItemContext.onFieldChange()
  return true
}
</script>

<template>
  <template v-if="readonly">
    <ProFieldReadonly :text="internalValue" v-bind="readonlyProps" />
  </template>
  <template v-else>
    <Input
      v-model:value="internalValue"
      v-bind="attrs"
      :placeholder="placeholder"
      @change="onInputChange"
    >
      <template #addonAfter>
        <a style="font-size: 12px" @click="onShowCron">配置</a>
      </template>
    </Input>
    <ProModal title="配置Cron表达式" v-model:open="open" destroy-on-close @confirm="onConfirm">
      <SCron ref="cronRef" v-model:value="cronValue" style="height: 506px" />
    </ProModal>
  </template>
</template>
```

:::

## API

### Props

| 参数              | 说明                                                                                                                                                                     | 类型                                                                                                         | 默认值                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| colon             | 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效)                                                                                                | `boolean`                                                                                                    | `true`                               |
| disabled          | 设置全部表单项禁用，表单项单独配置优先级更高                                                                                                                             | `boolean`                                                                                                    | `false`                              |
| hideRequired-mark | 隐藏所有表单项的必选标记                                                                                                                                                 | `boolean`                                                                                                    | `false`                              |
| label-align       | label 标签的文本对齐方式                                                                                                                                                 | `left` \| `right`                                                                                            | `'right'`                            |
| label-col         | label 标签布局，[Antv Col](https://www.antdv.com/components/grid-cn/#col) 的所有属性，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | `ColProps`                                                                                                   | -                                    |
| label-wrap        | label 标签的文本换行方式                                                                                                                                                 | `boolean`                                                                                                    | `false`                              |
| layout            | 表单布局                                                                                                                                                                 | `horizontal`\|`vertical`                                                                                     | `'horizontal'`                       |
| form-key          | 表单key，默认不需要配置，系统自动递增                                                                                                                                    | `string`                                                                                                     | -                                    |
| wrapper-col       | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol                                                                                                                | `ColProps`                                                                                                   | -                                    |
| loading           | 表单受控加载动画，默认表单内部控制，提交表单时触发                                                                                                                       | `boolean`                                                                                                    | -                                    |
| submit-on-loading | 提交时是否显示加载动画(包含表单主体、提交按钮)                                                                                                                           | `boolean`                                                                                                    | `true`                               |
| show-loading      | 是否显示加载动画(包含提交、加载初始值)                                                                                                                                   | `boolean`                                                                                                    | `true`                               |
| omit-nil          | ProForm 会自动清空 null 和 undefined 的数据，如果你约定了 nil 代表某种数据，可以设置为 false 关闭此功能                                                                  | `boolean`                                                                                                    | `true`                               |
| readonly          | 设置全部表单项只读，表单项单独配置优先级更高                                                                                                                             | `boolean`                                                                                                    | `false`                              |
| readonly-props    | 全部只读表单项的配置，与表单项单独配置合并处理                                                                                                                           | `{ tooltip?: boolean \| string; copy?: boolean; emptyText?: string; ellipsis?: boolean; autoLine?: boolean}` | `{ emptyText: '-', ellipsis: true }` |
| grid              | 表单布局的栅格化，基于行（row）和列（col）来定义信息区块的外部框架                                                                                                       | `boolean`                                                                                                    | `false`                              |
| col-props         | 在开启 grid 模式时传递给 Col，表单项单独配置优先级更高，支持[Antv Col](https://www.antdv.com/components/grid-cn/#col) 的所有属性                                         | `ColProps`                                                                                                   | `{ xs: 24 }`                         |
| row-props         | 在开启 grid 模式时传递给 Row，表单项(group、formList、formSet)单独配置优先级更高，支持[Antv Row](https://www.antdv.com/components/grid-cn/#row) 的所有属性               | `RowProps`                                                                                                   | `{ gutter: 16 }`                     |
| initial-values    | 表单默认值，只有初始化以及重置时生效                                                                                                                                     | `object`                                                                                                     | -                                    |
| request           | 获取表单默认值的网络请求，返回值会和`initialValues`合并                                                                                                                  | `(params)=>Promise<data>`                                                                                    | -                                    |
| params            | 用于 request 查询的额外参数，变化不会触发重新加载                                                                                                                        | `object`                                                                                                     | -                                    |
| request-abort     | 终止网络请求，初始化有效                                                                                                                                                 | `boolean`                                                                                                    | `false`                              |
| submitter         | 提交按钮相关配置                                                                                                                                                         | `boolean` \| `SubmitterProps`                                                                                | `true`                               |
| items             | 表单的定义，一般是 json 数组，如果是分步表单，需要使用数组嵌套 json 数组来生成多个表单                                                                                   | [`ProFormItemType[]` \| `ProFormItemType[][]`](#proformitemtype)                                             | `[]`                                 |
| layout-type       | 使用的表单布局模式                                                                                                                                                       | `Form` \| `DrawerForm` \| `ModalForm` \| `QueryFilter` \| `StepForm`                                         | `'Form'`                             |

### Events

| 事件名         | 说明                             | 类型                              |
| -------------- | -------------------------------- | --------------------------------- |
| init           | 表单初始化后回调事件             | `(values, action)=> void`         |
| finish         | 提交表单且数据验证成功后回调事件 | `(values)=>Promise<void> ｜ void` |
| reset          | 点击重置按钮的回调               | `(e)=>void`                       |
| finish-failed  | 提交表单且数据验证失败后回调事件 | `({ values, errorFields })=>void` |
| values-change  | 提交表单且数据验证失败后回调事件 | `(values)=>void`                  |
| loading-change | 加载动画变化后的回调事件         | `(loading)=>void`                 |

### Slots

| 插槽名    | 说明     | 类型                           |
| --------- | -------- | ------------------------------ |
| submitter | 提交按钮 | `{props, action, defaultDoms}` |

### Exposes

| 名称                            | 说明                                                                                                     | 类型                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| getFieldValue                   | 获取对应字段名的值                                                                                       | `(name: NamePath) => any	`                             |
| getFieldsValue                  | 获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用 getFieldsValue(true) 时返回所有值 | `(nameList?: true \| NamePath[]) => object`           |
| resetInitialValues              | 重新设置表单默认值                                                                                       | `(values: object) => void`                            |
| getFieldFormatValue             | 获取格式化之后的单个数据                                                                                 | `(name: NamePath) => any`                             |
| getFieldFormatValueObject       | 获取格式化之后的单个数据                                                                                 | `(name: NamePath) => object`                          |
| validateFieldsReturnFormatValue | 验字段后返回格式化之后的所有数据                                                                         | `(nameList?: NamePath[]) => Promise<object>`          |
| setFieldValue                   | 设置单个表单项的值                                                                                       | `(name: NamePath, value: any) => void`                |
| setFieldsValue                  | 设置表单的值                                                                                             | ` (values: object, isMerge?: boolean = true) => void` |
| resetField                      | 重置字段到 initialValue，并清除验证信息                                                                  | `(name: NamePath) => void`                            |
| clearValidate                   | 移除表单项的校验结果。传入待移除的表单项的 name 属性或者 name 组成的数组，如不传则移除整个表单的校验结果 | `(nameList?: NamePath[]) => void	`                     |
| validateFields                  | 触发表单验证                                                                                             | `(nameList?: NamePath[]) => Promise`                  |
| reset                           | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                               | `() => void`                                          |
| submit                          | 提交表单，与点击 `submit` 按钮效果相同                                                                   | `() => void`                                          |

### ProFormItemType

| 字段名称       | 说明                                                                                                                                         | 类型                                                                                                                                                                                         | 默认值                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| key            | 确定这个列的唯一值，一般用于 name 重复的情况                                                                                                 | `string \| number`                                                                                                                                                                           | -                                    |
| name           | 与实体映射的 key，数组会被转化 [a,b] => Entity.a.b                                                                                           | `string \| string[]`                                                                                                                                                                         | -                                    |
| fieldType      | 表单项渲染方式，我们自带了一部分，你也可以自定义 fieldType                                                                                   | [`ProFieldType`](#fieldtype-列表)                                                                                                                                                            | `ProFieldType.TEXT`                  |
| title          | 标题的内容，是 form 中的 label                                                                                                               | `VNode \| ((formData: T) => VNode)`                                                                                                                                                          | -                                    |
| tooltip        | 会在 title 旁边展示一个 icon，鼠标浮动之后展示                                                                                               | `string`                                                                                                                                                                                     | -                                    |
| initialValue   | 表单项默认值，类型根据表单项而定                                                                                                             | `any`                                                                                                                                                                                        | -                                    |
| order          | 表单中的权重，权重大排序靠前                                                                                                                 | `number`                                                                                                                                                                                     | -                                    |
| placeholder    | 占位符                                                                                                                                       | `string \| string[]`                                                                                                                                                                         | -                                    |
| width          | Field 的长度，我们归纳了常用的 Field 长度以及适合的场景，支持了一些枚举 "xs" , "sm" , "md" ,"lg" , "xl"                                      | `number \| "xs" \| "sm" \| "md" \| "lg" \| "xl"`                                                                                                                                             | -                                    |
| grid           | 开启 grid 模式，仅在`group`中有效，默认继承表单配置                                                                                          | `boolean`                                                                                                                                                                                    | -                                    |
| colProps       | 在开启 grid 模式时传递给 Col，支持[Antv Col](https://www.antdv.com/components/grid-cn/#col) 的所有属性                                       | `ColProps`                                                                                                                                                                                   | `{ xs: 24 }`                         |
| rowProps       | 在开启 grid 模式时传递给 Row，仅在`group、formList、formSet`中有效，支持[Antv Row](https://www.antdv.com/components/grid-cn/#row) 的所有属性 | `RowProps`                                                                                                                                                                                   | `{ gutter: 16 }`                     |
| spaceProps     | 没有开启grid 模式时传递给 Space，仅在`group、formSet`中有效，支持[Antv Space](https://www.antdv.com/components/space-cn/#api) 的所有属性     | `SpaceProps`                                                                                                                                                                                 | -                                    |
| allowClear     | 可以点击清除图标删除内容                                                                                                                     | `boolean`                                                                                                                                                                                    | `false`                              |
| rules          | 表单验证规则 ，和`FormItem` 的 `rules` 相同                                                                                                  | `FormItemProps['rules'] \| (formData: T, action: ProFormActionType) => FormItemProps['rules']`                                                                                               | -                                    |
| hidden         | 是否隐藏                                                                                                                                     | `boolean`                                                                                                                                                                                    | `false`                              |
| disabled       | 是否禁用状态                                                                                                                                 | `((formData: T, rowData?: Entity) => boolean) \| boolean`                                                                                                                                    | `false`                              |
| readonly       | 是否只读状态                                                                                                                                 | `((formData: T, rowData?: Entity) => boolean) \| boolean`                                                                                                                                    | `false`                              |
| readonlyProps  | 只读状态配置                                                                                                                                 | `{ tooltip?: boolean \| string; copy?: boolean; emptyText?: string; ellipsis?: boolean; autoLine?: boolean}`                                                                                 | `{ emptyText: '-', ellipsis: true }` |
| formItemProps  | [Antv FormItem](https://www.antdv.com/components/form-cn/#form-item) 的部分属性                                                              | `FormItemProps \| ((formData: T, config: ProFormItemType<T, FieldType>) => FormItemProps`                                                                                                    | -                                    |
| fieldProps     | Field 的额外属性，不同 Field 值不同                                                                                                          | `((formData: T) => Record<string, any>) \| Record<string, any>`                                                                                                                              | -                                    |
| extra          | 额外扩展，支持标题及表单控件后方展示                                                                                                         | `{ label?: VNode \| ((formData: T) => VNode); item?: VNode \| ((formData: T) => VNode)}`                                                                                                     | -                                    |
| valueEnum      | 部分表单项支持，支持 object 和 Map，Map 是支持其他基础类型作为 key                                                                           | `((formData: T) => ProValueEnumObj \| ProValueEnumMap) \| ProValueEnumObj \| ProValueEnumMap`                                                                                                | -                                    |
| colSize        | 一个表单项占用的格子数量，占比= `colSize*span`，`colSize` 默认为 1，仅在查询表单中生效                                                       | `number`                                                                                                                                                                                     | 1                                    |
| convertValue   | 前置转化，发生在组件获得数据之前，一般是后端直接给前端的数据，有时需要精加工一下                                                             | `(value: any,namePath: NamePath) => string \| boolean \| Record<string, any>`                                                                                                                | -                                    |
| transform      | 提交时转化，发生在提交的时候，一般来说都是吐给后端的存在数据库里的数据                                                                       | `(value: any,namePath: NamePath,allValues: any,) => string \| Record<string, any>`                                                                                                           | -                                    |
| options        | 部分表单项支持，select、checkboxGroud、radioGroup、treeSelect等                                                                              | `(string \| number \| RequestOptionsType)[] \| ((formData: T, rowData?: Entity) => (string \| number \| RequestOptionsType)[])`                                                              | -                                    |
| request        | 部分表单项支持，从网络获取`options`数据                                                                                                      | `(params: U,index?: number) => Promise<string \| number \| RequestOptionsType[]`                                                                                                             | -                                    |
| dependencies   | 所依赖的 values 变化后，触发 request 重新执行，并把 values 注入到 params 里                                                                  | `NamePath[]`                                                                                                                                                                                 | -                                    |
| linkage        | 无比强大的联动功能，可以`清空、禁用、隐藏`其他表单项                                                                                         | `{ disabled?: Key[] \| ((value: any, formData: any) => Key[]); hidden?: Key[] \| ((value: any, formData: any) => Key[]); clear?: NamePath[] \| ((value: any, formData: any) => NamePath[])}` | -                                    |
| renderFormItem | 自定义渲染表单项的Field，支持`jsx、插槽`等多种渲染方式                                                                                       | `string \| (({value: any; onChange: <T = any>(value: T, ...args: any[]) => void;defaultDom: VNode; formData: T;action: ProFormActionType }) => VNode \| string)`                             | -                                    |
| render         | 自定义渲染表单项，包含label                                                                                                                  | `VNode \| ((formData: T) => VNode)`                                                                                                                                                          | -                                    |
| onChange       | 表单项value变化时的回调，在强大`linkage`下，基本使用不到                                                                                     | `(...args: any[]) => void`                                                                                                                                                                   | -                                    |
| onInit         | 表单项初始化时的回调，此处可以回去到Field的ref                                                                                               | `(ref: any) => void`                                                                                                                                                                         | -                                    |
| children       | 表单控件，`group、formList、formSet` 下有效                                                                                                  | `ProFormItemType<T, FieldType>[] \| ((formData: T) => ProFormItemType<T, FieldType>[])`                                                                                                      | -                                    |

### fieldType 列表

fieldType 是 ProForm 的灵魂， ProForm 会根据 fieldType 来映射成不同的表单项。以下是支持的常见表单项：

| fieldType           | 枚举                               | 说明             |
| ------------------- | ---------------------------------- | ---------------- |
| `text`              | `ProFieldType.TEXT`                | 文本框           |
| `password`          | `ProFieldType.PASSWORD`            | 密码输入框       |
| `digit`             | `ProFieldType.DIGIT`               | 数字输入框       |
| `digitRange`        | `ProFieldType.DIGIT_RANGE`         | 数字区间输入框   |
| `select`            | `ProFieldType.SELECT`              | 下拉框           |
| `treeSelect`        | `ProFieldType.TREE_SELECT`         | 树形下拉框       |
| `cascader`          | `ProFieldType.CASCADER`            | 级联选择器       |
| `textarea`          | `ProFieldType.TEXTAREA`            | 文本域           |
| `checkbox`          | `ProFieldType.CHECKBOX`            | 多选框           |
| `checkboxGroup`     | `ProFieldType.CHECKBOX_GROUP`      | 多选框组         |
| `radioGroup`        | `ProFieldType.RADIO_GROUP`         | 单选框组         |
| `switch`            | `ProFieldType.SWITCH`              | 开关             |
| `slider`            | `ProFieldType.SLIDER`              | 滑动输入条       |
| `rate`              | `ProFieldType.RATE`                | 星级组件         |
| `date`              | `ProFieldType.DATE`                | 日期             |
| `dateRange`         | `ProFieldType.DATE_RANGE`          | 日期区间         |
| `time`              | `ProFieldType.TIME`                | 时间             |
| `timeRange`         | `ProFieldType.TIME_RANGE`          | 时间区间         |
| `uploadButton`      | `ProFieldType.UPLOAD_BUTTON`       | 上传（按钮）     |
| `uploadDragger`     | `ProFieldType.UPLOAD_DRAGGER`      | 上传（拖拽）     |
| `uploadPicture`     | `ProFieldType.UPLOAD_PICTURE`      | 上传（图片）     |
| `uploadPictureList` | `ProFieldType.UPLOAD_PICTURE_LIST` | 上传（图片列表） |
| `group`             | `ProFieldType.GROUP`               | 分组             |
| `formSet`           | `ProFieldType.FORM_SET`            | 表单集合         |
| `formList`          | `ProFieldType.FORM_LIST`           | 表单列表         |
