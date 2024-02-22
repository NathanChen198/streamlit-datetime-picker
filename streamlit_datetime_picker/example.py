# Author   : Nathan Chen
# Date     : 22-Feb-2024


import streamlit as st
from streamlit_datetime_picker import date_time_picker, date_range_picker, Preset
from datetime import datetime, timedelta
from typing import Tuple

def now() -> datetime:
    if 'now' not in st.session_state:
        st.session_state['now'] = datetime.now().astimezone()
    return st.session_state['now']

def clearNow():
    if 'now' in st.session_state:
        del st.session_state['now']


col1, col2 = st.columns([1, 2])
with col1:
    dt = date_time_picker(picker = 'week', placeholder='small', size='small')
    dt = date_time_picker(picker = 'week', placeholder='middle', size='middle')
    dt = date_time_picker(picker = 'week', placeholder='large', size='large')
with col2:
    dt = date_range_picker(size='small')
    dt = date_range_picker(size='middle')
    dt = date_range_picker(size='large')

dt = date_time_picker(format='DD-MMM-YYYY')

nowVal = now()
dt = date_time_picker(value=nowVal, presets=[Preset[datetime]('24hr ago', nowVal-timedelta(1)), Preset[datetime]('A week ago', nowVal-timedelta(7))])
start, end = date_range_picker(value=(nowVal-timedelta(1), now()), presets=[Preset[Tuple[datetime, datetime]]('This week', (nowVal-timedelta(1+nowVal.weekday()), nowVal+timedelta(6-nowVal.weekday())))])
st.write(f"DateTimeInput: **{dt}**")
st.write(f"DateRangeInput: From **{start}** to **{now() if end is None else end}**")