---
title: ProTable 高级表格
outline: deep
---

# ProTable 高级表格

ProTable 是核心组件之一，该组件致力于解决大数据渲染等复杂高频问题。使用该组件可以流畅滚动 10 万行、10 万列的数据，你不必担心页面卡顿造成用户投诉，进而影响业务进展。

![pro design table](/table.png)

## 使用演示

:::demo

table/demo

:::

### 基本使用

简单表格，使用分页切换数据。使用边框线、斑马纹等清晰呈现各数据单元格边界线，辅助信息区隔。

:::demo

table/basic

:::

### 远程加载数据

`request` 是 ProTable 最重要的 API，request 会返回一个对象。对象中必须要有 `data` 和 `success`，如果需要手动分页 `total` 也是必需的。`request` 会接管 `loading` 的设置，同时在查询表单查询时和 `params` 参数发生修改时重新执行。同时查询表单的值和 `params` 参数也会带入。

另外，本例也展示了筛选排序功能如何交给服务端实现，列不需要指定具体的 `onFilter` 和 `sorter` 函数，而是在把筛选和排序的参数发到服务端来处理。

当使用 `rowSelection` 时，请设置 `rowSelection.preserveSelectedRowKeys` 属性以保留 `key`。

使用表格属性 `manualRequest` 是否需要手动触发首次请求，可以通过控制 `params` 变化触发请求，也可以通过搜索表单手动请求数据。

使用表格属性 `polling` 开启定时轮训，`polling` 最低不能小于 `2000` ms，轮训模式下没有 `loading`。

:::demo

table/request

:::

### 查询表单

`ProTable` 会根据列来生成一个 Form，用于筛选列表数据，最后的值会根据通过 `request` 的第一个参数返回。通过列配置 `hideInSearch` 和 `hideInTable` 灵活控制列是显示在 table 中还是 form 中。

按照规范，table 的表单不需要任何的必选参数，点击搜索会触发 `request` 来发起一次查询。如果需要点击重置发起一次查询，配置表格属性 `search.resetOnSubmit=true`。

Form 的列是根据 fieldType 来生成不同的类型，详细的值类型请查看[表单配置](/component/form#fieldtype-列表)。

表格属性 `search` 支持 form(ProQueryFilter) 的所有属性，设置值为 `false` 将不显示搜索表单。设置 `search.items` 时，将不会使用表格列生成表单项。设置`search.cardProps` 添加标签搜索。

:::demo

table/search

:::

### 列表工具栏

用于自定义表格的工具栏部分。 `ProTable` 默认显示工具栏，配置表格属性 `tool-bar=false` 隐藏工具栏。

使用表格属性 `options` 可以控制某些栏，`options.density` 控制密度是否显示，`options.reload` 控制刷新是否显示，
`options.setting` 控制列设置是否显示，`options.search` 控制列设置是否显示，默认不显示。`options=false`隐藏所有工具。

:::demo

table/tool-bar

:::

### 固定表头和列

对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据。对于数据量非常大且没有分页的数据，可以固定表头，竖向滚动查看其它数据。如果数据行和列都非常多，建议开启`virtual`虚拟滚动。

可通过给列属性设置 `fixed: 'left'` 或 `fixed: 'right'` 以达成固定列效果。

你需要设置表格属性 `scroll="{ x: 1500 }"` 或者给每一列都设置宽度，当 scroll.x 或 列宽总和超过表格宽度时出现横向滚动条。

你需要设置表格属性 `scroll="{ y: 300 }"` 或通过 `height` 或 `maxHeight` 设置表格高度，单位同 CSS 属性。建议使用 `maxHeight` 自适应高度。

`height` 是固定表格高度，不受内容多少的影响，`height` 和 `scroll.y` 一般只需要设置一个，当然你可以同时设置，组合出你想要的效果。

:::demo

table/fixed

:::

### 表头吸顶/分页吸底

- 表头吸顶，设置 `sticky=true` 即可。如果需要调整吸顶位置及更多配置，使用 `sticky: { offsetHeader: 80 }`。
- 分页器/滚动条吸底，设置 `paginationSticky=true` 即可。如果需要调整吸底位置及更多配置，使用 `paginationSticky: { offsetBottom: 60 }`。

::: tip 注意
吸顶和吸底是使用的 position: sticky 实现，如果发现吸顶没有生效，请排查 table 父元素是否有元素设置了 overflow，具体原因请查看[规范](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)。
:::

:::demo

table/sticky

:::

### 合并表头/单元格

根据数据结构，可以将表格中的行列进行合并。

- 使用列属性 `colSpan` 设置表头合并。如果是多级表头，请参考下方「表头分组」示例。
- 使用列属性 `customRender` 设置表格内容合并元格，单元格属性 `colSpan`|`rowSpan`, 当设值为 0 时，设置的表格不会渲染。

:::demo

table/group

:::

### 表头分组

表头数据标签可采用分组呈现，表述信息层级包含关系。

- 表头分组的配置只需要在列配置中添加 `children` 子列配置即可。
- 表头分组中的固定列，必须指定第一层 `fixed` 属性，不支持子列固定。
- 表头分组中的列宽设置，只需指定最后一层表头宽度。

:::demo

table/grouping-columns

:::

### 滚动到指定位置

通过 `scrollTo` 方法滚动到指定位置，默认不开启动画。

对于动态行高，虚拟滚动会动态修正行的位置，如果需要滚动到指定行，很有可能并没有滚动到预期位置。

:::demo

table/scroll

:::

### Tooltip 自定义提示

使用 `tooltip.title` 自定义更加友好的单元格提示。

使用 `headerTooltip` 配置表头提示。`headerTooltip = true`使用title配置提示。

使用 `showCellPopover` 配置表头气泡卡片提示。`showCellPopover = true`使用title配置标题。使用 `headerCellPopover` 插槽定义更加复杂的卡片内容。

你可以全量开启 tooltip，不用担心性能问题。本示例，姓名、邮箱 两列开启了 tooltip。

:::demo

table/tooltip

:::

### 单元格超出省略

支持单元格文本超出省略，支持文本多行超出省略。表头标题超出自动省略，如果表头标题不想省略，参考自动高度。

使用 `ellipsis` 设置列文本超出省略显示；只要 ellipsis 为真，无论是何种数据类型都会出现超出省略。

使用 `ellipsis: { line: 2 }` 设置列文本多行超出省略显示。

:::demo

table/ellipsis

:::

### 自动高度

配置表格属性 `auto-header-height` 开启表头自动高度。拖动第一列查看效果吧。

列设置`autoHeight: true` 开启列自动行高。拖动邮箱列查看效果吧。

::: tip 注意
当自动表头高度时，表头部分会降级到全量渲染，如果你有很多很多很多列，全量渲染对表格性能有一定的影响。

不建议对每一列都设置自动行高，虽然你可以这么做， 对于大多数场景，一般只有少数几列会有自动行高的需求。
:::

:::demo

table/auto-height

:::

### 表尾总结栏

通过 `summary` 插槽设置总结栏。因为支持设置多行总结栏，所以不能简单的通过属性进行设置。

使用 `pro-table-summary-row` 设置一行，`pro-table-summary-cell` 设置列。

你可以通过在 `pro-table-summary-cell` 上设置 `index` 和 `colSpan`，来表示展示位置和合并列数。

注意 `index` 指的是所在列的位置，当有展开列或选择列时，会影响 `index` 的数据。

你可以通过插槽 `default` 获取组件内部自动计算的和，当然你也可以设置任意内容。

:::demo

table/summary

:::

### 自定义样式

自定义 `Header、Body、Summary、Row、Cell` 的样式。 由于有固定列、固定行等功能，没有办法简单的改变样式。

:::demo

table/custom-style

:::

### 自定义表头/单元格

表头标题默认使用 `title` 渲染，自定义标题则有以下 2 种方式：

- 使用 `title` 作为渲染函数，函数参数为：`({ column, sortColumns, filters }) => VNode`。
- 使用 `headerCell` 插槽，插槽参数为：`#headerCell="{ title, column }"`，根据`column.key`判断自定义渲染那一列。

单元格默认使用 row[dataIndex] 渲染数据内容，自定义单元格有以下 3 种方式：

- 【推荐】使用 `customRender` 作为渲染函数，函数参数为：`({ value, text, record, index, column }) => { props: {key, class,    style, colSpan, rowSpan }, children: VNode } | VNode`。
- 使用 `bodyCell` 插槽，插槽参数为：`#bodyCell="{ record, column, text, value, index, oldValue, recordIndexs }"`，根据`column.key`判断自定义渲染那一列。
- 使用 `renderText` 渲染函数，函数参数为：`({text, record, rowIndex}) => string | number`，只支持返回`字符串`，适合`拼接｜计算`等操作。

:::demo

table/custom-render

:::

### 虚拟滚动

虚拟滚动提升渲染速度，树形数据、展开内容、嵌套子表格、行列合并、自动行高、横向、纵向、吸顶、固定头、固定列等等一切都支持虚拟滚动。

- 虚拟滚动一般用于超大数据渲染的场景，以提供更优的前端性能表现，设置 `virtual=true` 即可开启虚拟滚动模式，设置 `xVirtual=false` 可以关闭横向虚拟滚动。
- 虚拟滚动根据表格高度计算渲染数据，所以必须设置 `scroll.y` 和 `height` 其中之一。

:::demo

table/virtual

:::

### 分页配置

组件默认开启了分页，你不但可以通过表格属性 `pagination` 配置显示或隐藏，还可以配置显示位置。你还可以配置 [Antv Pagination](https://www.antdv.com/components/pagination-cn#api) 组件的其它部分属性。

当 `dataSource.length` 长度超过 `pageSize`，单页已无法完整地显示数据，此时会自动开启本地数据分页，组件内部会对 `dataSource` 进行分页。如果希望禁用组件内部分页，可以设置 `pagination=false`关闭分页。

::: tip
如果关闭了分页，且表格没有设置`height` | `scroll.y`和开启 `virtual`虚拟滚动，表格数据将全量渲染，数据量大将会造成性能问题。
:::
:::demo

table/pagination

:::

### 拖拽排序

支持拖拽表格行调整顺序，支持拖拽表头调整列顺序。支持拖拽表头调整列宽。

- 设置列属性 `resizable = true`, 可以将列变成可拖拽改变宽度的列，通过设置 `minWidth`、`maxWidth` 控制列宽的最小宽度和最大宽度，当然这都是可选的配置。 当有些列没有设置 width 时，该列将会是自动伸缩，其它可拖拽的列大小改变时，会重新计算自动伸缩列的宽度。
- 设置列属性 `rowDrag = true`, 该列将添加拖拽图标。rowDrag 同样可以是一个返回 boolean 类型的函数，用来自定义不同的行是否允许 拖拽。
- 设置表格属性 `columnDrag = true`,启用全列拖拽(选择、展开除外)。设置列属性 `drag = true`，单独控制某一列是否可以拖拽。
- 组件内部默认使用当前单元格的内容显示提示，你可以使用 `rowDragGhost` 插槽自定义内容。
- 使用 `rowDragEnd` 事件返回 `promise`，可以做行拖拽排序二次确认是否移动到目标位置。
- 使用 `columnDragEnd` 事件返回 `promise`，可以做列拖拽排序二次确认是否移动到目标位置。

::: tip
拖拽是一个很酷的功能，但你要知道当用户刷新或重新获取数据后，状态会被重置，除非你开启了缓存，使用表格属性 `columns-state` 设置缓存及初始状态 `{persistenceType: 'localStorage',persistenceKey: 'dragable-local'}`。

注意：表头分组仅支持叶子节点拖拽修改列宽，表头分组仅支持一级节点拖拽排序。
:::

:::demo

table/dragable

:::

### 过滤和排序

对某一列数据进行筛选，使用列的 `filters` 属性来指定需要筛选菜单的列，`onFilter` 用于筛选当前数据，`filterMultiple` 用于指定多选和单选。

对某一列数据进行排序，通过指定列的 `sorter` 属性来指定需要排序的列。`sorter: function(rowA, rowB) { ... }`， rowA、rowB 为比较的两个行数据。
`sorter` 支持 `multiple` 字段以配置多列排序优先级。通过 `sorter.compare` 配置排序逻辑。

::: tip
表格使用 `request` 获取数据时，`sorter` 和 `filter` 值会传递给 `request` 函数，需要配合远程服务使用。
:::

:::demo

table/sorter-filter

:::

### 可选择

在涉及到表单选择、或批量操作场景中，可在数据行前直接单选或多选操作对象。

第一列是联动的选择框。可以通过表格属性 `rowSelection.type` 属性指定选择类型，默认为 `checkbox`。

根据 HTML 标准规范， Radio 选择后是不可以置空的，但的确有置空这类业务需求，我们提供了 `rowSelection.allowCancelRadio` 可以配置是否允许取消选择 Radio。

多选模式下，设置表格属性 `alwaysShowAlert`， 是否显示 `alert`，通过 `alertInfo` 和 `alertActions` 插槽自定义 `alert`。

设置表格属性 `highlightSelectRow`， 启用高亮选中行。

:::demo

table/selection

:::

### 树形结构

表格支持树形数据的展示，当数据中有 `children` 字段时会自动展示为树形表格，如果不需要或配置为其他字段可以用 `childrenColumnName` 进行配置。

设置表格属性 `indentSize` 以控制每一层的缩进宽度。

当表格内容较多不能一次性完全展示时，通过 `expandedRowRender` 插槽可以添加可展开的额外内容`#expandedRowRender="{ record }"`，树形表格和可展开表格不能同时使用。

:::demo

table/expand-tree

:::

## API

### Props

| 参数                      | 说明                                                                                                             | 类型                                                                                                                                                     | 默认值                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| animate-rows              | 是否开启动画                                                                                                     | `boolean`                                                                                                                                                | `true`                                                          |
| auto-header-height        | 是否自动表头高度，开启后会全量加载表头部分，有一定的性能损耗                                                     | `boolean`                                                                                                                                                | `false`                                                         |
| bordered                  | 是否展示外边框和列边框                                                                                           | `boolean`                                                                                                                                                | `false`                                                         |
| columns                   | 表格列的配置描述，具体项见[下表](#column)                                                                        | `ProTableColumnType[]`                                                                                                                                   | `[]`                                                            |
| children-column-name      | 指定树形结构的列名                                                                                               | `string`                                                                                                                                                 | `children`                                                      |
| data-source               | 数据数组                                                                                                         | `object[]`                                                                                                                                               |                                                                 |
| default-expand-all-rows   | 初始时，是否展开所有行                                                                                           | `boolean`                                                                                                                                                | `false`                                                         |
| default-expanded-row-keys | 默认展开的行                                                                                                     | `string[]`                                                                                                                                               | -                                                               |
| deep-watch-data-source    | 是否深度监听 dataSource 变化，开启后会对 dataSource 进行深度监听，有一定的性能损耗                               | `boolean`                                                                                                                                                | `false`                                                         |
| deep-watch-columns        | 是否深度监听 columns 变化，开启后会对 columns 进行深度监听，有一定的性能损耗                                     | `boolean`                                                                                                                                                | `false`                                                         |
| expanded-row-keys         | 展开的行，控制属性                                                                                               | `string[]`                                                                                                                                               | -                                                               |
| expand-fixed              | 控制展开图标是否固定，可选 true `left` `right`                                                                   | `boolean` \| `string`                                                                                                                                    | `false`                                                         |
| expand-row-by-click       | 通过点击行来展开子行                                                                                             | `boolean`                                                                                                                                                | `false`                                                         |
| expand-icon-column-index  | 自定义展开按钮的列顺序，`-1` 时不展示                                                                            | `number`                                                                                                                                                 | -                                                               |
| get-popup-container       | 设置表格内各类浮层的渲染节点，如筛选菜单                                                                         | `(triggerNode) => HTMLElement   `                                                                                                                        | `() => TableHtmlElement`                                        |
| loading                   | 页面是否加载中                                                                                                   | `boolean` \| [SpinProps](https://www.antdv.com/components/spin-cn#api)                                                                                   | `false`                                                         |
| pagination                | 分页器，参考[Antv Pagination](https://www.antdv.com/components/pagination-cn#api)，设为 false 时不展示和进行分页 | `PaginationProps`                                                                                                                                        | -                                                               |
| row-class-name            | 表格行的类名                                                                                                     | `(record, index) => string`                                                                                                                              | -                                                               |
| row-key                   | 表格行 key 的取值，可以是字符串或一个函数                                                                        | `string` \| `(record) => string`                                                                                                                         | `'id'`                                                          |
| row-selection             | 列表项是否可选择，[配置项](#rowselection)                                                                        | `object`                                                                                                                                                 | `null`                                                          |
| scroll                    | 表格是否可滚动，也可以指定滚动区域的宽、高，[配置项](#scroll)                                                    | `object `                                                                                                                                                | -                                                               |
| show-header               | 是否显示表头                                                                                                     | `boolean`                                                                                                                                                | `true`                                                          |
| show-sorter-tooltip       | 表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性                             | `boolean` \| [TooltipProps](#tooltip)                                                                                                                    | `true`                                                          |
| size                      | 表格大小                                                                                                         | `large` \| `middle` \| `small`                                                                                                                           | `'middle'`                                                      |
| sticky                    | 设置粘性头部和滚动条                                                                                             | `boolean` \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement, topSummary?: boolean }`                                   | -                                                               |
| pagination-sticky         | 设置粘性分页和滚动条                                                                                             | `boolean` \| `{offsetBottom?: number }`                                                                                                                  | -                                                               |
| title                     | 表格标题                                                                                                         | `string`                                                                                                                                                 | -                                                               |
| sub-title                 | 表格子标题                                                                                                       | `string`                                                                                                                                                 | -                                                               |
| tooltip                   | 表格标题 提示                                                                                                    | `string`                                                                                                                                                 | -                                                               |
| indent-size               | 展示树形数据时，每层缩进的宽度，以 px 为单位                                                                     | `number`                                                                                                                                                 | 15                                                              |
| row-expandable            | 设置是否允许行展开                                                                                               | `(record) => boolean`                                                                                                                                    | -                                                               |
| row-hover                 | 设置是否显示悬浮效果                                                                                             | `boolean`                                                                                                                                                | -                                                               |
| custom-row                | 设置行属性                                                                                                       | `Function(record, index)`                                                                                                                                | -                                                               |
| custom-cell               | 设置单元格属性, column 如配置了 `customCell`, 优先使用 column.customCell                                         | `Function(obj: {record: any; rowIndex: number; column: ColumnType}) `                                                                                    | -                                                               |
| summary-fixed             | 固定总结栏                                                                                                       | `boolean` \| `'top'` \| `'bottom'`                                                                                                                       | -                                                               |
| column-drag               | 列表头是否允许拖拽                                                                                               | `boolean`                                                                                                                                                | -                                                               |
| x-virtual                 | 横向是否虚拟滚动                                                                                                 | `boolean`                                                                                                                                                | -                                                               |
| virtual                   | 是否虚拟滚动，包括横向和竖向                                                                                     | `boolean`                                                                                                                                                | `false`                                                         |
| ignore-cell-key           | 忽略单元格唯一 key，进一步提升自定义组件复用，bodyCell 插槽新增 key 参数，可根据组件情况自行选用。               | `boolean`                                                                                                                                                | `false`                                                         |
| row-height                | 配置行高，组件内部默认会根据 size 自动调整高度，如果需要自定义高度可使用该属性                                   | `number` \| `((p: Record<any, any>, isExpandRow: boolean, baseHeight: number) => number`                                                                 | `undefined`                                                     |
| request                   | 获取 `dataSource` 的方法                                                                                         | `(params?: {pageSize,current},sortors,filter) => {data,success,total}`                                                                                   | -                                                               |
| params                    | 用于 `request` 查询的额外参数，一旦变化会触发重新加载                                                            | `object`                                                                                                                                                 | -                                                               |
| manual-request            | 用于 `request` 是否需要手动触发首次请求                                                                          | `boolean`                                                                                                                                                | -                                                               |
| polling                   | 用于 `request` 是否自动轮询请求                                                                                  | `number`                                                                                                                                                 | -                                                               |
| tool-bar                  | table 标题栏，包含标题和工具栏，设为 `false` 时不显示                                                            | `boolean`                                                                                                                                                | `true`                                                          |
| options                   | table 工具栏，设为 `false` 时不显示                                                                              | `{density?: boolean, reload?: boolean \| function, setting?: boolean \| SettingOptionType, search?: (OptionSearchProps & { name?: string }) \| boolean}` | `{ search: false, reload: true, density: true, setting: true }` |
| search                    | 是否显示搜索表单，传入对象时为搜索表单的配置                                                                     | `false \| SearchConfig`                                                                                                                                  | -                                                               |
| column-empty-text         | 空值时的显示，不设置时显示 `-`， `false` 可以关闭此功能                                                          | `false \| string`                                                                                                                                        | `'-'`                                                           |
| height                    | 表格高度                                                                                                         | `number \| string`                                                                                                                                       | -                                                               |
| min-height                | 表格最小高度                                                                                                     | `number \| string`                                                                                                                                       | -                                                               |
| max-height                | 表格最大高度                                                                                                     | `number \| string`                                                                                                                                       | -                                                               |
| show-header               | 是否显示表头                                                                                                     | `boolean`                                                                                                                                                | `true`                                                          |
| always-show-alert         | 总是展示 `alert`，默认无选择不展示（`rowSelection`内置属性）                                                     | `boolean`                                                                                                                                                | `true`                                                          |
| highlight-select-row      | 单选或多选时是否高亮选中行                                                                                       | `boolean`                                                                                                                                                | `false`                                                         |

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

### Column {#column}

| 属性              | 描述                                                                                                                                                                                                                                         | 类型                                                                                                                                                            | 默认值   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| key               | 确定这个列的唯一值，一般用于 `dataIndex` 重复的情况                                                                                                                                                                                          | `string` \| `number`                                                                                                                                            | -        |
| dataIndex         | 与实体映射的 key，映射到查询表单中的`name`，数组会被转化 [a,b] => Entity.a.b                                                                                                                                                                 | `string` \| `number`                                                                                                                                            | -        |
| title             | 与 antd 中基本相同，但是支持通过传入一个方法                                                                                                                                                                                                 | `ReactNode \| ((config: ProColumnType<T>, type: ProTableTypes) => ReactNode)`                                                                                   | -        |
| tooltip           | 单元格是否显示 tooltip，它和 ellipsis.showTitle 是独立不相关的功能，`tooltip` 内容需要额外通过 `tooltip.title` 或 `cellTooltip` 插槽传递。设置为 true 时，使用 cellTooltip 内容。                                                            | `boolean` \| [CellTooltip](#cellTooltip)                                                                                                                        | -        |
| ellipsis          | 超过宽度将自动省略。设置为 true 时，showTitle 默认为 true，支持多行省略                                                                                                                                                                      | `boolean` \| `{showTitle?: boolean,  line?: number}`                                                                                                            | -        |
| align             | 设置列的对齐方式                                                                                                                                                                                                                             | `left` \| `right` \| `center`                                                                                                                                   | `'left'` |
| fixed             | 列是否固定，可选 true(等效于 left)                                                                                                                                                                                                           | `left` \| `right` \| `true`                                                                                                                                     | `false`  |
| width             | 列宽度                                                                                                                                                                                                                                       | `string` \| `number`                                                                                                                                            | -        |
| minWidth          | 拖动列最小宽度，会受到表格自动调整分配宽度影响                                                                                                                                                                                               | `number`                                                                                                                                                        | 50       |
| maxWidth          | 拖动列最大宽度，会受到表格自动调整分配宽度影响                                                                                                                                                                                               | `number`                                                                                                                                                        | -        |
| resizable         | 是否可拖动调整宽度，此时 width 必须是 number 类型, 仅支持叶子结点                                                                                                                                                                            | `boolean`                                                                                                                                                       | `false`  |
| autoHeight        | 是否启用自动行高                                                                                                                                                                                                                             | `boolean`                                                                                                                                                       | `false`  |
| hidden            | 隐藏列，一般不会使用                                                                                                                                                                                                                         | `boolean`                                                                                                                                                       | `false`  |
| sorter            | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)。需要服务端排序可设为 true（单列排序） 或 { multiple: number }（多列排序） | `function` \| `boolean` \| `{ compare: function, multiple: number }`                                                                                            | -        |
| showSorterTooltip | 表头显示下一次排序的 tooltip 提示, 覆盖 table 中 `showSorterTooltip` \| [Antd Tooltip](https://www.antdv.com/components/tooltip-cn#api)                                                                                                      | `boolean`                                                                                                                                                       | `true`   |
| valueEnum         | 值的枚举，会自动转化把值当成 key 来取出要显示的内容，有color会生成`Tag`                                                                                                                                                                      | [valueEnum](#valueenum)                                                                                                                                         | -        |
| valueStatus       | 单元格状态，设置颜色，内置`'success' \| 'processing' \| 'error' \| 'warning'`状态，还可以返回自定义颜色值                                                                                                                                    | `(value: any, row: RecordType) => 'success' \| 'processing' \| 'error' \| 'warning' \| string` \| `'success' \| 'processing' \| 'error' \| 'warning' \| string` | -        |
| renderText        | 类似 table 的 render，但是必须返回 string，如果只是希望转化枚举，可以使用 valueEnum                                                                                                                                                          | `(text: any,record: T,rowIndex: number) => string`                                                                                                              | -        |
| hideInSearch      | 在查询表单中不展示此项                                                                                                                                                                                                                       | `boolean`                                                                                                                                                       | -        |
| hideInTable       | 在 Table 中不展示此列                                                                                                                                                                                                                        | `boolean`                                                                                                                                                       | -        |
| hideInSetting     | 在列设置中不展示此列                                                                                                                                                                                                                         | `boolean`                                                                                                                                                       | -        |
| filters           | 表头的筛选菜单项`                                                                                                                                                                                                                            | `{text: string \| number, value: string \| number \| boolean }[]`                                                                                               | -        |
| filterMultiple    | 是否多选 `                                                                                                                                                                                                                                   | `boolean`                                                                                                                                                       | `true`   |
| onFilter          | 筛选表单处理                                                                                                                                                                                                                                 | `(value: string \| number \| boolean, record: RecordType) => boolean`                                                                                           | -        |
| disable           | 列设置中`disabled`的状态                                                                                                                                                                                                                     | `boolean` \| `{ checkbox: boolean; }`                                                                                                                           | -        |
| headerTooltip     | 会在列 title 旁边展示一个 icon，鼠标浮动之后展示，值为`true`时使用title作为提示，查询表单项中的`tooltp`                                                                                                                                      | `string` \| `true`                                                                                                                                              | -        |
| showCellPopover   | 会在列 title 旁边展示一个 icon，鼠标浮动之后展示气泡卡片。                                                                                                                                                                                   | `boolean` \| [PopoverProps](https://www.antdv.com/components/popover-cn#api)                                                                                    | -        |
| colSpan           | 表头列合并,设置为 0 时，不渲染                                                                                                                                                                                                               | `number`                                                                                                                                                        | -        |
| customCell        | 设置单元格属性                                                                                                                                                                                                                               | `Function(obj: {record: any; rowIndex: number; column: ColumnType})`                                                                                            | -        |
| customHeaderCell  | 设置头部单元格属性                                                                                                                                                                                                                           | `Function(column)`                                                                                                                                              | -        |
| customRender      | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并,可参考 demo 表格行/列合并                                                                                                                | `Function({text, record, index, column}) {}`                                                                                                                    | -        |
| rowDrag           | 当前列添加拖拽手柄                                                                                                                                                                                                                           | `boolean \| (arg: { record: RecordType; column: ColumnType }) => boolean`                                                                                       | -        |
| drag              | 单元格是否可编辑                                                                                                                                                                                                                             | `boolean`                                                                                                                                                       | -        |
| children          | 表格分组使使用                                                                                                                                                                                                                               | `ProTableColumnType[]`                                                                                                                                          | -        |

### Scroll

| 参数                     | 说明                                                                                                                                                          | 类型                     | 默认值 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------ |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否滚动到表格顶部                                                                                                                    | boolean                  | -      |
| x                        | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | string \| number \| true | -      |
| y                        | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值                                                                                                      | string \| number         | -      |

### RowSelection

选择功能的配置。

| 参数                    | 说明                                                            | 类型                                                  | 默认值     |
| ----------------------- | --------------------------------------------------------------- | ----------------------------------------------------- | ---------- |
| checkStrictly           | checkable 状态下节点选择完全受控（父子数据选中状态不再关联）    | boolean                                               | true       |
| columnWidth             | 自定义列表选择框宽度                                            | string\|number                                        | -          |
| columnTitle             | 自定义列表选择框标题                                            | string\|VNode\| () => VNode                           | -          |
| fixed                   | 把选择框列固定在左边                                            | boolean                                               | -          |
| allowCancelRadio        | 是否允许取消单选                                                | boolean                                               | -          |
| getCheckboxProps        | 选择框的默认属性配置                                            | Function(record)                                      | -          |
| hideSelectAll           | 隐藏全选勾选框与自定义选择项                                    | boolean                                               | false      |
| preserveSelectedRowKeys | 当数据被删除时仍然保留选项的 `key`                              | boolean                                               | -          |
| hideDefaultSelections   | 去掉『全选』『反选』两个默认选项                                | boolean                                               | false      |
| selectedRowKeys         | 指定选中项的 key 数组，需要和 onChange 进行配合                 | string\[]                                             | \[]        |
| selections              | 自定义选择项 [配置项](#selection), 设为 `true` 时使用默认选择项 | object\[] \| boolean                                  | true       |
| type                    | 多选/单选，`checkbox` or `radio`                                | string                                                | `checkbox` |
| onChange                | 选中项发生变化时的回调                                          | Function(selectedRowKeys, selectedRows)               | -          |
| onSelect                | 用户手动选择/取消选择某列的回调                                 | Function(record, selected, selectedRows, nativeEvent) | -          |
| onSelectAll             | 用户手动选择/取消选择所有列的回调                               | Function(selected, selectedRows, changeRows)          | -          |
| onSelectInvert          | 用户手动选择反选的回调                                          | Function(selectedRows)                                | -          |
| onSelectNone            | 用户清空选择的回调                                              | function()                                            | -          |

### ValueEnum

valueEnum 需要传入一个枚举，ProTable 会自动根据值获取响应的枚举，并且在 form 中生成一个下拉框。看起来是这样的：

```js
const valueEnum = {
  open: {
    text: '未解决',
    color: 'error',
  },
  closed: {
    text: '已解决',
    color: 'success',
  },
}

// 也可以设置为一个function
const valueEnum = (row) =>
  row.isMe
    ? {
        open: {
          text: '未解决',
          color: 'error',
        },
        closed: {
          text: '已解决',
          color: 'success',
        },
      }
    : {
        open: {
          text: '等待解决',
          color: 'error',
        },
        closed: {
          text: '已回应',
          color: 'success',
        },
      }
```

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
