# Streamlit Datetime Picker

[![PyPI][pypi_badge]][pypi_link]
[![GitHub][github_badge]][github_link]
[![GitHub license][license_badge]][license_link]
[![GitHub issues][issue_badge]][issue_link]
[![GitHub pull requests][pull_badge]][pull_link]

---



## What is Streamlit Datetime Picker?
`streamlit-datetime-picker` is the input component to use with [Streamlit](https://streamlit.io/).



## Installation
``` terminal
pip install streamlit-datetime-picker
```



## Quickstart
create an example.py file
``` python
import streamlit as st
from streamlit_datetime_picker import date_time_picker, date_range_picker

dt = date_time_picker('Date Time Input')
st.write(f"DateTimeInput: {dt}")
(start, end) = date_range_picker()
st.write(f"DateRangeInput: From {start} to {end}")
```
run `streamlit`
``` terminal
streamlit run example.py
```



## Helper function
As streamlit rerun the whole python script whenever a component value is changed, thus cannot use `datetime.now()` directly.\
Can make use of the `st.session_state` to store the current date and time so that the initial value doens't change whenever the page is reloaded.

``` python
from datetime import datetime, timedelta

def now() -> datetime:
    if 'now' not in st.session_state:
        st.session_state['now'] = datetime.now().astimezone()
    return st.session_state['now']

def clearNow():
    if 'now' in st.session_state:
        del st.session_state['now']
```



## Features
### Theme
`date_time_picker` and `date_range_picker` will change color depend on your streamlit theme

### Switchable picker
Switch in different types of picker
* datetime
* time
* date
* week
* month
* quarter
* year

### Time resolution.
This property is only application is `datetime` and `date` picker
* hour
* minute
* second
* millisecond

### Placeholder
Place holder text will display when the value is not selected
``` python
dt = date_time_picker(placeholder='Enter your birthday')
```

### Allow Empty
Allow empty for the `date_range_picker`. It's useful when you need to keep the "to date".\
Provide None at the initial value will provide 
``` python
start, end = date_range_picker(value=(now()-timedelta(7), None), placeholder=('Start datetime', 'Till Now'))
end = now() if end is None else end
st.write(f"DateRangeInput: From **{start}** to **{end}**")
```

### Custom Format
Custom format can be set. Format string syntax can reference in [dayjs documentation](https://day.js.org/docs/en/display/format)
``` python
dt = date_time_picker(format='DD-MMM-YYYY HH:mm:ss')
```

### Allow Clear
`allowClear=False` will not allow user to clear the date and time value.
``` python
dt = date_time_picker(value=now(), allowClear=False)
start, end = date_range_picker(value=(now()-timedelta(7), now()), allowClear=False)
```

### Limit Datetime Range
Limit the range of dates by providing `minDate` and `maxDate`
``` python
dt = date_time_picker(value=now(), minDate=now()-timedelta(7), maxDate=now()+timedelta(7))
start, end = date_range_picker(value=(now()-timedelta(7), now()), minDate=now()-timedelta(7), maxDate=now()+timedelta(7))
```

### Disabled Date
Disabled selected dates
``` python
disabledDates = [now()-timedelta(3), now()+timedelta(2)]
dt = date_time_picker(value=now(), disabledDates=disabledDates)
start, end = date_range_picker(value=(now()-timedelta(1), now()), disabledDates=disabledDates)
```

### Preset Values
We can set preset values to `date_time_picker` and `date_range_picker` to improve user experience.
``` python
nowVal = now()
dt = date_time_picker(value=nowVal, presets=[Preset[datetime]('24hr ago', nowVal-timedelta(1)), Preset[datetime]('A week ago', nowVal-timedelta(7))])
start, end = date_range_picker(value=(nowVal-timedelta(1), now()), presets=[Preset[Tuple[datetime, datetime]]('This week', (nowVal-timedelta(1+nowVal.weekday()), nowVal+timedelta(6-nowVal.weekday())))])
```

### Customize User Interface
**Size**: The input box comes in three sizes. `middle`, `small` and `large` are avaliable.
**Variant**: There are `outlined`, `filled` and `borderless` variants to choose from.
**Status**: status could be `error` or `warning`



[pypi_badge]: https://img.shields.io/pypi/v/streamlit-datetime-picker.svg
[pypi_link]: https://pypi.org/project/streamlit-datetime-picker/
[github_badge]: https://badgen.net/badge/icon/GitHub?icon=github&color=black&label
[github_link]: https://github.com/NathanChen198/streamlit-datetime-picker
[license_badge]: https://img.shields.io/badge/Licence-MIT-gr.svg
[license_link]: https://github.com/NathanChen198/streamlit-datetime-picker/blob/main/LICENSE
[issue_badge]: https://img.shields.io/github/issues/NathanChen198/streamlit-datetime-picker
[issue_link]: https://github.com/NathanChen198/streamlit-datetime-picker/issues
[pull_badge]: https://img.shields.io/github/issues-pr/NathanChen198/streamlit-datetime-picker
[pull_link]: https://github.com/NathanChen198/streamlit-datetime-picker/pulls