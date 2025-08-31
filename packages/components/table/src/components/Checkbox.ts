/*
 * @Author: shen
 * @Date: 2022-11-07 09:39:00
 * @LastEditors: shen
 * @LastEditTime: 2025-07-28 08:54:13
 * @Description:
 */
import { createVNode } from 'vue'
import { checkboxProps } from './interface'

import type { FunctionalComponent } from 'vue'
import type { CheckboxProps } from './interface'

const Checkbox: FunctionalComponent<CheckboxProps> = (props, { emit }) => {
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
    'label',
    {
      class: {
        [className || '']: !!className,
        [`${prefixCls}-checkbox`]: true,
        [`${prefixCls}-checkbox-checked`]: checked,
        [`${prefixCls}-checkbox-disabled`]: disabled,
        [`${prefixCls}-checkbox-indeterminate`]: indeterminate,
      },
      style,
      tabindex,
      id,
    },
    [
      createVNode(
        'input',
        {
          class: `${prefixCls}-checkbox-input`,
          checked: checked,
          disabled: disabled,
          type: 'checkbox',
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
      createVNode('span', { class: `${prefixCls}-checkbox-inner` }, null),
    ],
  )
}

Checkbox.displayName = 'Checkbox'
Checkbox.props = checkboxProps()
Checkbox.emits = ['change']
export default Checkbox
