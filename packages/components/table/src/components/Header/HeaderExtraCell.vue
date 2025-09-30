<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-09-30 16:52:24
 * @Description:
-->
<script lang="ts">
import type { CSSProperties, PropType } from 'vue'
import type { FinallyColumnType, DefaultRecordType, Key } from '../interface'

import { defineComponent, inject, computed, Fragment, h } from 'vue'
import { Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { AUTO_HEADER_HEIGHT } from '../../utils/constant'
import { getCellFixedInfo } from '../../utils/fixUtil'
import { useInjectTable } from '../context/TableContext'
import supportSticky from '../../utils/supportSticky'
import eagerComputed from '../../utils/eagerComputed'
import Checkbox from '../Checkbox'

export default defineComponent({
  name: 'HeaderExtraCell',
  components: {
    Checkbox,
    Dropdown,
    AMenu: Menu,
    MenuItem,
    DownOutlined,
  },
  props: {
    component: { type: String, default: 'div' },
    prefixCls: String,
    column: { type: Object as PropType<FinallyColumnType<DefaultRecordType>>, default: () => ({}) },
    additionalProps: Object,
  },
  setup(props) {
    const autoHeight = inject<boolean>(AUTO_HEADER_HEIGHT, false)
    const tableContext = useInjectTable()
    const { pageDataEnableRowKeys, getRecordByKey, mergedRowSelection } = tableContext
    const {
      checkedCurrentAll,
      checkedCurrentSome,
      allDisabled,
      allDisabledAndChecked,
      allDisabledSomeChecked,
      mergedSelections,
      setSelectedKeys,
    } = tableContext.selection

    const rowSelectionType = computed(() => tableContext.mergedRowSelection.value.type)
    const hideSelectAll = computed(() => tableContext.mergedRowSelection.value.hideSelectAll)
    const derivedSelectedKeySet = computed(() => tableContext.selection.derivedSelectedKeySet.value)
    const sortColumns = computed(() =>
      tableContext.sorterStates.value.map(({ column, sortOrder }) => ({
        column,
        order: sortOrder,
      })),
    )

    const title = computed(() => {
      return h(Fragment, [
        typeof props.column.title == 'function'
          ? props.column.title({
              column: props.column.originColumn!,
              sortColumns: sortColumns.value,
              sortColumn: sortColumns.value[0]?.column,
              sortOrder: sortColumns.value[0]?.order,
            })
          : props.column.title,
      ])
    })

    const cellFixedInfo = computed(() => {
      if (autoHeight) {
        const additionalProps = props.additionalProps!
        return getCellFixedInfo(
          additionalProps.colstart,
          additionalProps.colend,
          tableContext.allColumns.value,
          tableContext.stickyOffsets.value,
          tableContext.props.direction,
        )
      }
      return undefined
    })

    const cellClass = computed(() => {
      const { prefixCls } = props
      let cellFixedCls = {}
      if (cellFixedInfo.value && supportSticky) {
        const autoCellPrefixCls = `${prefixCls}-cell`,
          { fixLeft, fixRight, firstFixLeft, lastFixLeft, firstFixRight, lastFixRight } =
            cellFixedInfo.value
        cellFixedCls = {
          [`${autoCellPrefixCls}-fix-left`]: typeof fixLeft === 'number',
          [`${autoCellPrefixCls}-fix-left-first`]: firstFixLeft,
          [`${autoCellPrefixCls}-fix-left-last`]: lastFixLeft,
          [`${autoCellPrefixCls}-fix-right`]: typeof fixRight == 'number',
          [`${autoCellPrefixCls}-fix-right-first`]: firstFixRight,
          [`${autoCellPrefixCls}-fix-right-last`]: lastFixRight,
        }
      }
      return Object.assign(
        {
          [`${prefixCls}-cell`]: true,
          [`${prefixCls}-header-cell`]: true,
          [`${prefixCls}-header-extra-cell`]: true,
        },
        cellFixedCls,
      )
    })

    return {
      cellClass,
      componentStyle: computed(() => {
        const styles: CSSProperties = {}
        if (cellFixedInfo.value && supportSticky) {
          const { fixLeft, fixRight } = cellFixedInfo.value
          if (typeof fixLeft == 'number') {
            styles.position = 'sticky'
            styles.left = `${fixLeft}px`
          }
          if (typeof fixRight == 'number') {
            styles.position = 'sticky'
            styles.right = `${fixRight}px`
          }
        }
        return autoHeight ? styles : { height: `${props.column.height}px` }
      }),
      getPopupContainer: computed(() => tableContext.getPopupContainer.value),
      rowSelectionType,
      hideSelectAll,
      onSelectAllChange: () => {
        const changeRows: Key[] = []
        const copyDerivedSelectedKeySet = new Set(derivedSelectedKeySet.value)
        if (checkedCurrentAll.value) {
          pageDataEnableRowKeys.value.forEach((key: Key) => {
            copyDerivedSelectedKeySet.delete(key)
            changeRows.push(key)
          })
        } else {
          pageDataEnableRowKeys.value.forEach((key: Key) => {
            if (!copyDerivedSelectedKeySet.has(key)) {
              copyDerivedSelectedKeySet.add(key)
              changeRows.push(key)
            }
          })
        }

        const selectedRows: Key[] = Array.from(copyDerivedSelectedKeySet)
        mergedRowSelection.value.onSelectAll?.(
          !checkedCurrentAll,
          selectedRows.map((key: Key) => getRecordByKey(key)),
          changeRows.map((key: Key) => getRecordByKey(key)),
        )
        setSelectedKeys(selectedRows)
      },
      checked: eagerComputed(() =>
        allDisabled.value
          ? allDisabledAndChecked.value
          : !!tableContext.flattenData.value.length && checkedCurrentAll.value,
      ),
      indeterminate: eagerComputed(() =>
        allDisabled.value
          ? !allDisabledAndChecked.value && allDisabledSomeChecked.value
          : !checkedCurrentAll.value && checkedCurrentSome.value,
      ),
      disabled: eagerComputed(
        () => tableContext.flattenData.value.length === 0 || allDisabled.value,
      ),
      mergedSelections,
      onMenuClick: (callback: any) => {
        callback?.(pageDataEnableRowKeys.value)
      },
      autoHeight,
      title,
      h,
      Fragment,
    }
  },
})
</script>

<template>
  <component
    :is="component"
    tabindex="-1"
    role="cell"
    :class="cellClass"
    :style="componentStyle"
    v-bind="additionalProps"
    @click.stop
  >
    <template
      v-if="column.type !== 'checkbox' || rowSelectionType === 'radio' || hideSelectAll"
    ></template>
    <div v-else :class="`${prefixCls}-selection-wrap`">
      <div :class="`${prefixCls}-selection`">
        <component v-if="column.title" :is="title" />
        <template v-else>
          <Checkbox
            :prefix-cls="prefixCls"
            :indeterminate="indeterminate"
            :disabled="disabled"
            :checked="checked"
            :aria-label="
              checked
                ? 'Press Space to toggle all row selection (checked)'
                : 'Press Space to toggle all row selection (unchecked)'
            "
            @change="onSelectAllChange"
          />
          <div v-if="mergedSelections" :class="`${prefixCls}-selection-extra`">
            <Dropdown :get-popup-container="getPopupContainer">
              <span>
                <DownOutlined :class="`${prefixCls}-selection-extra-dropdown-icon`" />
              </span>
              <template #overlay>
                <AMenu :get-popup-container="getPopupContainer">
                  <template
                    v-for="(item, index) in mergedSelections"
                    :key="(item && item.key) || index"
                  >
                    <MenuItem
                      v-if="item"
                      :key="item.key || index"
                      @click="onMenuClick(item.onSelect)"
                    >
                      <component
                        :is="
                          h(Fragment, [
                            typeof item.text == 'function' ? item.text(item) : item.text,
                          ])
                        "
                      ></component>
                    </MenuItem>
                  </template>
                </AMenu>
              </template>
            </Dropdown>
          </div>
        </template>
      </div>
    </div>
  </component>
</template>
