import React, { Component } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import VideoPopup from '../../Containers/VideoPopup/VideoPopup';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import './Home.css'

import Banner from '../../Containers/Banner/Banner';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoRow from '../../Containers/VideoRow/VideoRow';
import VideoManager from '../../Managers/VideoManager';


class Home extends Component {

    state = {
        data: null,
        videopopVisible: false,
        videoPopId: null,
        rows: [{tag: 'ciplamed', header: 'Recommended Videos'},
        {tag: 'covid', header: 'Videos on Covid19'},
        {tag: 'tuberculosis', header: 'Videos on Tuberculosis'},
        {tag: 'covid', header: 'Videos on Covid19'}]
    }

    openVideoPop = (videoData) => {
        this.setState({
            videopopVisible: true,
            videoPopupData: videoData,
        })
    }

    closeVideoPop = () => {
        this.setState({
            videopopVisible: false,
            videoPopupData: null,
        })
    }

    render() {

        return (
            <section className="wrapper" id="root">
                <div className="topicsBox__wrapper">

                    <div className="headerBox">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="headerBox__left">

                            </div>
                            <div className="headerBox__right headerBox__right--nogap">
                                <button className="btn btn-secondary"><i className="icon-invite"></i> Invite your friends</button>
                                <div className="notification">
                                    <a className="notification__btn" href="#"><i className="icon-bell"></i></a>
                                    <ul className="notification__dropdown">
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                    </ul>
                                </div>
                                <div className="headerBox__profile">
                                    <a className="profile__user" href="#"><img src="assets/images/user.png" alt="" /></a>
                                    <ul className="profile__dropdown">
                                        <li><a href="#">Profile</a></li>
                                        <li><a href="#">Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Banner />

                    <div className="tabBox">
                        <ul className="tabBox__list">
                            <li>Topics : </li>
                            <li><a href="#">Vaccination</a></li>
                            <li><a href="#">Resp. Devices</a></li>
                            <li><a href="#">CT Scans</a></li>
                            <li><a href="#">DRTB</a></li>
                            <li><a href="#">Neurology</a></li>
                        </ul>
                        <div className="contentBox">
                            {
                                this.state.rows.map(row =>
                                    <VideoRow heading={row.header} tag={row.tag} openVideoPop={this.openVideoPop} />
                                )
                            }
                        </div>
                    </div>
                    <footer className="footerBox">
                        <ul>
                            <li className="active"><a href="#">
                                <i className="icon-home"></i>
                            Home</a>
                            </li>
                            <li><a href="#">
                                <i className="icon-search"></i>
                            Search</a>
                            </li>
                            <li><a href="#">
                                <i className="icon-notifications2"></i>
                            Notification</a>
                            </li>
                            <li><a href="#">
                                <i className="icon-profile"></i>
                            Profile</a>
                            </li>
                        </ul>
                    </footer>
                </div>

                {
                    this.state.videopopVisible &&
                    <VideoPopup videoData={this.state.videoPopupData} closeVideoPop={this.closeVideoPop} />
                }

            </section>
        );
    };
}


export default Home;