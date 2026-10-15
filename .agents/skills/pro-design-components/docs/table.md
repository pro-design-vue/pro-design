## API

### ProTable

核心表格组件，高性能大数据渲染，支持虚拟滚动、远程加载、查询表单、工具栏等。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| columns | 表格列的配置描述 | `ProTableColumnType[]` | `[]` |
| dataSource | 数据源（静态数据） | `T[]` | - |
| request | 远程加载数据，接管 loading 和分页 | `(params, sorters, filter) => Promise<{ data: T[], success?: boolean, total?: number }>` | - |
| params | request 的额外参数 | `Record<string, any>` | - |
| manual-request | 是否需要手动触发首次请求 | `boolean` | `false` |
| polling | 定时轮询间隔（ms），最小 2000 | `number` | - |
| loading | 页面是否加载中 | `boolean \| SpinProps` | `false` |
| row-key | 表格行 key 的取值 | `string \| (record) => string` | `'id'` |
| size | 表格大小 | `'large' \| 'middle' \| 'small'` | `'middle'` |
| bordered | 是否展示外边框和列边框 | `boolean` | `false` |
| stripe | 是否展示斑马纹 | `boolean` | `false` |
| show-header | 是否显示表头 | `boolean` | `true` |
| row-hover | 是否展示行悬浮效果 | `boolean` | `true` |
| scroll | 表格是否可滚动 | `{ x?: number\|string, y?: number\|string }` | - |
| height | 表格固定高度 | `number \| string` | - |
| max-height | 表格最大高度 | `number \| string` | - |
| sticky | 设置粘性头部和滚动条 | `boolean \| { offsetHeader?, offsetScroll?, getContainer?, topSummary? }` | - |
| pagination-sticky | 设置粘性分页 | `boolean \| { offsetBottom? }` | - |
| pagination | 分页器，false 不展示 | `PaginationProps` | - |
| search | 搜索表单配置，false 不显示 | `false \| ProQueryFilterProps` | - |
| tool-bar | 工具栏配置，false 隐藏 | `boolean \| ToolBarProps` | `true` |
| options | 工具栏选项控制 | `OptionConfig \| false` | - |
| row-selection | 列表项是否可选择 | `RowSelectionProps` | - |
| expandable | 展开行配置 | `ExpandableConfig` | - |
| children-column-name | 树形结构的列名 | `string` | `'children'` |
| indent-size | 树形数据每层缩进宽度 | `number` | `15` |
| expand-row-by-click | 通过点击行来展开子行 | `boolean` | `false` |
| animate-rows | 是否开启动画 | `boolean` | `true` |
| virtual | 是否开启虚拟滚动 | `boolean` | `false` |
| column-drag | 是否开启列拖拽排序 | `boolean` | `false` |
| column-resizable | 是否开启列宽调整 | `boolean` | `false` |
| highlight-select-row | 是否高亮选中行 | `boolean` | `false` |
| always-show-alert | 是否总是显示多选提示 | `boolean` | `false` |
| card-props | 卡片包裹时的 props | `CardProps` | - |
| title | 表格标题 | `string` | - |
| sub-title | 表格子标题 | `string` | - |
| tooltip | 表格标题提示 | `string` | - |
| summary-fixed | 汇总行是否固定 | `boolean` | `false` |
| columns-state | 列状态持久化配置 | `{ persistenceKey, persistenceType: 'localStorage'\|'sessionStorage' }` | - |
| has-contextmenu-popup | 是否开启右键菜单 | `boolean` | `false` |
| export-excel | Excel 导出配置 | `{ fileName?: string }` | - |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| load | 数据加载完成后触发 | `(dataSource: T[]) => void` |
| request-error | 数据加载失败时触发 | `(error: Error) => void` |
| reset | 重置查询表单时触发 | `() => void` |
| row-click | 行点击事件 | `(record, index, event) => void` |

### Exposes (TableExposeType)

| 方法 | 说明 | 类型 |
|------|------|------|
| reload | 重新加载数据（可传 resetPageIndex） | `(resetPageIndex?: boolean) => Promise<void>` |
| reset | 重置查询表单并刷新 | `() => void` |
| formSearchSubmit | 提交查询表单 | `() => void` |
| getSearchParams | 获取查询表单参数 | `() => Record<string, any>` |
| scrollTo | 滚动到指定位置 | `(pos: string \| Position, behavior: 'auto' \| 'smooth') => void` |
| cleanSelected | 清空选中 | `(keys?: Key[]) => void` |
| clearDataSource | 清空数据源 | `() => void` |
| calcTableHeight | 重新计算表格高度 | `() => Promise<void>` |
| validateTableData | 验证表格数据 | `() => Promise<TablePromiseErrorData>` |
| validateRowData | 验证行数据 | `(rowValue: any) => Promise<TablePromiseErrorData>` |
| addEditRecord | 新增可编辑行 | `(recordValue?, options?: AddLineOptions) => false \| undefined` |
| startEditable | 开启行编辑 | `(recordKey: Key, recordValue?) => boolean` |
| cancelEditable | 取消行编辑 | `(recordKey: Key) => boolean` |
| saveEditable | 保存行编辑 | `(recordKey: Key) => Promise<boolean>` |
| openEditor | 打开单元格编辑器 | `(cellInfos: CellInfo[]) => void` |
| closeEditor | 关闭单元格编辑器 | `(cellInfos?: CellInfo[]) => void` |
| getSelectedRange | 获取选中区域 | `() => SelectedRangeItem[]` |
| clearAllSelectedRange | 清空选中区域 | `() => void` |
| formAction | 获取表单 action（可操作查询表单） | `ProFormActionType` |

### Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| default | 表格上方内容，通常放操作按钮 | - |
| tool-bar | 自定义工具栏 | - |
| alert-actions | 多选提示操作区 | `{ selectedRows, selectedRowKeys, cleanSelected }` |
| alert-info | 多选提示信息区 | `{ selectedRows, selectedRowKeys }` |
| expanded-row-render | 展开行内容 | `{ record }` |
| contextmenu-popup | 右键菜单内容 | `{ record, column, event }` |
| header-cell-popover | 表头气泡卡片内容 | `{ column }` |
| cell-tooltip | 单元格 tooltip 内容 | `{ record, column }` |
| empty | 空数据展示 | - |

---

### Column 配置 (ProTableColumnType)

基于 antdv Table Column 扩展。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| dataIndex | 列数据字段名，支持 `a.b.c` 嵌套 | `string \| number` | - |
| title | 列标题 | `string \| VNode \| ((column, type) => VNode)` | - |
| key | 列唯一标识 | `string` | - |
| width | 列宽度 | `string \| number` | - |
| minWidth | 最小列宽 | `number` | `50` |
| maxWidth | 最大列宽 | `number` | - |
| fixed | 列是否固定 | `'left' \| 'right' \| true` | `false` |
| align | 列对齐方式 | `'left' \| 'right' \| 'center'` | `'left'` |
| ellipsis | 超出宽度自动省略，支持多行 | `boolean \| { showTitle?: boolean, line?: number }` | - |
| tooltip | 单元格 tooltip | `boolean \| CellTooltip` | - |
| header-tooltip | 表头提示 | `boolean \| TooltipProps` | - |
| valueEnum | 值枚举映射 | `Record<string, { text, color? }> \| Map` | - |
| valueType | 值类型，用于自动格式化 | `'text' \| 'date' \| 'dateTime' \| 'digit' \| 'select' \| ...` | `'text'` |
| copyable | 是否可复制 | `boolean` | `false` |
| children | 子列（表头分组） | `ProTableColumnType[]` | - |
| colSpan | 表头合并列数 | `number` | - |
| hideInTable | 在表格中隐藏 | `boolean` | `false` |
| hideInSearch | 在查询表单中隐藏 | `boolean` | `false` |
| sorter | 排序配置 | `boolean \| { compare, multiple? }` | - |
| filters | 表头筛选配置 | `{ text, value }[]` | - |
| defaultSortOrder | 默认排序 | `'ascend' \| 'descend'` | - |
| defaultFilteredValue | 默认筛选值 | `(string \| number)[]` | - |
| search | 搜索表单中为此列单独配置 | `ProFormItemType` | - |
| fieldType | 查询表单组件类型 | `ProFieldType` | - |
| initialValue | 查询表单项初始值 | `any` | - |
| render | 自定义渲染单元格（推荐使用） | `(text, record, index, action) => VNode \| string` | - |
| customRender | 同 antdv customRender | `(opts) => VNode` | - |
| formItemProps | 传递给查询表单 Form.Item 的 props | `Record<string, any>` | - |
| fieldProps | 传递给查询表单控件的 props | `Record<string, any>` | - |