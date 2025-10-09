---
title: ProStepsForm 分步表单
outline: deep
---

# ProStepsForm 分步表单

ProStepsForm 通过 Provider 来管理子表单的数据，每个子表单都是完整的数据，在 ProStepsForm 组合成最后的数据。同时自带了一个进度条和管理进度条的相关 API.

## 使用演示

### 基本使用

:::demo

steps-form/basic

:::

### 垂直模式

:::demo

steps-form/vertical

:::


### 弹窗分布

:::demo

steps-form/modal

:::

## API

ProStepsForm 提供了与 [ProForm](./form.md) 相同的 API，以下的是 ProStepsForm 独有的 API，同时 `ProForm` 也支持以下 API。

### Props

| 参数            | 说明                                                                                                                   | 类型                                        | 默认值 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------ |
| current         | 当前表单的步骤数，从 `0` 开始                                                                                          | `number`                                    | 0      |
| steps           | 配置分步内容，与[Antv Step](https://www.antdv.com/components/steps-cn#steps-step) 相同。额外支持配置每步的 `FormProps` | `StepProps & { formProps?: BaseFormProps }` | `[]`   |
| items           | 表单的定义，分步表单，需要使用 json 数组来生成多个表单                                                                 | `ProFormItemType[][]`                       | `[]`   |
| steps-props     | 分步表单步骤条的配置，与[Antv Steps](https://www.antdv.com/components/steps-cn#steps) 相同                             | `StepsProps`                                | -      |
| container-style | 分步表单容器样式                                                                                                       | `CSSProperties`                             | -      |

### Events

| 事件名         | 说明                                                                                  | 类型                                     |
| -------------- | ------------------------------------------------------------------------------------- | ---------------------------------------- |
| current-change | current 发生改变的事件                                                                | `(current:number) => void	`               |
| finish         | 表单最后一步提交成功触发，如果返回`true`就会自动重置表单（包括`StepsForm`变回第一步） | `(values:T) => Promise<void \| boolean>` |
