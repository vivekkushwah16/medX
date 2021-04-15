import React from 'react'
import AskQuestion from '../../Containers/AskQuestion/AskQuestion'
import PollContainer from '../../Containers/PollContainer/PollContainer'
import Noticeboard from '../NoticeBoard/Noticeboard'

export default function CommunityBox(props) {
    return (
        <div className="communityBox">
            <AskQuestion id={props.id} sendQuestion={props.sendQuestion} showCloseButton={props.showCloseButton} handleCloseBtn={props.handleCloseBtn} />
            <Noticeboard message={props.noticeboard}/>
            <PollContainer id={props.id} pollAnalytics={props.pollAnalytics} />
        </div>
    )
}
