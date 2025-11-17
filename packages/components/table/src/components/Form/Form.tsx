/*
 * @Author: shen
 * @Date: 2023-11-07 15:07:59
 * @LastEditors: shen
 * @LastEditTime: 2025-11-17 17:23:17
 * @Description:
 */
import type { PropType } from 'vue'
import type { Bordered, SearchConfig } from '../interface'
import type { ProFormItemType, ProQueryFilterProps } from '@pro-design-vue/components/form'

import { computed, defineComponent, ref } from 'vue'
import { ProQueryFilter } from '@pro-design-vue/components/form'
import { Card } from 'ant-design-vue'
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
    const activeTabKey = ref(
      props.search?.cardProps !== false ? props.search?.cardProps?.activeTabKey : '',
    )

    const cardProps = computed(() => {
      if (!props.search?.cardProps) {
        return {}
      }
      return props.search?.cardProps
    })

    /** 提交表单，根据两种模式不同，方法不相同 */
    const submit = async (values: any, firstLoad: boolean) => {
      const tabParams = cardProps.value?.tabList?.length
        ? {
            [props.search?.tabName ?? 'tab']:
              cardProps.value.activeTabKey || cardProps.value?.tabList?.[0]?.key,
          }
        : {}
      const submitParams = omitUndefined(
        props.beforeSearchSubmit({
          ...values,
          ...tabParams,
        }),
      )
      props.onFormSearchSubmit?.(submitParams)
      if (props.onSubmit && !firstLoad) {
        props.onSubmit(submitParams)
      }
    }

    const onTabChange = (key: string) => {
      activeTabKey.value = key
      props.onSearchTabChange?.({
        [props.search?.tabName ?? 'tab']: key,
      })
      cardProps.value?.onTabChange?.(key)
    }
    return () => {
      const searchDom = (
        <ProQueryFilter
          class={`${props.prefixCls}-form`}
          {...omit(props.search || {}, ['cardProps', 'tabName'])}
          items={props.items}
          loading={props.loading}
          style={{
            marginBlockEnd: props.search?.cardProps !== false && props.tableShowCard ? 0 : '16px',
            ...props.search?.style,
          }}
          onReset={props.onReset}
          onFinish={(values) => {
            submit(values, false)
          }}
          onValuesChange={(values) => {
            if (props.search?.submitter === false) {
              submit(values, true)
            }
            props.search?.onValuesChange?.(values)
          }}
          v-slots={slots}
          onInit={(values) => {
            submit(values, true)
          }}
          onCollapse={props.onCollapse}
        />
      )
      if (props.search?.cardProps !== false && props.tableShowCard) {
        return (
          <Card
            class={`${props.prefixCls}-search`}
            activeTabKey={activeTabKey.value}
            bordered={isBordered('search', props.cardBordered)}
            style={{ marginBlockEnd: '16px' }}
            {...omit(cardProps.value ?? {}, ['onTabChange', 'activeTabKey'])}
            onTabChange={onTabChange}
          >
            {searchDom}
          </Card>
        )
      }
      return searchDom
    }
  },
})
