import React from 'react'
import { UpcompingEventBanner, LiveEventBanner, ImageSingleButtonBanner } from '../../Components/Banners'

const BannerType = {
    LiveEvent: 'liveEvent',
    ImageSingleButton: 'imageSingleButton',
    upcompingEvent: 'upcompingEvent',
}

const BannerData = [
    {
        type: BannerType.LiveEvent,
        mainTitle: 'Diagnosis & Monitoring of airway diseases in the Era of Social Distancing',
        subTitle: 'Symposium',
        eventId: '',
        mainImageUrl: 'assets/images/logos/impact-logo.png',

    },
    {
        type: BannerType.ImageSingleButton,
        mainTitle: 'FEATURED TALK',
        subTitle_line1: 'Discussion on Drug',
        subTitle_line2: 'resistant TB',
        trailerUrl: '',
        mainImageUrl: 'assets/images/banner-pic.png',
        speakerId: 'speaker-sa2',
        eventId: 'event-sa1'
    },
    {
        type: BannerType.ImageTwoButton,
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

    const enterEvent = (eventId) => {
        //redirectToEventId
    }

    const watchTrailer = (videoUrl) => {
        //open video
    }

    const addToCalendar = (details) => {
        //openAdd To Calendar
    }

    return (
        <div className="bannerBox">
            <div className="slider-banner-desktop">
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
                                item.type === BannerType.upcompingEvent &&
                                <UpcompingEventBanner data={item} watchTrailer={watchTrailer} addToCalendar={addToCalendar} />
                            }
                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default Banner