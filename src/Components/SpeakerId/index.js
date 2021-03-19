import React from 'react'

export function BannerSpeaker(props) {
    const { profile } = props
    return (
        <a href="#" class="bannerBox__profile mg-b50">
            <img class="bannerBox__profile-pic" src={profile.photoURL} alt="" />
            <div class="bannerBox__profile-text">
                <p class="bannerBox__profile-title">{profile.name}</p>
                <p class="bannerBox__profile-subtitle">{profile.designation}</p>
            </div>
        </a>
    )
}

export function CardSpeaker(props) {
    const { profile } = props
    return (
        <a href="#" class="maincardBox__card-profile">
            <img class="maincardBox__card-profile-pic" src={profile.photoURL} alt="" />
            <div class="maincardBox__card-profile-text">
                <p class="maincardBox__card-profile-title">{profile.name}</p>
                <p class="maincardBox__card-profile-subtitle">{profile.designation}</p>
            </div>
        </a>
    )
}
