import type { TooltipProps } from 'ant-design-vue/es/tooltip'
import type { SpinProps } from 'ant-design-vue/es/spin'
import type {
  ComputedRef,
  CSSProperties,
  ExtractPropTypes,
  HTMLAttributes,
  PropType,
  Ref,
  VNode,
} from 'vue'
import type {
  AppendCellRange,
  FormatRangeCellTextParams,
  KeydownPayload,
  SelectedRangeItem,
} from '../hooks/RangeInterface'
import type { INTERNAL_SELECTION_ITEM } from '../hooks/useRowSelection'
import type { DOWN, LEFT, RIGHT, UP } from './Drag/constant'
import type { TablePaginationConfig, TablePaginationPosition } from './PaginationConfig'
import type { InputProps } from 'ant-design-vue/es/input'
import type { UseFetchDataAction } from '../hooks/useFetchData'
import type { CardProps, PopoverProps } from 'ant-design-vue'
import type { ProFormItemType, ProQueryFilterProps } from '@pro-design-vue/components/form'
export type DefaultRecordType = Record<string, any>
export interface TooltipAlignConfig {
  points?: [string, string]
  offset?: [number | string, number | string]
  targetOffset?: [number | string, number | string]
  overflow?: {
    adjustX: boolean
    adjustY: boolean
  }
  useCssRight?: boolean
  useCssBottom?: boolean
  useCssTransform?: boolean
}
export type RowType = 'left' | 'center' | 'right'
export type ValueStatus = 'success' | 'processing' | 'error' | 'warning' | string | undefined
export type Key = string | number
export interface Position {
  left?: number
  top?: number
  columnIndex?: number
  columnKey?: Key
  rowKey?: Key
}
export type { TablePaginationPosition, TablePaginationConfig }
export type DataIndex = string | number | readonly (string | number)[]
export type CellEllipsisType =
  | {
      showTitle?: boolean
      line?: number
    }
  | boolean
export type FixedType = 'left' | 'right' | boolean
export type RowHeight =
  | ((p: Record<any, any>, isExpandRow: boolean, baseHeight: number) => number | undefined)
  | number
export type HeaderHeight = number[] | number
export interface RowsRefsItem {
  left?: any
  right?: any
  conter?: any
}
// const SpinSizes = ['small', 'default', 'large']
export type SpinSize = 'small' | 'default' | 'large'
// const TableActions = ['paginate', 'sort', 'filter']
export type TableAction = 'paginate' | 'sort' | 'filter'
export interface StickyOffsets {
  left: readonly number[]
  right: readonly number[]
  isSticky?: boolean
}
export interface CellEditorArgs {
  modelValue: Ref<any>
  save: () => void
  onInput: (event: Event, value: any) => void
  closeEditor: () => void
  column: ColumnType
  editorRef: Ref<any>
  getPopupContainer: () => HTMLElement
  recordIndexs: number[]
  record: any
}

export const checkboxProps = () => ({
  prefixCls: String as PropType<string>,
  disabled: Boolean as PropType<boolean>,
  tabindex: [String, Number],
  name: String as PropType<string>,
  id: String as PropType<string>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  class: String as PropType<string>,
  checked: Boolean as PropType<boolean>,
  indeterminate: Boolean as PropType<boolean>,
  ariaLabel: String as PropType<string>,
})

export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>
export type RowSelectionType = 'checkbox' | 'radio'
export type GetRowKey<RecordType = DefaultRecordType> = (record: RecordType, index?: number) => Key
export interface HeaderSticky {
  offsetHeader?: number
  topSummary?: boolean
}

export interface BottomSticky {
  offsetBottom?: number
}

export type FlatRecord<T = DefaultRecordType> = {
  record: T
  indent: number
  rowKey: Key
  isExpandRow?: boolean
  rowIndex: number
  pos: string
  flattenIndex: number
  level: number
}
export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
export interface SorterResult<RecordType> {
  column?: ColumnType<RecordType>
  order?: SortOrder
  field?: Key | readonly Key[]
  columnKey?: Key
}
export interface TableCurrentDataSource<RecordType = DefaultRecordType> {
  currentDataSource: RecordType[]
  action: TableAction
}
type ChangeEvent<RecordType> = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  extra: TableCurrentDataSource<RecordType>,
) => void
type Scroll = {
  x?: number | string
  y?: number | string
  scrollToFirstRowOnChange?: boolean
}
export type RowClassName<RecordType> = (
  record: RecordType,
  index: number,
  indent?: number,
) => string
export type ExpandType = null | 'row' | 'nest'
export type ExpandedRowRender<ValueType> = (opt: {
  record: ValueType
  index: number
  indent: number
  expanded: boolean
}) => any
export type TriggerEventHandler<RecordType> = (
  record: RecordType,
  key: Key,
  event: MouseEvent,
) => void
export interface RenderExpandIconProps<RecordType> {
  prefixCls: string
  expanded: boolean
  record: RecordType
  expandable: boolean
  onExpand: TriggerEventHandler<RecordType>
}
export type RenderExpandIcon<RecordType> = (props: RenderExpandIconProps<RecordType>) => any
export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void
export interface SelectionItem {
  key: string
  text: any
  onSelect?: SelectionItemSelectFn
}
export type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: T[],
  nativeEvent: Event,
) => void
export interface TableRowSelection<T = DefaultRecordType> {
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean
  type?: RowSelectionType
  allowCancelRadio?: boolean
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void
  getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>
  onSelect?: SelectionSelectFn<T>
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void
  /** @deprecated This function is meaningless and should use `onChange` instead */
  onSelectInvert?: (selectedRowKeys: Key[]) => void
  onSelectNone?: () => void
  selections?: INTERNAL_SELECTION_ITEM[] | boolean
  hideSelectAll?: boolean
  fixed?: boolean
  columnWidth?: string | number
  columnTitle?: any
  checkStrictly?: boolean
  renderCell?: (value: boolean, record: T, index: number, originNode: any) => any
}
type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => Omit<HTMLAttributes, 'style'> & {
  style?: CSSProperties
}
export type ResizeActionType = 'start' | 'move' | 'end'
export type SummaryFixed = boolean | 'top' | 'bottom'
export const baseTableProps = <T = DefaultRecordType>() => ({
  ignoreCellKey: Boolean,
  showHeaderScrollbar: Boolean,
  deepWatchDataSource: Boolean,
  deepWatchColumns: Boolean,
  prefixCls: String,
  columnDrag: {
    type: Boolean,
    default: false,
  },
  animateRows: {
    type: Boolean,
    default: undefined,
  },
  dropdownPrefixCls: { type: String },
  columns: {
    type: Array as PropType<ColumnsType<T>>,
    default: () => [],
  },
  dataSource: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
  virtual: {
    type: Boolean,
    default: false,
  },
  xVirtual: {
    type: Boolean,
    default: undefined,
  },
  rowHeight: {
    type: [Number, Function] as PropType<RowHeight>,
    default: undefined,
  },
  autoHeaderHeight: {
    type: Boolean,
    default: false,
  },
  headerHeight: {
    type: [Number, Array] as PropType<HeaderHeight>,
  },
  height: {
    type: [Number, String],
  },
  maxHeight: {
    type: [Number, String],
  },
  minHeight: {
    type: [Number, String],
  },
  size: {
    type: String as PropType<DensitySize>,
    default: undefined,
  },
  bordered: {
    type: Boolean,
    default: undefined,
  },
  wrapText: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: [Boolean, Object] as PropType<boolean | SpinProps>,
    default: undefined,
  },
  pagination: {
    type: [Boolean, Object] as PropType<false | TablePaginationConfig>,
    default: () => ({}),
  },
  direction: {
    type: String as PropType<'rtl'>,
    default: undefined,
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  rowClassName: {
    type: [String, Function] as PropType<string | RowClassName<T>>,
    default: undefined,
  },
  sticky: {
    type: [Boolean, Object] as PropType<boolean | HeaderSticky>,
    default: true,
  },
  selectedRowKeys: {
    type: Array as PropType<Key[]>,
    default: undefined,
  },
  expandFixed: {
    type: [Boolean, String] as PropType<FixedType>,
    default: undefined,
  },
  expandColumnWidth: {
    type: Number,
    default: undefined,
  },
  expandedRowKeys: {
    type: Array as PropType<Key[]>,
    default: undefined,
  },
  defaultExpandedRowKeys: {
    type: Array as PropType<Key[]>,
    default: undefined,
  },
  expandedRowRender: {
    type: Function as PropType<ExpandedRowRender<T>>,
    default: undefined,
  },
  expandRowByClick: {
    type: Boolean,
    default: undefined,
  },
  expandIcon: {
    type: Function as PropType<RenderExpandIcon<T>>,
    default: undefined,
  },
  onExpand: {
    type: Function as PropType<(expanded: boolean, record: T) => void>,
    default: undefined,
  },
  onExpandedRowsChange: {
    type: Function as PropType<(expandedKeys: Key[]) => void>,
    default: undefined,
  },
  defaultExpandAllRows: {
    type: Boolean,
    default: undefined,
  },
  indentSize: Number,
  expandIconColumnIndex: Number,
  childrenColumnName: {
    type: String,
    default: undefined,
  },
  rowExpandable: {
    type: Function as PropType<(record: T) => boolean>,
    default: () => true,
  },
  rowSelection: {
    type: Object as PropType<TableRowSelection<DefaultRecordType>>,
    default: undefined,
  },
  rowHoverDelay: {
    type: Number,
    default: 59,
  },
  rowHover: {
    type: Boolean,
    default: undefined,
  },
  rowKey: {
    type: [Function, String] as PropType<string | GetRowKey<T>>,
  },
  customRow: {
    type: Function as PropType<GetComponentProps<T>>,
    default: () => ({}),
  },
  customCell: {
    type: Function as PropType<
      (obj: { record: T; rowIndex: number; column: ColumnType<T> }) => Record<string, any>
    >,
    default: () => ({}),
  },
  customHeaderCell: {
    type: Function as PropType<(column: ColumnType<T>) => Record<string, any>>,
    default: () => ({}),
  },
  customSummaryCellProps: {
    type: Function as PropType<
      (obj: {
        record: T
        rowIndex: number
        column: ColumnType<T>
        columnIndex: number
      }) => Record<string, any>
    >,
    default: () => ({}),
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showSorterTooltip: {
    type: [Boolean, Object] as PropType<boolean | TooltipProps>,
    default: true,
  },
  getPopupContainer: {
    type: Function as PropType<GetPopupContainer>,
  },
  locale: {
    type: Object as PropType<TableLocale>,
    default: undefined,
  },
  scrollX: {
    type: [Number, String] as PropType<string | number>,
  },
  scroll: {
    type: Object as PropType<Scroll>,
    default: undefined,
  },
  rangeSelection: {
    type: [String, Boolean] as PropType<boolean | 'single'>,
    default: false,
  },
  copyDelimiter: {
    type: String,
    default: '',
  },
  rowDrag: {
    type: [Boolean],
  },
  onChange: {
    type: Function as PropType<ChangeEvent<T>>,
  },
  summaryFixed: {
    type: [Boolean, String] as PropType<SummaryFixed>,
    default: undefined,
  },
  hasContextmenuPopup: Boolean,
  formatRangeCellText: {
    type: Function as PropType<(params: FormatRangeCellTextParams) => string>,
  },

  columnEmptyText: {
    type: [String, Boolean] as PropType<string | false>,
    default: undefined,
  },
  toolBar: { type: Boolean, default: undefined },
  options: { type: [Object, Boolean] as PropType<OptionConfig | false>, default: undefined },
  alwaysShowAlert: { type: Boolean, default: undefined },
  showAlert: { type: Boolean, default: undefined },
  // requst 相关配置
  request: Function as PropType<Request>,
  params: Object as PropType<Record<string, any>>,
  defaultData: Array as PropType<T[]>,
  manual: Boolean,
  manualRequest: Boolean,
  polling: [Number, Function] as PropType<number | ((dataSource: any[]) => number)>,
  debounceTime: Number,
  onLoad: {
    type: Function as PropType<(dataSource: T[], extra: any) => void>,
    default: undefined,
  },
  onLoadingChange: {
    type: Function as PropType<(loading: boolean | SpinProps | undefined) => void>,
    default: undefined,
  },
  onRequestError: {
    type: Function as PropType<(e: Error) => void>,
    default: undefined,
  },
  onSizeChange: {
    type: Function as PropType<(size: DensitySize) => void>,
    default: undefined,
  },
  onSubmit: {
    type: Function as PropType<ProQueryFilterProps['onFinish']>,
    default: undefined,
  },
  onReset: {
    type: Function as PropType<ProQueryFilterProps['onReset']>,
    default: undefined,
  },
  /** @name 列状态的配置，可以用来操作列功能 */
  columnsState: {
    type: Object as PropType<ColumnStateType>,
    default: undefined,
  },
  /** @name 是否要高亮选择行	 */
  highlightSelectRow: {
    type: Boolean,
    default: undefined,
  },

  paginationSticky: {
    type: [Boolean, Object] as PropType<boolean | BottomSticky>,
    default: true,
  },
  horizontalScrollSticky: {
    type: [Boolean, Object] as PropType<boolean | BottomSticky>,
    default: true,
  },
  'onUpdate:selectedRowKeys': {
    type: Function as PropType<(selectedRowKeys: Key[], selectedRows: T[]) => void>,
  },
  onScroll: {
    type: Function as PropType<(e: UIEvent) => void>,
  },
  'onUpdate:expandedRowKeys': {
    type: Function as PropType<(info: Key[]) => void>,
  },
  onResizeColumn: {
    type: Function as PropType<
      (w: number, col: ColumnType, action: ResizeActionType) => boolean | void
    >,
    default: undefined,
  },
  onRowDragEnd: {
    type: Function as PropType<(opt: DragRowEventInfo) => boolean | Promise<any> | void>,
    default: undefined,
  },
  onColumnDragEnd: {
    type: Function as PropType<(opt: DragColumnEventInfo) => boolean | Promise<any> | void>,
    default: undefined,
  },
  onCellKeydown: {
    type: Function as PropType<(e: KeyboardEvent, opt: KeydownPayload) => boolean | void>,
    default: undefined,
  },
  onCellClick: {
    type: Function as PropType<(e: MouseEvent, opt: CellRenderArgs) => void>,
    default: undefined,
  },
  onBeforeOpenEditor: {
    type: Function as PropType<(opt: CellRenderArgs) => boolean | Promise<boolean> | void>,
    default: undefined,
  },
  onOpenEditor: {
    type: Function as PropType<(opt: CellRenderArgs) => void>,
    default: undefined,
  },
  onBeforeCloseEditor: {
    type: Function as PropType<(opt: CellRenderArgs) => boolean | Promise<boolean> | void>,
    default: undefined,
  },
  onCloseEditor: {
    type: Function as PropType<(opt: CellRenderArgs) => void>,
    default: undefined,
  },
  'onUpdate:pagination': {
    type: Function as PropType<(info: TablePaginationConfig) => void>,
  },
  'onUpdate:dataSource': {
    type: Function as PropType<(dataSource: T[]) => void>,
  },
  'onUpdate:columns': {
    type: Function as PropType<(columns: ColumnsType<T>, action: 'resize' | 'drag') => void>,
  },
  'onUpdate:showAlert': {
    type: Function as PropType<(show: boolean) => void>,
  },
})

export const tableProps = <T = DefaultRecordType>() => ({
  ...baseTableProps<T>(),
  title: String,
  subTitle: String,
  footer: Function,
  tooltip: String,
  cardProps: {
    type: [Object, Boolean] as PropType<CardProps | false>,
    default: undefined,
  },
  search: {
    type: [Object, Boolean] as PropType<SearchConfig | false>,
    default: undefined,
  },
  beforeSearchSubmit: {
    type: Function as PropType<(params: Partial<T>) => any>,
    default: undefined,
  },
  cardBordered: {
    type: [Boolean, Object] as PropType<Bordered>,
    default: undefined,
  },
})
class Helper<T extends DefaultRecordType> {
  Return = tableProps<T>()
}
export type ProTableProps<T extends DefaultRecordType = DefaultRecordType> = Partial<
  ExtractPropTypes<Helper<T>['Return']>
>
export interface TableLocale {
  filterTitle?: string
  filterConfirm?: any
  filterReset?: any
  filterEmptyText?: any
  emptyText?: any | (() => any)
  selectAll?: any
  selectNone?: any
  selectInvert?: any
  selectionAll?: any
  sortTitle?: string
  expand?: string
  collapse?: string
  triggerDesc?: string
  triggerAsc?: string
  cancelSort?: string
}
export interface ColumnTitleProps<RecordType> {
  /** @deprecated Please use `sorterColumns` instead. */
  sortOrder?: SortOrder
  /** @deprecated Please use `sorterColumns` instead. */
  sortColumn?: ColumnType<RecordType>
  column: ColumnType<RecordType>
  sortColumns?: {
    column: ColumnType<RecordType>
    order: SortOrder
  }[]
  filters?: Record<string, string[]>
}
export type ColumnTitle<RecordType = DefaultRecordType> =
  | string
  | number
  | object
  | ((props: ColumnTitleProps<RecordType>) => any)
interface ColumnSharedType {
  title?: ColumnTitle
  key?: Key
  className?: string
  class?: string
  fixed?: FixedType
  ellipsis?: CellEllipsisType
  align?: AlignType
  wrapText?: boolean
  dataIndex?: DataIndex
}
export interface FilterConfirmProps {
  closeDropdown: boolean
}
export type AlignType = 'left' | 'center' | 'right'
export interface ColumnFilterItem {
  text: string | number
  value: string | number | boolean
  children?: ColumnFilterItem[]
}
export type SortOrder = 'desc' | 'asc' | null
export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number
export type FilterValue = (Key | boolean)[]
export type FilterKey = Key[] | null
export interface FilterDropdownProps {
  prefixCls: string
  confirm: (param?: FilterConfirmProps) => void
  clearFilters?: () => void
  filters?: ColumnFilterItem[]
  /** @deprecated Please use `open` instead */
  visible: boolean
  open: boolean
}
export interface CellType {
  key?: Key
  class?: string
  style?: CSSProperties
  colSpan?: number
  rowSpan?: number
}
export interface HeaderCellType {
  key?: Key
  class?: string
  style?: CSSProperties
  column?: FinallyColumnType
  colSpan?: number
  rowSpan?: number
  hasSubColumns?: boolean
  colStart?: number
  colEnd?: number
}
export interface RenderedCell {
  props?: CellType
  children?: any
}
export type CellRenderArgs = {
  record: any
  column: ColumnType<DefaultRecordType> | ColumnGroupType<DefaultRecordType>
  text: any
  value: any
  index: number
  oldValue?: any
  recordIndexs: number[]
  openEditor: () => void
  closeEditor: () => void
}
export interface ContextmenuPopupArg<RecordT, ColumnT>
  extends Omit<Partial<CellRenderArgs>, 'column' | 'record'> {
  column?: ColumnT
  record?: RecordT
  event: MouseEvent
  isExpand?: boolean
  hidePopup: () => void
}
export type MenuFilterProps = {
  prefixCls: string
  setSelectedKeys: (selectedKeys: Key[]) => void
  selectedKeysRef: Ref<Key[]>
  confirm: () => void
  clearFilters: () => void
  filters: ColumnFilterItem[]
}
export interface MenuPopupArg<ColumnT> {
  column: ColumnT
  event: MouseEvent
  hidePopup: () => void
  filter: MenuFilterProps
}
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
  color?: string
  overlayStyle?: CSSProperties
  overlayClassName?: string
  openClassName?: string
  title?: (args: CellRenderArgs) => any
  align?: TooltipAlignConfig
  shouldOpen?: (isEllipsis: boolean, args: CellRenderArgs) => boolean
  allowEnter?: boolean
}
export interface ValueParserParams<RecordType = DefaultRecordType, TValue = any> {
  newValue: TValue
  oldValue: TValue
  record: RecordType
  recordIndexs: number[]
  column: ColumnType<RecordType>
}
export interface EditableValueParams<RecordType = DefaultRecordType, TValue = any> {
  value: TValue
  record: RecordType
  recordIndexs: number[]
  column: ColumnType<RecordType>
}
export interface ValueParserFunc<T = any, TValue = any> {
  (params: ValueParserParams<T, TValue>): TValue | null | undefined
}
export interface ValueGetterFunc<T = any, TValue = any> {
  (params: EditableValueParams<T, TValue>): string | null | undefined
}
type CellEditorSlot = 'cellEditorSlot'
export type EditableTrigger = 'click' | 'dblClick' | 'contextmenu'
export interface ColumnType<RecordType = DefaultRecordType>
  extends ColumnSharedType,
    Omit<
      ProFormItemType,
      | 'key'
      | 'originKey'
      | 'tooltip'
      | 'hidden'
      | 'grid'
      | 'title'
      | 'spaceProps'
      | 'children'
      | 'width'
      | 'ignoreWidth'
      | 'name'
      | 'originName'
      | 'rowProps'
      | 'colProps'
      | 'valueEnum'
    > {
  // search?:
  //   | boolean
  //   | Omit<
  //       ProFormItemType,
  //       | 'key'
  //       | 'originKey'
  //       | 'tooltip'
  //       | 'hidden'
  //       | 'grid'
  //       | 'title'
  //       | 'spaceProps'
  //       | 'children'
  //       | 'width'
  //       | 'ignoreWidth'
  //       | 'name'
  //       | 'originName'
  //       | 'rowProps'
  //       | 'colProps'
  //       | 'valueEnum'
  //     >
  colSpan?: number
  dataIndex?: DataIndex
  key?: Key
  rowSpan?: number
  width?: number
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  flex?: number
  autoHeight?: boolean
  tooltip?: true | CellTooltip
  headerTooltip?: string | true
  hidden?: boolean
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
        compare?: CompareFn<RecordType>
        /** Config multiple sorter order priority */
        multiple?: number
      }
  showCellPopover?: boolean | PopoverProps
  sortOrder?: SortOrder
  defaultSortOrder?: SortOrder
  sortDirections?: SortOrder[]
  showSorterTooltip?: boolean | TooltipProps
  filtered?: boolean
  filters?: ColumnFilterItem[]
  filterIcon?: ({ filtered }: { filtered: boolean }) => any
  filterDropdown?: (props: FilterDropdownProps) => any
  filterMultiple?: boolean
  filteredValue?: FilterValue | null
  defaultFilteredValue?: FilterValue | null
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean
  showFilter?: boolean
  showMenu?: boolean | 'hover'
  /** @deprecated Please use `filterDropdownOpen` instead */
  filterDropdownVisible?: boolean
  /** @deprecated Please use `onFilterDropdownOpenChange` instead */
  onFilterDropdownVisibleChange?: (open: boolean) => void
  filterDropdownOpen?: boolean
  onFilterDropdownOpenChange?: (open: boolean) => void
  customFilterDropdown?: boolean
  getPopupContainer?: GetPopupContainer
  customCell?: (obj: {
    record: any
    rowIndex: number
    column: ColumnType<RecordType>
  }) => Record<string, any>
  customHeaderCell?: (column: ColumnType<RecordType>) => Record<string, any>
  customRender?: (opt: {
    value: any
    text: any
    record: RecordType
    index: number
    column: ColumnType<RecordType>
  }) => any | RenderedCell
  editable?:
    | boolean
    | CellEditorSlot
    | ((params: EditableValueParams<RecordType>) => boolean | CellEditorSlot)
  editableTrigger?: EditableTrigger | EditableTrigger[]
  valueParser?: ValueParserFunc<RecordType>
  valueGetter?: ValueGetterFunc<RecordType>
  valueSetter?: (params: ValueParserParams<RecordType>) => boolean | Promise<any>
  valueChange?: (e: Event, params: ValueParserParams<RecordType>) => void
  rowDrag?: boolean | ((arg: { record: RecordType; column: ColumnType<RecordType> }) => boolean)
  drag?: boolean
  /** @deprecated Please use `v-slot:customFilterIcon` `v-slot:bodyCell` `v-slot:headerCell` instead */
  slots?: {
    filterIcon?: string
    filterDropdown?: string
    customRender?: string
    title?: string
  }
  valueEnum?: ((row: RecordType) => Record<string, ValueEnumType>) | Record<string, ValueEnumType>
  valueStatus?: ((value: any, row: RecordType) => ValueStatus) | ValueStatus
  renderText?: (text: any, record: RecordType, rowIndex: number) => string | number
  /** @name 列设置的 disabled */
  disable?:
    | boolean
    | {
        checkbox: boolean
      }
  /** @name 在 table 中隐藏 */
  hideInTable?: boolean

  /** @name 在 search 中隐藏 */
  hideInSearch?: boolean

  /** @name 不在配置工具中显示 */
  hideInSetting?: boolean

  children?: ColumnType<RecordType>[]
}
export interface ColumnGroupType<RecordType = DefaultRecordType> extends ColumnType<RecordType> {
  children?: ColumnsType<RecordType>
}
export type ColumnsType<RecordType = DefaultRecordType> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[]
export interface FinallyColumnType<RecordType = DefaultRecordType> extends ColumnType<RecordType> {
  finallyWidth?: number
  rowSpan?: number
  height?: number
  left?: number
  top?: number
  type?: 'checkbox' | 'expand' | 'rowIndex' | 'draggable'
  columnKey: Key
  columnIndex: number
  children?: FinallyColumnType<RecordType>[]
  originColumn?: ColumnsType[number]
  __Internal__Column__?: boolean
  showTitle: boolean
  fixed?: 'left' | 'right'
}
type CellInfo = {
  columnKey: Key
  rowKey: Key
}
export interface TableExposeType {
  scrollTo: (pos: string | Position, behavior: 'auto' | 'smooth') => void
  scrollLeft?: Ref<number>
  scrollTop?: Ref<number>
  bodyRef?: ComputedRef<HTMLDivElement>
  getSelectedRange: () => SelectedRangeItem[]
  clearAllSelectedRange: () => void
  clearDataSource: () => void
  copySelectedRange: () => void
  appendCellToSelectedRange: (cell: AppendCellRange) => void
  openEditor: (cellInfos: CellInfo[]) => void
  closeEditor: (cellInfos?: CellInfo[]) => void
  reload: (resetPageIndex?: boolean) => Promise<void>
  reset: () => void
}
export interface DragRowsHandleInfo {
  y: number
  top: number
  height: number
  rowKey: Key
  centerY: number
  record: DefaultRecordType
  indexs: number[]
}
export interface DragColumnHandleInfo {
  x: number
  left: number
  width: number
  columnKey: Key
  centerX: number
  indexs: number[]
}
export interface DragRowEventInfo {
  top: number
  height: number
  dir: typeof DOWN | typeof UP
  rowKey: Key
  record: DefaultRecordType
  event: MouseEvent | Touch
  column: ColumnType
  preTargetInfo: DragRowsHandleInfo | null
  nextTargetInfo: DragRowsHandleInfo | null
  fromIndexs: number[]
  insertToRowKey: Key
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
export interface DragColumnEventInfo {
  event: MouseEvent | Touch
  column: ColumnType
  targetColumn: ColumnType
  dir: typeof LEFT | typeof RIGHT
}
export interface ColumnDragGhostArg<ColumnT> {
  column: ColumnT
  icon: VNode
  allowed: boolean
  dragging: boolean
  event: MouseEvent | Touch
  targetColumn: ColumnT
}

export type DensitySize = 'small' | 'middle' | 'large' | undefined
export type Request<T = DefaultRecordType, U = Record<string, any>> = (
  params: U & {
    pageSize?: number
    current?: number
    keyword?: string
  },
  sorters?: SorterResult<T>[],
  filter?: Record<string, (string | number)[] | null>,
) => Promise<Partial<RequestData<T>>>

export type RequestData<T = DefaultRecordType> = {
  data: T[] | undefined
  success?: boolean
  total?: number
} & Record<string, any>

export type OptionsFunctionType = (e: any, action?: UseFetchDataAction<any>) => void
export type OptionsType = OptionsFunctionType | boolean

export type SettingOptionType = {
  draggable?: boolean
  checkable?: boolean
  checkedReset?: boolean
  listsHeight?: number
}

export type OptionSearchProps = Omit<InputProps, 'onSearch'> & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (keyword: string) => Promise<boolean | undefined> | boolean | undefined
}

export type OptionConfig = {
  density?: boolean
  filter?: boolean
  fullScreen?: OptionsType
  reload?: OptionsType
  setting?: boolean | SettingOptionType
  search?: (OptionSearchProps & { name?: string }) | boolean
}

export type ValueEnumType = {
  text: string | number
  label?: string | number
  status?: string
  color?: string
  disabled?: boolean
  value?: string | number | boolean
  children?: ValueEnumType[]
}

export type ColumnsState = {
  show?: boolean
  fixed?: true | 'right' | 'left' | undefined
  order?: number
  width?: number
  disable?:
    | boolean
    | {
        checkbox: boolean
      }
}

export type ColumnStateType = {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   *
   * @param localStorage 设置在关闭浏览器后也是存在的
   * @param sessionStorage 关闭浏览器后会丢失
   */
  persistenceType?: 'localStorage' | 'sessionStorage'
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string
  /** ColumnsState 的值 */
  defaultValue?: Record<string, ColumnsState>
  /** ColumnsState 的值 */
  value?: Record<string, ColumnsState>
  onChange?: (map: Record<string, ColumnsState>) => void
}

export type SearchConfig = ProQueryFilterProps & {
  cardProps?: CardProps | false
  tabName?: string
  style?: CSSProperties
}

export type BorderedType = 'search' | 'table'

export type Bordered =
  | boolean
  | {
      search?: boolean
      table?: boolean
    }
