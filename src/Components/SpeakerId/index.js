import React from 'react'

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

export function CardSpeaker(props) {
    const { profile } = props
    return (
        <div className="maincardBox__card-profile">
            <img className="maincardBox__card-profile-pic" src={profile.photoURL} alt="" />
            <div className="maincardBox__card-profile-text">
                <p className="maincardBox__card-profile-title">{profile.name}</p>
                <p className="maincardBox__card-profile-subtitle">{profile.designation}</p>
            </div>
        </div>
    )
}
