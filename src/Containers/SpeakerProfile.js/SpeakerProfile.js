import React, { useState, useContext, useEffect } from 'react'
import { SpeakerProfileType } from '../../AppConstants/SpeakerProfileType'
import { BannerSpeaker, CardSpeaker } from '../../Components/SpeakerId'
import { speakerContext } from '../../Context/Speaker/SpeakerContextProvider'

//props - type, id
export default function SpeakerProfile(props) {
    if (!props.type) {
        props.type = SpeakerProfileType.CARD_PROFILE
    }
    const [profile, setProfile] = useState(null)
    const { getSpeaker } = useContext(speakerContext)

    useEffect(() => {
        getProfile(props.id)
    }, [])

    const getProfile = async (id) => {
        const profile = await getSpeaker(id)
        setProfile(profile)
    }

    return (
        <>
            {
                profile && 
                props.type === SpeakerProfileType.CARD_PROFILE &&
                < CardSpeaker profile={profile} />
            }
            {
                profile && 
                props.type === SpeakerProfileType.BANNER_PROFILE &&
                < BannerSpeaker profile={profile} />
            }
        </>
    )
}
