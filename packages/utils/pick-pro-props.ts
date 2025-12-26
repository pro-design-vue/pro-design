/*
 * @Author: shen
 * @Date: 2025-12-12 13:42:44
 * @LastEditors: shen
 * @LastEditTime: 2025-12-12 13:42:48
 * @Description:
 */
const proFieldProps = `valueType request plain renderFormItem render text formItemProps valueEnum`

const proFormProps = `fieldProps isDefaultDom groupProps contentRender submitterProps submitter`

export function pickProProps(props: Record<string, any>) {
  const propList = `${proFieldProps} ${proFormProps}`.split(/[\s\n]+/)

  const attrs = {} as Record<string, any>
  Object.keys(props || {}).forEach((key) => {
    if (propList.includes(key)) {
      return
    }
    attrs[key] = props[key]
  })
  return attrs
}
