/*
 * @Author: shen
 * @Date: 2023-11-09 13:11:23
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 09:24:13
 * @Description:
 */
import type { InnerKeydownPayload } from './RangeInterface'

import { useInjectTable } from '../components/context/TableContext'
import { useInjectRangeStore } from './useRangeStore'
import KeyCode from '../utils/KeyCode'

export const useCellKeyboard = () => {
  const {
    enableRangeSelection,
    navigationService,
    extendLatestRangeInDirection,
    focusCell,
    ensureCellVisible,
  } = useInjectRangeStore()

  const directionOrEnterHandle = (event: KeyboardEvent, payload: InnerKeydownPayload) => {
    if (!payload.isEditing) {
      event.shiftKey && enableRangeSelection.value
        ? selectRange(event)
        : navigationService.navigateToNextCell(event, payload.cellPosition)
      event.preventDefault()
    }
  }

  const { props } = useInjectTable()
  const selectRange = (event: KeyboardEvent) => {
    const latestRange = extendLatestRangeInDirection(event)
    latestRange && ensureCellVisible(latestRange)
  }
  const escHandle = (_: KeyboardEvent, payload: InnerKeydownPayload) => {
    payload.isEditing && focusCell(payload.cellPosition)
  }
  const tabHandle = (event: KeyboardEvent, payload: InnerKeydownPayload) => {
    navigationService.onTabKeyDown(payload.cellPosition, event)
  }

  return {
    onCellKeydown: (event: KeyboardEvent, payload: InnerKeydownPayload) => {
      if (
        props.onCellKeydown &&
        false ===
          props.onCellKeydown(event, {
            isEditing: payload.isEditing,
            cellPosition: {
              column: (payload.cellPosition.column as any).originColumn,
              rowIndex: payload.cellPosition.rowIndex,
            },
          })
      ) {
        return
      }
      const { keyCode } = event
      const target = event.target! as any
      switch (keyCode) {
        case KeyCode.RIGHT:
        case KeyCode.LEFT:
          if (
            !(
              'INPUT' === target?.tagName ||
              'TEXTAREA' === target?.tagName ||
              target?.isContentEditable
            )
          ) {
            directionOrEnterHandle(event, payload)
          }
          break
        case KeyCode.DOWN:
        case KeyCode.UP:
        case KeyCode.ENTER:
          if (
            !((target: any) => 'TEXTAREA' === target.tagName || target.isContentEditable)(
              event.target,
            )
          ) {
            directionOrEnterHandle(event, payload)
          }
          break
        case KeyCode.ESC:
          escHandle(event, payload)
          break
        case KeyCode.TAB:
          tabHandle(event, payload)
      }
    },
  }
}
