/*
 * @Author: shen
 * @Date: 2023-11-07 15:07:59
 * @LastEditors: shen
 * @LastEditTime: 2025-12-09 17:34:12
 * @Description:
 */
import type { PropType } from 'vue'
import type { Bordered, SearchConfig } from '../interface'
import type {
  ProFormActionType,
  ProFormItemType,
  ProQueryFilterProps,
} from '@pro-design-vue/components/form'

import { computed, defineComponent } from 'vue'
import { ProQueryFilter } from '@pro-design-vue/components/form'
import { isBordered } from '../../utils/util'
import { omit, omitUndefined } from '@pro-design-vue/utils'

export default defineComponent({
  props: {
    prefixCls: String,
    items: {
      type: Array as PropType<ProFormItemType[]>,
      default: () => [],
    },
    search: {
      type: Object as PropType<SearchConfig>,
      default: undefined,
    },
    cardBordered: {
      type: [Boolean, Object] as PropType<Bordered>,
      default: undefined,
    },
    loading: Boolean,
    manual: Boolean,
    tableShowCard: Boolean,
    beforeSearchSubmit: {
      type: Function as PropType<(params: Partial<any>) => any>,
      default: (searchParams: Partial<any>) => searchParams,
    },
    setFormAction: {
      type: Function as PropType<(action: ProFormActionType) => any>,
    },
    onSubmit: {
      type: Function as PropType<ProQueryFilterProps['onFinish']>,
      default: undefined,
    },
    onReset: {
      type: Function as PropType<ProQueryFilterProps['onReset']>,
      default: undefined,
    },
    onFormSearchSubmit: {
      type: Function as PropType<(params: any) => void>,
      default: undefined,
    },
    onSearchTabChange: {
      type: Function as PropType<(params: any) => void>,
      default: undefined,
    },
    onCollapse: {
      type: Function as PropType<(val: boolean) => void>,
      default: undefined,
    },
  },
  setup: (props, { slots }) => {
    /** 提交表单，根据两种模式不同，方法不相同 */
    const submit = async (values: any, firstLoad: boolean) => {
      const submitParams = omitUndefined(
        props.beforeSearchSubmit({
          ...values,
        }),
      )
      props.onFormSearchSubmit?.(submitParams)
      if (props.onSubmit && !firstLoad) {
        props.onSubmit(submitParams)
      }
    }

    const isCard = computed(() => props.search?.cardProps !== false && props.tableShowCard)

    const className = computed(() => ({
      [`${props.prefixCls}-search`]: true,
      [`${props.prefixCls}-card`]: isCard.value,
      [`${props.prefixCls}-card-bordered`]:
        isCard.value && isBordered('search', props.cardBordered),
    }))

    return () => {
      return (
        <div class={className.value} style={{ marginBlockEnd: isCard.value ? '16px' : '' }}>
          <ProQueryFilter
            class={`${props.prefixCls}-form`}
            {...omit(props.search || {}, [
              'cardProps',
              'tabName',
              'items',
              'loading',
              'onReset',
              'onFinish',
              'onValuesChange',
              'onInit',
              'onCollapse',
            ])}
            items={props.items}
            loading={props.loading}
            style={{
              marginBlockEnd: props.search?.cardProps !== false && props.tableShowCard ? 0 : '16px',
              ...props.search?.style,
            }}
            onReset={props.onReset}
            onFinish={(values) => {
              submit(values, false)
              props.search?.onFinish?.(values)
            }}
            onValuesChange={(values) => {
              if (props.search?.submitter === false) {
                submit(values, true)
              }
              props.search?.onValuesChange?.(values)
            }}
            v-slots={slots}
            onInit={(values, action) => {
              submit(values, true)
              props.setFormAction?.(action)
              props.search?.onInit?.(values, action)
            }}
            onCollapse={props.onCollapse}
          />
        </div>
      )
      // if (props.search?.cardProps !== false && props.tableShowCard) {
      //   return (
      //     <Card
      //       class={`${props.prefixCls}-search`}
      //       activeTabKey={activeTabKey.value}
      //       bordered={isBordered('search', props.cardBordered)}
      //       style={{ marginBlockEnd: '16px' }}
      //       {...omit(cardProps.value ?? {}, ['onTabChange', 'activeTabKey'])}
      //       onTabChange={onTabChange}
      //     >
      //       {searchDom}
      //     </Card>
      //   )
      // }
      // return searchDom
    }
  },
})
