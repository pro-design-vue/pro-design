/*
 * @Author: shen
 * @Date: 2023-08-17 10:04:39
 * @LastEditors: shen
 * @LastEditTime: 2025-07-18 10:05:52
 * @Description:
 */
/**
 * @param TEXT 文本框
 * @param PASSWORD 密码框
 * @param DIGIT 数值
 * @param DATE 日期 YYYY-MM-DD
 * @param DATE_RANGE 日期范围 YYYY-MM-DD[]
 * @param TIME: 时间 HH:mm:ss
 * @param TIME_RANGE: 时间区间 HH:mm:ss[]
 */
export enum ProFieldType {
  FORM_SET = 'formSet',
  FORM_LIST = 'formList',
  GROUP = 'group',
  DIVIDER = 'divider',
  TEXT = 'text',
  DIGIT = 'digit',
  DIGIT_RANGE = 'digitRange',
  SELECT = 'select',
  TREE_SELECT = 'treeSelect',
  CASCADER = 'cascader',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  CHECKBOX = 'checkbox',
  CHECKBOX_GROUP = 'checkboxGroup',
  RADIO_GROUP = 'radioGroup',
  SWITCH = 'switch',
  SLIDER = 'slider',
  RATE = 'rate',
  DATE = 'date',
  DATE_RANGE = 'dateRange',
  TIME = 'time',
  TIME_RANGE = 'timeRange',
  UPLOAD_BUTTON = 'uploadButton',
  UPLOAD_DRAGGER = 'uploadDragger',
  UPLOAD_PICTURE = 'uploadPicture',
  UPLOAD_PICTURE_LIST = 'uploadPictureList',
  EDITOR = 'editor',
}
