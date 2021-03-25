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
        rows: [{ tag: 'ciplamed', header: 'Recommended Videos' },
        { tag: 'covid', header: 'Videos on Covid19' },
        { tag: 'tuberculosis', header: 'Videos on Tuberculosis' },
        { tag: 'vaccination', header: 'Videos on Vaccination' }],

        tags: [{ tag: 'ciplamed', header: 'Ciplamed' },
        { tag: 'covid', header: 'Covid19' },
        { tag: 'tuberculosis', header: 'Tuberculosis' },
        { tag: 'vaccination', header: 'Vaccination' }],
    }

    openVideoPop = (videoData, videosData) => {
        console.log(videosData,videoData);
        this.setState({
            currentVideosData: videosData,
            videopopVisible: true,
            videoPopupData: videoData,
        })
    }

    closeVideoPop = () => {
        this.setState({
            currentVideosData: null,
            videopopVisible: false,
            videoPopupData: null,
        })
    }

    render() {

        return (
            <section className="wrapper" id="root">
                <div className="topicsBox__wrapper">
                    <Header />
                    <Banner />
                    <div className="tabBox">
                        <TagsRow tags={this.state.tags}/> 
                        <div className="contentBox">
                            {
                                this.state.rows.map(row =>
                                    <VideoRow heading={row.header} tag={row.tag} openVideoPop={this.openVideoPop} />
                                )
                            }
                        </div>
                    </div>
                    <Footer />
                </div>

                {
                    this.state.videopopVisible &&
                    <VideoPopup videoData={this.state.videoPopupData} 
                    currVideosData={this.state.currentVideosData} 
                    closeVideoPop={this.closeVideoPop} 
                    openVideoPop={this.openVideoPop}/>
                }

            </section>
        );
    };
}


export default Home;
