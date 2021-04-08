import moment from 'moment'
import React from 'react'

function TimelineBoxItem(props) {
    const { timelineData, timelineClick, minPlayed } = props
    return (
        <div className={`timelineBox-item ${minPlayed > timelineData.startTime ? '' : 'timelineBox-item-left-unseen'}`} onClick={() => timelineClick(timelineData.startTime)}>
            <span className="timelineBox-item-left">{new Date(timelineData.startTime * 1000).toISOString().substr(11, 8).substr(3,10)} - {new Date(timelineData.endTime * 1000).toISOString().substr(11, 8).substr(3,10)} </span>
            <span className="timelineBox-item-right">{timelineData.title}</span>
        </div>
    )
}

export default TimelineBoxItem
