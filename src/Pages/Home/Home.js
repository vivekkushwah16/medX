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
            { tag: 'Respiratory', header: 'Videos on Respiratory' },
            { tag: 'COPD', header: 'Videos on COPD' },
            // { tag: 'Asthma', header: 'Videos on Asthma' },
            // { tag: 'ILD/IPF', header: 'Videos on ILD/IPF' },
            { tag: 'Telemedicine', header: 'Videos on Telemedicine' },
            { tag: 'Allergic Rhinitis', header: 'Videos on Allergic Rhinitis' },
            { tag: ['Asthma', 'ILD/IPF'], header: 'Other Videos', multipleTags: true },


            // { tag: 'Recommendations', header: 'Videos on Recommendations' },
            // { tag: 'Pediatric asthma', header: 'Videos on Pediatric asthma' },
            // { tag: 'Expert Views', header: 'Videos on Expert Views' },
            // { tag: 'Pulmonary Hypertension', header: 'Videos on Pulmonary Hypertension' },

            // { tag: 'Bronchiectasis', header: 'Videos on Bronchiectasis' },
            // { tag: 'Diagnosis', header: 'Videos on Diagnosis' },

            // { tag: 'Inhalation Devices', header: 'Videos on Inhalation Devices' },
        ],

        tags: [
            { tag: 'Respiratory', header: 'Respiratory' },
            { tag: 'COPD', header: 'COPD' },
            { tag: 'Asthma', header: 'Asthma' },
            { tag: 'ILD/IPF', header: 'ILD/IPF' },
            { tag: 'Telemedicine', header: 'Telemedicine' },
            { tag: 'Allergic Rhinitis', header: 'Allergic Rhinitis' },

            // { tag: ['Asthma', 'ILD/IPF'], header: 'Others', multipleTags: true }
            // { tag: 'Recommendations', header: 'Recommendations' },
            // { tag: 'Pediatric asthma', header: 'Pediatric asthma' },
            // { tag: 'Expert Views', header: 'Expert Views' },
            // { tag: 'Pulmonary Hypertension', header: 'Pulmonary Hypertension' },

            // { tag: 'Bronchiectasis', header: 'Bronchiectasis' },
            // { tag: 'Diagnosis', header: 'Diagnosis' },
            // { tag: 'Inhalation Devices', header: 'Inhalation Devices' },
        ],

        activeTag: { tag: 'Respiratory', header: 'Respiratory' },
        lastPlayed: null,
        lastVideoMetadata: null
    }

    onTagSelect = (tag) => {
        let _tag = this.state.rows.filter(r => !r.multipleTags ? r.tag === tag.tag : r.tag.indexOf(tag.tag) !== -1)[0]
        if (_tag.multipleTags) {
            this.setState({ activeTag: { ..._tag, currentTag: tag.tag } })
        } else {
            this.setState({ activeTag: _tag })
        }
        return
        this.setState({ activeTag: tag })
        return
        this.state.activeTag.tag == tag.tag ?
            this.setState({ activeTag: '' }) :
            this.setState({ activeTag: tag })
    }

    openVideoPop = (metadata, videoData, videosData, tagSelectedFrom) => {
        console.log(metadata,videoData,videosData,tagSelectedFrom);
        this.closeVideoPop(metadata);
        setTimeout(()=>{
            this.setState({
                currentVideosData: videosData,
                videopopVisible: true,
                videoPopupData: { ...videoData, tagSelectedFrom },
                lastVideoMetadata: metadata
            })
        },100);
        
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
                        <div class="container" id="ottContent">

                            <TagsRow tags={this.state.tags} stickyOnScroll={false} onTagSelect={this.onTagSelect} activeTag={this.state.activeTag} />

                            <div className="contentBox" >
                                {
                                    this.state.activeTag !== '' &&
                                    <VideoRow heading={`${this.state.activeTag.header}`} lastPlayed={this.state.lastPlayed}
                                        tag={this.state.activeTag.tag}
                                        openVideoPop={this.openVideoPop} grid={false}
                                        multipleTags={this.state.activeTag.multipleTags}
                                    />
                                }
                                {
                                    this.state.rows.map(row => (
                                        <>
                                            {
                                                row.tag !== this.state.activeTag.tag &&
                                                <VideoRow heading={row.header} lastPlayed={this.state.lastPlayed} tag={row.tag}
                                                    openVideoPop={this.openVideoPop}
                                                    grid={false}
                                                    multipleTags={row.multipleTags}
                                                />
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
