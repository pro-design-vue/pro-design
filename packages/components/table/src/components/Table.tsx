/*
 * @Author: shen
 * @Date: 2023-11-01 09:26:05
 * @LastEditors: shen
 * @LastEditTime: 2025-11-25 10:01:21
 * @Description:
 */

import { defineComponent, ref, computed, watch, unref, onMounted, nextTick } from 'vue'
import { Card } from 'ant-design-vue'
import { theme } from './config'
import { useProvideHover } from '../hooks/useHover'
import { useProvideLevel } from '../hooks/useLevel'
import { usePrefixCls, useState } from '@pro-design-vue/hooks'
import { convertChildrenToColumns, genColumnKey, isBordered } from '../utils/util'
import { tableProps } from './interface'
import { useFetchData } from '../hooks/useFetchData'
import { useContainer } from '../hooks/useContainer'
import { genProColumnToColumn } from '../utils/genProColumnToColumn'
import { columnSort } from '../utils/columnSort'
import { flatColumnsHandle } from '../utils/flatColumnsHandle'
import { merge, omit, omitKeysAndUndefined } from '@pro-design-vue/utils'
import { useProConfigInject } from '@pro-design-vue/components/config-provider'
import { promiseTimeout } from '@vueuse/core'
import useMergedState from '../hooks/useMergedState'
import InteralTable from './InteralTable.vue'
import ToolBar from './ToolBar/ToolBar.vue'
import Alert from './Alert.vue'
import FormRender from './Form/Form'

import type { ProFormItemType, ProFormActionType } from '@pro-design-vue/components/form'
import type {
  ColumnsType,
  GetRowKey,
  Key,
  OptionSearchProps,
  Position,
  RequestData,
  SorterResult,
  TableRowSelection,
} from './interface'
import type { AppendCellRange } from '../hooks/RangeInterface'
import type { CustomSlotsType } from '../utils/type'
import type { ContextSlots } from './context/TableSlotsContext'

export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: tableProps(),
  slots: {} as CustomSlotsType<ContextSlots>,
  emits: ['keydown'],
  setup(props, { expose, slots, attrs, emit }) {
    const tableRef = ref()
    const { table, dark } = useProConfigInject()
    const prefixCls = usePrefixCls('table')

    const { hoverRowKey } = useProvideHover({
      rowHoverDelay: computed(() => props.rowHoverDelay),
      rowHover: computed(() => props.rowHover ?? table?.value?.rowHover),
    })

    const mergedPrefixCls = computed(() => props.prefixCls ?? prefixCls)
    const mergeOptions = computed(() => {
      if (props.options === false) {
        return false
      }
      if (props.options === undefined) {
        return table?.value?.options
      }
      return { ...table?.value?.options, ...props.options }
    })

    useProvideLevel()

    watch(
      hoverRowKey,
      (newValue, oldValue) => {
        if (counter.rootDomRef.value) {
          counter.rootDomRef.value.style.removeProperty(
            `--${mergedPrefixCls.value}-row-bg-${oldValue}`,
          )
          counter.rootDomRef.value.style.setProperty(
            `--${mergedPrefixCls.value}-row-bg-${newValue}`,
            `hsl(var(--pro-accent))`,
          )
        }
      },
      { flush: 'post' },
    )

    const onKeydown = (ev: KeyboardEvent) => {
      ev.stopPropagation()
      emit('keydown', ev)
    }

    const fetchData = computed(() => {
      if (!props.request) return undefined

      return async (
        params?: Record<string, any>,
        sorters?: SorterResult<any>[],
        filter?: Record<string, (string | number)[] | null>,
      ) => {
        const actionParams = {
          ...(params || {}),
          ...(props.params || {}),
        }
        const response = await props.request!(actionParams, sorters, filter)
        return response as RequestData
      }
    })

    const actions = useFetchData(fetchData, props)
    const { dataSource, loading, pagination, pollingLoading, onTableChange, reload, reset } =
      actions
    const mergePagination = computed(() => {
      if (props.pagination === false) {
        return false
      }
      return pagination.value
    })

    const formSubmitLoading = computed(() => {
      if (typeof loading.value === 'boolean') {
        return loading.value
      } else if (typeof loading.value === 'object') {
        return loading.value.spinning
      } else {
        return undefined
      }
    })

    const onFormSearchSubmit = (values: any) => {
      // 判断search.onSearch返回值决定是否更新formSearch
      if (mergeOptions.value && mergeOptions.value.search) {
        const { name = 'keyword' } =
          mergeOptions.value.search === true ? {} : mergeOptions.value.search

        /** 如果传入的 onSearch 返回值为 false，则不要把options.search.name对应的值set到formSearch */
        const success = (mergeOptions.value.search as OptionSearchProps)?.onSearch?.(
          actions.keyword.value!,
        )

        if (success !== false) {
          actions.setFormSearch({
            ...values,
            [name]: actions.keyword.value,
          })
          return
        }
      }

      actions.setFormSearch(values)
    }

    const counter = useContainer(props)

    // ---------- 列计算相关 start  -----------------
    const tableColumn = computed(() => {
      return genProColumnToColumn({
        columns: props.columns,
        counter,
      }).sort(columnSort(counter.columnsMap.value))
    })

    watch(
      tableColumn,
      () => {
        if (tableColumn.value && tableColumn.value.length > 0) {
          // 重新生成key的字符串用于排序
          const columnKeys = tableColumn.value.map((item) => genColumnKey(item.key, item.index))
          counter.setSortKeyColumns(columnKeys)
        }
      },
      {
        immediate: true,
      },
    )

    /** 需要遍历一下，不然不支持嵌套表格 */
    const columns = computed(() => {
      const loopFilter = (column: any[]): any[] => {
        return column
          .map((item) => {
            // 删掉不应该显示的
            const columnKey = genColumnKey(item.key, item.index)
            const config = counter.columnsMap.value[columnKey]
            if (config && config.show === false) {
              return false
            }
            if (item.children) {
              return {
                ...item,
                children: loopFilter(item.children),
              }
            }
            return item
          })
          .filter(Boolean)
      }
      return loopFilter(tableColumn.value)
    })

    const onColumnsChange = (rawColumns, action: 'resize' | 'drag') => {
      const newMap = { ...counter.columnsMap.value }
      const newColumns = rawColumns.map((item) => genColumnKey(item.key, item.index))
      if (action === 'resize') {
        const loopSetWidth = (rawColumns) => {
          rawColumns.forEach((item) => {
            const key = genColumnKey(item.key, item.index)
            const newSetting = { ...newMap[key] }
            if (item.children?.length) {
              loopSetWidth(item.children)
            } else {
              newSetting.width = item.width
              newMap[key] = newSetting
            }
          })
        }
        loopSetWidth(rawColumns)
      } else {
        newColumns.forEach((key, order) => {
          newMap[key] = { ...(newMap[key] || {}), order }
        })
      }
      counter.setColumnsMap(newMap)
      counter.setSortKeyColumns(newColumns)
      props['onUpdate:columns']?.(rawColumns as ColumnsType, action)
    }
    const formItems = computed(() => {
      if (props.search === false) {
        return []
      }
      if (props.search?.items?.length) {
        return props.search?.items
      }
      return flatColumnsHandle(props.columns)
        .filter((item) => {
          if (item.hideInSearch) {
            return false
          }
          return true
        })
        .map((item) => {
          const mergeItem = merge(
            {
              ...item,

              width: undefined,
              tooltip: item.headerTooltip,
              name: item.dataIndex,
            },
            item.search,
          )
          return omitKeysAndUndefined(mergeItem, [
            'dataIndex',
            'width',
            'headerTooltip',
            'search',
          ]) as ProFormItemType
        })
    })

    /** SelectedRowKeys受控处理selectRows */
    const preserveRecordsRef = ref(new Map<any, any>())
    // ============================ RowKey ============================
    const getRowKey = computed<GetRowKey>(() =>
      typeof props.rowKey == 'function'
        ? props.rowKey
        : (record: Record<string, any>) => {
            return record?.[(props.rowKey ?? (table?.value?.rowKey || 'id')) as string]
          },
    )

    watch([() => dataSource.value, getRowKey], () => {
      if (dataSource.value?.length) {
        dataSource.value.forEach((data) => {
          const dataRowKey = getRowKey.value(data, -1)
          preserveRecordsRef.value.set(dataRowKey, data)
        })
      } else {
        onCleanSelected()
      }
    })

    /** 单选多选的相关逻辑 */
    const [selectedRowKeys, setSelectedRowKeys] = useMergedState<(string | number)[] | undefined>(
      props.selectedRowKeys ||
        (props.rowSelection ? props.rowSelection?.defaultSelectedRowKeys || [] : undefined),
      {
        value: computed(
          () =>
            props.selectedRowKeys ||
            (props.rowSelection ? props.rowSelection.selectedRowKeys : undefined),
        ),
      },
    )

    const rowSelection = computed<TableRowSelection>(() => ({
      selectedRowKeys: selectedRowKeys.value,
      preserveSelectedRowKeys: true,
      ...props.rowSelection,
      onChange: (selectedRowKeys: Key[], selectedRows: any[]) => {
        if (props.rowSelection && props.rowSelection.onChange) {
          props.rowSelection.onChange(selectedRowKeys, selectedRows)
        }
        props['onUpdate:selectedRowKeys']?.(selectedRowKeys, selectedRows)
        setSelectedRowKeys(selectedRowKeys)
      },
    }))

    const selectedRows = computed(() =>
      selectedRowKeys.value?.map((key) => preserveRecordsRef.value?.get(key)),
    )

    const onCleanSelected = (keys?: Key[]) => {
      let newSelectedRowKeys: Key[] = []
      if (keys?.length) {
        newSelectedRowKeys = selectedRowKeys.value?.filter((key) => !keys.includes(key)) ?? []
      }
      if (props.rowSelection && props.rowSelection.onChange) {
        props.rowSelection.onChange(newSelectedRowKeys, selectedRows.value ?? [])
      }
      props['onUpdate:selectedRowKeys']?.(newSelectedRowKeys, selectedRows.value ?? [])
      setSelectedRowKeys(newSelectedRowKeys)
    }

    const setRowSelected = (keys: Key[], rows?: []) => {
      if (keys?.length) {
        if (rows?.length) {
          rows.forEach((data) => {
            const dataRowKey = getRowKey.value(data, -1)
            preserveRecordsRef.value.set(dataRowKey, data)
          })
        }
        const newKeys = Array.from(new Set([...(selectedRowKeys.value ?? []), ...keys]))
        setSelectedRowKeys(newKeys)
      }
    }

    const hideToolbar = computed(
      () =>
        mergeOptions.value === false &&
        !props.title &&
        !slots.title &&
        !slots.toolbar &&
        !slots.searchExtra &&
        !slots.toolbarActions,
    )

    /**
     * 是否需要 card 来包裹
     */
    const notNeedCardDom = computed(() => {
      if ((props.search === false || !formItems.value?.length) && props.toolBar === false) {
        return true
      }
      return false
    })

    const showTableCard = computed(() => {
      if (counter.hasFullScreen.value) {
        return false
      }
      return props.cardProps !== false && !notNeedCardDom.value
    })

    const cardBodyStyle = computed(() => {
      if (!showTableCard.value) return {}

      if (hideToolbar.value) {
        return {
          padding: 0,
        }
      }

      // if (props.toolBar) {
      //   return {
      //     paddingBlockStart: 0,
      //   }
      // }

      // if (props.toolBar && props.pagination === false) {
      //   return {
      //     paddingBlockStart: 0,
      //   }
      // }
      if (props.pagination !== false) {
        return {
          paddingBlockEnd: 0,
        }
      }
      return {}
    })

    const [formAction, setFormAction] = useState<ProFormActionType>()

    const [mergeShowAlert, setMergeShowAlert] = useMergedState<boolean>(
      !!selectedRowKeys.value?.length,
      {
        value: computed(() => props.showAlert!),
        onChange(val) {
          props['onUpdate:showAlert']?.(val)
        },
      },
    )

    watch(selectedRowKeys, (selectedKeys) => {
      if (selectedKeys?.length) {
        setMergeShowAlert(true)
      } else {
        setMergeShowAlert(false)
      }
    })

    const tableHeight = ref<number | undefined | string>(props.height)
    const calcTableHeight = async () => {
      if (props.autoHeight || counter.hasFullScreen.value) {
        await nextTick()
        const height =
          window.innerHeight -
          (tableRef.value?.rootRef?.getBoundingClientRect()?.top || 0) -
          (tableRef.value?.paginationRef?.getBoundingClientRect()?.height || 0)
        tableHeight.value =
          typeof props.autoHeight === 'function' && !counter.hasFullScreen.value
            ? props.autoHeight?.(height)
            : height
      } else {
        tableHeight.value = props.height
      }
    }

    watch(
      () => counter.tableSize.value,
      () => {
        calcTableHeight()
      },
    )

    onMounted(async () => {
      await promiseTimeout(0)
      calcTableHeight()
    })

    expose({
      scrollTo: (pos: string | Position, behavior: 'auto' | 'smooth') => {
        tableRef.value?.scrollTo(pos, behavior)
      },
      scrollLeft: computed(() => {
        return unref(tableRef.value?.scrollLeft)
      }),
      scrollTop: computed(() => {
        return unref(tableRef.value?.scrollTop)
      }),
      bodyRef: computed(() => {
        return unref(tableRef.value?.bodyRef)
      }),
      rootRef: computed(() => {
        return unref(tableRef.value?.rootRef)
      }),
      paginationRef: computed(() => {
        return unref(tableRef.value?.paginationRef)
      }),
      copySelectedRange: () => {
        return tableRef.value?.copySelectedRange()
      },
      getSelectedRange: () => {
        return tableRef.value?.getSelectedRange()
      },
      clearAllSelectedRange: () => {
        return tableRef.value?.clearAllSelectedRange()
      },
      clearDataSource: () => {
        dataSource.value = []
      },
      cleanSelected: onCleanSelected,
      setSelected: setRowSelected,
      appendCellToSelectedRange: (params: AppendCellRange) => {
        return tableRef.value?.appendCellToSelectedRange(params)
      },
      openEditor: (cellInfos: any[]) => {
        return tableRef.value?.openEditor(cellInfos)
      },
      closeEditor: (cellInfos: any[]) => {
        return tableRef.value?.closeEditor(cellInfos)
      },
      reload,
      reset,
      calcTableHeight,
      formAction: computed(() => {
        return unref(formAction.value)
      }),
      formSearchSubmit: () => {
        const fieldValues = formAction.value?.getFieldsValue() ?? {}
        actions.setFormSearch({
          ...actions.formSearch.value,
          ...fieldValues,
        })
      },
      getSearchParams: () => {
        return actions.searchParams.value ?? {}
      },
    })

    return () => {
      const { expandIcon = slots.expandIcon, expandedRowRender = slots.expandedRowRender } = props
      const mergeColumns = columns.value || convertChildrenToColumns(slots.default?.()) || []
      let tableDom = (
        <>
          {props.toolBar !== false && !hideToolbar.value && (
            <ToolBar
              title={props.title}
              subTitle={props.subTitle}
              tooltip={props.tooltip}
              prefixCls={mergedPrefixCls.value}
              options={mergeOptions.value}
              actionsRef={{
                ...actions,
                fullScreen: () => {
                  counter.hasFullScreen.value = !counter.hasFullScreen.value
                  calcTableHeight()
                },
              }}
              tableColumn={tableColumn.value}
              selectedRowKeys={selectedRowKeys.value!}
              selectedRows={selectedRows.value}
              v-slots={{
                toolbar: slots.toolbar,
                title: slots.title,
                searchExtra: slots.searchExtra,
                actions: slots.toolbarActions,
                bottom: slots.toolbarBottom,
                top: slots.toolbarTop,
              }}
              onCleanSelected={onCleanSelected}
              onFormSearchSubmit={(newValues) => {
                actions.setFormSearch({
                  ...actions.formSearch.value,
                  ...newValues,
                })
              }}
            />
          )}
          {!!props.rowSelection &&
            props.rowSelection?.type !== 'radio' &&
            props.alwaysShowAlert !== false &&
            mergeShowAlert.value && (
              <Alert
                prefixCls={mergedPrefixCls.value}
                selectedRowKeys={selectedRowKeys.value!}
                selectedRows={selectedRows.value}
                onCleanSelected={onCleanSelected}
                actionsRef={actions}
                v-slots={{ info: slots.alertInfo, actions: slots.alertActions, alert: slots.alert }}
              />
            )}
          <InteralTable
            ref={tableRef}
            {...omit(props, [
              'onChange',
              'onUpdate:pagination',
              'onUpdate:selectedRowKeys',
              'onUpdate:columns',
            ])}
            height={tableHeight.value}
            virtual={!!props.autoHeight || !!counter.hasFullScreen.value || props.virtual}
            prefixCls={mergedPrefixCls.value}
            columns={mergeColumns || []}
            size={counter.tableSize.value}
            dataSource={dataSource.value}
            loading={loading.value}
            rowSelection={props.rowSelection ? rowSelection.value : undefined}
            pagination={mergePagination.value}
            expandIcon={expandIcon}
            expandedRowRender={expandedRowRender}
            hasContextmenuPopup={!!slots.contextmenuPopup}
            onChange={onTableChange}
            onUpdate:columns={onColumnsChange}
            v-slots={{
              ...slots,
              footer: props.footer || slots.footer,
            }}
          />
        </>
      )

      if (showTableCard.value) {
        tableDom = (
          <Card
            bordered={isBordered(
              'table',
              props.cardBordered ?? table?.value?.cardBordered ?? dark?.value,
            )}
            bodyStyle={cardBodyStyle.value}
            {...props.cardProps}
          >
            {tableDom}
          </Card>
        )
      }

      return (
        <div
          ref={counter.rootDomRef}
          {...attrs}
          class={[
            `${mergedPrefixCls.value}-wrapper ${props.bordered ? mergedPrefixCls.value + '-wrapper-bordered' : ''} ${
              'dark' === theme.value ? mergedPrefixCls.value + '-wrapper-dark' : ''
            } ${pollingLoading.value ? mergedPrefixCls.value + '-wrapper-polling' : ''}`,
            {
              [`${mergedPrefixCls.value}-maximize`]: counter.hasFullScreen.value,
            },
            attrs.class,
          ]}
          onKeydown={onKeydown}
        >
          {props.search !== false && !!formItems.value?.length && (
            <FormRender
              prefixCls={mergedPrefixCls.value}
              items={formItems.value}
              cardBordered={props.cardBordered ?? table?.value?.cardBordered ?? dark?.value}
              search={props.search}
              tableShowCard={showTableCard.value}
              loading={formSubmitLoading.value}
              beforeSearchSubmit={props.beforeSearchSubmit}
              setFormAction={setFormAction}
              manual={props.manual || props.manualRequest}
              v-slots={slots}
              onReset={props.onReset}
              onSubmit={props.onSubmit}
              onFormSearchSubmit={onFormSearchSubmit}
              onSearchTabChange={(newValues) => {
                actions.setFormSearch({
                  ...actions.formSearch.value,
                  ...newValues,
                })
              }}
              onCollapse={calcTableHeight}
            />
          )}
          {tableDom}
        </div>
      )
    }
  },
})
