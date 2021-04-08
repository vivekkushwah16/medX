import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../Context/Auth/UserContextProvider'

const bandClassNames = ['', "contentBox__item-title--pink", "contentBox__item-title--orange"]


function VideoThumbnail_Rich(props) {
    const { videosData, videoInfo, openVideoPop, grid, refresh } = props
    const [metadata, setMetadata] = useState(null);
    const { getVideoMetaData } = useContext(UserContext);
    const [bandClassName, setBandClassName] = useState('')

    useEffect(() => {
        getVideoMetaData(videoInfo.id).then((data) => {
            setMetadata(data);
            // console.log(data);
        });
        setBandClassName(bandClassNames[Math.round(Math.random() * 3)])
    }, [videoInfo, refresh])

    return (
        <div className={"col-25 col-md-50 col-sm-100"} style={!grid ? { width: '100%' } : {}}>
            <div className="contentBox__item" id={videoInfo.id}
                onClick={() => openVideoPop(metadata, videoInfo, videosData)}
                style={{ backgroundImage: `url(${videoInfo.thumnailUrl})` }}
            // onClickCapture={() => {openVideoPop(videoInfo, videosData);handleOnItemClick()}}
            >
                {/* <img className="contentBox__item-pic" src={videoInfo.thumnailUrl} alt="" /> */}
                <a href="#" class="contentBox__item-play"><i class="icon-play"></i></a>
                <a className={`contentBox__item-title ${bandClassName}`}>{videoInfo.title}
                    <ul>
                        {videoInfo.tags.map(tag => (<li>{tag}</li>))}
                    </ul>
                </a>

                {/* <a class="contentBox__item-plus" href="#"><i class="icon-video-plus"></i></a>  */}

                {/* <div className="maincardBox__card-menu">
                    <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                    <ul className="maincardBox__card-menu-dropdown">
                        <li><a href="#">Watch This Video</a></li>
                        <li><a href="#">Not Interested</a></li>
                    </ul>
                </div> */}
                <div className="custom-slider">
                    <div className="custom-slider__bar">
                        <div className="custom-slider__bar-inner" style={{ width: `${metadata ? (metadata.lastKnownTimestamp / metadata.duration) * 100 : 0}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoThumbnail_Rich
