/**
 * Author   : Scorp1987
 * Date     : 22-Feb-2024
 */

import React, { ComponentProps } from "react"
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from "antd"
import { PickerType, Size, getOpenHeight } from "./utils"
import BasePicker, { Preset } from "./base_picker"
const { RangePicker } = DatePicker;
const _getOpenHeight = getOpenHeight;


export default class DateRangePicker extends BasePicker<[Dayjs|undefined, Dayjs|undefined], [string, string]> {
  getInitialValue(value: any): [Dayjs|undefined, Dayjs|undefined] | undefined {
    if(!value) return undefined;
    const start = (value[0]) ? dayjs(value[0]) : undefined
    const end = (value[1]) ? dayjs(value[1]) : undefined
    return [start, end]
  }
  getInitialPlaceHolder(picker: PickerType, placeholder: any): [string, string] | undefined {
    if (placeholder) return placeholder;
    return picker === PickerType.datetime ? ['Start datetime', 'End datetime'] : undefined;
  }
  getPresets(presets: any){
    if(presets instanceof Array)
      return presets.map((item: Preset<[string, string]>) => new Preset<[Dayjs, Dayjs]>(item.label, [dayjs(item.value[0]), dayjs(item.value[1])]));
  }
  getComponentValue(date: any): [string | null, string | null] {
    if(!date) return [null, null];
    const[start, end] = date;
    return [start?this.getDateString(start):null, end?this.getDateString(end):null]
  }
  getOpenHeight(): number{
    switch(this.state.size){
      case Size.small: return _getOpenHeight(this.state.picker) + 1
      case Size.middle: return _getOpenHeight(this.state.picker) + 10
      case Size.large: return _getOpenHeight(this.state.picker) + 17
      default: return _getOpenHeight(this.state.picker)
    }
  }
  private allowEmpty(): boolean | [boolean, boolean] | undefined{
    const initialValue = this.state.initialValue;
    if(!initialValue) return undefined
    const [start, end] = initialValue
    if(start === undefined && end === undefined) return undefined
    return [start === undefined, end === undefined]
  }
  getNodeForRender(props: ComponentProps<any>): React.ReactNode {
    return(
      <RangePicker {...props}
        allowEmpty={this.allowEmpty()}
      />
    )
  }
}