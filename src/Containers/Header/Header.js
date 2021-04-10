import React, { useContext, useEffect, useRef, useState } from 'react'
import InviteFriend from '../../Components/InviteFriend/InviteFriend'
import Notification from '../../Components/Notification/Notification'
import Profile from '../../Components/Profile/Profile'
import CIPLAMEDXLOGO from '../../assets/images/medXlogo.png'
import CIPLAMEDXLOGO_WHITE from '../../assets/images/ciplamed-logo2.png'
import { RootRoute } from '../../AppConstants/Routes'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'
import { MediaModalType } from '../../AppConstants/ModalType'
import Certificate from '../../Components/Certificate/Certificate'
import './Header.css';

//showCertificate, showFeedback 
export default function Header(props) {
    const { stickyOnScroll } = props
    const [showInviteFriendModal, toggleInviteFriendModal] = useState(false)
    const { showMediaModal } = useContext(MediaModalContext)

    const navBar = useRef(null)
    const [sticky, setSticky] = useState(false)
    const [yOffset, setyOffset] = useState(0)
    useEffect(() => {
        if (stickyOnScroll) {
            // console.log(navBar.current)
            if (navBar.current) {
                // yOffset = navBar.current.offsetTop
                setyOffset(navBar.current.offsetTop)
                // console.log(navBar.current.offsetTop)
                window.addEventListener('scroll', handleScroll);
                return () => {
                    window.removeEventListener('scroll', handleScroll);
                }
            }
        }
    }, [navBar.current])

    const handleScroll = () => {
        try {
            if (window.pageYOffset > yOffset) {
                setSticky(true)
            } else {
                setSticky(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={` headerBox--full pd-r0 ${sticky ? 'headerBox_sticky' : 'headerBox'}`} ref={navBar}>
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
                            <button className="btn btn-secondary" onClick={() => showMediaModal(MediaModalType.PDF, '/feedback/index.html')}>Feedback</button>
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
