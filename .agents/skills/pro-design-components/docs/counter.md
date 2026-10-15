## API

### ProCounter

数字动画组件，支持数字动画效果。

| 参数       | 说明           | 类型      | 默认值     |
| ---------- | -------------- | --------- | ---------- |
| startVal   | 起始值         | `number`  | `0`        |
| endVal     | 结束值         | `number`  | `2021`     |
| duration   | 动画持续时间   | `number`  | `1500`     |
| autoplay   | 自动执行       | `boolean` | `true`     |
| prefix     | 前缀           | `string`  | -          |
| suffix     | 后缀           | `string`  | -          |
| separator  | 分隔符         | `string`  | `','`      |
| color      | 字体颜色       | `string`  | -          |
| useEasing  | 是否开启动画   | `boolean` | `true`     |
| transition | 动画效果       | `string`  | `'linear'` |
| decimals   | 保留小数点位数 | `number`  | `0`        |

### Events

| 事件名   | 说明       | 类型         |
| -------- | ---------- | ------------ |
| started  | 动画已开始 | `() => void` |
| finished | 动画已结束 | `() => void` |

### Exposes

| 名称  | 说明         | 类型         |
| ----- | ------------ | ------------ |
| start | 开始执行动画 | `() => void` |
| reset | 重置         | `() => void` |
