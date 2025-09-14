---
title: ProTable 高级表格
outline: deep
---

# ProTable 高级表格

ProTable 是核心组件之一，该组件致力于解决大数据渲染等复杂高频问题。使用该组件可以流畅滚动 10 万行、10 万列的数据，你不必担心页面卡顿造成用户投诉，进而影响业务进展。

## 使用演示

最简单的用法。你只需要配置 `columns` `dataSource` 即可展示表格。组件默认开启了分页，如果没有分页且数据量较大，请开启`virtual`虚拟滚动，支持10万+数据渲染。

:::demo

table/basic

:::

## API

::: warning 提示

由于功能太多，API还在加速完善中，目前只是部分文档。

:::

### Props

| 参数                   | 说明                                                                                               | 类型                                                                                                                 | 默认值                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| animateRows            | 是否开启动画                                                                                       | boolean                                                                                                              | true                                                                      |
| autoHeaderHeight       | 是否自动表头高度，开启后会全量加载表头部分，有一定的性能损耗                                       | boolean                                                                                                              | false                                                                     |
| bordered               | 是否展示外边框和列边框                                                                             | boolean                                                                                                              | false                                                                     |
| columns                | 表格列的配置描述，具体项见[下表](#column)                                                          | array                                                                                                                | -                                                                         |
| childrenColumnName     | 指定树形结构的列名                                                                                 | string                                                                                                               | `children`                                                                |
| dataSource             | 数据数组                                                                                           | object\[]                                                                                                            |                                                                           |
| defaultExpandAllRows   | 初始时，是否展开所有行                                                                             | boolean                                                                                                              | false                                                                     |
| defaultExpandedRowKeys | 默认展开的行                                                                                       | string\[]                                                                                                            | -                                                                         |
| deepWatchDataSource    | 是否深度监听 dataSource 变化，开启后会对 dataSource 进行深度监听，有一定的性能损耗                 | boolean                                                                                                              | false                                                                     |
| deepWatchColumns       | 是否深度监听 columns 变化，开启后会对 columns 进行深度监听，有一定的性能损耗                       | boolean                                                                                                              | false                                                                     |
| expandedRowKeys        | 展开的行，控制属性                                                                                 | string\[]                                                                                                            | -                                                                         |
| expandFixed            | 控制展开图标是否固定，可选 true `left` `right`                                                     | boolean \| string                                                                                                    | false                                                                     |
| expandRowByClick       | 通过点击行来展开子行                                                                               | boolean                                                                                                              | `false`                                                                   |
| expandIconColumnIndex  | 自定义展开按钮的列顺序，`-1` 时不展示                                                              | number                                                                                                               | -                                                                         |
| getPopupContainer      | 设置表格内各类浮层的渲染节点，如筛选菜单                                                           | (triggerNode) => HTMLElement                                                                                         | `() => TableHtmlElement`                                                  |
| loading                | 页面是否加载中                                                                                     | boolean\|[object](#loading)                                                                                          | false                                                                     |
| locale                 | 默认文案设置，目前包括排序、过滤、空数据文案                                                       | object                                                                                                               | filterConfirm: `确定` <br> filterReset: `重置` <br> emptyText: `暂无数据` |
| pagination             | 分页器，参考[配置项](#pagination)，设为 false 时不展示和进行分页                                   | object                                                                                                               | -                                                                         |
| rowClassName           | 表格行的类名                                                                                       | Function(record, index):string                                                                                       | -                                                                         |
| rowKey                 | 表格行 key 的取值，可以是字符串或一个函数                                                          | string\|Function(record):string                                                                                      | 'key'                                                                     |
| rowSelection           | 列表项是否可选择，[配置项](#rowselection)                                                          | object                                                                                                               | null                                                                      |
| scroll                 | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll)                                      | object                                                                                                               | -                                                                         |
| showHeader             | 是否显示表头                                                                                       | boolean                                                                                                              | true                                                                      |
| showSorterTooltip      | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性               | boolean \| [Tooltip props](#tooltip)                                                                                 | true                                                                      |
| size                   | 表格大小                                                                                           | default \| middle \| small                                                                                           | default                                                                   |
| sortDirections         | 支持的排序方式，取值为 `ascend` `descend`                                                          | Array                                                                                                                | \[`ascend`, `descend`]                                                    |
| sticky                 | 设置粘性头部和滚动条                                                                               | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement, topSummary?: boolean }` | -                                                                         |
| title                  | 表格标题                                                                                           | `string`                                                                                                             | -                                                                         |
| indentSize             | 展示树形数据时，每层缩进的宽度，以 px 为单位                                                       | number                                                                                                               | 15                                                                        |
| rowExpandable          | 设置是否允许行展开                                                                                 | (record) => boolean                                                                                                  | -                                                                         |
| customRow              | 设置行属性                                                                                         | Function(record, index)                                                                                              | -                                                                         |
| customCell             | 设置单元格属性, column 如配置了 `customCell`, 优先使用 column.customCell                           | Function(obj: {record: any; rowIndex: number; column: ColumnType})                                                   | -                                                                         |
| summaryFixed           | 固定总结栏                                                                                         | boolean \| 'top'（2.4.6） \| 'bottom'                                                                                | -                                                                         |
| columnDrag             | 列表头是否允许拖拽                                                                                 | boolean                                                                                                              | -                                                                         |
| xVirtual               | 横向是否虚拟滚动                                                                                   | boolean                                                                                                              | -                                                                         |
| ignoreCellKey          | 忽略单元格唯一 key，进一步提升自定义组件复用，bodyCell 插槽新增 key 参数，可根据组件情况自行选用。 | boolean                                                                                                              | false                                                                     |
| showHeaderScrollbar    | 显示表头滚动条                                                                                     | boolean                                                                                                              | false                                                                     |
| rowHeight              | 配置行高，组件内部默认会根据 size 自动调整高度，如果需要自定义高度可使用该属性                     | number \| ((p: Record<any, any>, isExpandRow: boolean, baseHeight: number) => number                                 | undefined                                                                 |
| rangeSelection         | 单元格选择, 开启后单元格内文本无法划词选中                                                         | boolean \| `single`(只能选择一个区间)                                                                                | `single`                                                                  |

- `expandFixed`
  - 当设置为 true 或 `left` 且 `expandIconColumnIndex` 未设置或为 0 时，开启固定
  - 当设置为 true 或 `right` 且 `expandIconColumnIndex` 设置为表格列数时，开启固定

### Events

| 事件名             | 说明                                                       | 类型                                                                                  |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| expandedRowsChange | 展开的行变化时触发                                         | `(expandedRows) => void`                                                              |
| change             | 分页、排序、筛选变化时触发                                 | `(pagination, filters, sorter, { action: 'paginate' \| 'sort' \| 'filter' }) => void` |
| expand             | 点击展开图标时触发                                         | `(expanded, record) => void`                                                          |
| resizeColumn       | 拖动列时触发, 如果不需要内部自动更改宽度，可以返回 `false` | `(width, column, action: 'start' \| 'move' \| 'end' ) => boolean \| void`             |
| rowDragEnd         | 拖拽行结束时触发                                           | `(opt: [DragRowEventInfo](#dragroweventinfo)) => boolean \| Promise \| void`          |
| columnDragEnd      | 拖拽列结束时触发                                           | `(opt: [DragColumnEventInfo](#dragcolumneventinfo)) => boolean \| Promise \| void`    |
| cellClick          | 单元格点击事件                                             | `(event: MouseEvent, params: [CellRenderArgs](#cellrenderargs)) => void`              |

### Exposes

| 事件名称        | 说明                                                   | 参数                                                                                                                                 |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| scrollTo        | 滚动到指定位置, 优先级：left > columnIndex > columnKey | `(pos: {left?: number; top?: number; columnIndex?: number; columnKey?: Key; rowKey?: Key; }, behavior?: 'auto' \| 'smooth') => void` |
| scrollLeft      | 当前横向滚动位置                                       | `ComputedRef<number>`                                                                                                                |
| scrollTop       | 当前纵向滚动位置                                       | `ComputedRef<number>`                                                                                                                |
| reload          | 重新加载数据，使用内置`request`时有效                  | `(resetPageIndex?: boolean) => Promise<void>`                                                                                        |
| reset           | 重置分页等状态                                         | `() => void`                                                                                                                         |
| clearDataSource | 清空数据                                               | `() => void`                                                                                                                         |

### Slots

| 插槽名               | 说明                                                        | 类型                                        |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| bodyCell             | 个性化单元格                                                | `{text, record, index, column}`             |
| headerCell           | 个性化头部单元格                                            | `{title, column}`                           |
| customFilterDropdown | 自定义筛选菜单，需要配合 `column.customFilterDropdown` 使用 | [FilterDropdownProps](#filterdropdownprops) |
| customFilterIcon     | 自定义筛选图标                                              | `{filtered, column}`                        |
| emptyText            | 自定义空数据时的显示内容                                    | `{title, column}`                           |
| summary              | 总结栏                                                      | `{title, column}`                           |
| rowDragGhost         | 自定义拖拽行时的提示内容                                    | [RowDragGhostArg](#rowdragghost)            |
| columnDragGhost      | 自定义拖拽列时的提示内容                                    | [ColumnDragGhostArg](#columndragghost)      |
| menuPopup            | 自定义筛选菜单弹出内容                                      | [MenuPopupArg](#MenuPopupArg)               |
| menuIcon             | 自定义筛选菜单图标                                          | `{column, filtered}`                        |
| expandedRowRender    | 额外的展开行                                                | `{record, index, indent, expanded}`         |
| expandIcon           | 自定义展开图标                                              | `props`                                     |
| footer               | 表格尾部                                                    | `currentPageData`                           |

## 类型声明

### CellTooltip

```ts
export interface CellTooltip {
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
  color?: String
  overlayStyle?: CSSProperties
  overlayClassName?: String
  title?: (args: CellRenderArgs) => any
  align?: TooltipAlignConfig
  // 默认鼠标移入单元格后就会显示，你可以通过该函数自定义是否显示，isEllipsis 是内部计算出的当前单元格是否触发了 ellipsis
  shouldOpen?: (isEllipsis: boolean, args: CellRenderArgs) => boolean // 4.2.4
  // 是否允许进入 tooltip，默认允许
  allowEnter?: boolean // 4.2.4
}
```

### CellRenderArgs

```ts
export type CellRenderArgs = {
  record: any
  column: ColumnType<DefaultRecordType> | ColumnGroupType<DefaultRecordType>
  text: any
  value: any
  oldValue?: any // 4.2.5+ only for beforeCloseEditor，组件不会对 oldValue 进行复制，请注意引用类型的数据
  index: number
  recordIndexs: number[]
  openEditor: () => void
  closeEditor: () => void
}
```

### RowDragGhostArg

```ts
interface DragRowsHandleInfo {
  y: number
  top: number
  height: number
  rowKey: Key
  centerY: number
  record: DefaultRecordType
  indexs: number[] // 这是一个索引数组，用以支持树形结构
}

export interface RowDragGhostArg<RecordT, ColumnT> {
  record: RecordT
  column: ColumnT
  icon: VNode
  allowed: boolean
  dragging: boolean
  event: MouseEvent | Touch
  preTargetInfo: DragRowsHandleInfo | null
  nextTargetInfo: DragRowsHandleInfo | null
}
```

### DragRowEventInfo

```ts
export interface DragRowEventInfo {
  top: number
  height: number
  record: DefaultRecordType
  dir: 'down' | 'up'
  rowKey: Key
  event: MouseEvent | Touch
  column: ColumnType
  preTargetInfo: DragRowsHandleInfo | null
  nextTargetInfo: DragRowsHandleInfo | null
  fromIndexs: number[] // 这是一个索引数组，用以支持树形结构
  insertToRowKey: Key
}
```

### DragColumnEventInfo

```ts
export interface DragColumnEventInfo {
  event: MouseEvent | Touch
  column: ColumnType
  targetColumn: ColumnType
  dir: 'left' | 'right'
}
```

### ColumnDragGhostArg

```ts
export interface ColumnDragGhostArg<ColumnT> {
  column: ColumnT
  icon: VNode
  allowed: boolean
  dragging: boolean
  event: MouseEvent | Touch
  targetColumn: ColumnT
}
```

### FilterDropdownProps

```ts
interface FilterDropdownProps {
  prefixCls: string
  setSelectedKeys: (selectedKeys: Key[]) => void
  selectedKeys: Key[]
  confirm: (param?: FilterConfirmProps) => void
  clearFilters?: () => void
  filters?: ColumnFilterItem[]
  visible: boolean
  column: ColumnType
}
```
