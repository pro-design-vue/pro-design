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
  autoContentHeight = false,
  heightOffset = 0,
  headerClass = '',
  contentClass = '',
  footerClass = '',
  tabList = [],
  contentStyle,
  tabProps,
  contentPadding = 16,
} = defineProps<PageProps>()

const slots = useSlots()
const prefixCls = usePrefixCls('page')
const headerHeight = ref(0)
const footerHeight = ref(0)
const tabsHeight = ref(0)
const shouldAutoHeight = ref(false)

const { contentOffsetTop } = useProConfigInject()
const tabActiveKey = defineModel<TabsProps['activeKey']>('activeKey')
const pageRef = useTemplateRef<HTMLDivElement>('pageRef')
const headerRef = useTemplateRef<HTMLDivElement>('headerRef')
const footerRef = useTemplateRef<HTMLDivElement>('footerRef')
const tabsRef = useTemplateRef<HTMLDivElement>('tabsRef')
const headerCls = computed(() => ({
  [`${prefixCls}-header`]: true,
  [headerClass]: true,
}))

const contentCls = computed(() => ({
  [`${prefixCls}-content`]: true,
  [contentClass]: true,
}))

const footerCls = computed(() => ({
  [`${prefixCls}-footer`]: true,
  [footerClass]: true,
}))

const offset = computed(() => {
  if (autoContentHeight) {
    return {
      top: -contentPadding,
      bottom: -contentPadding,
    }
  }
  return {
    top: contentOffsetTop?.value || 0,
    bottom: 0,
  }
})

const contentStyles = computed<StyleValue>(() => {
  if (autoContentHeight) {
    return {
      height: `calc(var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT}) - ${headerHeight.value}px - ${tabsHeight.value}px - ${typeof heightOffset === 'number' ? `${heightOffset}px` : heightOffset})`,
      overflowY: shouldAutoHeight.value ? 'auto' : 'unset',
      padding: `${contentPadding || 0}px`,
      ...contentStyle,
    }
  }
  return {
    padding: `${contentPadding || 0}px`,
    ...contentStyle,
  }
})

const mergeTabsProps = computed(() => omit(tabProps ?? {}, ['activeKey', 'onChange']))

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
  <div ref="pageRef" :class="[prefixCls, tabList?.length ? `is-tabs` : '']">
    <div
      v-if="
        $slots.header || description || $slots.description || title || $slots.title || $slots.extra
      "
      ref="headerRef"
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
    <div v-if="tabList?.length" ref="tabsRef" :class="`${prefixCls}-tabs`">
      <Tabs v-model:activeKey="tabActiveKey" v-bind="mergeTabsProps">
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

    <div v-if="$slots.footer" ref="footerRef" :class="footerCls">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
