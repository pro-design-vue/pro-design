<!--
 * @Author: shen
 * @Date: 2023-11-09 22:29:52
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:58:46
 * @Description:
-->
<script lang="ts">
import { defineComponent, ref, shallowRef, onMounted, nextTick, computed } from 'vue'
import { set } from 'lodash-es'
import { useInjectSlots } from '../context/TableSlotsContext'
import { useInjectTable } from '../context/TableContext'
import { useInjectPopup } from '../context/PopupContext'
import devWarning from '../../utils/devWarning'
import KeyCode from '../../utils/KeyCode'

import type { PropType } from 'vue'
import type { CellEditorArgs, FinallyColumnType } from '../interface'
import { isPromise } from '@pro-design-vue/utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    prefixCls: { type: String },
    recordIndexs: { type: Array as PropType<number[]> },
    rowKey: { type: [Number, String] },
    column: { type: Object as PropType<FinallyColumnType>, default: () => ({}) },
    record: { type: Object as PropType<any>, default: () => ({}) },
    value: { validator: () => true },
    customEditable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    autoHeight: { type: Boolean, default: false },
    cellKey: { type: String },
    getPopupContainer: Function as PropType<() => HTMLElement>,
    onCloseEditor: Function,
    onKeydown: Function as PropType<(e: KeyboardEvent) => void>,
  },
  emits: ['closeEditor', 'keydown'],
  setup(props, { expose, emit }) {
    const tableSlots = useInjectSlots()
    const popup = useInjectPopup()
    const oldValue =
      props.column?.valueGetter?.({
        value: props.value,
        record: props.record,
        column: props.column,
        recordIndexs: props.recordIndexs!,
      }) ?? props.value

    const modelValue = ref(oldValue)
    const inputRef = shallowRef<any>(null)

    const tableContext = useInjectTable()

    onMounted(() => {
      nextTick(() => {
        if (inputRef.value && !props.multiple) {
          inputRef.value?.focus?.()
          inputRef.value?.select?.()
        }
      })
    })

    expose({ value: modelValue, inputRef })

    const onInput = (e: Event, val: any) => {
      props.column.valueChange?.(e, {
        column: props.column,
        record: props.record,
        recordIndexs: props.recordIndexs!,
        newValue: val,
        oldValue: oldValue,
      })
    }
    const childrenColumnName = computed(() => tableContext.props.childrenColumnName || 'children')

    const save = () => {
      const recordIndexs = props.recordIndexs!
      let dataSource = tableContext.props.dataSource || []
      let record: any = {}
      recordIndexs.forEach((index) => {
        record = dataSource[index]
        dataSource = record[childrenColumnName.value] || []
      })
      const value =
        props.column.valueParser?.({
          column: props.column,
          record,
          recordIndexs,
          newValue: modelValue.value,
          oldValue,
        }) ?? modelValue.value
      const valueSetter = props.column.valueSetter
      if (valueSetter) {
        const result = valueSetter({
          column: props.column,
          record: record,
          recordIndexs: recordIndexs,
          newValue: modelValue.value,
          oldValue: oldValue,
        })
        if (isPromise(result)) {
          result
            .then((res) => {
              res && emit('closeEditor', [props.cellKey])
            })
            .catch(() => {})
          return
        }
        result && emit('closeEditor', [props.cellKey])
      } else {
        devWarning(
          undefined !== props.column.dataIndex || null !== props.column.dataIndex,
          'Editable',
          'If not have column dataIndex, you should to set valueSetter for editable columns, otherwise the value cannot be modified.',
        )
        set(record, props.column.dataIndex!, value)
        emit('closeEditor', [props.cellKey])
      }
    }

    let isKeyDown = false
    const closeEditor = (key?: any) => {
      emit('closeEditor', key ?? [props.cellKey])
    }

    return {
      modelValue,
      inputRef,
      handleInput: (e: Event) => {
        onInput(e, (e.target as HTMLInputElement)?.value)
      },
      handleKeyDown: (e: KeyboardEvent) => {
        const { which } = e
        if (which === KeyCode.ENTER) {
          save()
        } else {
          if (which === KeyCode.ESC) {
            isKeyDown = true
            emit('closeEditor', null)
          }
          emit('keydown', e)
        }
      },
      handleBlur: () => {
        isKeyDown || props.multiple || save()
      },
      tableSlots,
      popup,
      save,
      closeEditor,
      getCustomEditorProps: (): CellEditorArgs => ({
        modelValue,
        save,
        onInput,
        closeEditor,
        column: props.column.originColumn!,
        editorRef: inputRef,
        getPopupContainer: props.getPopupContainer as any,
        record: props.record,
        recordIndexs: props.recordIndexs!,
      }),
    }
  },
})
</script>

<template>
  <div :class="`${prefixCls}-cell-edit-inner`" :data-cell-auto="autoHeight">
    <template v-if="customEditable">
      <component
        v-if="tableSlots.cellEditor"
        v-bind="getCustomEditorProps()"
        :is="tableSlots.cellEditor"
      />
    </template>
    <input
      v-else
      v-model="modelValue"
      ref="inputRef"
      :class="`${prefixCls}-cell-edit-input`"
      type="text"
      @input="handleInput"
      @keydown="handleKeyDown"
      @blur="handleBlur"
    />
  </div>
</template>
