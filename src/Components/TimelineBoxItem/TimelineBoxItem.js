import moment from 'moment'
import React from 'react'

function TimelineBoxItem(props) {

    const {timelineData, timelineClick} = props
    return (
        <div className="timelineBox-item" onClick={()=>timelineClick(timelineData.startTime)}>
            <span className="timelineBox-item-left">{new Date(timelineData.startTime * 1000).toISOString().substr(11, 8)} </span>
            <span className="timelineBox-item-right">{timelineData.title}</span>
        </div>
    )
}

export default TimelineBoxItem
