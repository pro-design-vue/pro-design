/*
 * @Author: shen
 * @Date: 2023-08-23 20:07:22
 * @LastEditors: shen
 * @LastEditTime: 2026-01-12 16:45:30
 * @Description:
 */
import type { InternalNamePath, NamePath } from 'ant-design-vue/es/form/interface'
import { cloneDeep, get, isEqual, merge, set, type Entity } from '@pro-design-vue/utils'
import { ref, shallowRef, toRaw, watch, type Ref } from 'vue'
import { getNamePath } from '../utils/getNamePath'
import { cloneByNamePathList } from '../utils/cloneByNamePathList'

export type FormStore = {
  formValues: Ref<Entity | undefined>
  getFieldValue: (name: NamePath) => any
  updateValue: (name: NamePath, value: any) => void
  getInitialValue: (namePath: InternalNamePath) => any
  initEntityValue: (namePath: InternalNamePath, initialValue: any) => void
  getFieldsValue: (nameList?: NamePath[] | true) => Entity
  resetFields: (nameList?: NamePath) => void
}

export function useFormStore({
  initialData,
  initialValues: userInitialValues,
  onValuesChange,
}: {
  initialData: Ref<Entity | undefined>
  initialValues?: Entity
  onValuesChange: (changedValues: Partial<Entity>, values: Entity) => void
}): FormStore {
  const formValues = ref<Entity>(cloneDeep(userInitialValues) ?? {})
  const initialValues = shallowRef<Entity>(cloneDeep(userInitialValues) ?? {})

  const getFieldValue = (name: NamePath) => {
    const namePath: InternalNamePath = getNamePath(name)
    return get(formValues.value, namePath)
  }

  const getInitialValue = (namePath: InternalNamePath) => {
    const initValue = get(initialValues.value, namePath)

    // Not cloneDeep when without `namePath`
    return namePath.length ? cloneDeep(initValue) : initValue
  }

  const initEntityValue = (namePath: InternalNamePath, initialValue: any) => {
    if (initialValue !== undefined) {
      const prevValue = get(formValues.value, namePath)
      if (prevValue === undefined) {
        set(initialValues.value, namePath, initialValue)
        updateValues(initialValues.value)
      }
    }
  }

  const resetFields = (name?: NamePath) => {
    if (!name) {
      console.log('🚀 ~ resetFields ~ merge(initialValues.value):', initialValues.value)
      updateValues(initialValues.value)
      return
    }
    const namePath = getNamePath(name)
    const initialValue = getInitialValue(namePath)
    updateValue(initialValue, namePath)
  }

  const updateValues = (nextValues: Entity) => {
    formValues.value = cloneDeep(nextValues)
  }

  const updateValue = (name: NamePath, value: any) => {
    const namePath = getNamePath(name)
    const prevValue = getFieldValue(namePath)
    if (!isEqual(prevValue, value)) {
      const nextValues = set(formValues.value, namePath, value)
      updateValues(nextValues)
      if (onValuesChange) {
        const changedValues = cloneByNamePathList(nextValues, [namePath])
        onValuesChange(changedValues, toRaw(formValues.value))
      }
    }
  }

  const getFieldsValue = (nameList?: NamePath[] | true) => {
    if (nameList === true) {
      return cloneDeep(formValues.value)
    }
    return cloneDeep(formValues.value)

    // const fieldEntities = this.getFieldEntitiesForNamePathList(
    //   Array.isArray(mergedNameList) ? mergedNameList : null,
    // )

    // const filteredNameList: NamePath[] = []
    // const listNamePaths: InternalNamePath[] = []

    // fieldEntities.forEach((entity: FlexibleFieldEntity) => {
    //   const namePath = entity.INVALIDATE_NAME_PATH || entity.getNamePath()

    //   // Ignore when it's a list item and not specific the namePath,
    //   // since parent field is already take in count
    //   if ((entity as FieldEntity).isList?.()) {
    //     listNamePaths.push(namePath)
    //     return
    //   }

    //   if (!mergedFilterFunc) {
    //     filteredNameList.push(namePath)
    //   } else {
    //     const meta: Meta = 'getMeta' in entity ? entity.getMeta() : null
    //     if (mergedFilterFunc(meta)) {
    //       filteredNameList.push(namePath)
    //     }
    //   }
    // })

    // let mergedValues = cloneByNamePathList(this.store, filteredNameList.map(getNamePath))

    // // We need fill the list as [] if Form.List is empty
    // listNamePaths.forEach((namePath) => {
    //   if (!getValue(mergedValues, namePath)) {
    //     mergedValues = setValue(mergedValues, namePath, [])
    //   }
    // })

    // return mergedValues
  }

  // request 请求的初始化数据优先级更高
  watch(initialData, () => {
    initialValues.value = merge({}, initialValues.value, initialData.value)
    updateValues(initialValues.value)
  })

  return {
    formValues,
    resetFields,
    getFieldValue,
    updateValue,
    getInitialValue,
    initEntityValue,
    getFieldsValue,
  }
}
