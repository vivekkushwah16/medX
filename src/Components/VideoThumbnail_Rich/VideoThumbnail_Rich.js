import React from 'react'

function VideoThumbnail_Rich(props) {
    const { videosData, videoInfo, openVideoPop,handleOnItemClick } = props
    return (
        <div class="col-100">
            <div className="contentBox__item" id={videoInfo.id} 
                 onClick={() => openVideoPop(videoInfo, videosData)}
            // onClickCapture={() => {openVideoPop(videoInfo, videosData);handleOnItemClick()}}
            >
                <img className="contentBox__item-pic" src={videoInfo.thumnailUrl} alt="" />
                <a className="contentBox__item-title">{videoInfo.title}</a>
                {/* <a class="contentBox__item-plus" href="#"><i class="icon-video-plus"></i></a>  */}

                <div className="maincardBox__card-menu">
                    <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                    <ul className="maincardBox__card-menu-dropdown">
                        <li><a href="#">Watch This Video</a></li>
                        <li><a href="#">Not Interested</a></li>
                    </ul>
                </div>
                <div className="custom-slider">
                    <div className="custom-slider__bar">
                        <div className="custom-slider__bar-inner" style={{ width: "70%" }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoThumbnail_Rich
