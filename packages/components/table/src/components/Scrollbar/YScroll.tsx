/*
 * @Author: shen
 * @Date: 2023-11-07 15:07:59
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 10:56:26
 * @Description:
 */
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  // withModifiers,
} from 'vue'
import { useInjectTable } from '../context/TableContext'
import { useVScrollSyncInject } from '../../hooks/useVScrollSync'
import { isMacOsUserAgent, isIOSUserAgent } from '../../utils/browser'
import { addClass, removeClass } from '../../utils/class'

export default defineComponent({
  props: { onlyAutoShow: { type: Boolean }, notShowAuto: { type: Boolean } },
  setup: (props) => {
    const tableContext = useInjectTable()
    const prefixCls = computed(() => `${tableContext.props.prefixCls}`)

    const scrollViewportRef = ref<HTMLDivElement>()
    const rootRef = ref<HTMLDivElement>()
    const isScrollbarActive = ref(false)
    const commonStyle = computed(() => {
      const width = `${tableContext.scrollBarSize.value || 15}px`
      return { width, minWidth: width, maxWidth: width }
    })
    const isApple = isMacOsUserAgent() || isIOSUserAgent()
    const isIosScroll = computed(() => 0 === tableContext.scrollBarSize.value && isApple)

    const rootClass = computed(() => ({
      [`${prefixCls.value}-vertical-scroll`]: true,
      [`${prefixCls.value}-vertical-scroll-hidden`]: 0 === tableContext.scrollBarSize.value,
      [`${prefixCls.value}-scrollbar-active`]: isScrollbarActive.value,
      [`${prefixCls.value}-apple-scroll`]: isApple,
    }))

    const showVerticalScrollbar = computed(
      () =>
        tableContext.showVerticalScrollbar.value &&
        (!props.onlyAutoShow || isIosScroll.value) &&
        (!props.notShowAuto || !isIosScroll.value),
    )

    const verticalStyle = computed(() => {
      const barSize = `${tableContext.scrollBarSize.value || 15}px`
      return {
        height: `${tableContext.viewportHeight.value || 15}px`,
        width: barSize,
        minWidth: barSize,
        maxWidth: barSize,
      }
    })

    const { addVScrollDom, removeVScrollDom } = useVScrollSyncInject()
    let timer: any = null
    const onScroll = () => {
      if (isIosScroll.value) {
        clearTimeout(timer)
        addClass(rootRef.value!, `${prefixCls.value}-scrolling`)
        timer = setTimeout(() => {
          removeClass(rootRef.value!, `${prefixCls.value}-scrolling`)
        }, 500)
      }
    }

    onMounted(() => {
      watch(
        scrollViewportRef,
        () => {
          if (scrollViewportRef.value) {
            removeVScrollDom(scrollViewportRef.value)
            scrollViewportRef.value.removeEventListener('scroll', onScroll)
            addVScrollDom(scrollViewportRef.value, true)
            scrollViewportRef.value.addEventListener('scroll', onScroll, { passive: true })
          }
        },
        { immediate: true },
      )
    })
    onBeforeUnmount(() => {
      clearTimeout(timer)
      if (scrollViewportRef.value) {
        removeVScrollDom(scrollViewportRef.value)
        scrollViewportRef.value.removeEventListener('scroll', onScroll)
      }
    })
    return () => {
      if (showVerticalScrollbar.value) {
        return (
          <div
            ref={rootRef}
            class={rootClass.value}
            aria-hidden="true"
            style={commonStyle.value}
            onMousedown={() => (isScrollbarActive.value = true)}
            onMouseenter={() => (isScrollbarActive.value = true)}
            // onTouchstart={withModifiers(() => (isScrollbarActive.value = true), ['passive'])}
            onMouseleave={() => (isScrollbarActive.value = false)}
            onTouchend={() => (isScrollbarActive.value = false)}
          >
            <div
              key="center"
              ref={scrollViewportRef}
              class={`${prefixCls.value}-vertical-scroll-viewport`}
              style={commonStyle.value}
            >
              <div
                class={`${prefixCls.value}-body-vertical-scroll-container`}
                style={verticalStyle.value}
              ></div>
            </div>
          </div>
        )
      }
      return null
    }
  },
})
