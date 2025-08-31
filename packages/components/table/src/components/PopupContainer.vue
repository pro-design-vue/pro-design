<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-29 14:05:03
 * @Description:
-->
<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import { useInjectPopup } from './context/PopupContext'
import { resize } from '@pro-design-vue/directives'
import onClickOutside from '../utils/onClickOutside'

export default defineComponent({
  name: 'PopupContainer',
  directives: { resize },
  props: { prefixCls: { type: String } },
  setup(_, { expose }) {
    const targetRef = shallowRef<HTMLDivElement>()
    const rootRef = shallowRef<HTMLDivElement>()
    const { registerPopupContext, visible } = useInjectPopup()

    let currentTarget: HTMLDivElement | null = null
    const hidePopup = (targetDom: HTMLDivElement) => {
      currentTarget = null
      visible.value = false
      targetDom.style.opacity = '0'
      popupContent.value = null
    }
    const popupContent = shallowRef<any>()

    let timer
    const alignPopup = () => {
      const targetDom = targetRef.value
      if (!targetDom || !visible.value || !rootRef.value) {
        visible.value = false
        return
      }
      if (!currentTarget || !document.contains(currentTarget)) return
      const { x, y } = currentTarget.getBoundingClientRect()
      const { left, top, width } = rootRef.value.getBoundingClientRect()
      const offsetWidth = targetDom.offsetWidth
      const firstChild = targetDom.children[0]
      const scrollHeight = Math.min(targetDom.scrollHeight, firstChild?.scrollHeight || 0)
      targetDom.style.opacity = '1'
      targetDom.style.height = `${scrollHeight}px`
      let targetLeft = x - left
      const targetTop = y - top
      if (targetLeft + offsetWidth > width) {
        targetLeft = width - offsetWidth
      }
      targetDom.style.left = `${targetLeft}px`
      targetDom.style.top = `${targetTop}px`
    }

    onClickOutside(targetRef, () => {
      hidePopup(targetRef.value!)
    })

    expose({ alignPopup: alignPopup })

    registerPopupContext({
      showPopupContent: (handle, event, params) => {
        visible.value = true
        popupContent.value = () => {
          if (handle) {
            return handle({
              event,
              ...params,
              popupContaniner: targetRef.value,
              hidePopup: () => {
                hidePopup(targetRef.value!)
              },
            })
          }
          return null
        }

        currentTarget = event.currentTarget
        clearTimeout(timer)
        timer = setTimeout(() => {
          alignPopup()
        })
        event.preventDefault()
      },
      hidePopupContent: hidePopup,
      getPopupContainer: () => targetRef.value!,
    })

    return {
      hidePopup,
      alignPopup,
      handlePopupResize: () => {
        alignPopup()
      },
      handleRootResize: () => {
        alignPopup()
      },
      targetRef,
      rootRef,
      popupContent,
      visible,
    }
  },
})
</script>

<template>
  <div
    ref="rootRef"
    :class="`${prefixCls}-popup`"
    :style="{ position: 'absolute', top: '0', left: '0', right: '0' }"
    @resize="handleRootResize"
  >
    <div v-show="visible" ref="targetRef" :class="`${prefixCls}-popup-container`">
      <div v-resize :class="`${prefixCls}-popup-container-inner`" @resize="handlePopupResize">
        <component :is="popupContent"></component>
      </div>
    </div>
  </div>
</template>
