<!--
 * @Author: shen
 * @Date: 2025-10-22 16:31:15
 * @LastEditors: shen
 * @LastEditTime: 2025-12-30 17:31:54
 * @Description:
-->
<script setup lang="tsx">
import { ProField } from '@pro-design-vue/components'
import { Space, Radio, Descriptions, Form } from 'ant-design-vue'
import { ref } from 'vue'
import dayjs from 'dayjs'
const state = ref<any>('read')
const radio = ref('open')
const numberRange = ref([123, 456])
const dateValue = ref(dayjs('2019-11-16 12:50:26').valueOf())
const dateRangeValue = ref([
  dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
  dayjs('2019-11-16 12:50:26').valueOf(),
])

const switchValue = ref(true)

const codeValue = ref(`
yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.
          `)

const handleRateChange = (value) => {
  console.log('🚀 ~ handleRateChange ~ value:', value)
}
</script>

<template>
  <div style="width: 1000px; padding: 50px 30px; margin: 100px; border: 1px solid #f1f1f1">
    <Form>
      <Space>
        <Radio.Group v-model:value="state">
          <Radio value="read">只读</Radio>
          <Radio value="edit">编辑</Radio>
        </Radio.Group>
      </Space>
      <br />
      <br />
      <Descriptions :column="2">
        <Descriptions.Item label="空字符串">
          <ProField text="" mode="read" />
        </Descriptions.Item>
        <Descriptions.Item label="头像">
          <ProField
            text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
            mode="read"
            valueType="avatar"
          />
        </Descriptions.Item>
        <Descriptions.Item label="列序号">
          <ProField :text="1" valueType="index" />
        </Descriptions.Item>
        <Descriptions.Item label="列序号2">
          <ProField :text="1" valueType="indexBorder" />
        </Descriptions.Item>
        <Descriptions.Item label="文本">
          <ProField text="这是一段文本" valueType="text" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="图片">
          <ProField
            text="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            valueType="image"
            :mode="state"
          />
        </Descriptions.Item>
        <Descriptions.Item label="金额">
          <ProField text="100" valueType="money" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="颜色">
          <ProField valueType="color" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="数字">
          <ProField text="19897979797979" valueType="digit" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="数字范围">
          <ProField v-model:value="numberRange" valueType="digitRange" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="秒格式化">
          <ProField text="2000000" valueType="second" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="百分比">
          <Space>
            <ProField
              :text="100"
              valueType="percent"
              :mode="state"
              :field-props="{ showColor: true, showSymbol: true }"
            />
            <ProField
              :text="0"
              valueType="percent"
              :mode="state"
              :field-props="{ showColor: true, showSymbol: true }"
            />
            <ProField
              :text="-80"
              valueType="percent"
              :mode="state"
              :field-props="{ showColor: true, showSymbol: true }"
            />
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="评分">
          <ProField :text="3.5" valueType="rate" :mode="state" @change="handleRateChange" />
        </Descriptions.Item>
        <Descriptions.Item label="选择框">
          <ProField
            text="open"
            :mode="state"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="多选">
          <ProField
            :text="['open', 'closed']"
            :mode="state"
            valueType="checkbox"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="多选 labelInValue">
          <ProField
            :text="[
              {
                value: 'open1',
                label: '打开',
              },
              {
                value: 'closed2',
                label: '关闭',
              },
            ]"
            :mode="state"
            valueType="checkbox"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>

        <Descriptions.Item label="单选">
          <ProField
            text="open"
            v-model:value="radio"
            :mode="state"
            valueType="radio"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="单选按钮">
          <ProField
            text="open"
            v-model:value="radio"
            :mode="state"
            valueType="radioButton"
            :value-enum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="远程选择框">
          <ProField
            text="open"
            :mode="state"
            valueType="select"
            :request="
              async () => [
                { label: '全部', value: 'all' },
                { label: '未解决', value: 'open' },
                { label: '已解决', value: 'closed' },
                { label: '解决中', value: 'processing' },
                {
                  label: '特殊选项',
                  value: 'optGroup',
                  optionType: 'optGroup',
                  options: [
                    { label: '不解决', value: 'no' },
                    { label: '已废弃', value: 'clear' },
                  ],
                },
              ]
            "
          />
        </Descriptions.Item>
        <Descriptions.Item label="级联选择框">
          <ProField
            :text="['zhejiang', 'hangzhou', 'xihu']"
            :mode="state"
            valueType="cascader"
            :fieldProps="{
              fieldNames: {
                label: 'name',
              },
            }"
            :request="
              async () => [
                {
                  value: 'zhejiang',
                  name: '浙江',
                  children: [
                    {
                      value: 'hangzhou',
                      name: '杭州',
                      children: [
                        {
                          value: 'xihu',
                          name: '西湖',
                        },
                      ],
                    },
                  ],
                },
                {
                  value: 'jiangsu',
                  name: '江苏',
                  children: [
                    {
                      value: 'nanjing',
                      name: '南京',
                      children: [
                        {
                          value: 'zhonghuamen',
                          name: 'Zhong Hua Men',
                        },
                      ],
                    },
                  ],
                },
              ]
            "
          />
        </Descriptions.Item>
        <Descriptions.Item label="进度条">
          <ProField text="40" valueType="progress" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="滑动输入条">
          <ProField text="40" valueType="slider" :mode="state" style="width: 100%" />
        </Descriptions.Item>
        <Descriptions.Item label="开关">
          <ProField v-model:value="switchValue" valueType="switch" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="相对于当前时间">
          <ProField text="2019-11-16 12:50:26" valueType="fromNow" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="日期时间">
          <ProField text="2023-11-16 12:50:26" valueType="dateTime" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="日期区间">
          <ProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ]"
            valueType="dateRange"
            :mode="state"
            :field-props="{
              separator: '至',
              format: 'YYYY年MM月DD日',
              valueFormat: 'YYYY-MM-DD',
            }"
          >
            <template #separator><span style="color: red">~</span></template>
          </ProField>
        </Descriptions.Item>
        <Descriptions.Item label="日期时间区间">
          <ProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ]"
            valueType="dateTimeRange"
            :mode="state"
            :field-props="{
              separator: '~',
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="周区间">
          <ProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ]"
            valueType="dateWeekRange"
            :mode="state"
            :field-props="{
              separator: '~',
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="月区间">
          <ProField
            :text="[dayjs('2019-11-16').add(-1, 'd').valueOf(), dayjs('2019-12-16').valueOf()]"
            valueType="dateMonthRange"
            :mode="state"
            :field-props="{
              separator: '~',
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="季度区间">
          <ProField
            :text="[dayjs('2019-06-16').add(-1, 'd').valueOf(), dayjs('2019-12-16').valueOf()]"
            valueType="dateQuarterRange"
            :mode="state"
            :field-props="{
              separator: '~',
              format: 'YYYY年Q季度',
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="年区间">
          <ProField
            :text="[dayjs('2019-11-16').add(-1, 'd').valueOf(), dayjs('2020-12-16').valueOf()]"
            valueType="dateYearRange"
            :mode="state"
            :field-props="{
              format: 'YYYY年',
            }"
          />
        </Descriptions.Item>
        <Descriptions.Item label="时间">
          <ProField v-model:value="dateValue" valueType="time" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="时间区间">
          <ProField
            v-model:value="dateRangeValue"
            valueType="timeRange"
            :field-props="{
              separator: '~',
            }"
            :mode="state"
          />
        </Descriptions.Item>
        <Descriptions.Item label="密码">
          <ProField text="password" valueType="password" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="代码块">
          <ProField v-model:value="codeValue" valueType="code" :mode="state" />
        </Descriptions.Item>
        <Descriptions.Item label="JSON 代码块">
          <ProField
            :text="`{
  &quot;compilerOptions&quot;: {
    &quot;target&quot;: &quot;esnext&quot;,
    &quot;moduleResolution&quot;: &quot;node&quot;,
    &quot;jsx&quot;: &quot;preserve&quot;,
    &quot;esModuleInterop&quot;: true,
    &quot;experimentalDecorators&quot;: true,
    &quot;strict&quot;: true,
    &quot;forceConsistentCasingInFileNames&quot;: true,
    &quot;noImplicitReturns&quot;: true,

    &quot;declaration&quot;: true,
    &quot;skipLibCheck&quot;: true
  },
  &quot;include&quot;: [&quot;**/src&quot;, &quot;**/docs&quot;, &quot;scripts&quot;, &quot;**/demo&quot;, &quot;.eslintrc.js&quot;]
}
`"
            valueType="jsonCode"
            :mode="state"
          />
        </Descriptions.Item>
        <Descriptions.Item label="文本域">
          <ProField
            :text="`
yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.
          `"
            valueType="textarea"
            :mode="state"
          />
        </Descriptions.Item>
      </Descriptions>
    </Form>
  </div>
</template>
