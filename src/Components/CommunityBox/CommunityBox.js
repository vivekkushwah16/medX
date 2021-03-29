import React from 'react'
import AskQuestion from '../../Containers/AskQuestion/AskQuestion'
import PollContainer from '../../Containers/PollContainer/PollContainer'

export default function CommunityBox(props) {
    return (
        <div className="communityBox">
            <AskQuestion id={props.id} sendQuestion={props.sendQuestion} />
            <PollContainer id={props.id} />
        </div>
    )
}
