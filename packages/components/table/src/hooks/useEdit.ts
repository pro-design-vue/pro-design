/*
 * @Author: shen
 * @Date: 2023-11-03 11:03:37
 * @LastEditors: shen
 * @LastEditTime: 2023-12-29 10:38:16
 * @Description:
 */
import { shallowRef, provide, inject, ref } from 'vue'
import type { Ref, ShallowRef, InjectionKey } from 'vue'

type EditProps = {
  editCellKeys: Ref<string[]>
  openEditor: (key: string | string[], values?: Record<string, any>) => void
  closeEditor: (key?: string | string[]) => void
  oldValuesMap: ShallowRef<Record<string, any>>
}

const EditKey: InjectionKey<EditProps> = Symbol('edit')

export const useEditProvider = () => {
  const editCellKeys = shallowRef<string[]>([])
  const oldValuesMap = shallowRef({})
  const openEditor = (key: string | string[], values?: Record<string, any>) => {
    if (key) {
      if (Array.isArray(key)) {
        editCellKeys.value = key
      } else {
        editCellKeys.value.includes(key) || (editCellKeys.value = [key])
      }
      Object.assign(oldValuesMap.value, values || {})
    }
  }
  const closeEditor = (key?: string | string[]) => {
    if (typeof key === 'undefined') {
      editCellKeys.value = []
      oldValuesMap.value = {}
      return
    }
    const keys = Array.isArray(key) ? key : [key]
    editCellKeys.value = editCellKeys.value.filter((key) => !keys.includes(key))
    keys.forEach((key) => {
      delete oldValuesMap.value[key]
    })
  }
  provide(EditKey, {
    editCellKeys,
    openEditor,
    closeEditor,
    oldValuesMap,
  })
  return {
    editCellKeys,
    openEditor,
    closeEditor,
  }
}
export const useEditInject = () => {
  return inject(EditKey, {
    editCellKeys: ref([]),
    openEditor: () => {},
    closeEditor: () => {},
    oldValuesMap: shallowRef({}),
  })
}
