import React from 'react'

function VideoThumbnail_Compact(props) {
    const { videoInfo, openVideoPop } = props
    return (
        <div className="maincardBox__card maincardBox__card--large">
            <div className="maincardBox__card-menu">
                <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                <ul className="maincardBox__card-menu-dropdown">
                    <li><a href="#">Watch this video</a></li>
                </ul>
            </div>
            <div className="maincardBox__card-left">
                <div className="maincardBox__card-video" style={{ backgroundImage: "url(assets/images/video-thumb.jpg)" }}>
                    <a href="javascript:void(0)" className="maincardBox__card-video__play"><i className="icon-play"></i></a>
                </div>
            </div>
            <div className="maincardBox__card-right">
                <h4 className="mg-b15 maincardBox__card-title">Panel Discussion on Drug resistant TB</h4>
                <p className="mg-b25 maincardBox__card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. </p>
            </div>
        </div>
    )
}

export default VideoThumbnail_Compact
