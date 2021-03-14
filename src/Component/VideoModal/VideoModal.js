import React from 'react'
import ReactPlayer from 'react-player'
import './VideoModal.css'

function VideoModal(props) {
    return (
        <div className="videoModal">
            <div className="videoModal_container">
                <ReactPlayer
                    config={{
                        youtube: {
                            playerVars: { showinfo: 1 }
                        }
                    }}
                    playing={true}
                    url={props.link}
                    volume={0.85}
                    controls={true}
                    width='100%'
                    height='100%'
                />
                {/* <div className="blocker">
                    <div className="lds-dual-ring"></div>
                </div> */}
            </div>
        </div>
    )
}

export default VideoModal
