import React from 'react'
import './WaveAnim.css'

export default function WaveAnim() {
    return (
        <div className="waveWrapper waveAnimation">
            <div className="waveWrapperInner bgTop">
                <div className="wave waveTop" style={{ background: 'url(https://storage.googleapis.com/cipla-impact.appspot.com/impact2021/webAssets/wave1.png)' }}></div>
            </div>
            <div className="waveWrapperInner bgMiddle">
                <div className="wave waveMiddle"
                    style={{ background: 'url(https://storage.googleapis.com/cipla-impact.appspot.com/impact2021/webAssets/wave2.png)' }}
                ></div>
            </div>
            <div className="waveWrapperInner bgBottom">
                <div className="wave waveBottom"
                    style={{ background: 'url(https://storage.googleapis.com/cipla-impact.appspot.com/impact2021/webAssets/wave2.png)' }}
                ></div>
            </div>
        </div>

    )
}
