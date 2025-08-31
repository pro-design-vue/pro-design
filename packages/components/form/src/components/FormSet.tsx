/*
 * @Author: shen
 * @Date: 2023-08-09 10:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:52:13
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormItemType } from '../type'

import { computed, defineComponent, watch } from 'vue'
import { Form } from 'ant-design-vue'
import { useInjectForm } from '../context/FormContext'
import { useFieldValue } from '../hooks/useFieldValue'
import { get, isEqual, omitUndefined, pickKeys, runFunction } from '@pro-design-vue/utils'
import FormRowWrapper from './FormRowWrapper'
import FormColWrapper from './FormColWrapper'
import FormItems from './FormItems'
import FormTitle from './FormTitle'

const NOT_ALLOW_FIELD_TYPES = ['formList', 'formSet', 'group', 'divider']

const ALL_ANTD_PROP_KEYS = [
  'autoLink',
  'colon',
  'hasFeedback',
  'labelAlign',
  'labelCol',
  'required',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'wrapperCol',
  'required',
]

export default defineComponent({
  name: 'FormSet',
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Array] as PropType<ProFormItemType['name']>,
      default: undefined,
    },
    initialValue: {
      type: Object as PropType<ProFormItemType['initialValue']>,
      default: undefined,
    },
    title: {
      type: [String, Object, Function] as PropType<ProFormItemType['title']>,
      default: undefined,
    },
    tooltip: {
      type: String,
      default: undefined,
    },
    colProps: {
      type: Object as PropType<ProFormItemType['colProps']>,
      default: undefined,
    },
    rowProps: {
      type: Object as PropType<ProFormItemType['rowProps']>,
      default: undefined,
    },
    spaceProps: {
      type: Object as PropType<ProFormItemType['spaceProps']>,
      default: () => ({}),
    },
    formItemProps: {
      type: [Object, Function] as PropType<ProFormItemType['formItemProps']>,
      default: undefined,
    },
    convertValue: {
      type: Function as PropType<ProFormItemType['convertValue']>,
      default: undefined,
    },
    transform: {
      type: Function as PropType<ProFormItemType['transform']>,
      default: undefined,
    },
    items: {
      type: [Array, Function] as PropType<ProFormItemType['children']>,
      default: undefined,
    },
  },
  setup(props) {
    const { formatItems, formData } = useInjectForm()

    const { fieldValue, onValueChange } = useFieldValue<any>({
      namePath: computed(() => props.name!),
      initialValue: props.initialValue,
      convertValue: props.convertValue,
      transform: props.transform,
    })

    const formItemProps = computed(() => runFunction(props.formItemProps, formData.value) ?? {})
    const restItemProps = computed(() =>
      omitUndefined({
        ...pickKeys(formItemProps.value, ALL_ANTD_PROP_KEYS),
      }),
    )

    const items = computed(() => {
      let children: ProFormItemType[] = runFunction(props.items ?? [], formData.value) ?? []
      if (Array.isArray(props.initialValue) && props.initialValue.length) {
        children = children
          .filter((item) => !NOT_ALLOW_FIELD_TYPES.includes(item.fieldType ?? ''))
          .map((child, index) => {
            if (typeof child.initialValue === 'undefined') {
              child.initialValue = props.initialValue[index]
            }
            return child
          })
      }
      return formatItems?.(children) ?? []
    })
    const childNames = computed(() => items.value.map((item) => item.name))

    const childValues = computed(() => {
      const values: any[] = []
      if (Array.isArray(childNames.value) && childNames.value.length) {
        childNames.value.forEach((namePath, index) => {
          values[index] = get(formData.value, namePath!)
        })
      }
      return values
    })
    const slotsGetter = computed(() => {
      const temp = {}
      if (props.title) {
        temp['label'] = () => <FormTitle title={props.title} tooltip={props.tooltip} />
      }
      return temp
    })

    watch(childValues, () => {
      if (!isEqual(childValues.value, fieldValue.value)) {
        onValueChange(childValues.value)
      }
    })
    return () => {
      if (!props.name?.length || !items.value.length) return null
      return (
        <FormColWrapper colProps={props.colProps}>
          <Form.Item {...restItemProps.value} v-slots={slotsGetter.value}>
            <FormRowWrapper rowProps={props.rowProps}>
              <FormItems
                list={items.value}
                type="space"
                spaceProps={{ size: [8, 0], ...(props.spaceProps ?? {}) }}
              ></FormItems>
            </FormRowWrapper>
          </Form.Item>
        </FormColWrapper>
      )
    }
  },
})
