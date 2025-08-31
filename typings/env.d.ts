/*
 * @Author: shen
 * @Date: 2025-08-27 16:07:19
 * @LastEditors: shen
 * @LastEditTime: 2025-08-31 21:56:37
 * @Description:
 */
import type { vShow } from 'vue'
import type { INSTALLED_KEY } from '@pro-design-vue/constants'

declare global {
  const process: {
    env: {
      NODE_ENV: string
    }
  }

  namespace JSX {
    interface IntrinsicAttributes {
      class?: unknown
      style?: unknown
    }
  }
}

declare module 'vue' {
  export interface App {
    [INSTALLED_KEY]?: boolean
  }

  export interface GlobalComponents {
    Component: (props: { is: Component | string }) => void
  }

  export interface ComponentCustomProperties {
    vShow: typeof vShow
  }
}

export {}
