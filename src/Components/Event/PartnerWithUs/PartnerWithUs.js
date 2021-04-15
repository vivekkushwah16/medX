import React, { useState, useContext, useEffect } from 'react'
import Slider from 'react-slick'
import { PARTNERWITHUSAGREE_COLLECTION } from '../../../AppConstants/CollectionConstants';
import { UserContext } from '../../../Context/Auth/UserContextProvider';
import { eventContext } from '../../../Context/Event/EventContextProvider';
import { firestore } from '../../../Firebase/firebase';
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

let partnerWithUsRef = null

export default function PartnerWithUs(props) {
    const { data, countIn, isActive, eventId: id } = props

    const [agreedData, setAgreedData] = useState(false);
    const { user } = useContext(UserContext)

    useEffect(() => {
        partnerWithUsListener(id)
        return () => {
            removePartnerWithUsListener()
        }
    }, [])


    const partnerWithUsListener = (eventId, callback) => {
        const ref = firestore.collection(PARTNERWITHUSAGREE_COLLECTION).where('user', '==', user.uid)//.where('eventId', "==", eventId);
        partnerWithUsRef = ref.onSnapshot(query => {
            if (query.empty) {
                let err = { code: "404", message: 'NO File Found' }
                if (callback) {
                    callback(null, err)
                }
            }
            let dataObj = {}
            query.docs.forEach((doc) => {
                dataObj[doc.data().targetId] = true
            })
            // console.log('xxxxxxxxxxxxxxx=========================')
            setAgreedData(dataObj)
            // console.log('xxxxxxxxxxxxxxx=========================')

        })
    }

    const removePartnerWithUsListener = () => {
        if (partnerWithUsRef) {
            partnerWithUsRef()
        }
    }

    const _callCountIn = (eventId, targetId) => {
        return new Promise(async (res, rej) => {
            try {
                await countIn(eventId, targetId)
                // console.log("count me in")
                res()
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
                        <PartnerWithUsCard agreedData={agreedData} data={e} countIn={_callCountIn} />
                    ))
                }
                {
                    data.map(e => (
                        <PartnerWithUsCard agreedData={agreedData} data={e} countIn={_callCountIn} />
                    ))
                }
            </Slider>
        </div>
    )
}
