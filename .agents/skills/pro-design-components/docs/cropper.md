## API

### ProCropper

基于 [Cropper.js](https://github.com/fengyuanchen/cropperjs) 封装的图片裁剪组件。

| 参数          | 说明                           | 类型                  | 默认值 |
| ------------- | ------------------------------ | --------------------- | ------ |
| imgSrc        | 图片地址                       | `string`              | `''`   |
| cropperWidth  | 裁剪框宽度，设置后影响裁剪比例 | `number`              | -      |
| cropperHeight | 裁剪框高度，设置后影响裁剪比例 | `number`              | -      |
| cropperProps  | Cropper.js 原始配置项          | `Record<string, any>` | `{}`   |

### Exposes

| 名称             | 说明                             | 类型                                                                |
| ---------------- | -------------------------------- | ------------------------------------------------------------------- |
| getCroppedCanvas | 获取裁剪后的 canvas，返回 base64 | `(file: File, options?: Cropper.GetCroppedCanvasOptions) => string` |
