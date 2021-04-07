import React, { useContext, useState } from 'react'
import InviteFriend from '../../Components/InviteFriend/InviteFriend'
import Notification from '../../Components/Notification/Notification'
import Profile from '../../Components/Profile/Profile'
import CIPLAMEDXLOGO from '../../assets/images/medXlogo.png'
import CIPLAMEDXLOGO_WHITE from '../../assets/images/ciplamed-logo2.png'
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
        <div className="headerBox headerBox--full pd-r0">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="headerBox__left">
                        <a href={RootRoute} className="headerBox__logo5">
                            <img src={props.whiteLogo ? CIPLAMEDXLOGO_WHITE : CIPLAMEDXLOGO} alt="CIPLAMEDXLOGO" />
                        </a>
                    </div>
                    <div className="headerBox__right headerBox__right--nogap">
                        {
                            props.showCertificate &&
                            <button className="btn btn-secondary" onClick={() => showMediaModal(MediaModalType.Component, Certificate)} disabled={props.disableFeedback}>Get your certificate</button>
                        }
                        {
                            props.showFeedback &&
                            <button className="btn btn-secondary">Feedback</button>
                        }
                        {
                            !props.hideInviteFriend &&
                            <InviteFriend toggleInviteFriendModal={toggleInviteFriendModal} showInviteFriendModal={showInviteFriendModal} />
                        }
                        <Notification data={['You have been successfully registered!!.']} />
                        <Profile />
                    </div>
                </div>
            </div>
        </div>
    )
}
