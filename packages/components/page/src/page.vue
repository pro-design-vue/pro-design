<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { TabsProps } from 'ant-design-vue'
import type { PageProps } from './types'

import { computed, nextTick, onMounted, ref, useSlots, useTemplateRef, watch } from 'vue'
import { Tabs, TabPane, Spin } from 'ant-design-vue'
import { usePrefixCls } from '@pro-design-vue/hooks'
import { omit } from '@pro-design-vue/utils'
import { useProConfigInject } from '../../config-provider'

defineOptions({
  name: 'ProPage',
})
const {
  autoContentHeight,
  heightOffset = 0,
  headerClass = '',
  contentClass = '',
  footerClass = '',
  tabList = [],
  loading = false,
  contentLoading = false,
  contentStyle,
  tabProps,
  contentPadding,
} = defineProps<PageProps>()

const slots = useSlots()
const prefixCls = usePrefixCls('page')
const footerHeight = ref(0)
const contentHeight = ref(0)
const shouldAutoHeight = ref(false)
const { contentOffsetTop, page } = useProConfigInject()
const tabActiveKey = defineModel<TabsProps['activeKey']>('activeKey')
const footerRef = useTemplateRef<HTMLDivElement>('footer')
const contentRef = useTemplateRef<HTMLDivElement>('content')

const mergeContentPadding = computed(() => contentPadding || page?.value?.contentPadding || 16)
const mergeAutoContentHeight = computed(
  () => autoContentHeight || page?.value?.autoContentHeight || false,
)

const headerCls = computed(() => ({
  [`${prefixCls}-header`]: true,
  [page?.value?.headerClass || '']: true,
  [headerClass]: true,
}))

const contentCls = computed(() => ({
  [`${prefixCls}-content`]: true,
  [page?.value?.contentClass || '']: true,
  [contentClass]: true,
}))

const footerCls = computed(() => ({
  [`${prefixCls}-footer`]: true,
  [page?.value?.footerClass || '']: true,
  [footerClass]: true,
}))

const offset = computed(() => {
  if (mergeAutoContentHeight.value) {
    return {
      top: -mergeContentPadding.value,
      bottom: -mergeContentPadding.value,
    }
  }
  return {
    top: contentOffsetTop?.value || 0,
    bottom: 0,
  }
})

const contentStyles = computed<StyleValue>(() => {
  if (mergeAutoContentHeight.value) {
    return {
      height: `${contentHeight.value}px`,
      overflowY: shouldAutoHeight.value ? 'auto' : 'unset',
      padding: `${mergeContentPadding.value || 0}px`,
      ...page?.value?.contentStyle,
      ...contentStyle,
    }
  }
  return {
    padding: `${mergeContentPadding.value || 0}px`,
    ...page?.value?.contentStyle,
    ...contentStyle,
  }
})

const loadingProps = computed(() => {
  if (typeof loading === 'boolean') {
    return {
      spinning: loading,
    }
  }
  return loading
})

const contentLoadingProps = computed(() => {
  if (typeof contentLoading === 'boolean') {
    return {
      spinning: contentLoading,
    }
  }
  return contentLoading
})

const mergeTabsProps = computed(() =>
  omit(tabProps ?? {}, ['activeKey', 'tabPosition', 'onChange']),
)

async function calcContentHeight() {
  if (!autoContentHeight) {
    return
  }
  await nextTick()
  footerHeight.value = footerRef.value?.offsetHeight || 0

  contentHeight.value =
    window.innerHeight -
    (contentRef.value?.getBoundingClientRect()?.top || 0) -
    footerHeight.value -
    heightOffset

  setTimeout(() => {
    shouldAutoHeight.value = true
  }, 30)
}

const tabComp = computed(() => {
  if (tabList?.length) {
    const key = tabActiveKey.value ?? tabList[0]!.key!
    return slots[key]
  }
  return null
})

watch([() => loading, () => contentLoading], calcContentHeight)

onMounted(() => {
  calcContentHeight()
})
</script>

<template>
  <div :class="[prefixCls, tabList?.length ? `is-tabs` : '']" :style="page?.pageStyle">
    <Spin v-bind="loadingProps">
      <div
        v-if="
          $slots.header ||
          description ||
          $slots.description ||
          title ||
          $slots.title ||
          $slots.extra
        "
        ref="header"
        :class="headerCls"
        :style="headerStyle"
      >
        <slot name="header">
          <div :class="`${prefixCls}-header-wrap`">
            <slot name="title">
              <div v-if="title" :class="`${prefixCls}-title`">{{ title }}</div>
            </slot>

            <slot name="description">
              <p v-if="description" :class="`${prefixCls}-description`">
                {{ description }}
              </p>
            </slot>
          </div>

          <div v-if="$slots.extra">
            <slot name="extra"></slot>
          </div>
        </slot>
      </div>
      <div v-if="tabList?.length" ref="tabs" :class="`${prefixCls}-tabs`">
        <Tabs v-model:activeKey="tabActiveKey" v-bind="mergeTabsProps" tab-position="top">
          <template v-for="tab in tabList" :key="tab.key">
            <TabPane v-bind="tab" />
          </template>
        </Tabs>
      </div>
      <Spin v-bind="contentLoadingProps">
        <div ref="content" :class="contentCls" :style="contentStyles">
          <slot :active-key="tabActiveKey ?? tabList[0]?.key" :offset="offset"></slot>
          <slot
            name="tabs"
            v-if="tabList?.length"
            :active-key="tabActiveKey ?? tabList[0]?.key"
            :offset="offset"
          >
            <component :is="tabComp" />
          </slot>
        </div>
      </Spin>
      <div v-if="$slots.footer" ref="footer" :class="footerCls">
        <slot name="footer"></slot>
      </div>
    </Spin>
  </div>
</template>
