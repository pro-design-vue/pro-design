## API

### ProConfigProvider

基于 Antv `ConfigProvider` 和 `App` 组件的二次包装，为组件提供统一的全局化配置。使用 Vue 的 `provide / inject`，只需在应用外围包裹一次即可全局生效。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| autoInsertSpaceInButton | 移除按钮中 2 个汉字之间的空格 | `boolean` | `true` |
| accessCodes | 权限码集合，用于按钮、标签页等组件的权限控制 | `Set<string>` | - |
| dark | 暗黑模式，内部实现 `theme.darkAlgorithm` | `boolean` | - |
| compact | 紧凑模式算法，内部实现 `theme.compactAlgorithm` | `boolean` | - |
| contentOffsetTop | 内容区域距离顶部的偏移量 | `number` | - |
| token | 同 `theme.token` | `AliasToken` | - |
| theme | 设置主题 | `Theme` | - |
| componentSize | 设置 antd 组件大小 | `'small' \| 'middle' \| 'large'` | - |
| csp | Content Security Policy 配置 | `{ nonce: string }` | - |
| direction | 文本展示方向 | `'ltr' \| 'rtl'` | `'ltr'` |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽 | `boolean \| number` | - |
| form | Form 组件通用属性 | `{ validateMessages?, requiredMark?, colon?, resetOnSubmit?, labelWidth?, searchText?, resetText?, labelAlign?, labelCol?, wrapperCol? }` | - |
| getPopupContainer | 弹出框渲染父节点 | `(triggerNode, dialogContext) => HTMLElement` | `() => document.body` |
| getTargetContainer | Affix、Anchor 滚动监听容器 | `() => HTMLElement` | `() => window` |
| input | Input 组件通用属性 | `{ autocomplete?: string }` | - |
| intl | Pro 组件国际化类型配置 | `{ locale: string, getMessage: (id, defaultMessage) => string }` | - |
| locale | 语言包配置 | `object` | - |
| page | Page 组件通用属性 | `{ contentClass?, pageStyle?, contentStyle?, autoContentHeight?, headerClass?, footerClass?, heightOffset?, contentPadding? }` | - |
| pageHeader | 统一设置 pageHeader 的 ghost | `{ ghost: boolean }` | `true` |
| prefixCls | 设置 antd 统一样式前缀 | `string` | `'ant'` |
| proPrefixCls | 设置 Pro 组件统一样式前缀 | `string` | `'pro'` |
| space | Space 的 size | `{ size: 'small' \| 'middle' \| 'large' \| number }` | - |
| transformCellText | Table 数据渲染前变换 | `({ text, column, record, index }) => any` | - |
| virtual | 关闭虚拟滚动 | `boolean` | - |
| wave | 水波纹特效 | `{ disabled?: boolean }` | - |
| table | Table 组件通用属性 | `{ animateRows?, bordered?, cardBordered?, childrenColumnName?, columnDrag?, columnResizable?, expandIconType?, expandRowByClick?, selectRowByClick?, rowKey?, cardProps?, size?, rowHover?, summaryFixed?, columnEmptyText?, highlightSelectRow?, options?, pagination? }` | - |
| modal | Modal 组件通用属性 | `{ draggable?: boolean, showFullscreen?: boolean }` | - |
| drawer | Drawer 组件通用属性 | `{ showFullscreen?: boolean }` | - |
| app | App 组件通用属性 | `{ message?: {...}, notification?: {...} }` | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 子内容 |