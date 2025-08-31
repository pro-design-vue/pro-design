/*
 * @Author: shen
 * @Date: 2023-08-27 12:04:01
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 16:28:13
 * @Description:
 */
import type { PropType } from 'vue'
import type { ProFormActionType, ProFormItemType } from './type'

import { defineComponent, ref } from 'vue'
import { useFormExpose } from './hooks/useFormExpose'
import { formProps } from './props'
import DrawerForm from './layouts/DrawerForm'
import ModalForm from './layouts/ModalForm'
import QueryFilter from './layouts/QueryFilter'
import StepsForm from './layouts/StepsForm'
import BaseForm from './base/BaseForm'

export default defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: {
    layoutType: {
      type: String as PropType<'Form' | 'DrawerForm' | 'ModalForm' | 'QueryFilter' | 'StepForm'>,
      default: 'Form',
    },
    ...formProps,
  },
  setup(props, { slots, expose, attrs }) {
    const formRef = ref<InstanceType<typeof BaseForm> & ProFormActionType>()
    const formExpose = useFormExpose(formRef)
    expose(formExpose)

    return () => {
      const { layoutType, items, ...rest } = props
      if (layoutType === 'DrawerForm') {
        return (
          <DrawerForm
            ref={formRef}
            {...attrs}
            {...rest}
            items={items as ProFormItemType[]}
            v-slots={slots}
          />
        )
      } else if (layoutType === 'ModalForm') {
        return (
          <ModalForm
            ref={formRef}
            {...attrs}
            {...rest}
            items={items as ProFormItemType[]}
            v-slots={slots}
          />
        )
      } else if (layoutType === 'QueryFilter') {
        return (
          <QueryFilter
            ref={formRef}
            {...attrs}
            {...rest}
            items={items as ProFormItemType[]}
            v-slots={slots}
          />
        )
      } else if (layoutType === 'StepForm') {
        return (
          <StepsForm
            ref={formRef}
            {...attrs}
            {...rest}
            items={items as ProFormItemType[][]}
            v-slots={slots}
          />
        )
      }
      return (
        <BaseForm
          ref={formRef}
          {...attrs}
          {...rest}
          items={items as ProFormItemType[]}
          v-slots={slots}
        />
      )
    }
  },
})
