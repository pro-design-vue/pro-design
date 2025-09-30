<!--
 * @Author: shen
 * @Date: 2022-06-20 09:32:09
 * @LastEditors: shen
 * @LastEditTime: 2025-09-28 14:58:54
 * @Description:
-->
<script lang="ts">
export default {
  name: 'Demo',
}
</script>
<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { message, Tooltip } from 'ant-design-vue'
import Icon, { SnippetsOutlined } from '@ant-design/icons-vue'
import VSourceCode from './source-code.vue'

const props = defineProps<{
  source: string
  path: string
  rawSource: string
  description?: string
}>()

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()

const decodedDescription = computed(() => decodeURIComponent(props.description!))

const copyCode = async () => {
  if (!isSupported) {
    message.error('不支持复制')
  }
  try {
    await copy()
    message.success('复制成功')
  } catch (e: any) {
    message.error(e.message)
  }
}
</script>

<template>
  <ClientOnly>
    <p text="sm" v-html="decodedDescription" />
    <div class="example">
      <div class="example-showcase">
        <slot name="source" />
      </div>
      <div class="op-btns">
        <Tooltip title="复制代码" :show-arrow="false">
          <span class="op-btn" @click="copyCode()">
            <SnippetsOutlined style="font-size: 16px" />
          </span>
        </Tooltip>
        <Tooltip :title="!sourceVisible ? '显示代码' : '收起代码'" :show-arrow="false">
          <Icon class="op-btn" @click="toggleSourceVisible()">
            <template #component="svgProps">
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                v-bind="svgProps"
              >
                <path
                  v-show="!sourceVisible"
                  d="M1018.645 531.298c8.635-18.61 4.601-41.42-11.442-55.864l-205.108-184.68c-19.7-17.739-50.05-16.148-67.789 3.552-17.738 19.7-16.148 50.051 3.553 67.79l166.28 149.718-167.28 150.62c-19.7 17.738-21.291 48.088-3.553 67.789 17.739 19.7 48.089 21.291 67.79 3.553l205.107-184.68a47.805 47.805 0 0 0 12.442-17.798zM119.947 511.39l166.28-149.719c19.7-17.738 21.29-48.088 3.552-67.789-17.738-19.7-48.088-21.291-67.789-3.553L16.882 475.01C.84 489.456-3.194 512.264 5.44 530.874a47.805 47.805 0 0 0 12.442 17.798l205.108 184.68c19.7 17.739 50.05 16.148 67.79-3.552 17.738-19.7 16.147-50.051-3.553-67.79l-167.28-150.62z"
                  fill-rule="evenodd"
                  opacity=".78"
                />
                <path
                  v-show="sourceVisible"
                  d="M1018.645 531.298c8.635-18.61 4.601-41.42-11.442-55.864l-205.108-184.68c-19.7-17.739-50.05-16.148-67.789 3.552-17.738 19.7-16.148 50.051 3.553 67.79l166.28 149.718-167.28 150.62c-19.7 17.738-21.291 48.088-3.553 67.789 17.739 19.7 48.089 21.291 67.79 3.553l205.107-184.68a47.805 47.805 0 0 0 12.442-17.798zM119.947 511.39l166.28-149.719c19.7-17.738 21.29-48.088 3.552-67.789-17.738-19.7-48.088-21.291-67.789-3.553L16.882 475.01C.84 489.456-3.194 512.264 5.44 530.874a47.805 47.805 0 0 0 12.442 17.798l205.108 184.68c19.7 17.739 50.05 16.148 67.79-3.552 17.738-19.7 16.147-50.051-3.553-67.79l-167.28-150.62zm529.545-377.146c24.911 9.066 37.755 36.61 28.688 61.522L436.03 861.068c-9.067 24.911-36.611 37.755-61.522 28.688-24.911-9.066-37.755-36.61-28.688-61.522l242.15-665.302c9.067-24.911 36.611-37.755 61.522-28.688z"
                  fill-rule="evenodd"
                  opacity=".78"
                />
              </svg>
            </template>
          </Icon>
        </Tooltip>
      </div>
      <VSourceCode :visible="sourceVisible" :source="source" />
      <div v-show="sourceVisible" class="op-btns" @click="toggleSourceVisible(false)">
        <Tooltip title="收起代码" :show-arrow="false">
          <Icon class="op-btn" @click="toggleSourceVisible(false)">
            <template #component="svgProps">
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                v-bind="svgProps"
              >
                <path
                  d="M1018.645 531.298c8.635-18.61 4.601-41.42-11.442-55.864l-205.108-184.68c-19.7-17.739-50.05-16.148-67.789 3.552-17.738 19.7-16.148 50.051 3.553 67.79l166.28 149.718-167.28 150.62c-19.7 17.738-21.291 48.088-3.553 67.789 17.739 19.7 48.089 21.291 67.79 3.553l205.107-184.68a47.805 47.805 0 0 0 12.442-17.798zM119.947 511.39l166.28-149.719c19.7-17.738 21.29-48.088 3.552-67.789-17.738-19.7-48.088-21.291-67.789-3.553L16.882 475.01C.84 489.456-3.194 512.264 5.44 530.874a47.805 47.805 0 0 0 12.442 17.798l205.108 184.68c19.7 17.739 50.05 16.148 67.79-3.552 17.738-19.7 16.147-50.051-3.553-67.79l-167.28-150.62zm529.545-377.146c24.911 9.066 37.755 36.61 28.688 61.522L436.03 861.068c-9.067 24.911-36.611 37.755-61.522 28.688-24.911-9.066-37.755-36.61-28.688-61.522l242.15-665.302c9.067-24.911 36.611-37.755 61.522-28.688z"
                  fill-rule="evenodd"
                  opacity=".78"
                />
              </svg>
            </template>
          </Icon>
        </Tooltip>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="less">
.example {
  margin-bottom: 20px;
  border: 1px var(--vp-c-divider) solid;
  border-radius: 5px;

  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    background-color: var(--bg-color);
    border-radius: var(--el-border-radius-base);
  }

  .op-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    padding: 0.5rem;
    border-top: 1px var(--vp-c-divider) dashed;

    .op-btn {
      margin: 0 0.5rem;
      color: var(--vp-c-text-3);
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: var(--vp-c-text-1);
        transform: scale(1.2);
      }
    }
  }

  &-float-control {
    position: sticky;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    margin-top: -1px;
    color: var(--vp-c-text-3);
    cursor: pointer;
    border-top: 1px solid var(--vp-c-divider);
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;

    span {
      margin-left: 10px;
      font-size: 14px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
