---
title: ProCropper 图片裁剪
outline: deep
---

# ProCropper 图片裁剪

ProCropper 是基于 [Cropper.js](https://github.com/fengyuanchen/cropperjs) 封装的图片裁剪组件，提供了简洁的图片裁剪能力，支持缩放控制。

## 使用演示

通过 `imgSrc` 设置图片源，通过 `cropperWidth` 和 `cropperHeight` 设置裁剪宽高比例，通过 `cropperProps` 设置 cropper.js 的原始配置。

:::demo

cropper/basic

:::

## API

### Props

| 参数          | 说明                           | 类型                    | 默认值    |
| ------------- | ------------------------------ | ----------------------- | --------- |
| imgSrc        | 图片地址                       | `string`                | `''`      |
| cropperWidth  | 裁剪框宽度，设置后影响裁剪比例 | `number`                | -         |
| cropperHeight | 裁剪框高度，设置后影响裁剪比例 | `number`                | -         |
| cropperProps  | Cropper.js 原始配置项          | `Record<string, any>`   | `{}`      |

### Exposes

| 名称              | 说明                             | 类型                                                           |
| ----------------- | -------------------------------- | -------------------------------------------------------------- |
| getCroppedCanvas  | 获取裁剪后的 canvas，返回 base64 | `(file: File, options?: Cropper.GetCroppedCanvasOptions) => string` |