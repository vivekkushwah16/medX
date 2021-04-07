import React, { useContext } from 'react'
import { UpcompingEventBanner, LiveEventBanner, ImageSingleButtonBanner } from '../../Components/Banners'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHistory } from 'react-router-dom';
import { EVENT_ROUTE } from '../../AppConstants/Routes';
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider';
import { MediaModalType } from '../../AppConstants/ModalType';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <button className="slider-btn slider-btn-next" onClick={onClick}><i className="icon-angle-right"></i></button>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <button className="slider-btn slider-btn-prev" onClick={onClick}><i className="icon-angle-left"></i></button>
    );
}


const BannerType = {
    LiveEvent: 'liveEvent',
    ImageSingleButton: 'imageSingleButton',
    UpcompingEvent: 'upcompingEvent',
}

const BannerData = [
    {
        type: BannerType.LiveEvent,
        mainTitle: 'Diagnosis & Monitoring of airway diseases in the Era of Social Distancing',
        subTitle: 'Symposium',
        eventId: '',
        mainImageUrl: 'assets/images/logos/impact-logo.png',

    },
    // {
    //     type: BannerType.ImageSingleButton,
    //     mainTitle: 'FEATURED TALK',
    //     subTitle_line1: 'Discussion on Drug',
    //     subTitle_line2: 'resistant TB',
    //     trailerUrl: '',
    //     mainImageUrl: 'assets/images/banner-pic.png',
    //     speakerId: 'speaker-kmfz0vco',
    //     eventId: 'event-kmde59n5'
    // },
    {
        type: BannerType.UpcompingEvent,
        mainTitle: '50+ Eminent Speakers',
        subTitle_line1: 'Two days of engaging',
        subTitle_line2: 'sessions',
        trailerUrl: '',
        calendarData: {},
        dateString: '9th & 10th April, 2021',
        mainImageUrl: 'assets/images/logos/impact-logo.png',
    }
]

function Banner() {
    let history = useHistory();
    const { showMediaModal } = useContext(MediaModalContext)


    const enterEvent = (eventId) => {
        history.push(`${EVENT_ROUTE}/event-kmde59n5`);
    }

    const watchTrailer = (videoUrl) => {
        //open video
        showMediaModal(MediaModalType.Videos, 'https://player.vimeo.com/video/528854507')
    }

    var settings = {
        dots: true,
        infinite: true,
        speed: 300,
        arrows: true,
        slidesToShow: 1,
        prevArrow: <SamplePrevArrow />,
        nextArrow: <SampleNextArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                }
            }
        ]
    };

    return (
        <div className="bannerBox bannerBox--large">
            <Slider className="slider-banner-desktop" {...settings}>
                {
                    BannerData.map(item => (
                        <>
                            {
                                item.type === BannerType.LiveEvent &&
                                <LiveEventBanner data={item} enterEvent={enterEvent} />
                            }
                            {
                                item.type === BannerType.ImageSingleButton &&
                                <ImageSingleButtonBanner data={item} watchTrailer={watchTrailer} />
                            }
                            {
                                item.type === BannerType.UpcompingEvent &&
                                <UpcompingEventBanner data={item} watchTrailer={watchTrailer} />
                            }
                        </>
                    ))
                }
            </Slider>
        </div>
    )
}

export default Banner