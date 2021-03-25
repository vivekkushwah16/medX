import React, { useEffect, useState, useCallback } from 'react'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoThumbnail_Rich from '../../Components/VideoThumbnail_Rich/VideoThumbnail_Rich';
import VideoManager from '../../Managers/VideoManager';


function VideoRow(props) {
    const { heading, tag, lastPlayed, openVideoPop, grid } = props;
    const [videosData, setData] = useState(null);

    useEffect(() => {
        getVideos()
    }, [tag])

    const getVideos = async () => {
        const arr = await VideoManager.getVideoWithTag([tag]);
        console.log(arr);
        setData(arr);
    }


    var settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 3.25,
        slidesToScroll: 3.25,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 2.5,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1.5
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1.5
                }
            }
        ]
    };

    return (
        <>
            <h2 className="contentBox__title" >{heading} </h2>

            {
                videosData ?
                    <>
                    {
                        grid ?
                            <>
                                <div className="contentBox__item-wrapper row">
                                    {
                                        videosData.map(vd => (
                                            <VideoThumbnail_Rich videoInfo={vd} videosData={videosData}
                                                openVideoPop={openVideoPop} grid={grid}
                                            />
                                        ))
                                    }
                                </div>
                            </>
                            :
                            <>
                                <Slider {...settings}>
                                    {
                                        videosData.map(vd => (
                                            <VideoThumbnail_Rich videoInfo={vd} videosData={videosData}
                                                openVideoPop={openVideoPop} grid={grid}
                                            />
                                        ))
                                    }
                                </Slider>
                            </>
                    }
                    </>
                    :
                    <>
                    <Slider {...settings}>
                        <div className="contentBox__item">
                            <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                            {/* <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a> */}
                            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                        </div>
                        <div className="contentBox__item">
                            <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                            {/* <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a> */}
                            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                        </div>
                        <div className="contentBox__item">
                            <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                            {/* <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a> */}
                            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                        </div>
                        <div className="contentBox__item">
                            <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                            {/* <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a> */}
                            <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                        </div>
                    </Slider>
                    </>
            }
        </>
    )
}

export default VideoRow