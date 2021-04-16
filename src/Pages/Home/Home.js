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
import { isMobileOnly } from 'react-device-detect';
import { UserContext } from '../../Context/Auth/UserContextProvider';
import { firestore } from '../../Firebase/firebase';
import { BACKSTAGE_COLLECTION, PLATFORM_BACKSTAGE_DOC } from '../../AppConstants/CollectionConstants';
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';
// import { color } from 'html2canvas/dist/types/css/types/color';

class Home extends Component {

    state = {
        data: null,
        videopopVisible: false,
        videoPopId: null,
        currentVideosData: null,
        rows: [
            { tag: 'COPD', header: 'Videos on COPD' },
            // { tag: 'Asthma', header: 'Videos on Asthma' },
            { tag: 'Asthma', header: 'Videos on Asthma' },
            { tag: 'ILD/IPF', header: 'Videos on ILD/IPF' },
            { tag: 'Telemedicine', header: 'Videos on Telemedicine' },
            { tag: ['Inhalation Devices', 'Diagnosis', 'Pulmonary Hypertension', 'Pediatric asthma', 'Bronchiectasis', 'Allergic Rhinitis'], header: 'Videos on Other Respiratory Diseases', multipleTags: true },



            // { tag: 'Recommendations', header: 'Videos on Recommendations' },
            // { tag: 'Pediatric asthma', header: 'Videos on Pediatric asthma' },
            // { tag: 'Expert Views', header: 'Videos on Expert Views' },
            // { tag: 'Pulmonary Hypertension', header: 'Videos on Pulmonary Hypertension' },

            // { tag: 'Bronchiectasis', header: 'Videos on Bronchiectasis' },
            // { tag: 'Diagnosis', header: 'Videos on Diagnosis' },

            // { tag: 'Inhalation Devices', header: 'Videos on Inhalation Devices' },
        ],

        tags: [
            { tag: 'COPD', header: 'COPD' },
            { tag: 'Asthma', header: 'Asthma' },
            { tag: 'Pediatric asthma', header: 'Pediatric Asthma' },
            { tag: 'Pulmonary Hypertension', header: 'Pulmonary Hypertension' },
            { tag: 'Bronchiectasis', header: 'Bronchiectasis' },
            { tag: 'Allergic Rhinitis', header: 'Allergic Rhinitis' },
            { tag: 'Diagnosis', header: 'Diagnosis' },
            { tag: 'Inhalation Devices', header: 'Inhalation Devices' },
            { tag: 'ILD/IPF', header: 'ILD/IPF' },
            { tag: 'Telemedicine', header: 'Telemedicine' },

            // { tag: ['Asthma', 'ILD/IPF'], header: 'Others', multipleTags: true }
            // { tag: 'Recommendations', header: 'Recommendations' },
            // { tag: 'Pediatric asthma', header: 'Pediatric asthma' },
            // { tag: 'Expert Views', header: 'Expert Views' },
            // { tag: 'Pulmonary Hypertension', header: 'Pulmonary Hypertension' },

            // { tag: 'Bronchiectasis', header: 'Bronchiectasis' },
            // { tag: 'Diagnosis', header: 'Diagnosis' },
            // { tag: 'Inhalation Devices', header: 'Inhalation Devices' },
        ],

        activeTag: { tag: 'COPD', header: 'Videos on COPD' },
        lastPlayed: null,
        lastVideoMetadata: null,
        platformData: JSON.parse(localStorage.getItem('platformData'))
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
        console.log(metadata, videoData, videosData, tagSelectedFrom);
        this.closeVideoPop(metadata);
        setTimeout(() => {
            this.setState({
                currentVideosData: videosData,
                videopopVisible: true,
                videoPopupData: { ...videoData, tagSelectedFrom },
                lastVideoMetadata: metadata
            })
        }, 100);

    }

    closeVideoPop = (videoData) => {
        this.setState({
            currentVideosData: null,
            videopopVisible: false,
            videoPopupData: null,
            lastPlayed: videoData,
        })
    }

    componentDidMount() {
        firestore.collection(BACKSTAGE_COLLECTION).doc(PLATFORM_BACKSTAGE_DOC).onSnapshot((doc) => {
            if (!doc.exists) {
                console.log("backstagePlatform doc not exists")
            }
            const data = doc.data()
            localStorage.setItem('platformData', JSON.stringify(data))
            this.setState({
                platformData: data
            })
            if (data.liveEventCTA) {
                if (data.liveEventCTA.active) {
                    swal({
                        title: data.liveEventCTA.title,
                        text: data.liveEventCTA.message,
                        icon: "info",
                        button: data.liveEventCTA.buttonText
                    }).then(() => {
                        const { history } = this.props;
                        if (history) history.push(data.liveEventCTA.redirectTo);
                    })
                }
            }
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
                            <div style={{ zIndex: '1', position: 'absolute', right: '0', top: '0', width: '7%', height: '100%', backgroundImage: 'linear-gradient(to right, transparent , black)' }}></div>

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


export default withRouter(Home);
Home.contextType = UserContext
