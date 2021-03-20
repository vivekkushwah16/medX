import React from 'react'

function VideoThumbnailElement(props) {
    const { videoInfo, openVideoPop} = props
    return (
        <div className="contentBox__item" id={videoInfo.id} onClick={()=>openVideoPop(videoInfo)}>
            <img className="contentBox__item-pic" src={videoInfo.thumnailUrl} alt="" />
            <a href="#" className="contentBox__item-title">{videoInfo.title}</a>
            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
        </div>
    )
}

export default VideoThumbnailElement
