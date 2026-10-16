---
name: pro-design-components
description: Pro Design Vue 组件库选型规则和API参考，基于 ant-design-vue 4.x 封装的高级业务组件
license: MIT
compatibility: opencode
metadata:
  scope: frontend
  framework: vue
---

## Pro Design Vue 组件选型优先级

1. 优先使用 `pro-design-vue`（Pro 组件）
2. Pro 组件不满足需求时，使用 `ant-design-vue` 实现
3. ant-design-vue 也不能满足时，再寻找其他第三方解决方案

## Pro 组件清单及文档

以下组件均来自 `pro-design-vue`，完整 API 定义见对应的文档文件：

| 组件             | 导入名              | 文档路径                  |
| ---------------- | ------------------- | ------------------------- |
| Button           | ProButton           | `docs/button.md`          |
| Clipboard        | ProClipboard        | `docs/clipboard.md`       |
| ConfigProvider   | ProConfigProvider   | `docs/config-provider.md` |
| Counter          | ProCounter          | `docs/counter.md`         |
| Cropper          | ProCropper          | `docs/cropper.md`         |
| Drawer           | ProDrawer           | `docs/drawer.md`          |
| Form             | ProForm             | `docs/form.md`            |
| DrawerForm       | ProDrawerForm       | `docs/modal-form.md`      |
| ModalForm        | ProModalForm        | `docs/modal-form.md`      |
| QueryFilter      | ProQueryFilter      | `docs/query-filter.md`    |
| StepsForm        | ProStepsForm        | `docs/steps-form.md`      |
| Icon             | ProIcon             | `docs/icon.md`            |
| Layout           | ProLayout           | `docs/layout.md`          |
| Loading          | ProLoading          | `docs/loading.md`         |
| Modal            | ProModal            | `docs/modal.md`           |
| Page             | ProPage             | `docs/page.md`            |
| Spinner          | ProSpinner          | `docs/spinner.md`         |
| Slot             | ProSlot             | `docs/slot.md`            |
| Table            | ProTable            | `docs/table.md`           |
| TableColumn      | ProTableColumn      | `docs/table.md`           |
| TableColumnGroup | ProTableColumnGroup | `docs/table.md`           |
| TableSummary     | ProTableSummary     | `docs/table.md`           |
| TableSummaryRow  | ProTableSummaryRow  | `docs/table.md`           |
| TableSummaryCell | ProTableSummaryCell | `docs/table.md`           |

## 使用方式

```vue
<script setup lang="ts">
import {
  ProTable,
  ProForm,
  ProButton,
  ProDrawer,
  ProModal,
  ProQueryFilter,
  ProStepsForm,
  ProDrawerForm,
  ProModalForm,
  ProLayout,
  ProPage,
  ProConfigProvider,
  type ProTableColumnType,
  type ProFormItemType,
} from 'pro-design-vue'
</script>
```

所有 Pro 组件统一使用 `Pro*` 前缀命名。

## Pro 组件特点

- 基于 `ant-design-vue` 4.x 封装，**继承 ant-design-vue 组件所有 props**
- 额外提供 Pro 业务增强功能（如 Button 的 `tooltip`/`confirm`/`dropdown`/`accessCode`，Form 的 JSON Schema 驱动/联动/栅格布局，Table 的 `request` 远程加载/查询表单/工具栏/虚拟滚动等）
- Pro 文档中未列出的 props，与 ant-design-vue 对应组件一致

## 其他常用导出

除 UI 组件外，`pro-design-vue` 还通过 re-export 暴露了以下模块，可直接从 `pro-design-vue` 导入：

```ts
import {
  // 组件
  ProTable,
  ProForm,
  ProButton,
  ProModal,
  ProDrawer,
  // 类型
  type ProTableColumnType,
  type ProTableExposeType,
  type ProTableValueEnumType,
  type ProFormActionType,
  type ProFormItemType,
  type ProTableRowSelection,
  // 枚举
  ProFieldType,
  // 工具
  dayjs,
  registerField,
  // 表格常量
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
} from 'pro-design-vue'
```

常用类型和工具：

| 导出项                                          | 分类 | 说明                                    |
| ----------------------------------------------- | ---- | --------------------------------------- |
| `ProFieldType`                                  | 枚举 | 表单字段类型枚举（TEXT/SELECT/DATE 等） |
| `ProFormActionType`                             | 类型 | Form ref 暴露的方法类型                 |
| `ProTableExposeType`                            | 类型 | Table ref 暴露的方法类型                |
| `ProTableColumnType`                            | 类型 | 表格列配置类型                          |
| `ProTableValueEnumType`                         | 类型 | 值枚举类型                              |
| `ProTableRowSelection`                          | 类型 | 行选择配置类型                          |
| `dayjs`                                         | 工具 | 时间处理库                              |
| `registerField`                                 | 工具 | 注册自定义表单组件                      |
| `SELECTION_ALL/SELECTION_INVERT/SELECTION_NONE` | 常量 | 表格选择操作常量                        |

## Demo 示例

详细 Demo 代码见 `demo/` 目录：

| 文件            | 涵盖场景                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| `demo/form.md`  | 基本表单 / 栅格布局 / 表单联动 / 远程加载 / 自定义渲染                              |
| `demo/table.md` | 基础表格 / 远程加载数据 / 查询表单 / 工具栏 / 虚拟滚动 / 树形表格 / 行选择 / 列拖拽 |

遇到具体需求时，优先参考对应 demo 文件中的完整代码片段。

## 注意

- ProForm / ProTable 推荐使用 `ref` 获取组件实例方法（如 `formRef.submit()` / `tableRef.reload()`）
- 所有 Pro 组件文档均在 `docs/` 目录下，每个文件包含完整的 props、events、slots、methods 表格
- Pro 组件基于 Vue 3 Composition API，使用 `<script setup lang="ts">` 语法
- ProTable 的 `request` 方法会自动处理 loading 状态和分页
- ProForm 使用 `items` 配置数组（JSON Schema）来生成表单，`fieldType` 是核心配置
