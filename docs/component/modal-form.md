---
title: ProModalForm/ProDrawerForm 浮层表单
outline: deep
---

# ProModalForm/ProDrawerForm 浮层表单

ProModalForm 和 ProDrawerForm 是 ProForm 的一个变体，本质上仍然是个表单。所以无法通过 `footer` 来自定义页脚，如果要定义页脚需要使用 `submitter.render`或 `submitter插槽` 来进行自定义。这两个表单的表现与 ProForm 相同，可以从 ProForm 直接修改而来。

ProModalForm 组合了 ProModal 和 ProForm 可以减少繁琐的状态管理。

ProDrawerForm 组合了 ProDrawer 和 ProForm 可以减少繁琐的状态管理。

## 使用演示


ProModalForm 和 ProDrawerForm 都提供了 `trigger插槽` 来减少 state 的使用，如果你需要使用 state 来控制可以使用 `open` 来控制打开与关闭。

### Modal 表单

:::demo

modal-form/modal

:::

### Drawer 表单

:::demo

modal-form/drawer

:::

### 自定义表单按钮

:::demo

modal-form/custom-button

:::

### 使用open打开

:::demo

modal-form/open

:::

### 重置表单

由于弹窗加载后，form并没有加载，所以无法使用formRef调用方法，但可以使用`init`事件获取`form action`。

:::demo

modal-form/reset

:::

## API

ProModalForm或ProDrawerForm 提供了与 [ProForm](./form.md) 相同的 API，以下的是 ProModalForm或ProDrawerForm 独有的 API，同时 `ProForm` 也支持以下 API。

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open(v-model) | 是否打开	 | `boolean` | - |
| title| 弹框的标题	 | `string` | - |
| width| 弹框的宽度	 | `string` \| `number` | 800 |
| submit-timeout | 提交数据时，禁用取消按钮的超时时间（毫秒） | `number` | - |
| confirm-on-values-change | 数据变化后，关闭弹窗时是否需要确认 | `boolean` | `true` |
| modal-props | Modal 的 props，使用方式与 [ProModal](./modal#api) 相同。 | `ModalProps` | - |
| drawer-props | Drawer 的 props，使用方式与 [ProDrawer](./drawer#api) 相同。 | `DrawerProps` | - |

### Events

| 事件名     | 说明          | 类型                  |
| ---------- | ------------- | --------------------- |
| open-change | 浮层打开关闭后的回调事件 | `(open: boolean) => void` |

### Slots


| 插槽名      | 说明           | 类型                                                                 |
| ----------- | -------------- | -------------------------------------------------------------------- |
| trigger     | 用于触发 Modal \| Drawer  打开的 dom，一般是 button      | - |
| title     | 浮层的标题 | - |
