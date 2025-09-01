/*
 * @Author: shen
 * @Date: 2022-06-09 10:13:01
 * @LastEditors: shen
 * @LastEditTime: 2025-09-01 13:32:24
 * @Description:
 */
import { ProFieldType } from './fieldType'
import FieldText from './fields/FieldText'
import FieldDigit from './fields/FieldDigit'
import FieldDigitRange from './fields/FieldDigitRange'
import FieldTextarea from './fields/FieldTextarea'
import FieldPassword from './fields/FieldPassword'
import FieldSelect from './fields/FieldSelect'
import FieldTreeSelect from './fields/FieldTreeSelect'
import FieldCheckbox from './fields/FieldCheckbox'
import FieldCheckboxGroup from './fields/FieldCheckboxGroup'
import FieldRadioGroup from './fields/FieldRadioGroup'
import FieldCascader from './fields/FieldCascader'
import FieldSwitch from './fields/FieldSwitch'
import FieldSlider from './fields/FieldSlider'
import FieldRate from './fields/FieldRate'
import FieldDatePicker from './fields/FieldDatePicker'
import FieldDateRangePicker from './fields/FieldDateRangePicker'
import FieldTimePicker from './fields/FieldTimePicker'
import FieldTimeRangePicker from './fields/FieldTimeRangePicker'
import FieldUploadButton from './fields/FieldUploadButton'
import FieldUploadDragger from './fields/FieldUploadDragger'
import FieldUploadPicture from './fields/FieldUploadPicture'
import FieldUploadPictureList from './fields/FieldUploadPictureList'
// import FieldEditor from './fields/FieldEditor'

export const fieldComponentMap: Partial<Record<`${ProFieldType}`, any>> = {
  text: FieldText,
  digit: FieldDigit,
  digitRange: FieldDigitRange,
  select: FieldSelect,
  cascader: FieldCascader,
  textarea: FieldTextarea,
  password: FieldPassword,
  treeSelect: FieldTreeSelect,
  checkbox: FieldCheckbox,
  checkboxGroup: FieldCheckboxGroup,
  radioGroup: FieldRadioGroup,
  switch: FieldSwitch,
  slider: FieldSlider,
  rate: FieldRate,
  date: FieldDatePicker,
  dateRange: FieldDateRangePicker,
  time: FieldTimePicker,
  timeRange: FieldTimeRangePicker,
  uploadButton: FieldUploadButton,
  uploadDragger: FieldUploadDragger,
  uploadPicture: FieldUploadPicture,
  uploadPictureList: FieldUploadPictureList,
  // editor: FieldEditor
}
