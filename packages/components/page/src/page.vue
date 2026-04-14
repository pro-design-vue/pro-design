<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { TabsProps } from 'ant-design-vue'
import type { PageProps } from './types'

import { computed, nextTick, onMounted, ref, useSlots, useTemplateRef } from 'vue'
import { Tabs, TabPane } from 'ant-design-vue'
import { CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT } from '@pro-design-vue/constants'
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
  contentStyle,
  tabProps,
  contentPadding,
} = defineProps<PageProps>()

const slots = useSlots()
const prefixCls = usePrefixCls('page')
const headerHeight = ref(0)
const footerHeight = ref(0)
const tabsHeight = ref(0)
const shouldAutoHeight = ref(false)
const { contentOffsetTop, page } = useProConfigInject()
const tabActiveKey = defineModel<TabsProps['activeKey']>('activeKey')
const headerRef = useTemplateRef<HTMLDivElement>('header')
const footerRef = useTemplateRef<HTMLDivElement>('footer')
const tabsRef = useTemplateRef<HTMLDivElement>('tabs')

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
      height: `calc(var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT}) - ${headerHeight.value}px - ${tabsHeight.value}px - ${typeof heightOffset === 'number' ? `${heightOffset}px` : heightOffset})`,
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

const mergeTabsProps = computed(() =>
  omit(tabProps ?? {}, ['activeKey', 'tabPosition', 'onChange']),
)

async function calcContentHeight() {
  if (!autoContentHeight) {
    return
  }
  await nextTick()
  headerHeight.value = headerRef.value?.offsetHeight || 0
  footerHeight.value = footerRef.value?.offsetHeight || 0
  tabsHeight.value = tabsRef.value?.offsetHeight || 0

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

onMounted(() => {
  calcContentHeight()
})
</script>

<template>
  <div :class="[prefixCls, tabList?.length ? `is-tabs` : '']" :style="page?.pageStyle">
    <div
      v-if="
        $slots.header || description || $slots.description || title || $slots.title || $slots.extra
      "
      ref="header"
      :class="headerCls"
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

    <div :class="contentCls" :style="contentStyles">
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

    <div v-if="$slots.footer" ref="footer" :class="footerCls">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
