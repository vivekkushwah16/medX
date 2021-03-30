import React, { useState } from 'react'
import DailyMotionPlayer from 'react-player/dailymotion'

export default function ButtonWithLoader(props) {
    const { className, id, name, handleClick, disabled } = props
    const [isLoading, setIsLoading] = useState(false)

    const handleLocalClick = async () => {
        setIsLoading(true)
        await handleClick()
        setIsLoading(false)
    }

    return (
        <button className={className} id={id ? id : ""} disabled={disabled ? disabled : isLoading} onClick={handleLocalClick} style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            {isLoading ? (
                <>
                    <img src="/assets/images/loader.gif" alt="loading" style={{ maxWidth: '1.5rem' }} />
                </>
            ) : name}
        </button>
    )
}
