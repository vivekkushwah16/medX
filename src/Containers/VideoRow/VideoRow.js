import React, { useEffect, useState } from 'react'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoManager from '../../Managers/VideoManager';
import VideoThumbnailElement from '../../Components/VideoThumbnail/VideoThumbnailElement';



function VideoRow(props) {
    const { heading, tag, openVideoPop } = props;
    const [videosData, setData] = useState(null)

    useEffect(() => {
        getVideos()
    }, [])

    const getVideos = async () => {
        const arr = await VideoManager.getVideoWithTag([tag])
        console.log(arr);
        setData(arr)
    }

    var settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <h2 className="contentBox__title" >{heading} </h2>

            {
                videosData &&

                <Slider {...settings}>
                    {
                        videosData.map(vd => (
                            <VideoThumbnailElement videoInfo={vd} openVideoPop={openVideoPop} />
                        ))
                    }
                </Slider>
            }
            {
                !videosData &&
                <Slider {...settings}>
                    <div className="contentBox__item">
                        <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a>
                        <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                    </div>
                    <div className="contentBox__item">
                        <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a>
                        <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                    </div>
                    <div className="contentBox__item">
                        <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a>
                        <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                    </div>
                    <div className="contentBox__item">
                        <img className="contentBox__item-pic" src="assets/images/video1.jpg" alt="" />
                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug resistant TB</a>
                        <a className="contentBox__item-plus" href="#"><i className="icon-video-plus"></i></a>
                    </div>
                </Slider>
            }

        </>
    )
}

export default VideoRow