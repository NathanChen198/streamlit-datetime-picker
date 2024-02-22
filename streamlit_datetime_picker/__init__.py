# Author   : Nathan Chen
# Date     : 22-Feb-2024
 

import os
import streamlit.components.v1 as components
from datetime import datetime, time, timedelta
from typing import Literal, Generic, TypeVar, Union, List, Tuple
from dateutil.relativedelta import relativedelta


_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component("datetime_picker", url="http://localhost:3000")
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("datetime_picker", path=build_dir)


PickerType = Literal['datetime','time','date','week','month','quarter','year']
TimeUnit = Literal['hour','minute','second','millisecond']
Size = Literal['small','middle','large']
Placement = Literal['bottomLeft', 'bottomRight']
Status = Literal['warning', 'error']
Variant = Literal['outlined','filled','borderless']
T = TypeVar('T')


class Preset(Generic[T]):
    """ Preset value to pass to the component
    """
    label: str
    value: T

    def __init__(self, label: str, value: T):
        self.label = label
        self.value = value



def _decodeValue(value: datetime, picker: PickerType, timeUnit: TimeUnit) -> Union[datetime, time, Tuple[datetime, datetime]]:
    def _weekday(value: datetime):
        """ Return day of the week, where Sunday==0 ... Saturday==6
        """
        isoweekday = value.isoweekday()
        return isoweekday if isoweekday < 7 else 0

    if timeUnit == 'millisecond':
        if picker == 'datetime': return value
        elif picker == 'time': return value.timetz()
    value = value - timedelta(microseconds=value.microsecond)
    
    if timeUnit == 'second':
        if picker == 'datetime': return value
        elif picker == 'time': return value.timetz()
    value = value - timedelta(seconds=value.second)

    if timeUnit == 'minute':
        if picker == 'datetime': return value
        elif picker == 'time': return value.timetz()
    value = value - timedelta(minutes=value.minute)

    if timeUnit == 'hour':
        if picker == 'datetime': return value
        elif picker == 'time': return value.timetz()
    value = value - timedelta(hours=value.hour)
      

    if picker == 'date': return value
    value = value - timedelta(days=_weekday(value))

    if picker == 'week': return (value, value + timedelta(days=7))
    value = value - timedelta(days=value.day-1)

    if picker == 'month': return (value, value + relativedelta(months=1))
    value = value - relativedelta(months=(value.month-1) % 3)

    if picker == 'quarter': return (value, value + relativedelta(months=3))
    value = value - relativedelta(months=(value.month-1))

    if picker == 'year': return (value, value + relativedelta(years=1))
    raise TypeError('Not Supported')



def _toOptionalIsoFormat(value: Union[datetime, None]) -> Union[str, None]:
    if value is None: return None
    else: return value.isoformat()



def _toStr(value: Union[datetime, str]) -> str:
    if(type(value) is datetime): return value.isoformat()
    elif(type(value) is str): return value
    else: raise TypeError('Not Supported')
def date_time_picker(label: Union[str, None] = None,
                     picker: PickerType = 'datetime',
                     value: Union[datetime, None] = None,
                     timeUnit: TimeUnit = 'second',
                     format: Union[str, None] = None,
                     placeholder: Union[str, None] = None,
                     allowClear: bool = True,
                     size: Size = 'middle',
                     variant: Variant ='outlined',
                     status: Union[Status, None] = None,
                     minDate: Union[datetime, None] = None,
                     maxDate: Union[datetime, None] = None,
                     disabledDates: Union[List[datetime], None] = None,
                     presets: Union[List[Preset[datetime]], None] = None,
                     disabled: bool = False,
                     key=None):
    """ Date and time picker

    ## Arguments
    label: str | None
        label for the component
    picker: 'datetime' | 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'
        type of the picker
    value: datetime | None
        initial value of the component
    timeUnit: 'hour' | 'minute' | 'second' | 'millisecond'
        Time resolution
    format: str | None
        A optional format string controlling how the interface should display dates and times. [Documentation](https://day.js.org/docs/en/display/format)
    placeholder: str | None
        place holder text when the value is not selected
    allowClear: boolean
        Allow to clear the value
    size: 'small' | 'middle' | 'large'
        The size of the component
    variant: 'outlined' | 'filled' | 'borderless'
        The variant of the component
    status: 'warning' | 'error' | None
        The status of the component
    minDate: datetime | None
        The minimum date allow to select
    maxDate: datetime | None
        The maximum date allow to select
    disabledDates: list[datetime] | None
        Custom datetime list to disable for selection
    presets: list[Preset[datetime]] | None
        Custom list of preset dates for easy selection
    disabled : bool
        An optional boolean, which disables the date input if set to True. The default is False.
    label_visibility : "visible", "hidden", or "collapsed"
        The visibility of the label. If "hidden", the label doesn't show but there is still empty space for it above the widget (equivalent to label=""). If "collapsed", both the label and the space are removed.
    """
    valueStr = value if value is None else value.isoformat()
    kw = {
        'label': label,
        'picker': picker,
        'value': valueStr,
        'timeUnit': timeUnit,
        'format': format,
        'placeholder': placeholder,
        'allowClear': allowClear,
        'size': size,
        'variant': variant,
        'status': status,
        'minDate': _toOptionalIsoFormat(minDate),
        'maxDate': _toOptionalIsoFormat(maxDate),
        'disabledDates': None if disabledDates is None else [(d - timedelta(hours=d.hour, minutes=d.minute, seconds=d.second, microseconds=d.microsecond)).isoformat() for d in disabledDates],
        'presets': [{'label': p.label, 'value': _toStr(p.value)} for p in presets] if presets is not None else None,
        'disabled': disabled
    }
    valueStr = _component_func(id='date_time_picker', kw=kw, key=key, default=[valueStr])
    valueStr = valueStr[0]
    if valueStr is None: return None
    value = datetime.fromisoformat(valueStr)
    return _decodeValue(value, picker, timeUnit)

def _get_date(value: Union[datetime, time, Tuple[datetime, datetime], None], index: int) -> Union[datetime, time, None]:
    if(type(value) is tuple): return value[index]
    elif(type(value) is datetime): return value
    elif(type(value) is time): return value
    else: return None

def date_range_picker(label: Union[str, None] = None,
                      picker: PickerType = 'datetime',
                      value: Tuple[Union[datetime, None], Union[datetime, None]] = (None, None),
                      timeUnit: TimeUnit = 'second',
                      format: Union[str, None] = None,
                      placeholder: Union[Tuple[str, str], None] = None,
                      allowClear: bool = True,
                      size: Size = 'middle',
                      variant: Variant ='outlined',
                      status: Union[Status, None] = None,
                      minDate: Union[datetime, None] = None,
                      maxDate: Union[datetime, None] = None,
                      disabledDates: Union[List[datetime], None] = None,
                      presets: Union[List[Preset[Tuple[datetime, datetime]]], None] = None,
                      disabled: bool = False,
                      key=None) -> Tuple[Union[datetime, time, None], Union[datetime, time, None]]:
    
    """ Date Range picker

    ## Arguments
    label: str | None
        label for the component
    picker: 'datetime' | 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'
        type of the picker
    value: (datetime, datetime) | None
        initial value of the component
    timeUnit: 'hour' | 'minute' | 'second' | 'millisecond'
        Time resolution
    on_change: callable
        An optional callback invoked when this date_input's value changes.
    args: tuple
        An optional tuple of args to pass to the callback.
    kargs: dict
        An optional dict of kwargs to pass to the callback.
    format: str | None
        A optional format string controlling how the interface should display dates and times. [Documentation](https://day.js.org/docs/en/display/format)
    placeholder: str | None
        place holder text when the value is not selected
    allowClear: boolean
        Allow to clear the value
    size: 'small' | 'middle' | 'large'
        The size of the component
    variant: 'outlined' | 'filled' | 'borderless'
        The variant of the component
    status: 'warning' | 'error' | None
        The status of the component
    minDate: datetime | None
        The minimum date allow to select
    maxDate: datetime | None
        The maximum date allow to select
    disabledDates: list[datetime] | None
        Custom datetime list to disable for selection
    presets: Preset[(datetime,datetime)][] | None
        Custom list of preset dates for easy selection
    disabled : bool
        An optional boolean, which disables the date input if set to True. The default is False.
    """
    # make sure the first value is smaller than last value
    (start, end) = value
    if start is not None and end is not None and start > end:
        value = (end, start)
    valueStr = (_toOptionalIsoFormat(start), _toOptionalIsoFormat(end))

    kw = {
        'label': label,
        'picker': picker,
        'value': valueStr,
        'timeUnit': timeUnit,
        'format': format,
        'placeholder': placeholder,
        'allowClear': allowClear,
        'size': size,
        'variant': variant,
        'status': status,
        'minDate': _toOptionalIsoFormat(minDate),
        'maxDate': _toOptionalIsoFormat(maxDate),
        'disabledDates': None if disabledDates is None else [(d - timedelta(hours=d.hour, minutes=d.minute, seconds=d.second, microseconds=d.microsecond)).isoformat() for d in disabledDates],
        'presets': [{'label': p.label, 'value': (_toStr(p.value[0]), _toStr(p.value[1]))} for p in presets] if presets is not None else None,
        'disabled': disabled
    }
    valueStr = _component_func(id='date_range_picker', kw=kw, key=key, default=valueStr)
    startStr, endStr = valueStr
    start = _decodeValue(datetime.fromisoformat(startStr), picker, timeUnit) if startStr is not None else None
    end = _decodeValue(datetime.fromisoformat(endStr), picker, timeUnit) if endStr is not None else None

    start = _get_date(start, 0)
    end = _get_date(end, 1)
    return (start, end)
