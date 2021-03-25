import React from 'react'
import './Event.css'
import Footer from '../../Containers/Footer/Footer'
import Header from '../../Containers/Header/Header'
import { useParams } from 'react-router-dom'
import EventContainer from '../../Containers/EventContainer/EventContainer'

export default function Event() {
    let id = useParams()
    console.log(id)
    return (
        <section className="wrapper" id="root">
            <div className="topicsBox__wrapper">

                <Header showCertificate={true} showFeedback={true} />

                <EventContainer id={id} />

                <Footer />
            </div>
        </section>
    )
}
