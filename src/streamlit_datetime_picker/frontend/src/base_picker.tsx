/**
 * Author   : Scorp1987
 * Date     : 22-Feb-2024
 */

import { Streamlit, StreamlitComponentBase } from "streamlit-component-lib"
import React, { ComponentProps, ReactNode } from "react"
import dayjs, { Dayjs } from 'dayjs'
import { DatePickerProps, ConfigProvider } from "antd"
import { PickerType, TimeUnit, Size, Status, Variant } from "./utils"

export class Preset<TValue>{
  label: string;
  value: TValue;

  constructor(label: string, value: TValue){
    this.label = label
    this.value = value
  }
}

export interface StateBase<TValue, TPh>{
  label: string | undefined
  height: number
  picker: PickerType
  timeUnit: TimeUnit
  showTime: boolean
  showMinute: boolean
  showSecond: boolean
  showMsec: boolean
  format_string: string
  placeholder: TPh | undefined
  allowClear: boolean
  size: Size
  variant: Variant
  status: Status | undefined
  minDate: Dayjs | undefined
  maxDate: Dayjs | undefined
  disabledDates: Dayjs[] | undefined
  presets: Preset<TValue|(()=>TValue)>[] | undefined
  initialValue: TValue | undefined
  switchTime: boolean
  value: TValue | undefined
  disabled: boolean
}

export default abstract class BasePicker<TValue, TPh> extends StreamlitComponentBase<StateBase<TValue, TPh>>{
  private toOptionalDayjs(value: any): Dayjs | undefined{
    return value ? dayjs(value) : undefined
  }
  private getTimeFormatString(unit: TimeUnit | undefined): string{
    switch(unit){
      case TimeUnit.millisecond: return 'HH:mm:ss.SSS'
      case TimeUnit.second: return 'HH:mm:ss'
      case TimeUnit.minute: return 'HH:mm'
      case TimeUnit.hour: return 'HH'
      default: return 'HH'
    }
  }
  private getFormatString(picker: PickerType, timeType: TimeUnit | undefined): string{
    switch(picker){
      case PickerType.datetime: return `YYYY-MM-DD ${this.getTimeFormatString(timeType)}`
      case PickerType.time: return this.getTimeFormatString(timeType)
      case PickerType.date: return 'YYYY-MM-DD'
      case PickerType.week: return 'YYYY-[W]ww'
      case PickerType.month: return 'YYYY-MM'
      case PickerType.quarter: return 'YYYY-[Q]Q'
      case PickerType.year: return 'YYYY'
      default: return "YYYY-MM-DD"
    }
  }
  private getLabelHeight(label: string | undefined): number{
    return label ? 18 : 0;
  }
  private getCloseHeight(size: Size): number{
    switch(size){
      case Size.small: return 34
      case Size.middle: return 42
      case Size.large: return 50
      default: return 42
    }
  }
  private getDisabledDates(){
    const disabledDates = this.props.args.kw['disabledDates']
    if(disabledDates instanceof Array) return disabledDates.map(d => dayjs(d))
    else return undefined
  }
  constructor(props: ComponentProps<any>){
    super(props);
    const size = props.args.kw['size'] || Size.middle;
    const picker = props.args.kw['picker'] || PickerType.datetime;
    const timeUnit = props.args.kw['timeUnit'] || TimeUnit.second;
    const showTime = picker === PickerType.datetime || picker === PickerType.time;
    const showMinute = (timeUnit === TimeUnit.millisecond || timeUnit === TimeUnit.second || timeUnit === TimeUnit.minute);
    const showSecond = (timeUnit === TimeUnit.millisecond || timeUnit === TimeUnit.second);
    const showMsec = timeUnit === TimeUnit.millisecond;
    const value = this.getInitialValue(props.args.kw['value']);
    const label = props.args.kw['label']
    this.state = {
      label: label,
      height: this.getCloseHeight(size) + this.getLabelHeight(label),
      picker: picker,
      timeUnit: timeUnit,
      showTime: showTime,
      showMinute: showMinute,
      showSecond: showSecond,
      showMsec: showMsec,
      size: size,
      format_string: props.args.kw['format'] || this.getFormatString(picker, timeUnit),
      placeholder: this.getInitialPlaceHolder(picker, props.args.kw['placeholder']),
      allowClear: props.args.kw['allowClear'] === false ? false : true,
      variant: props.args.kw['variant'] || Variant.outlined,
      status: props.args.kw['status'],
      minDate: this.toOptionalDayjs(props.args.kw['minDate']),
      maxDate: this.toOptionalDayjs(props.args.kw['maxDate']),
      disabledDates: this.getDisabledDates(),
      presets: this.getPresets(props.args.kw['presets']),
      initialValue: value,
      switchTime: false,
      value: value,
      disabled: (props.args.kw['disabled']) ? true : false
    };
  }


  /**
   * Decode initial value pass from python wrapper
   */
  abstract getInitialValue(value: any): TValue | undefined;

  /**
   * Get the initial placeholder text
   */
  abstract getInitialPlaceHolder(picker: PickerType, placeholder: any): TPh | undefined

  /**
   * Get the list of presets values
   */
  abstract getPresets(presets: any): Preset<TValue>[] | undefined

  /**
   * Get the component value to return the value to python wrapper
   */
  abstract getComponentValue(date: any): any

  /**
   * Get the height for the when open for picker
   */
  abstract getOpenHeight(): number;

  abstract getNodeForRender(props: ComponentProps<any>): ReactNode;


  protected getDateString(value: Dayjs): string{
      return value.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ')
  }
  protected disableDate(date: Dayjs, disabledDates: Dayjs[] | undefined): boolean{
    return disabledDates?.some(v => date >= v && date < v.add(1, 'days')) ?? false
  }


  componentDidMount(): void {
      super.componentDidMount();
      Streamlit.setFrameHeight(this.state.height)
  }
  componentDidUpdate(): void {
      super.componentDidUpdate();
      Streamlit.setFrameHeight(this.state.height)
  }


  protected onOpenChange: DatePickerProps['onOpenChange'] = (isOpen: boolean) => {
    const labelHeight = this.getLabelHeight(this.state.label);
    console.log(labelHeight);
    this.setState({
      height: labelHeight + (isOpen ? this.getOpenHeight() : this.getCloseHeight(this.state.size))
    })
  }
  protected onChange = (date: any, dateString: any) => {
    this.setState({
      value: date ?? undefined
    });
    const value = this.getComponentValue(date);
    Streamlit.setComponentValue(value);
  }

  public render(): ReactNode {
    const node = this.getNodeForRender({
      picker: this.state.picker === PickerType.datetime ? PickerType.date : this.state.picker,
      showNow: true,
      showTime: this.state.showTime,
      showHour: this.state.showTime,
      showMinute: this.state.showMinute,
      showSecond: this.state.showSecond,
      showMillisecond: this.state.showMsec,
      format: this.state.format_string,
      placement: 'bottomLeft',
      style: {width: '100%'},
      placeholder: this.state.placeholder,
      allowClear: this.state.allowClear,
      size: this.state.size,
      variant: this.state.variant,
      status: this.state.status,
      value: this.state.value,
      minDate: this.state.minDate,
      maxDate: this.state.maxDate,
      presets: this.state.presets,
      disabled: this.props.disabled || this.state.disabled,
      disabledDate: (date: Dayjs) => this.disableDate(date, this.state.disabledDates),
      onChange: this.onChange,
      onOpenChange: this.onOpenChange
    });
    return(
      <div>
        <ConfigProvider
          theme={{
            token: {
              colorText: this.props.theme?.textColor,
              colorTextPlaceholder: this.props.theme?.font,
              colorPrimary: this.props.theme?.primaryColor,
              colorPrimaryBg: this.props.theme?.primaryColor,
              colorBgBase: this.props.theme?.secondaryBackgroundColor
            }
          }}
        >
          {this.state.label && <label>{this.state.label}</label>}
          {node}
        </ConfigProvider>
      </div>
    );
  }
}