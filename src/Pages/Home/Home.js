import React, { Component } from 'react';
// import { Splide, SplideSlide } from '@splidejs/react-splide';
import VideoPopup from '../../Containers/VideoPopup/VideoPopup';
// import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import './Home.css'

import Banner from '../../Containers/Banner/Banner';

// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import VideoRow from '../../Containers/VideoRow/VideoRow';
// import VideoManager from '../../Managers/VideoManager';
import Header from '../../Containers/Header/Header';
import TagsRow from '../../Containers/TagsRow/TagsRow';
import Footer from '../../Containers/Footer/Footer';


class Home extends Component {

    state = {
        data: null,
        videopopVisible: false,
        videoPopId: null,
        currentVideosData: null,
        rows: [
            { tag: 'Recommendations', header: 'Videos on Recommendations' },
            { tag: 'Respiratory', header: 'Videos on Respiratory' },
            { tag: 'Pediatric asthma', header: 'Videos on Pediatric asthma' },
            { tag: 'Expert Views', header: 'Videos on Expert Views' },
            { tag: 'Pulmonary Hypertension', header: 'Videos on Pulmonary Hypertension' },
            { tag: 'COPD', header: 'Videos on COPD' },
            { tag: 'Bronchiectasis', header: 'Videos on Bronchiectasis' },
            { tag: 'Allergic Rhinitis', header: 'Videos on Allergic Rhinitis' },
            { tag: 'Diagnosis', header: 'Videos on Diagnosis' },
            { tag: 'Asthma', header: 'Videos on Asthma' },
            { tag: 'ILD/IPF', header: 'Videos on ILD/IPF' },
            { tag: 'Telemedicine', header: 'Videos on Telemedicine' },
            { tag: 'Inhalation Devices', header: 'Videos on Inhalation Devices' },
        ],
        
        tags: [
            // { tag: 'Recommendations', header: 'Recommendations' },
            { tag: 'Respiratory', header: 'Respiratory' },
            { tag: 'Pediatric asthma', header: 'Pediatric asthma' },
            { tag: 'Expert Views', header: 'Expert Views' },
            { tag: 'Pulmonary Hypertension', header: 'Pulmonary Hypertension' },
            { tag: 'COPD', header: 'COPD' },
            { tag: 'Bronchiectasis', header: 'Bronchiectasis' },
            // { tag: 'Allergic Rhinitis', header: 'Allergic Rhinitis' },
            // { tag: 'Diagnosis', header: 'Diagnosis' },
            // { tag: 'Asthma', header: 'Asthma' },
            // { tag: 'ILD/IPF', header: 'ILD/IPF' },
            // { tag: 'Telemedicine', header: 'Telemedicine' },
            // { tag: 'Inhalation Devices', header: 'Inhalation Devices' },
        ],

        activeTag: '',
        lastPlayed: null,
        lastVideoMetadata: null
    }

    onTagSelect = (tag) => {
        this.state.activeTag.tag == tag.tag ? this.setState({ activeTag: '' }) : this.setState({ activeTag: tag })
    }

    openVideoPop = (metadata, videoData, videosData) => {
        console.log(metadata, videoData, videosData);
        this.setState({
            currentVideosData: videosData,
            videopopVisible: true,
            videoPopupData: videoData,
            lastVideoMetadata: metadata
        })
    }

    closeVideoPop = (videoData) => {
        this.setState({
            currentVideosData: null,
            videopopVisible: false,
            videoPopupData: null,
            lastPlayed: videoData,
        })
    }

    render() {

        return (
            // <section className="wrapper" id="root" style={{background: 'black'}}>
            <>
                <div className="topicsBox__wrapper" id="homePageConatiner">
                    <Header hideInviteFriend={true} whiteLogo={true} stickyOnScroll={true} />
                    <Banner />
                    <div className="tabBox" id="homeVideoContainer">
                        <div class="container">

                            <TagsRow tags={this.state.tags} onTagSelect={this.onTagSelect} activeTag={this.state.activeTag} />

                            <div className="contentBox">
                                {
                                    this.state.activeTag !== '' &&
                                    <VideoRow heading={`Videos on ${this.state.activeTag.header}`} lastPlayed={this.state.lastPlayed} tag={this.state.activeTag.tag} openVideoPop={this.openVideoPop} grid={false} />
                                }
                                {
                                    this.state.rows.map(row => (
                                        <>
                                            {
                                                row.tag !== this.state.activeTag &&
                                                <VideoRow heading={row.header} lastPlayed={this.state.lastPlayed} tag={row.tag} openVideoPop={this.openVideoPop} grid={false} />
                                            }
                                        </>
                                    )
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>

                {
                    this.state.videopopVisible &&
                    <VideoPopup metadata={this.state.lastVideoMetadata}
                        videoData={this.state.videoPopupData}
                        currVideosData={this.state.currentVideosData}
                        closeVideoPop={this.closeVideoPop}
                        openVideoPop={this.openVideoPop} />
                }
            </>
            // </section>
        );
    };
}


export default Home;
