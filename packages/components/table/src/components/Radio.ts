/*
 * @Author: shen
 * @Date: 2022-11-07 12:52:20
 * @LastEditors: shen
 * @LastEditTime: 2022-11-07 12:55:16
 * @Description:
 */
import { createVNode } from 'vue'
import { checkboxProps } from './interface'

import type { FunctionalComponent } from 'vue'
import type { CheckboxProps } from './interface'

const Radio: FunctionalComponent<CheckboxProps> = (props, { emit }) => {
  const {
    prefixCls,
    disabled,
    tabindex,
    id,
    style,
    class: className,
    checked,
    indeterminate,
    name,
    ariaLabel,
  } = props
  return createVNode(
    'span',
    {
      class: {
        [className || '']: !!className,
        [`${prefixCls}-radio`]: true,
        [`${prefixCls}-radio-checked`]: checked,
        [`${prefixCls}-radio-disabled`]: disabled,
        [`${prefixCls}-radio-indeterminate`]: indeterminate,
      },
      style,
      tabindex,
      id,
    },
    [
      createVNode(
        'input',
        {
          class: `${prefixCls}-radio-input`,
          checked: checked,
          disabled: disabled,
          type: 'radio',
          onClick: (e: any) => {
            e.target.checked = checked
            emit('change', e)
          },
          name,
          'aria-label':
            ariaLabel === undefined
              ? disabled
                ? 'This row is disabled selection'
                : `Press Space to toggle row selection (${checked ? 'checked' : 'unchecked'})`
              : ariaLabel,
        },
        null,
      ),
      createVNode('span', { class: `${prefixCls}-radio-inner` }, null),
    ],
  )
}
Radio.displayName = 'Radio'
Radio.props = checkboxProps()
Radio.emits = ['change']
export default Radio
