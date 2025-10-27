/*
 * @Author: shen
 * @Date: 2023-11-09 11:37:05
 * @LastEditors: shen
 * @LastEditTime: 2025-10-27 13:27:19
 * @Description:
 */
import type { InnerKeydownPayload, RangeCell } from '../../hooks/RangeInterface'
import type { PropType, ExtractPropTypes, FunctionalComponent, VNode } from 'vue'
import type { FinallyColumnType, Key, RowType } from '../interface'

import { withDirectives, createVNode, mergeProps, cloneVNode } from 'vue'
import { Badge, Tag } from 'ant-design-vue'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectBody } from '../context/BodyContext'
import { useInjectRangeStore } from '../../hooks/useRangeStore'
import { useInjectLevel } from '../../hooks/useLevel'
import { isValidElement, ensureValidVNode } from '../../utils/util'
import { isEventSupported } from '../../utils/events'
import { isIOSUserAgent } from '../../utils/browser'
import { useEditInject } from '../../hooks/useEdit'
import { get, isObject, isPromise, runFunction } from '@pro-design-vue/utils'
import { cellResize } from '@pro-design-vue/directives'
import { useProConfigInject } from '@pro-design-vue/components/config-provider'
import RowHandler from '../Drag/RowHandler.vue'
import BodyCellTooltip from './BodyCellTooltip'
import EditInput from './EditInput.vue'

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
  editCellKeys: Array as PropType<string[]>,
  onOpenEditor: Function,
  onCloseEditor: Function,
  onMousedown: Function as PropType<(e: any, cellPosition: RangeCell) => void>,
  onMousemove: Function as PropType<(e: any, cellPosition: RangeCell) => void>,
  onKeydown: Function as PropType<(e: KeyboardEvent, payload: InnerKeydownPayload) => void>,
  onClick: Function as PropType<(e: MouseEvent, cellPosition: RangeCell) => void>,
}

type CellProps = Partial<ExtractPropTypes<typeof cellProps>>
let lastClickTime = 0

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
  const { getRangeCellClass } = useInjectRangeStore()
  const level = useInjectLevel()
  const { oldValuesMap } = useEditInject()
  const {
    prefixCls,
    column,
    wrapText,
    rowKey,
    item,
    rowIndex,
    hasAppendNode,
    tooltipOpen,
    editCellKeys,
  } = props

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
  const valueStatus = runFunction(column?.valueStatus, value, props.item)
  const recordIndexs = tableContext.getIndexsByKey(rowKey!)

  let customEditable = false
  let isEditing = editCellKeys?.includes(key)

  if (isEditing) {
    const editable =
      'function' == typeof column!.editable &&
      column!.editable({
        record: item,
        column: column!.originColumn!,
        recordIndexs,
        value,
      })
    customEditable = 'cellEditorSlot' === column!.editable || 'cellEditorSlot' === editable
    isEditing =
      isEditing &&
      ((customEditable && !!tableSlotsContext.cellEditor) ||
        true === column!.editable ||
        !!editable)
  }

  let { editableTrigger = ['dblClick'] } = column!
  editableTrigger = Array.isArray(editableTrigger) ? editableTrigger : [editableTrigger]

  const cellInnerClass = { [`${prefixCls}-cell-inner`]: true }
  const cellContentClass = {
    [`${prefixCls}-cell-content`]: true,
    [`${prefixCls}-cell-wrap-text`]: column!.wrapText === undefined ? wrapText : column!.wrapText,
    [`${prefixCls}-cell-text-ellipsis`]: !!column!.ellipsis,
  }

  const cellContentStyle = {
    textAlign: `${column!.align}`,
    color: valueStatus ? ValueStatusEnum[valueStatus] || 'valueStatus' : undefined,
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

  const cellPosition = { rowIndex: props.flattenRowIndex, rowPinned: null, column: column }

  const cellClass = {
    [`${prefixCls}-cell`]: true,
    [`${prefixCls}-body-cell`]: true,
    [`${prefixCls}-cell-multi`]: cellRowSpan > 1,
    [`${prefixCls}-cell-hidden`]: cellRowSpan === 0,
    [`${prefixCls}-column-sort`]: sorterInfo.sorterOrder,
    [`${prefixCls}-with-append`]: hasAppendNode,
    [`${prefixCls}-cell-inline-edit`]: isEditing,
    [getRangeCellClass(cellPosition)]: true,
  }

  const openEditor = () => {
    const oldValue =
      props.column?.valueGetter?.({
        value,
        record: item,
        column: column!,
        recordIndexs: recordIndexs,
      }) ?? value
    const beforeOpen = tableContext.props?.onBeforeOpenEditor?.(cellRenderArgs)
    if (isPromise(beforeOpen)) {
      beforeOpen.then((res) => {
        if (res) {
          emit('openEditor', key, { [key]: oldValue })
          tableContext.props?.onOpenEditor?.(cellRenderArgs)
        }
      })
    } else {
      if (false !== beforeOpen) {
        emit('openEditor', key, { [key]: oldValue })
        tableContext.props?.onOpenEditor?.(cellRenderArgs)
      }
    }
  }

  const closeEditor = (currentKey?: Key) => {
    const beforeClose = tableContext.props?.onBeforeCloseEditor?.({
      ...cellRenderArgs,
      oldValue: oldValuesMap.value[key],
    })
    if (isPromise(beforeClose)) {
      beforeClose.then((res) => {
        if (res) {
          emit('closeEditor', currentKey ?? key)
          tableContext.props?.onCloseEditor?.({
            ...cellRenderArgs,
            oldValue: oldValuesMap.value[key],
          })
        }
      })
    } else {
      if (false !== beforeClose) {
        emit('closeEditor', currentKey ?? key)
        tableContext.props?.onCloseEditor?.({
          ...cellRenderArgs,
          oldValue: oldValuesMap.value[key],
        })
      }
    }
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
    openEditor,
    closeEditor,
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
          cellValue = option.text ?? emptyText
        }
      } else {
        cellValue = emptyText
      }
    } else {
      // cellValue = value !== null || value !== undefined || value !== '' ? value : emptyText
      cellValue = value ?? emptyText
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
            : true
          // : isEllipsis
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

  const onDblclick = () => {
    editableTrigger.includes('dblClick') && openEditor()
  }

  const editInputRender = isEditing
    ? createVNode(
        EditInput,
        {
          prefixCls,
          recordIndexs,
          rowKey,
          cellKey: key,
          column: column,
          record: item,
          onCloseEditor: closeEditor,
          value,
          customEditable,
          getPopupContainer: props.getPopupContainer,
          multiple: editCellKeys!.length > 1,
          autoHeight,
        },
        null,
      )
    : null

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
        if (
          (tableContext.props.hasContextmenuPopup || tableContext.props.rangeSelection) &&
          0 === e.button &&
          e.ctrlKey
        ) {
          e.preventDefault()
        } else {
          onBodyCellContextmenu(e, cellRenderArgs, props.type!)
          editableTrigger.includes('contextmenu') && openEditor()
        }
      },
      onDblclick,
      onClick: (e: MouseEvent) => {
        tableContext.props?.onCellClick?.(e, cellRenderArgs)
        if (
          (() => {
            if (!isIOSUserAgent() || isEventSupported('dblclick')) return false
            const now = new Date().getTime()
            const is = now - lastClickTime < 200
            lastClickTime = now
            return is
          })()
        ) {
          onDblclick()
          e.preventDefault()
          return
        }
        emit('click', e, cellPosition)
        editableTrigger.includes('click') && openEditor()
      },
      onMousedown: (e: any) => {
        emit('mousedown', e, cellPosition)
      },
      onMousemove: (e: any) => {
        emit('mousemove', e, cellPosition)
      },
      onKeydown: (e: KeyboardEvent) => {
        emit('keydown', e, { cellPosition, isEditing })
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
      autoHeight && editInputRender
        ? createVNode(
            'label',
            {
              class: `${prefixCls}-cell-edit-wrapper`,
              onMousedown: (e) => e.stopPropagation(),
            },
            [withDirectives(editInputRender, [[cellResize, cellResizeValue]])],
          )
        : editInputRender
          ? createVNode(
              'label',
              {
                class: `${prefixCls}-cell-edit-wrapper`,
                onMousedown: (e) => e.stopPropagation(),
              },
              [editInputRender],
            )
          : null,
    ],
  )
}

BodyCell.props = cellProps
export default BodyCell
