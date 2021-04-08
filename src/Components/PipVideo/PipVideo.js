import React, { useEffect, useRef, useState } from 'react'
import { isMobileOnly } from 'react-device-detect';
import ReactPlayer from 'react-player';

const extraPdding = 0;

export default function PipVideo(props) {
    const { link } = props;
    const [pipMode, setPipMode] = useState(false)
    const playerRef = useRef(null)
    const [yOffset, setyOffset] = useState(0)



    useEffect(() => {
        console.log(playerRef.current, ReactPlayer.canEnablePIP(link))

        if (playerRef.current) {
            setyOffset(playerRef.current.wrapper.offsetTop)
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            }
        }
    }, [playerRef.current])

    const handleScroll = () => {
        try {
            if (yOffset > 0) {
                if (window.pageYOffset >= (yOffset + extraPdding)) {
                    setPipMode(true)
                } else {
                    setPipMode(false)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ReactPlayer
            playing={true}
            url={link}
            volume={0.85}
            controls={true}
            width='100%'
            height={isMobileOnly ? '40vh' : '60vh'}
            playsinline={true}
            pip={pipMode}
            ref={playerRef}
        ></ReactPlayer>
    )
}
