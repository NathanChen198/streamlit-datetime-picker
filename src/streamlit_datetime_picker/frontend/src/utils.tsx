/**
 * Author   : Scorp1987
 * Date     : 22-Feb-2024
 */

export enum PickerType {
  datetime = 'datetime',
  time = 'time',
  date = 'date',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year'
}

export enum TimeUnit {
  millisecond = 'millisecond',
  second = 'second',
  minute = 'minute',
  hour = 'hour'
}

export enum Size {
  small = 'small',
  middle = 'middle',
  large = 'large'
}

export enum Status{
  warning = 'warning',
  error = 'error'
}

export enum Variant{
  outlined = 'outlined',
  filled = 'filled',
  borderless = 'borderless'
}

export const getOpenHeight = (picker: PickerType): number => {
  switch(picker){
    case PickerType.datetime: return 397
    case PickerType.time: return 316
    case PickerType.date: return 393
    case PickerType.week: return 356
    case PickerType.month: return 350
    case PickerType.quarter: return 142
    case PickerType.year: return 350
    default: return 397
  }
}