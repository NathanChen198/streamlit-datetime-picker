/**
 * Author   : Nathan Chen
 * Date     : 22-Feb-2024
 */

import React, { ComponentProps } from "react"
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from "antd"
import { PickerType, Size, getOpenHeight } from "./utils"
import BasePicker, { Preset } from "./base_picker"
const _getOpenHeight = getOpenHeight;


export default class DateTimePicker extends BasePicker<Dayjs, string> {
  getInitialValue(value: any): Dayjs | undefined {
    if(!value) return undefined;
    return dayjs(value);
  }
  getInitialPlaceHolder(picker: PickerType, placeholder: any): string | undefined {
    if (placeholder) return placeholder;
    return picker === PickerType.datetime ? 'Select datetime' : undefined
  }
  getPresets(){
    const presets = this.props.args.kw['presets'];
    if(presets instanceof Array)
      return presets.map((item: Preset<string>) => new Preset<Dayjs>(item.label, dayjs(item.value)));
    else
      return undefined
  }
  getComponentValue(date: any): [string|null] {
    if(!date) return [null];
    return [this.getDateString(date)];
  }
  getOpenHeight(): number{
    switch(this.state.size){
      case Size.small: return _getOpenHeight(this.state.picker) - 9
      case Size.middle: return _getOpenHeight(this.state.picker)
      case Size.large: return _getOpenHeight(this.state.picker) + 7
      default: return _getOpenHeight(this.state.picker)
    }
  }
  getNodeForRender(props: ComponentProps<any>): React.ReactNode {
    return(
      <DatePicker {...props}/>
    )
  }
}