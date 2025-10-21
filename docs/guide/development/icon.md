---
outline: deep
---

# 图标

项目中有以下多种图标使用方式，可以根据实际情况选择使用：

## Iconify 图标 

集成了 [iconify](https://github.com/iconify/iconify) 图标库

### 新增

可在 `src/icons/iconify` 目录下新增图标：

```ts
// src/icons/iconify/index.ts
import { createIconifyIcon } from '../create-icon';

export const MdiKeyboardEsc = createIconifyIcon('mdi:keyboard-esc');
```

### 使用

```vue
<script setup lang="ts">
import { MdiKeyboardEsc } from '@/icons';
</script>

<template>
  <MdiKeyboardEsc  />
</template>
```

## Svg 图标

没有采用 Svg Sprite 的方式，而是直接引入 Svg 图标

### 新增
可以在 `src/icons/svg/icons` 目录下新增图标文件test.svg, 然后在 `src/icons/svg/index.ts` 中引入：

```ts
// src/icons/svg/index.ts
import { createIconifyIcon } from '../create-icon'

const SvgTestIcon = createIconifyIcon('svg:test');

export { SvgTestIcon };
```

### 使用
```vue
<script setup lang="ts">
import { SvgTestIcon } from '@/icons';
</script>

<template>
  <SvgTestIcon />
</template>

```

