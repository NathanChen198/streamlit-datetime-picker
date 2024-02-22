/**
 * Author   : Scorp1987
 * Date     : 22-Feb-2024
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { ComponentProps, withStreamlitConnection } from "streamlit-component-lib"
import DateTimePicker from "./datetime_picker"
import DateRangePicker from "./daterange_picker"


const getComponent = (props: ComponentProps) => {
  const id = props.args['id']
  switch(id){
    case 'date_time_picker': return (<DateTimePicker {...props}/>)
    case 'date_range_picker': return (<DateRangePicker {...props}/>)
  }
}


//wrap component
// @ts-ignore
const StreamlitComponent = withStreamlitConnection(getComponent)

const container = document.getElementById('root');
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <StreamlitComponent/>
  </React.StrictMode>
)