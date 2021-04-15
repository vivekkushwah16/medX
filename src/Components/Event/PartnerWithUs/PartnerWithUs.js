import React from 'react'
import Slider from 'react-slick'
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
                slidesToShow:1,
                slidesToScroll: 1,
                arrows: true,
            }
        }
    ]
};

export default function PartnerWithUs(props) {
    const { data, countIn, isActive } = props

    return (
        <div id="tab5" class={`eventBox__tabs-content ${isActive ? 'active' : ''}`}>
            <Slider className="partnerBox slider-horizontal-3"  {...settings}>
                {
                    data.map(e => (
                        <PartnerWithUsCard data={e} countIn={countIn} />
                    ))
                }
                {
                    data.map(e => (
                        <PartnerWithUsCard data={e} countIn={countIn} />
                    ))
                }
            </Slider>
        </div>
    )
}
