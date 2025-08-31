<!--
 * @Author: shen
 * @Date: 2023-11-06 16:03:18
 * @LastEditors: shen
 * @LastEditTime: 2025-08-27 13:47:04
 * @Description:
-->
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { InputSearch } from 'ant-design-vue'
import { useIntl } from '@pro-design-vue/components/config-provider'

export default defineComponent({
  name: 'TableToolBarSearch',
  inheritAttrs: false,
  components: { AInputSearch: InputSearch },
  emits: ['search'],
  setup(_, { emit, attrs }) {
    const searchValue = ref((attrs.defaultValue ?? attrs.value ?? '') as string)
    const intl = useIntl()

    const onSearch = (value) => {
      emit('search', value)
    }

    return {
      attrs,
      intl,
      searchValue,
      onSearch,
    }
  },
})
</script>

<template>
  <AInputSearch
    allow-clear
    :placeholder="
      (attrs.placeholder as string) || intl.getMessage('form.inputPlaceholder', '请输入')
    "
    :style="attrs.style ?? { width: '200px' }"
    v-bind="attrs"
    v-model:value="searchValue"
    @search="onSearch"
  />
</template>
