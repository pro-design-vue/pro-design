/*
 * @Author: shen
 * @Date: 2023-11-05 11:19:33
 * @LastEditors: shen
 * @LastEditTime: 2025-07-30 11:05:08
 * @Description:
 */
import type { SlotsType } from 'vue'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer F)[] ? F : never
export type LiteralUnion<T extends U, U> = T | (U & {})
export type CustomSlotsType<T extends Record<string, any>> = SlotsType<T>
