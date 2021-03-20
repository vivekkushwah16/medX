import React, { useState } from 'react'
import InviteFriend from '../../Components/InviteFriend/InviteFriend'
import Notification from '../../Components/Notification/Notification'
import Profile from '../../Components/Profile/Profile'

export default function Header() {
    const [showInviteFriendModal, toggleInviteFriendModal] = useState(false)

    return (
        <div class="headerBox">
            <div class="d-flex align-items-center justify-content-between">
                <div class="headerBox__left">
                </div>
                <div class="headerBox__right headerBox__right--nogap">
                    <InviteFriend toggleInviteFriendModal={toggleInviteFriendModal} showInviteFriendModal={showInviteFriendModal} />
                    <Notification data={['You have been successfully registered!!.']} />
                    <Profile />
                </div>
            </div>
        </div>
    )
}
