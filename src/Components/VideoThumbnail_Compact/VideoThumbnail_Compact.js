import React from 'react'

function VideoThumbnail_Compact(props) {
    const {videosData, currentVideoData, openVideoPop } = props
    return (
        <div className="maincardBox__card maincardBox__card--large">
            <div className="maincardBox__card-menu">
                <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                <ul className="maincardBox__card-menu-dropdown">
                    <li><a onClick={()=>{
                        console.log("working?");
                        openVideoPop(currentVideoData,videosData)
                        }}>Watch this video</a></li>
                </ul>
            </div>
            <div className="maincardBox__card-left">
                <div className="maincardBox__card-video" onClick={()=>{
                        console.log("working?");
                        openVideoPop(currentVideoData,videosData)
                        }} style={{ backgroundImage: `url(${currentVideoData.thumnailUrl})` }}>
                    <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                </div>
            </div>
            <div className="maincardBox__card-right">
                <h4 className="mg-b15 maincardBox__card-title" onClick={()=>{
                        console.log("working?");
                        openVideoPop(currentVideoData,videosData)
                        }}>{currentVideoData.title}</h4>
                <p className="mg-b25 maincardBox__card-desc">{currentVideoData.description} </p>
            </div>
        </div>
    )
}

export default VideoThumbnail_Compact
