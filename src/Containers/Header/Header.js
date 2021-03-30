import React, { useContext, useState } from 'react'
import InviteFriend from '../../Components/InviteFriend/InviteFriend'
import Notification from '../../Components/Notification/Notification'
import Profile from '../../Components/Profile/Profile'
import CIPLAMEDXLOGO from '../../assets/images/medXlogo.png'
import { RootRoute } from '../../AppConstants/Routes'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'
import { MediaType } from '../../AppConstants/TypeConstant'
import { MediaModalType } from '../../AppConstants/ModalType'
import Certificate from '../../Components/Certificate/Certificate'

//showCertificate, showFeedback 
export default function Header(props) {
    const [showInviteFriendModal, toggleInviteFriendModal] = useState(false)
    const { showMediaModal } = useContext(MediaModalContext)

    return (
        <div className="headerBox">
            <div className="d-flex align-items-center justify-content-between">
                <div className="headerBox__left">
                    <a href={RootRoute} className="headerBox__logo">
                        <img src={CIPLAMEDXLOGO} alt="CIPLAMEDXLOGO" />
                    </a>
                </div>
                <div className="headerBox__right headerBox__right--nogap">
                    {
                        props.showCertificate &&
                        <button className="btn btn-secondary" onClick={() => showMediaModal(MediaModalType.Component, Certificate)}>Get your certificate</button>
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
