import React from 'react'

function VideoThumbnail_Rich(props) {
    const { videosData, videoInfo, openVideoPop} = props
    return (
        <div className="contentBox__item" id={videoInfo.id} onClick={()=>openVideoPop(videoInfo,videosData)}>
            <img className="contentBox__item-pic" src={videoInfo.thumnailUrl} alt="" />
            <a href="#" className="contentBox__item-title">{videoInfo.title}</a>
            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
        </div>
    )
}

export default VideoThumbnail_Rich
