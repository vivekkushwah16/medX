import React from 'react'
import AskQuestion from '../../Containers/AskQuestion/AskQuestion'
import PollContainer from '../../Containers/PollContainer/PollContainer'

export default function CommunityBox() {
    return (
        <div className="communityBox">
            <AskQuestion />
            <PollContainer />
        </div>
    )
}
