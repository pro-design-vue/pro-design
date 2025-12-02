/*
 * @Author: shen
 * @Date: 2023-11-09 11:37:05
 * @LastEditors: shen
 * @LastEditTime: 2025-12-02 17:15:26
 * @Description:
 */
import type { RangeCell } from '../../hooks/RangeInterface'
import type { PropType, ExtractPropTypes, FunctionalComponent, VNode } from 'vue'
import type { FinallyColumnType, RowType } from '../interface'

import { withDirectives, createVNode, mergeProps, cloneVNode } from 'vue'
import { Badge, Tag } from 'ant-design-vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { useInjectLevel } from '../../hooks/useLevel'
import { isValidElement, ensureValidVNode } from '../../utils/util'
import { isEventSupported } from '../../utils/events'
import { isIOSUserAgent } from '../../utils/browser'
import { get, isObject, runFunction } from '@pro-design-vue/utils'
import { cellResize } from '@pro-design-vue/directives'
import { useProConfigInject } from '@pro-design-vue/components/config-provider'
import RowHandler from '../Drag/RowHandler.vue'
import BodyCellTooltip from './BodyCellTooltip'

const cellProps = {
  prefixCls: String as PropType<string>,
  rowIndex: { type: Number as PropType<number>, required: true },
  flattenRowIndex: { type: Number, required: true },
  rowKey: { type: [Number, String] },
  column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
  item: { type: Object as PropType<any>, default: () => ({}) },
  wrapText: { type: Boolean as PropType<boolean>, default: false },
  type: { type: String as PropType<RowType> },
  height: Number as PropType<number>,
  hasAppendNode: Boolean as PropType<boolean>,
  resizeObserver: { type: Object as PropType<ResizeObserver> },
  calMaxHeight: Function,
  tooltipOpen: Boolean as PropType<boolean>,
  getPopupContainer: Function as PropType<() => HTMLElement>,
  onCellLeave: Function,
  onClick: Function as PropType<(e: MouseEvent, cellPosition: RangeCell) => void>,
}

type CellProps = Partial<ExtractPropTypes<typeof cellProps>>
let lastClickTime = 0

const hasSupportedDblclick = () => {
  if (!isIOSUserAgent() || isEventSupported('dblclick')) return false
  const now = new Date().getTime()
  const is = now - lastClickTime < 200
  lastClickTime = now
  return is
}

const ValueStatusEnum = {
  success: '#03bf64',
  processing: '#315efb',
  error: '#e8353e',
  warning: '#eb8903',
}

const BodyCell: FunctionalComponent<CellProps> = (props, { slots, emit }) => {
  const { table } = useProConfigInject()
  const tableSlotsContext = useInjectSlots()
  const tableContext = useInjectTable()
  const { onBodyCellContextmenu } = useInjectBody()
  const level = useInjectLevel()
  const { prefixCls, column, wrapText, rowKey, item, rowIndex, hasAppendNode, tooltipOpen } = props
  const columnKey = column!.columnKey
  const valueEnum = runFunction(column?.valueEnum, props.item)
  const rowDrag =
    typeof column!.rowDrag == 'function'
      ? column!.rowDrag({ record: item, column: column!.originColumn! })
      : !!column!.rowDrag
  const isRowDrag = column!.rowDrag

  const sorterState = tableContext.sorterStates.value.find(({ key }) => key === columnKey)
  const sorterOrder = sorterState ? sorterState.sortOrder : null
  const sorterInfo = { columnKey, sorterState, sorterOrder }
  const key = `${props.rowKey} ${columnKey}`
  const value = column!.dataIndex
    ? column!.renderText
      ? column!.renderText(get(item, column!.dataIndex), item, rowIndex!)
      : get(item, column!.dataIndex)
    : undefined
  const valueStatus = runFunction(column?.valueStatus, value, props.item, valueEnum?.[value])
  const recordIndexs = tableContext.getIndexsByKey(rowKey!)

  const cellInnerClass = { [`${prefixCls}-cell-inner`]: true }
  const cellContentClass = {
    [`${prefixCls}-cell-content`]: true,
    [`${prefixCls}-cell-wrap-text`]: column!.wrapText === undefined ? wrapText : column!.wrapText,
    [`${prefixCls}-cell-text-ellipsis`]: !!column!.ellipsis,
  }

  const cellContentStyle = {
    textAlign: `${column!.align}`,
    color: valueStatus ? ValueStatusEnum[valueStatus] || valueStatus : undefined,
  }

  if (isObject(column!.ellipsis) && column!.ellipsis.line! > 1) {
    cellContentStyle['-webkit-box-orient'] = 'vertical'
    cellContentStyle['-webkit-line-clamp'] = column!.ellipsis.line!
    cellContentStyle['white-space'] = 'normal'
    cellContentStyle['display'] = '-webkit-box'
    cellContentStyle['padding'] = '0 16px'
  }

  const cellRender = tableContext.allCellProps.value?.[rowKey!]?.[column!.columnKey] || {}
  const cellProps: any = cellRender.props || {}
  const cellRowSpan = cellProps.rowSpan!

  const cellClass = {
    [`${prefixCls}-cell`]: true,
    [`${prefixCls}-first-cell`]: column!.columnIndex === 0,
    [`${prefixCls}-body-cell`]: true,
    [`${prefixCls}-cell-multi`]: cellRowSpan > 1,
    [`${prefixCls}-cell-hidden`]: cellRowSpan === 0,
    [`${prefixCls}-column-sort`]: sorterInfo.sorterOrder,
    [`${prefixCls}-with-append`]: hasAppendNode,
  }

  const cellRenderArgs: any = {
    record: item,
    column: column!.originColumn!,
    text: value,
    value,
    index: rowIndex!,
    recordIndexs: tableContext.getIndexsByKey(rowKey!),
    key,
    valueStatus,
    cancelEditable: tableContext.cancelEditable,
    startEditable: tableContext.startEditable,
    saveEditable: tableContext.saveEditable,
    isEditable: tableContext.isEditable,
  }

  let bodyCell: VNode[] = (recordIndexs && tableSlotsContext.bodyCell?.(cellRenderArgs)) || []

  const emptyText =
    tableContext.props.columnEmptyText !== false
      ? (tableContext.props.columnEmptyText ?? table?.value?.columnEmptyText ?? '-')
      : ''

  if (!ensureValidVNode(bodyCell)) {
    let cellValue
    if (cellRender.children) {
      cellValue = cellRender.children
    } else if (valueEnum) {
      const option = valueEnum[value]
      if (option && option.text) {
        if (option.status) {
          cellValue = createVNode(Badge, {
            status: option.status,
            text: option.text,
          })
        } else if (option.color) {
          cellValue = createVNode(
            Tag,
            {
              color: option.color,
              bordered: false,
            },
            () => option.text,
          )
        } else {
          cellValue = option.text
        }
      } else {
        cellValue = value === null || value === undefined || value === '' ? emptyText : value
      }
    } else {
      cellValue = value === null || value === undefined || value === '' ? emptyText : value
    }
    bodyCell = [
      (typeof cellValue === 'object' && isValidElement(cellValue)) || typeof cellValue !== 'object'
        ? cellValue
        : null,
    ]
  }

  const cellResizeValue = {
    resizeObserver: props.resizeObserver,
    calMaxHeight: props.calMaxHeight,
  }

  const tooltip = column!.tooltip
  const autoHeight = props.height === undefined && cellRowSpan === 1 && column?.autoHeight
  const altTitle =
    !column!.showTitle || (typeof value !== 'string' && typeof value !== 'number')
      ? undefined
      : value
  const tooltipStatus = !!tooltip && tooltipOpen

  const cellKeyProps = tableContext.props.ignoreCellKey ? {} : { key: key }

  let cellVNode = createVNode(
    'div',
    {
      class: cellInnerClass,
      style: cellProps?.style?.height ? '' : `height: ${props.height}px`,
      'data-cell-auto': autoHeight,
    },
    [
      createVNode(
        'div',
        mergeProps(
          {
            class: cellContentClass,
            style: cellContentStyle,
            title: altTitle,
          },
          cellKeyProps,
        ),
        [hasAppendNode ? slots.appendNode?.() : null, bodyCell],
      ),
    ],
  )
  cellVNode = autoHeight ? withDirectives(cellVNode, [[cellResize, cellResizeValue]]) : cellVNode
  let renderCellVNode: any = null
  let showTooltip = tooltipStatus
  if (tooltipStatus) {
    const tooltipProps = { ...(column!.tooltip === true ? {} : column!.tooltip) } as any
    if (tooltipProps.title) {
      tooltipProps.title = tooltipProps.title(cellRenderArgs)
      showTooltip = !(!tooltipProps.title && tooltipProps.title !== 0)
    } else {
      tooltipProps.title = value
      showTooltip = !(!tooltipProps.title && tooltipProps.title !== 0)
    }

    renderCellVNode = createVNode(
      BodyCellTooltip,
      {
        getPopupContainer: props.getPopupContainer,
        align: { offset: [0, 13] },
        tooltipProps,
        open: showTooltip,
        allowEnter: tooltipProps?.allowEnter,
        // shouldOpen:
        // 	!tooltipProps?.shouldOpen ||
        // 	(isEllipsis => {
        // 		return tooltipProps?.shouldOpen?.(isEllipsis, cellRenderArgs)
        // 	}),
        shouldOpen: (isEllipsis) => {
          return tooltipProps?.shouldOpen
            ? tooltipProps?.shouldOpen?.(isEllipsis, cellRenderArgs)
            : isEllipsis
        },
        onCellLeave: () => {
          emit('cellLeave')
        },
      },
      {
        default: () => [
          false !== tooltipProps.allowEnter
            ? cellVNode
            : cloneVNode(cellVNode, {
                onMouseleave: () => {
                  emit('cellLeave')
                },
              }),
        ],
        title: () => tableSlotsContext.tooltipTitle?.(cellRenderArgs),
      },
    )
  } else {
    renderCellVNode = cellVNode
  }

  return createVNode(
    'div',
    mergeProps(cellProps, {
      onMouseleave: () => {
        showTooltip || emit('cellLeave')
      },
      tabindex: '-1',
      role: 'cell',
      'data-column-key': columnKey,
      class: cellClass,
      onContextmenu: (e) => {
        if (tableContext.props.hasContextmenuPopup && 0 === e.button && e.ctrlKey) {
          e.preventDefault()
        } else {
          onBodyCellContextmenu(e, cellRenderArgs, props.type!)
          emit('contextmenu', e)
        }
      },
      onDblclick: (e: MouseEvent) => {
        emit('dblClick', e)
      },
      onClick: (e: MouseEvent) => {
        tableContext.props?.onCellClick?.(e, cellRenderArgs)
        if (hasSupportedDblclick()) {
          emit('dblclick', e)
          e.preventDefault()
          return
        }
        emit('click', e)
      },
      'data-level': level,
      'aria-selected': 'true',
    }),
    [
      isRowDrag
        ? createVNode(
            RowHandler,
            {
              disabled: !rowDrag,
              columnKey,
              column: column!.originColumn,
            },
            { label: () => bodyCell },
          )
        : null,
      renderCellVNode,
    ],
  )
}

BodyCell.props = cellProps
export default BodyCell
