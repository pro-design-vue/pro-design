import { Tooltip } from 'ant-design-vue'
import { defineComponent, ref, computed, watch, getCurrentInstance, nextTick } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    prefixCls: String as PropType<string>,
    tooltipProps: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    getPopupContainer: Function as PropType<() => HTMLElement>,
    open: Boolean,
    onCellLeave: Function,
    align: Object as PropType<any>,
    shouldOpen: {
      type: [Function, Boolean] as PropType<boolean | ((isEllipsis: boolean) => boolean)>,
    },
    allowEnter: { type: Boolean, default: true },
  },
  setup(props, { slots, emit }) {
    const align = computed(() => ({ offset: [0, 13] }))
    const instance = getCurrentInstance()
    const shouldOpen = ref(false)

    const hasEllipsis = (firstChild: HTMLElement) => {
      const range = document.createRange()
      range.setStart(firstChild, 0)
      range.setEnd(firstChild, firstChild.childNodes.length)
      let rangeWidth = range.getBoundingClientRect().width
      // let rangeHeight = range.getBoundingClientRect().height
      rangeWidth - Math.floor(rangeWidth) < 1e-3 && (rangeWidth = Math.floor(rangeWidth))
      // rangeHeight - Math.floor(rangeHeight) < 1e-3 && (rangeHeight = Math.floor(rangeHeight))
      const {
        pLeft: pLeft,
        pRight: pRight,
        // pTop: pTop,
        // pBottom: pBottom,
      } = ((child) => {
        const styles = window.getComputedStyle(child, null)
        return {
          pLeft: Number.parseInt(styles.paddingLeft, 10) || 0,
          pRight: Number.parseInt(styles.paddingRight, 10) || 0,
          // pTop: Number.parseInt(styles.paddingTop, 10) || 0,
          // pBottom: Number.parseInt(styles.paddingBottom, 10) || 0,
        }
      })(firstChild)
      return (
        rangeWidth + (pLeft + pRight) > firstChild.offsetWidth ||
        // rangeHeight + (pTop + pBottom) > firstChild.offsetHeight ||
        firstChild.scrollWidth > firstChild.offsetWidth
      )
    }

    watch(
      () => props.open,
      (newValue) => {
        if (newValue) {
          if ('function' === typeof props.shouldOpen) {
            nextTick(() => {
              const el: HTMLElement = ((ins) => {
                let el = ins?.vnode?.el || (ins as any)?.$el || ins
                for (; el && !el.tagName; ) el = el.nextSibling
                return el
              })(instance)
              if (el) {
                const firstChild = el.childNodes[0]
                const isEllipsis = firstChild && hasEllipsis(firstChild as HTMLElement)
                shouldOpen.value = (props.shouldOpen as any)?.(isEllipsis)
              }
            })
          } else {
            shouldOpen.value = props.shouldOpen!
          }
        } else {
          shouldOpen.value = false
        }
      },
      { immediate: true, flush: 'post' },
    )

    const onOpenChange = () => {
      emit('cellLeave')
    }

    return () => {
      if (shouldOpen.value) {
        return (
          <Tooltip
            get-popup-container={props.getPopupContainer}
            align={align.value}
            {...props.tooltipProps}
            open={props.open}
            overlay-style={
              !props.allowEnter
                ? {
                    pointerEvents: 'none',
                  }
                : {}
            }
            onOpenChange={onOpenChange}
            v-slots={{ ...slots }}
          />
        )
      }
      return slots.default?.()
    }
  },
})
