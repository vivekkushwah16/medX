import React, { useState } from 'react'
import Slider from 'react-slick'
import { eventContext } from '../../../Context/Event/EventContextProvider';
import PartnerWithUsCard from './PartnerWithUsCard/PartnerWithUsCard'


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

var settings = {
    dots: true,
    infinite: true,
    speed: 300,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    // className:".partnerBox__item.slick-center",  
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,

    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                arrows: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
            }
        }
    ]
};

export default function PartnerWithUs(props) {
    const { data, countIn, isActive } = props
    const [isUpdated, setUpdate] = useState(false);

    const _callCountIn = (eventId, targetId) => {
        return new Promise(async (res, rej) => {
            try {
                await countIn(eventId, targetId)
                setUpdate(true)
            } catch (error) {
                console.log(error)
            }
        })
    }
    
    return (
        <div id="tab5" className={`eventBox__tabs-content ${isActive ? 'active' : ''}`}>
            <Slider className="partnerBox slider-horizontal-3"  {...settings}>
                {
                    data.map(e => (
                        <PartnerWithUsCard data={e} countIn={_callCountIn} />
                    ))
                }
                {
                    data.map(e => (
                        <PartnerWithUsCard data={e} countIn={_callCountIn} />
                    ))
                }
            </Slider>
        </div>
    )
}
