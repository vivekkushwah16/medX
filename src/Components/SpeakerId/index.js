import React, { useState } from 'react'

export function BannerSpeaker(props) {
    const { profile } = props
    return (
        <div className="bannerBox__profile mg-b50">
            <img className="bannerBox__profile-pic" src={profile.photoURL} alt="" />
            <div className="bannerBox__profile-text">
                <p className="bannerBox__profile-title">{profile.name}</p>
                <p className="bannerBox__profile-subtitle">{profile.designation}</p>
            </div>
        </div>
    )
}

const FACEBOOKLink = "https://www.facebook.com/"
const TWITTERLink = "https://twitter.com/"
const LINKEDINLink = "https://www.linkedin.com/"

export function CardSpeaker(props) {
    const { profile } = props
    const [isProfileActive, setIsProfileActive] = useState(false)

    const openSocialLink = (link) => {
        window.open(link, "_Blank")
    }

    return (
        <div key={profile.name} className={`maincardBox__card-profile ${isProfileActive ? 'active' : ''}`} >
            <div className={`maincardBox__card-profile-popover`}>
                <a href="#" className="maincardBox__card-profile-popover-close" onClick={(e) => {
                    e.preventDefault()
                    setIsProfileActive(false)
                }}><i className="icon-close"></i></a>
                <div className="maincardBox__card-profile-popover-pic">
                    <img src={profile.photoURL} alt="" />
                </div>
                <div className="maincardBox__card-profile-popover-text">
                    <h3 className="maincardBox__card-profile-popover-title">{profile.name}</h3>
                    <ul className="maincardBox__card-profile-popover-desc">
                        <li>- Research Fellow at AIIMS</li>
                        <li>- Member of ESA</li>
                        <li>- Speaker for Past 3 IMPACT Conferences</li>
                        {
                            profile.profileLine.length > 0 &&
                            profile.profileLine.map(line => (
                                <li>- {line}</li>
                            ))
                        }
                    </ul>

                    <div className="social-media">
                        <a href={profile.social.facebook ? profile.social.facebook : FACEBOOKLink} target="_Blank">  <img src="assets/images/facebook.png" width="75" alt=""
                        //   onClick={() => openSocialLink(profile.social.facebook ? profile.social.facebook : FACEBOOKLink)} 
                        /></a>
                        <a href={profile.social.twitter ? profile.social.twitter : TWITTERLink} target="_Blank">
                            <img src="assets/images/twitter.png" width="75" alt=""
                            // onClick={() => openSocialLink(profile.social.twitter ? profile.social.twitter : TWITTERLink)} 
                            /></a>

                        <a href={profile.social.linkedIn ? profile.social.linkedIn : LINKEDINLink} target="_Blank">
                            <img src="assets/images/linkedIn.png" width="75" alt=""
                            // onClick={() => openSocialLink(profile.social.linkedIn ? profile.social.linkedIn : LINKEDINLink)} 
                            />
                        </a>

                    </div>
                </div>
            </div>
            <img className="maincardBox__card-profile-pic" src={profile.photoURL} alt="" onClick={() => {
                console.log('xxxxxxxxx////////////')
                setIsProfileActive(true)
            }} />
            <div className="maincardBox__card-profile-text" onClick={() => {
                console.log('xxxxxxxxx////////////')
                setIsProfileActive(true)
            }}>
                <p className="maincardBox__card-profile-title">{profile.name}</p>
                <p className="maincardBox__card-profile-subtitle">{profile.designation}</p>
            </div>
        </div>
    )
}
