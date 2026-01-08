/*
 * @Author: shen
 * @Date: 2026-01-08 17:01:27
 * @LastEditors: shen
 * @LastEditTime: 2026-01-08 17:23:25
 * @Description:
 */
const antdFormItemPropsList = [
  'colon',
  'dependencies',
  'extra',
  'getValueFromEvent',
  'getValueProps',
  'hasFeedback',
  'help',
  'htmlFor',
  'initialValue',
  'noStyle',
  'label',
  'labelAlign',
  'labelCol',
  'name',
  'preserve',
  'normalize',
  'required',
  'rules',
  'trigger',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'wrapperCol',
  'hidden',
  // 我自定义的
  'addonBefore',
  'addonAfter',
  'addonWarpStyle',
]

export function pickProFormItemProps(props: {}) {
  const attrs = {} as Record<string, any>
  antdFormItemPropsList.forEach((key) => {
    if ((props as any)[key] !== undefined) {
      attrs[key] = (props as any)[key]
    }
  })
  return attrs
}
