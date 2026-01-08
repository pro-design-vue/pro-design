import { Fragment, type CSSProperties, type FunctionalComponent, type VNode } from 'vue'
import { Badge, Space } from 'ant-design-vue'
import { getType } from './objectToMap'
import type { ProFieldValueEnumType, ProSchemaValueEnumMap, ProVNode } from '@pro-design-vue/utils'

type StatusProps = {
  className?: string
  style?: CSSProperties
  text?: ProVNode
}

export const objectToMap = (value: ProFieldValueEnumType | undefined): ProSchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProSchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

const TableStatus: {
  Success: FunctionalComponent<StatusProps>
  Error: FunctionalComponent<StatusProps>
  Processing: FunctionalComponent<StatusProps>
  Default: FunctionalComponent<StatusProps>
  Warning: FunctionalComponent<StatusProps>
  success: FunctionalComponent<StatusProps>
  error: FunctionalComponent<StatusProps>
  processing: FunctionalComponent<StatusProps>
  default: FunctionalComponent<StatusProps>
  warning: FunctionalComponent<StatusProps>
} = {
  Success: ({ text }) => <Badge status="success" text={text} />,
  Error: ({ text }) => <Badge status="error" text={text} />,
  Default: ({ text }) => <Badge status="default" text={text} />,
  Processing: ({ text }) => <Badge status="processing" text={text} />,
  Warning: ({ text }) => <Badge status="warning" text={text} />,
  success: ({ text }) => <Badge status="success" text={text} />,
  error: ({ text }) => <Badge status="error" text={text} />,
  default: ({ text }) => <Badge status="default" text={text} />,
  processing: ({ text }) => <Badge status="processing" text={text} />,
  warning: ({ text }) => <Badge status="warning" text={text} />,
}

type ProFieldStatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'default'
  | 'processing'
  | 'Success'
  | 'Error'
  | 'Processing'
  | 'Default'
  | 'Warning'

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 * @param pure 纯净模式，不增加 status
 */
export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType,
  key?: number | string,
): VNode => {
  if (Array.isArray(text)) {
    return (
      <Space key={key} size={2} wrap v-slots={{ split: () => ',' }}>
        {text.map((value, index) => proFieldParsingText(value, valueEnumParams, index))}
      </Space>
    )
  }

  const valueEnum = objectToMap(valueEnumParams)

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: string
    status: ProFieldStatusType
    color?: string
  }

  if (!domText) {
    // @ts-ignore
    return <Fragment key={key}>{text?.label || text}</Fragment>
  }

  const { status, color } = domText

  const Status = TableStatus[status || 'Init']
  // 如果类型存在优先使用类型
  if (Status) {
    return <Status key={key} text={domText.text} />
  }

  // 如果不存在使用颜色
  if (color) {
    return <Badge key={key} color={color} text={domText.text} />
  }
  // 什么都没有使用 text
  return <Fragment key={key}>{domText.text || (domText as any as VNode)}</Fragment>
}
