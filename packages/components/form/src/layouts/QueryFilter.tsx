/*
 * @Author: shen
 * @Date: 2023-08-28 13:01:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 16:28:52
 * @Description:
 */
import { ref, computed, defineComponent, watch, useTemplateRef } from 'vue'
import { queryFilterProps } from '../props'
import { useMergedState, usePrefixCls } from '@pro-design-vue/hooks'
import { isBrowser, merge, omit, omitUndefined } from '@pro-design-vue/utils'
import { ProFieldType } from '../fieldType'
import { DownOutlined } from '@ant-design/icons-vue'
import { useResizeObserver } from '@vueuse/core'
import { useFormExpose } from '../hooks/useFormExpose'
import { useIntl } from '@pro-design-vue/components/config-provider'
import BaseForm from '../base/BaseForm'

import type { ProFormActionType, ProFormItemType, SpanConfig } from '../type'
import type { FormItemProps, FormProps } from 'ant-design-vue'

const CONFIG_SPAN_BREAKPOINTS = {
  xs: 513,
  sm: 513,
  md: 785,
  lg: 992,
  xl: 1057,
  xxl: Infinity,
}
/** 配置表单列变化的容器宽度断点 */
const BREAKPOINTS = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    [Infinity, 4, 'vertical'],
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal'],
  ],
}

/**
 * 合并用户和默认的配置
 *
 * @param layout
 * @param width
 */
const getSpanConfig = (
  layout: FormProps['layout'] = 'horizontal',
  width: number,
  span?: SpanConfig,
): { span: number; layout: FormProps['layout'] } => {
  if (span && typeof span === 'number') {
    return {
      span,
      layout,
    }
  }

  const spanConfig: (string | number)[][] = span
    ? ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((key) => [
        CONFIG_SPAN_BREAKPOINTS[key as 'xs'],
        24 / (span as any)[key as 'sm'],
        'horizontal',
      ])
    : BREAKPOINTS[(layout as 'default') || 'default']
  const breakPoint = (spanConfig || BREAKPOINTS.default).find(
    (item) => width < (item[0] as number) + 16, // 16 = 2 * (ant-row -8px margin)
  )
  if (!breakPoint) {
    return {
      span: 8,
      layout: 'horizontal',
    }
  }
  return {
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint?.[2] as 'horizontal',
  }
}

const flatMapItems = (items: ProFormItemType[], ignoreRules?: boolean): ProFormItemType[] => {
  return items?.flatMap((item: any) => {
    if (item.fieldType === ProFieldType.GROUP && !item.title) {
      return item.props.children
    }
    if (ignoreRules) {
      return {
        ...item,
        rules: [],
        formItemProps: {
          ...item.formItemProps,
          rules: [],
        },
      }
    }
    return item
  })
}

const defaultWidth = isBrowser() ? document?.body?.clientWidth : 1024
export default defineComponent({
  name: 'ProQueryFilter',
  inheritAttrs: false,
  props: {
    ...queryFilterProps,
  },
  emits: ['collapse', 'resize'],
  setup(props, { slots, emit, expose, attrs }) {
    // totalSpan 统计控件占的位置，计算 offset 保证查询按钮在最后一列
    const totalSpan = ref(0)
    // totalSize 统计控件占的份数
    const totalSize = ref(0)
    // for split compute
    const currentSpan = ref(0)
    const intl = useIntl()
    const prefixCls = usePrefixCls('query-filter')
    const wrapEl = useTemplateRef<HTMLDivElement>('wrapper')
    const formRef = ref<InstanceType<typeof BaseForm> & ProFormActionType>()
    const processedList = ref<ProFormItemType[]>([])
    const [width, setWidth] = useMergedState(defaultWidth)
    const formExpose = useFormExpose(formRef)
    useResizeObserver(wrapEl, (entries) => {
      const entry = entries[0]
      const { width: newWidth, height } = entry?.contentRect || ({} as DOMRectReadOnly)
      if (width.value !== newWidth && newWidth > 17) {
        setWidth(newWidth)
      }
      emit('resize', newWidth, height)
    })

    const spanSize = computed(() => getSpanConfig(props.layout, width.value + 16, props.span))

    const showLength = computed(() => {
      if (props.defaultFormItemsNumber !== undefined) {
        return props.defaultFormItemsNumber
      }
      if (props.defaultColsNumber !== undefined) {
        const oneRowControlsNumber = 24 / spanSize.value.span - 1
        return props.defaultColsNumber > oneRowControlsNumber
          ? oneRowControlsNumber
          : props.defaultColsNumber
      }
      return Math.max(1, 24 / spanSize.value.span - 1)
    })

    const hiddenNum = computed(
      () => props.showHiddenNum && processedList.value.filter((item) => item.hidden).length,
    )

    const needCollapse = computed(() => {
      if (totalSpan.value < 24 || totalSize.value <= showLength.value) {
        return false
      }
      return true
    })

    const offset = computed(() => {
      const offsetSpan = (currentSpan.value % 24) + spanSize.value.span
      if (offsetSpan > 24) {
        return 24 - spanSize.value.span
      }
      return 24 - offsetSpan
    })

    /** 计算最大宽度防止溢出换行 */
    const formItemFixStyle = computed<FormItemProps | undefined>(() => {
      if (props.labelWidth && spanSize.value.layout !== 'vertical' && props.labelWidth !== 'auto') {
        return {
          labelCol: {
            flex: `0 0 ${props.labelWidth}px`,
          },
          wrapperCol: {
            style: {
              maxWidth: `calc(100% - ${props.labelWidth}px)`,
            },
          },
          style: {
            flexWrap: 'nowrap',
          },
        }
      }
      return undefined
    })

    const [collapsed, setCollapsed] = useMergedState<boolean | undefined>(
      () => props.defaultCollapsed,
      {
        value: computed(() => props.collapsed),
        onChange: (val) => {
          emit('collapse', val)
        },
      },
    )

    const formProps = computed(() => {
      return {
        ...omitUndefined(
          omit(props, [
            'defaultCollapsed',
            'collapsed',
            'grid',
            'showLoading',
            'defaultColsNumber',
            'searchGutter',
            // 'onFinish',
            'submitOnLoading',
            'preserve',
            'submitter',
            'ignoreRules',
            'searchText',
            'resetText',
            'labelWidth',
            'layout',
            'items',
            'gridSubmitter',
            'rowProps',
            'defaultFormItemsNumber',
            'showHiddenNum',
            'ignoreRules',
            'onCollapse',
            'onReset',
          ]),
        ),
      }
    })

    const submitterConfig = computed(() => {
      if (props.submitter === false) {
        return false
      }

      return merge(
        {
          style: {
            justifyContent: 'flex-end',
          },
          reverse: true,
          searchConfig: {
            submitText: props.searchText || intl.getMessage('form.search', '搜索'),
            resetText: props.resetText || intl.getMessage('form.reset', '重置'),
          },
          colProps: {
            span: spanSize.value.span,
            offset: offset.value,
          },
        },
        props.submitter,
      )
    })

    watch(
      [spanSize, collapsed, () => props.items],
      () => {
        let firstRowFull = false
        currentSpan.value = 0
        totalSize.value = 0
        totalSpan.value = 0
        if (props.items?.length) {
          processedList.value = flatMapItems(props.items, props.ignoreRules).map((item, index) => {
            // 如果 formItem 自己配置了 hidden，默认使用它自己的
            const colSize = item.colSize ?? 1
            const colSpan = Math.min(spanSize.value.span * (colSize || 1), 24)
            // 计算总的 totalSpan 长度
            totalSpan.value += colSpan
            // 计算总的 colSize 长度
            totalSize.value += colSize

            if (index === 0) {
              firstRowFull = colSpan === 24 && !item.hidden
            }

            const hidden: boolean | undefined =
              item.hidden ||
              // 如果收起了
              (collapsed.value &&
                (firstRowFull ||
                  // 如果 超过显示长度 且 总长度超过了 24
                  totalSize.value > showLength.value) &&
                !!index)

            // console.log(item, item.fieldType, hidden)
            if (hidden) {
              if (!props.preserve) {
                return {
                  ...item,
                  colProps: { span: 0 },
                  hidden: true,
                }
              }
              return {
                ...item,
                colProps: { span: colSpan },
                hidden: true,
              }
            }

            if (24 - (currentSpan.value % 24) < colSpan) {
              // 如果当前行空余位置放不下，那么折行
              totalSpan.value += 24 - (currentSpan.value % 24)
              currentSpan.value += 24 - (currentSpan.value % 24)
            }

            currentSpan.value += colSpan
            return {
              ...item,
              hidden,
              formItemProps: formItemFixStyle.value,
              colProps: {
                span: colSpan,
              },
            }
          })
        } else {
          processedList.value = []
        }
      },
      {
        immediate: true,
      },
    )

    expose({
      formRef,
      ...formExpose,
    })

    return () => (
      <div class={`${prefixCls}-wrap`} ref="wrapper" {...attrs}>
        <BaseForm
          ref={formRef}
          class={prefixCls}
          {...formProps.value}
          grid
          gridSubmitter
          rowProps={{
            gutter: props.searchGutter,
            justify: 'start',
            class: `${prefixCls}-row`,
          }}
          submitOnLoading={false}
          submitter={submitterConfig.value}
          items={processedList.value}
          layout={spanSize.value.layout}
          v-slots={{
            ...slots,
            submitter: ({ defaultDoms }) => {
              return (
                <>
                  {defaultDoms}
                  {needCollapse.value !== false && (
                    <a
                      class={`${prefixCls}-collapse-button`}
                      onClick={() => setCollapsed(!collapsed.value)}
                    >
                      {collapsed.value
                        ? intl.getMessage('form.collapsed', '展开')
                        : intl.getMessage('form.expand', '收起')}
                      {!!hiddenNum.value && `(${hiddenNum.value})`}
                      <DownOutlined
                        style={{
                          marginInlineStart: '0.5em',
                          transition: '0.3s all',
                          transform: `rotate(${collapsed.value ? 0 : 0.5}turn)`,
                        }}
                      />
                    </a>
                  )}
                </>
              )
            },
          }}
          onReset={(values) => {
            if (props.resetOnSubmit) {
              formRef.value?.submit()
            }
            props.onReset?.(values)
          }}
        />
      </div>
    )
  },
})
