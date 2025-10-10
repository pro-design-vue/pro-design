<!--
 * @Author: shen
 * @Date: 2023-11-01 09:29:27
 * @LastEditors: shen
 * @LastEditTime: 2025-10-10 09:13:26
 * @Description:
-->
<script lang="ts">
import type { WatchStopHandle } from 'vue'
import {
  computed,
  defineComponent,
  shallowRef,
  ref,
  watchEffect,
  inject,
  watch,
  toRaw,
  triggerRef,
  onActivated,
  isReactive,
  toRef,
} from 'vue'
import { Spin, Pagination } from 'ant-design-vue'
import { animateRows as globalAnimateRows } from './config'
import { baseTableProps } from './interface'
import { DOWN, LEFT, UP } from './Drag/constant'
import { addNestItemData, deleteNestItemData } from '../utils/util'
import { useEditProvider } from '../hooks/useEdit'
import { useProvidePopup } from './context/PopupContext'
import { useHScrollSyncProvide } from '../hooks/useHScrollSync'
import { useVScrollSyncProvide } from '../hooks/useVScrollSync'
import { useProvideTable } from './context/TableContext'
import { useProvideRangeStore } from '../hooks/useRangeStore'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { resize } from '@pro-design-vue/directives'
import { omit, debounce, isPromise } from '@pro-design-vue/utils'
import useKVMap from '../hooks/useKVMap'
import useLicense from '../hooks/useLicense'
import devWarning from '../utils/devWarning'
import eagerComputed from '../utils/eagerComputed'
import getScrollBarSize from '../utils/getScrollBarSize'
import useColumns from '../hooks/useColumns'
import useSorter from '../hooks/useSorter'
import useFilter from '../hooks/useFilter'
import useCal from '../hooks/useCal'
import useFlattenRecords from '../hooks/useFlattenRecords'
import useSelection from '../hooks/useRowSelection'
import usePagination, { getPaginationParam } from '../hooks/usePagination'
import raf from '../utils/raf'
import easeoutScroll from '../utils/easeoutScroll'
import useData from '../hooks/useData'
import supportSticky from '../utils/supportSticky'
import classNames from '../utils/classNames'
import useCellProps from '../hooks/useCellProps'
import KeyCode from '../utils/KeyCode'
import TableSlotsContextProvider from './context/TableSlotsContext'
import MeasureWidth from './MeasureWidth.vue'
import PopupContainer from './PopupContainer.vue'
import AutoHeightHeader from './AutoHeightHeader/Header.vue'
import Header from './Header/Header.vue'
import Body from './Body/Body.vue'

import type { SpinProps } from 'ant-design-vue/es/spin'
import type {
  GetRowKey,
  Key,
  SorterResult,
  TableLocale,
  ColumnType,
  ResizeActionType,
  DragRowEventInfo,
  DragColumnEventInfo,
  DefaultRecordType,
  TableAction,
} from './interface'
import type { CustomSlotsType } from '../utils/type'
import type { RangeCell } from '../hooks/RangeInterface'
import type { SortState } from '../hooks/useSorter'
import type { FilterState } from '../hooks/useFilter'
import type { ContextSlots } from './context/TableSlotsContext'
import { DEFAULT_LOCALE } from '@pro-design-vue/constants'

export type FilterValue = (Key | boolean)[]
export interface ChangeEventInfo<RecordType> {
  pagination: {
    current?: number
    pageSize?: number
    total?: number
  }
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[]
  filterStates: FilterState<RecordType>[]
  sorterStates: SortState<RecordType>[]
  currentDataSource: RecordType[]
  action: TableAction
}
const EMPTY_LIST: any[] = []

export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  directives: { resize },
  components: {
    TableSlotsContextProvider,
    Spin,
    MeasureWidth,
    Pagination,
    PopupContainer,
    AutoHeightHeader,
    ProHeader: Header,
    ProBody: Body,
  },
  props: baseTableProps(),
  emits: [
    'update:pagination',
    'scroll',
    'update:selectedRowKeys',
    'update:expandedRowKeys',
    'update:columns',
    'update:sorter',
    'update:filters',
    'expand',
    'expandedRowsChange',
    'resizeColumn',
    'update:dataSource',
    'cellKeydown',
  ],
  slots: {} as CustomSlotsType<ContextSlots>,
  setup(props, { expose, emit, slots }) {
    const rowKey = computed(() => props.rowKey ?? 'id')
    const popupContainer = shallowRef<any>(null)
    const customUiCls = usePrefixCls('custom-ui')

    const { editCellKeys, openEditor, closeEditor } = useEditProvider()

    useProvidePopup()

    const getPopupContainer = computed(() => props.getPopupContainer!)
    const { status, watermarkMsg } = useLicense()

    const dragRowsHandle = new Map<Key, Set<HTMLSpanElement>>()
    const draggingRowKey = ref<Key | null>(null)
    const insertToRowKey = ref<Key | null>(null)
    const dragColumnsHandle = new Map<Key, Set<HTMLDivElement>>()
    const draggingColumnKey = ref<Key>('')
    const latestRangeStartCell = shallowRef<RangeCell | null>(null)
    const mergedSummaryFixed = computed(() =>
      props.summaryFixed === true || props.summaryFixed === ('' as any)
        ? 'bottom'
        : props.summaryFixed,
    )
    const realHeaderHeight = ref(0)

    watchEffect(() => {
      devWarning(
        !(typeof rowKey.value == 'function' && rowKey.value.length > 1),
        'table',
        '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
      )
    })

    const localeData: any = inject('localeData', {
      antLocale: {
        Table: {
          triggerDesc: 'Click to sort descending',
          triggerAsc: 'Click to sort ascending',
          cancelSort: 'Click to cancel sorting',
        },
      },
    })

    const locale = computed<TableLocale>(() => {
      const antLocale = localeData?.antLocale || {}
      return {
        ...(antLocale.locale === DEFAULT_LOCALE.toLocaleLowerCase()
          ? {
              triggerDesc: '\u70B9\u51FB\u964D\u5E8F',
              triggerAsc: '\u70B9\u51FB\u5347\u5E8F',
              cancelSort: '\u53D6\u6D88\u6392\u5E8F',
            }
          : {}),
        ...(antLocale.Table || {}),
        ...(props.locale || {}),
      }
    })

    const scrollTop = ref(0)
    const scrollLeft = ref(0)
    const rootRef = ref<HTMLDivElement>()
    const bodyWidth = ref(0)
    const bodyHeight = ref(0)
    const measureWidthRef = shallowRef<HTMLDivElement>()

    const mergedScrollX = eagerComputed(() => props.scrollX ?? props.scroll?.x)
    const mergedScrollY = eagerComputed(() => props.scroll?.y ?? props.height ?? props.maxHeight)
    const bodyScrollWidth = ref(typeof mergedScrollX.value == 'number' ? mergedScrollX.value : 0)

    watch(mergedScrollX, () => {
      bodyScrollWidth.value = typeof mergedScrollX.value == 'number' ? mergedScrollX.value : 0
    })

    const virtual = eagerComputed<boolean>(() => !(props.virtual === false || !mergedScrollY.value))
    const xVirtual = eagerComputed<boolean>(
      () => props.xVirtual || (props.virtual !== false && props.xVirtual !== false),
    )

    const getRowKey = computed<GetRowKey>(() =>
      typeof rowKey.value == 'function'
        ? rowKey.value
        : (record: Record<string, any>) => {
            return record?.[rowKey.value as string]
          },
    )

    const rawData = shallowRef<DefaultRecordType[]>([])
    const rawColumns = shallowRef<ColumnType[]>([])

    let dataSourceWatchStopHandle: WatchStopHandle
    let columnsWatchStopHandle: WatchStopHandle
    watch(
      () => props.deepWatchDataSource,
      () => {
        dataSourceWatchStopHandle && dataSourceWatchStopHandle()
        dataSourceWatchStopHandle = watch(
          () => props.dataSource,
          () => {
            rawData.value = toRaw(props.dataSource) || EMPTY_LIST
            triggerRef(rawData)
          },
          { immediate: true, deep: !!props.deepWatchDataSource },
        )
      },
      { immediate: true, deep: true },
    )

    watch(
      () => props.deepWatchColumns,
      () => {
        columnsWatchStopHandle && columnsWatchStopHandle()
        columnsWatchStopHandle = watch(
          () => props.columns,
          () => {
            rawColumns.value = toRaw(props.columns) || EMPTY_LIST
            triggerRef(rawColumns)
          },
          { immediate: true, deep: true },
        )
      },
      { immediate: true, deep: !!props.deepWatchColumns },
    )

    const childrenColumnName = computed(() => props.childrenColumnName || 'children')

    const { getRecordByKey, getIndexsByKey, getKeyByIndexs, allDataRowKeys, allDataRootRowKeys } =
      useKVMap(rawData, childrenColumnName, getRowKey)

    const defaultExpandedRowKeys = shallowRef<Key[]>([])
    watchEffect(() => {
      props.defaultExpandedRowKeys && (defaultExpandedRowKeys.value = props.defaultExpandedRowKeys)
      props.defaultExpandAllRows && (defaultExpandedRowKeys.value = allDataRowKeys.value)
    })

    const mergedRowSelection = computed(() => {
      const rowSelection = props.rowSelection || {}
      const { checkStrictly = true } = rowSelection
      return { ...rowSelection, checkStrictly }
    })

    const expandedRowKeys = computed(
      () => new Set(props.expandedRowKeys || defaultExpandedRowKeys.value || []),
    )

    const spinProps = computed<SpinProps>(() => {
      if (typeof props.loading === 'boolean') {
        return { spinning: props.loading }
      } else if (typeof props.loading === 'object') {
        return { spinning: true, ...props.loading }
      } else {
        return { spinning: false }
      }
    })

    onActivated(() => {
      scrollTo({ left: 0, top: 0 })
    })

    let triggerOnChange: any = () => {}

    const scrollBarSize = shallowRef(getScrollBarSize())
    const baseHeight = computed(() =>
      props.size === 'small' ? 39 : props.size === 'middle' ? 47 : 55,
    )
    const expandedRowRender = computed(() => props.expandedRowRender)
    const expandType = eagerComputed(() =>
      rawData.value.some((column) => column?.[childrenColumnName.value])
        ? 'nest'
        : expandedRowRender.value
          ? 'row'
          : null,
    )
    const expandable = eagerComputed(() => !!props.expandedRowRender)

    const columns = useColumns({
      props,
      rawColumns,
      bodyScrollWidth,
      baseHeight,
      measureWidthRef,
      expandable,
      expandType,
      scrollLeft,
      bodyWidth,
      xVirtual,
      draggingColumnKey,
      latestRangeStartCell,
    })

    const { sortedData, sorterStates, sorter, changeSorter } = useSorter(
      props,
      rawData,
      columns.allColumns,
      (sorter, sorterStates) => {
        scrollTop.value > bodyHeight.value && updateAnimate()
        triggerOnChange({ sorter, sorterStates }, 'sort', false)
      },
    )

    const { filterData, filterStates, filters, changeFilter } = useFilter(
      props,
      sortedData,
      columns.allColumns,
      (filters, filterStates) => {
        triggerOnChange({ filters, filterStates }, 'filter', true)
      },
    )

    const total = eagerComputed(() => filterData.value.length)
    const paginationParam = computed(() => {
      if (props.pagination === false) {
        return {}
      }
      return getPaginationParam(props.pagination, mergedPagination.value)
    })

    const triggeronPaginationChange = (current: number, pageSize: number) => {
      const pagination = { ...paginationParam.value, current, pageSize }
      props['onUpdate:pagination'] &&
        emit(
          'update:pagination',
          isReactive(props.pagination)
            ? Object.assign(props.pagination || {}, pagination)
            : pagination,
        )
    }

    const {
      mergedPagination,
      pos,
      refreshPagination,
      onChange: onPaginationChange,
      onShowSizeChange,
      pageData,
    } = usePagination(total, props, filterData, (current, pageSize) => {
      const pagination = { ...paginationParam.value, current, pageSize }
      triggeronPaginationChange(current, pageSize)
      updateAnimate()
      triggerOnChange({ pagination }, 'paginate')
    })

    const {
      flattenData,
      keyEntities,
      pageDataRowKeys,
      pageDataEnableRowKeys,
      checkboxPropsMap,
      getRowFlattenIndexByKey,
      isMyChildren,
      getRowByFlattenIndex,
    } = useFlattenRecords(
      pageData,
      childrenColumnName,
      expandedRowKeys,
      getRowKey,
      expandType,
      mergedRowSelection,
    )

    const cal = useCal(props, flattenData, bodyHeight, scrollTop, virtual, keyEntities)

    const { rowPosition, viewportHeight, startIndex, endIndex } = cal
    const { leftWidth, rightWidth, centerWidth, bodyMaxWidth } = columns

    const selection = useSelection(props, mergedRowSelection, rawData, {
      prefixCls: computed(() => props.prefixCls!),
      pageData,
      getRowKey,
      getRecordByKey,
      childrenColumnName,
      locale,
      flattenData,
      keyEntities,
      checkboxPropsMap,
      allDataRowKeys,
      allDataRootRowKeys,
      pageDataRowKeys,
      pageDataEnableRowKeys,
    })

    const bodyRef = ref<HTMLDivElement>()
    let leftRaf: any, topRaf: any

    const scrollTo = (options: any = {}, type = 'auto', isAnimate = false) => {
      if (!isAnimate) {
        updateAnimate()
      }
      const mergeOptions = typeof options == 'number' ? { top: options } : options
      let left, top
      if ('left' in mergeOptions) {
        left = mergeOptions.left || 0
      } else if ('columnIndex' in mergeOptions) {
        const position = columns.getColumnPosition(mergeOptions.columnIndex!)
        if (position) {
          left = position.left - leftWidth.value
        }
      } else if ('columnKey' in mergeOptions) {
        const position = columns.getColumnPositionByKey(mergeOptions.columnKey!)
        if (position) {
          left = position.left - leftWidth.value
        }
      }
      if ('top' in mergeOptions) {
        top = Math.min(Math.max(mergeOptions.top || 0, 0), maxScrollTop.value)
      } else if ('rowKey' in mergeOptions) {
        const pos = cal.getRowPositionByKey(mergeOptions.rowKey!)
        if (pos) {
          top = pos
        }
      }

      left = Math.max(Math.min(maxScrollLeft.value, left || 0), 0)
      if (!showVerticalScrollbar.value) {
        top = 0
      }
      if (type === 'smooth') {
        if (left !== undefined) {
          raf.cancel(leftRaf)
          leftRaf = easeoutScroll(scrollLeft.value, left, (val: number) => {
            scrollLeft.value = val
          })
        }
        if (top !== undefined) {
          raf.cancel(topRaf)
          topRaf = easeoutScroll(scrollTop.value, top, (val: number) => {
            scrollTop.value = val
          })
        }
      } else {
        if (left !== undefined) {
          scrollLeft.value = left
        }
        if (top !== undefined) {
          scrollTop.value = top
        }
      }
    }

    const useAnimate = ref(false)
    const animateRows = computed(() => {
      return !!(props.animateRows ?? globalAnimateRows.value)
    })

    let timer: any
    watch(
      animateRows,
      (newVal) => {
        useAnimate.value = newVal
      },
      { immediate: true },
    )

    const updateAnimate = () => {
      useAnimate.value = false
      clearTimeout(timer)
      timer = setTimeout(() => {
        useAnimate.value = animateRows.value
      }, 100)
    }

    const maxScrollLeft = computed(() => bodyMaxWidth.value - bodyWidth.value)
    const maxScrollTop = computed(() => viewportHeight.value - bodyHeight.value)
    const onScroll = (e) => {
      emit('scroll', e)
    }

    useHScrollSyncProvide({ scrollLeft, maxScrollLeft, onScroll, bodyWidth })
    useVScrollSyncProvide({ scrollTop, maxScrollTop, onScroll, updateAnimate, bodyWidth })

    const { data, pos: dataRowPosition } = useData(
      props,
      rowPosition,
      flattenData,
      startIndex,
      endIndex,
      draggingRowKey,
      useAnimate,
      getRowFlattenIndexByKey,
      latestRangeStartCell,
    )

    const pingedLeft = ref(false)
    const pingedRight = ref(false)
    const noPinged = ref(false)

    watchEffect(() => {
      pingedLeft.value = supportSticky && !!scrollLeft.value
      pingedRight.value =
        supportSticky &&
        centerWidth.value - (bodyWidth.value - leftWidth.value - rightWidth.value) >
          scrollLeft.value
      noPinged.value = !pingedLeft.value && !pingedRight.value
    })

    const rootClass = computed(() =>
      classNames({
        [`${props.prefixCls}`]: true,
        [`${props.prefixCls}-support-sticky`]: supportSticky,
        [`${props.prefixCls}-stripe`]: props.stripe,
        [`${props.prefixCls}-bordered`]: props.bordered,
        [`${props.prefixCls}-${props.size}`]: true,
        [`${props.prefixCls}-ping-left`]: pingedLeft.value,
        [`${props.prefixCls}-ping-right`]: pingedRight.value,
        [`${props.prefixCls}-no-ping`]: noPinged.value,
        [`${props.prefixCls}-has-animate`]: animateRows.value,
      }),
    )
    const rootStyle = computed(() => ({
      height: typeof props.height == 'number' ? `${props.height}px` : props.height,
      maxHeight: typeof props.maxHeight == 'number' ? `${props.maxHeight}px` : props.maxHeight,
      minHeight: typeof props.minHeight == 'number' ? `${props.minHeight}px` : props.minHeight,
    }))

    const showHorizontalScrollbar = ref(false)
    const debounceFn = debounce(() => {
      showHorizontalScrollbar.value = bodyMaxWidth.value > bodyWidth.value
      if (bodyWidth.value > bodyScrollWidth.value) {
        bodyScrollWidth.value = bodyWidth.value
      }
    }, 100)

    watch([bodyMaxWidth, bodyWidth], () => {
      debounceFn()
    })

    const showVerticalScrollbar = eagerComputed(
      () => !!mergedScrollY.value && bodyHeight.value + 0.9 < viewportHeight.value,
    )
    const scrollToFirstRow = eagerComputed(
      () => !props.scroll || (props.scroll && props.scroll.scrollToFirstRowOnChange !== false),
    )

    triggerOnChange = (
      info: Partial<ChangeEventInfo<DefaultRecordType>>,
      action: TableAction,
      reset = false,
    ) => {
      if (reset) {
        refreshPagination()
        triggeronPaginationChange(1, mergedPagination.value.pageSize!)
        if (props.pagination) {
          props.pagination.onChange?.(1, mergedPagination.value.pageSize)
        }
      }
      if (scrollToFirstRow.value) {
        scrollTop.value = 0
      }
      props.onChange?.(
        info.pagination || mergedPagination.value,
        info.filters || filters.value,
        info.sorter || sorter.value,
        {
          currentDataSource: info.currentDataSource || filterData.value,
          action,
        },
      )
    }

    const paginationProps = computed(() => {
      return omit(mergedPagination.value, ['position', 'onChange', 'onShowSizeChange'])
    })

    const paginationClass = computed(() => {
      return {
        [`${props.prefixCls}-pagination`]: true,
        [`${props.prefixCls}-pagination-${pos.value.bottom}`]: true,
        [`${customUiCls}`]: true,
      }
    })
    const bottomPaginationHeight = ref(0)
    const bottomPaginationStyle = computed<any>(() => {
      if (!props.paginationSticky) {
        return {}
      }
      if (props.paginationSticky === true) {
        return { position: 'sticky', 'z-index': 9, bottom: '0px' }
      }
      return {
        position: 'sticky',
        'z-index': 9,
        bottom: `${props.paginationSticky?.offsetBottom ?? 0}px`,
      }
    })

    const indentSize = computed(() => (typeof props.indentSize == 'number' ? props.indentSize : 15))

    const cellProps = useCellProps({
      leftColumns: columns.leftColumns,
      rightColumns: columns.rightColumns,
      visibleCenterColumns: columns.visibleCenterColumns,
      allColumns: columns.allColumns,
      data,
      mergedRowHeights: cal.mergedRowHeights,
      startIndex,
      getColumnPosition: columns.getColumnPosition,
      bodyWidth,
      leftWidth,
      centerWidth,
      getRowHeight: cal.getRowHeight,
      customCell: toRef(props, 'customCell'),
    })

    watch(
      [realHeaderHeight, scrollLeft],
      () => {
        popupContainer.value?.alignPopup?.()
      },
      { flush: 'post' },
    )

    useProvideTable({
      ...cal,
      ...columns,
      ...cellProps,
      rootRef,
      rawData,
      getRowFlattenIndexByKey,
      prefixCls: computed(() => props.prefixCls!),
      draggingRowKey,
      insertToRowKey,
      status,
      useAnimate,
      animateRows,
      watermarkMsg,
      onResizeColumn: (w: number, col: ColumnType, action: ResizeActionType) => {
        const width = col.width
        const result = props.onResizeColumn?.(w, col, action)
        if (result !== false) {
          if (!(width === w && col.width === w)) {
            col.width = width !== col.width ? col.width : w
            triggerRef(rawColumns)
          }
          if (action === 'end') {
            emit('update:columns', rawColumns.value, 'resize')
          }
        }
      },
      onRowDragEnd: (opt: DragRowEventInfo) => {
        const { insertToRowKey, record, fromIndexs, rowKey, dir, preTargetInfo, nextTargetInfo } =
          opt
        const rawRecord = toRaw(record)
        const dragEnd = props.onRowDragEnd?.({ ...opt, record: rawRecord, fromIndexs })
        if (dragEnd === false) {
          return
        }

        const handler = () => {
          if (!isMyChildren(rowKey, preTargetInfo?.rowKey as Key) && insertToRowKey !== rowKey) {
            if (insertToRowKey !== null) {
              const parentRecord = getRecordByKey(insertToRowKey)
              if (
                insertToRowKey === preTargetInfo?.rowKey ||
                insertToRowKey === nextTargetInfo?.rowKey
              ) {
                if (dir === DOWN) {
                  addNestItemData(
                    parentRecord[childrenColumnName.value],
                    [],
                    childrenColumnName.value,
                    rawRecord,
                  )
                  deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
                } else {
                  deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
                  addNestItemData(
                    parentRecord[childrenColumnName.value],
                    [],
                    childrenColumnName.value,
                    rawRecord,
                  )
                }
              } else {
                if (dir === DOWN) {
                  addNestItemData(
                    rawData.value,
                    preTargetInfo?.indexs as number[],
                    childrenColumnName.value,
                    rawRecord,
                  )
                  deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
                } else {
                  deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
                  addNestItemData(
                    rawData.value,
                    preTargetInfo?.indexs as number[],
                    childrenColumnName.value,
                    rawRecord,
                  )
                }
              }
            } else {
              if (dir === DOWN && preTargetInfo) {
                addNestItemData(
                  rawData.value,
                  [preTargetInfo.indexs[0]!],
                  childrenColumnName.value,
                  rawRecord,
                )
                deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
              } else if (dir === UP && nextTargetInfo) {
                deleteNestItemData(rawData.value, fromIndexs, childrenColumnName.value)
                addNestItemData(
                  rawData.value,
                  preTargetInfo?.indexs ? [preTargetInfo!.indexs[0]!] : [],
                  childrenColumnName.value,
                  rawRecord,
                )
              }
            }
            triggerRef(rawData)
            emit('update:dataSource', rawData.value)
          }
        }
        if (isPromise(dragEnd)) {
          dragEnd
            .then(() => {
              handler()
            })
            .catch(() => {})
        } else {
          handler()
        }
      },
      virtual,
      xVirtual,
      dataRowPosition,
      rawColumns,
      bodyHeight,
      scrollTop,
      scrollLeft,
      supportSticky,
      childrenColumnName,
      bodyScrollWidth,
      baseHeight,
      startIndex,
      data,
      pageData,
      getRecordByKey,
      getIndexsByKey,
      expandType,
      flattenData,
      expandedRowKeys,
      indentSize,
      props,
      bodyWidth,
      scrollTo,
      scrollBarSize,
      leftWidth,
      rightWidth,
      centerWidth,
      showVerticalScrollbar,
      showHorizontalScrollbar,
      getRowKey,
      selection,
      updateSelectedRowKeys: (keys: Key[]) => {
        emit('update:selectedRowKeys', keys)
      },
      locale,
      sorterStates,
      changeSorter,
      changeFilter,
      filterStates,
      onTriggerExpand: (record, key: Key) => {
        let keys: Key[]
        const hasKey = expandedRowKeys.value.has(key)
        if (hasKey) {
          expandedRowKeys.value.delete(key)
          keys = [...expandedRowKeys.value]
        } else {
          keys = [...expandedRowKeys.value, key]
        }
        defaultExpandedRowKeys.value = keys
        emit('update:expandedRowKeys', keys)
        emit('expand', !hasKey, record)
        emit('expandedRowsChange', keys)
      },
      keyEntities,
      pageDataRowKeys,
      pageDataEnableRowKeys,
      checkboxPropsMap,
      mergedRowSelection,
      getPopupContainer,
      allDataRowKeys,
      allDataRootRowKeys,
      dragRowsHandle,
      isMyChildren,
      getKeyByIndexs,
      getRowByFlattenIndex,
      draggingColumnKey,
      dragColumnsHandle,
      onColumnDragEnd: (arg: DragColumnEventInfo) => {
        const { dir, column, targetColumn } = arg
        const dragEnd = props.onColumnDragEnd?.(arg)
        if (dragEnd === false) {
          return
        }

        const handler = () => {
          if (column === targetColumn || column.key === targetColumn.key) return
          const index = rawColumns.value.findIndex(
            (col) => col === column || col.key === column.key,
          )
          const targetIndex = rawColumns.value.findIndex(
            (col) => col === targetColumn || col.key === targetColumn.key,
          )
          if (dir === LEFT) {
            rawColumns.value.splice(index, 1)
            rawColumns.value.splice(targetIndex, 0, column)
          } else {
            rawColumns.value.splice(targetIndex + 1, 0, column)
            rawColumns.value.splice(index, 1)
          }
          triggerRef(rawColumns)
          emit('update:columns', rawColumns.value, 'drag')
        }

        if (isPromise(dragEnd)) {
          dragEnd
            .then(() => {
              handler()
            })
            .catch(() => {})
        } else {
          handler()
        }
      },
      onColumnDrag: () => {},
      columnDrag: computed(() => props.columnDrag),
      summaryFixed: mergedSummaryFixed,
      realHeaderHeight,
      bottomPaginationHeight,
      pos,
    })

    const tabGuardTopRef = ref()
    const tabGuardBottomRef = ref()

    const {
      navigationService,
      getSelectedRange,
      clearAllSelectedRange,
      copySelectedRange,
      appendCellToSelectedRange,
      onBodyKeydown,
    } = useProvideRangeStore({
      allColumns: columns.allColumns,
      flattenData,
      rangeSelection: computed(() => props.rangeSelection),
      getRowByFlattenIndex,
      rootRef,
      prefixCls: computed(() => props.prefixCls!),
      allCellProps: cellProps.allCellProps,
      tabGuardTopRef,
      tabGuardBottomRef,
      ensureCellColumnVisible: (cell: RangeCell) => {
        if (!cell.column || cell.column.fixed) return
        const sl = scrollLeft.value
        const pos = columns.getColumnPositionByKey(cell.column.columnKey)
        if (pos) {
          const { width, left } = pos
          const lw = leftWidth.value
          const rw = rightWidth.value
          left - lw < sl
            ? (scrollLeft.value = left - lw)
            : left + width > sl + bodyWidth.value - rw &&
              (scrollLeft.value = left + width - bodyWidth.value + rw)
        }
      },
      ensureCellRowVisible: (cell: RangeCell) => {
        const { rowIndex } = cell
        const st = scrollTop.value
        const row = getRowByFlattenIndex(rowIndex)
        const pos = cal.getRowPositionByKey(row.rowKey)
        const cprops =
          (cellProps.allCellProps.value[row.rowKey]?.[cell.column!.columnKey] || {}).props || {}
        const height = cal.getRowHeight(rowIndex, cprops.rowSpan)
        if (pos !== undefined) {
          updateAnimate()
          if (pos < st) {
            scrollTop.value = pos
          } else {
            if (pos + height > st + bodyHeight.value) {
              scrollTop.value = pos + height - bodyHeight.value
            }
          }
        }
      },
      latestRangeStartCell,
      bodyRef: computed(() => {
        return (bodyRef.value as any)?.bodyRef
      }),
      scrollLeft,
      scrollTop,
      scrollTo,
      showVerticalScrollbar,
      showHorizontalScrollbar,
      getIndexsByKey,
      formatRangeCellText: (parmas) => {
        if (props.formatRangeCellText) {
          return props.formatRangeCellText(parmas)
        } else if (parmas.value) {
          return parmas.value
        }
        return ''
      },
      editCellKeys,
      copyDelimiter: computed(() => props.copyDelimiter),
    })

    expose({
      scrollTo,
      scrollLeft,
      scrollTop,
      bodyRef: computed(() => {
        return (bodyRef.value as any)?.bodyRef
      }),
      getSelectedRange,
      clearAllSelectedRange,
      copySelectedRange,
      appendCellToSelectedRange,
      openEditor: (cellInfos: any[]) => {
        openEditor(cellInfos.map((info) => `${info.rowKey} ${info.columnKey}`))
      },
      closeEditor: (cellInfos: any[]) => {
        if (cellInfos) {
          closeEditor(cellInfos.map((info) => `${info.rowKey} ${info.columnKey}`))
        } else {
          closeEditor()
        }
      },
    })

    return {
      bodyRef,
      spinProps,
      rowPosition,
      viewportHeight,
      startIndex,
      data,
      watermarkMsg,
      rootStyle,
      rootClass,
      onBodyKeydown,
      watermarkStyle: computed<any>(() => ({
        minWidth: '100px!important',
        minHeight: '40px!important',
        position: 'absolute!important',
        fontSize: '20px!important',
        opacity: '0.8!important',
        bottom: '40px!important',
        right: '40px!important',
        pointerEvents: 'none',
        display: 'block!important',
        zIndex: '999999!important',
        color: '#000000!important',
        margin: '0px!important',
        padding: '0px!important',
        transform: 'unset!important',
      })),
      mergedPagination,
      pos,
      onPaginationChange,
      scrollBarSize,
      scrollTop,
      bodyScrollWidth,
      bodyWidth,
      scrollLeft,
      cal,
      selection,
      locale,
      paginationProps,
      slots,
      mergedScrollX,
      mergedScrollY,
      bodyHeight,
      measureWidthRef,
      flattenData,
      rootRef,
      mergedSummaryFixed,
      handleResize: (e: CustomEvent) => {
        realHeaderHeight.value = e.detail.height
      },
      handlePaginationResize: (e: CustomEvent) => {
        bottomPaginationHeight.value = e.detail.height
      },
      popupContainer,
      handleGuardTopKeydown: (e: KeyboardEvent) => {
        e.keyCode !== KeyCode.TAB ||
          e.shiftKey ||
          (navigationService.getFirstCellToFocus(e.shiftKey), e.preventDefault())
      },
      handleGuardBottomKeydown: (e: KeyboardEvent) => {
        e.keyCode === KeyCode.TAB &&
          e.shiftKey &&
          (navigationService.getLastCellToFocus(e.shiftKey), e.preventDefault())
      },
      tabGuardTopRef,
      tabGuardBottomRef,
      onShowSizeChange,
      customUiCls,
      paginationClass,
      bottomPaginationStyle,
    }
  },
})
</script>

<template>
  <TableSlotsContextProvider :value="{ ...slots }">
    <Spin v-bind="spinProps">
      <Pagination
        v-if="pos.top"
        :class="`${prefixCls}-pagination ${prefixCls}-pagination-${pos.top} ${customUiCls}`"
        v-bind="paginationProps"
        @change="onPaginationChange"
        @show-size-change="onShowSizeChange"
      />
      <div
        ref="tabGuardTopRef"
        role="presentation"
        tabindex="0"
        :style="{ position: 'absolute', width: '0', height: '0' }"
        @keydown="handleGuardTopKeydown"
      ></div>
      <div key="content" ref="ref" :class="rootClass" :style="rootStyle">
        <template v-if="showHeader">
          <AutoHeightHeader
            v-if="autoHeaderHeight"
            :prefix-cls="prefixCls"
            :sticky="sticky"
            @resizeheight="handleResize"
          />
          <ProHeader v-else :prefix-cls="prefixCls" :sticky="sticky" @resizeheight="handleResize" />
        </template>
        <ProBody
          ref="bodyRef"
          v-model:bodyScrollWidth="bodyScrollWidth"
          v-model:bodyWidth="bodyWidth"
          v-model:bodyHeight="bodyHeight"
          :prefix-cls="prefixCls"
          :wrap-text="wrapText"
          :scroll-x="mergedScrollX"
          :height="mergedScrollY"
          :summary-fixed="mergedSummaryFixed"
          :summary="$slots.summary"
          :empty-text="$slots.emptyText"
          @keydown="onBodyKeydown"
        />
      </div>
      <div
        ref="tabGuardBottomRef"
        role="presentation"
        tabindex="0"
        :style="{ position: 'absolute', width: '0', height: '0' }"
        @keydown="handleGuardBottomKeydown"
      ></div>
      <div v-if="$slots.footer" key="footer" :class="`${prefixCls}-footer`">
        <slot name="footer" />
      </div>
      <PopupContainer ref="popupContainer" :prefix-cls="prefixCls" />
      <div
        v-if="pos.bottom"
        v-resize:height
        :style="bottomPaginationStyle"
        :class="`${prefixCls}-pagination-wrap`"
        @resizeheight="handlePaginationResize"
      >
        <Pagination
          :class="paginationClass"
          v-bind="paginationProps"
          @change="onPaginationChange"
          @show-size-change="onShowSizeChange"
        />
      </div>
    </Spin>
    <MeasureWidth ref="measureWidthRef" />
  </TableSlotsContextProvider>
</template>
