import React, { useState } from 'react'
import InviteFriend from '../../Components/InviteFriend/InviteFriend'
import Notification from '../../Components/Notification/Notification'
import Profile from '../../Components/Profile/Profile'

//showCertificate, showFeedback 
export default function Header(props) {
    const [showInviteFriendModal, toggleInviteFriendModal] = useState(false)

    return (
        <div className="headerBox">
            <div className="d-flex align-items-center justify-content-between">
                <div className="headerBox__left">
                </div>
                <div className="headerBox__right headerBox__right--nogap">
                    {
                        props.showCertificate &&
                        <button className="btn btn-secondary">Get your certificate</button>
                    }
                    {
                        props.showFeedback &&
                        <button className="btn btn-secondary">Feedback</button>
                    }
                    <InviteFriend toggleInviteFriendModal={toggleInviteFriendModal} showInviteFriendModal={showInviteFriendModal} />
                    <Notification data={['You have been successfully registered!!.']} />
                    <Profile />
                </div>
            </div>
        </div>
    )
}
