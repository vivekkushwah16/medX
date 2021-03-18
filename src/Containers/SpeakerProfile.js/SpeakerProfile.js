import React, { useState } from 'react'
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType'
import { BannerSpeaker, CardSpeaker } from '../../Components/SpeakerId'

const dummyProfile = {
    name: 'Dr Jc halley',
    designation: 'MBBS, Aligarh University',
    profileURL: 'assets/images/user.png'
}

//props - type, id
export default function SpeakerProfile(props) {
    if (!props.type) {
        props.type = SpeakerProfileType.CARD_PROFILE
    }

    const [profile, setProfile] = useState(null)
    //get speaker context
    //useEffect to get speaker details,(first check in context and then in db)

    return (
        <>
            {
                profile && props.type === SpeakerProfileType.CARD_PROFILE &&
                < CardSpeaker profile={dummyProfile} />
            }
            {
                profile && props.type === SpeakerProfileType.BANNER_PROFILE &&
                < BannerSpeaker profile={dummyProfile} />
            }
        </>
    )
}
