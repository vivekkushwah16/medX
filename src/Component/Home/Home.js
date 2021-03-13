import React, {Component} from 'react';
import {Splide, SplideSlide} from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';


class Home extends Component {
    render() {
        return <section className="wrapper" id="root">
            <div className="topicsBox__wrapper">

                <div className="headerBox">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="headerBox__left">
                                <a href="#" className="headerBox__logo">
                                    <img src="assets/images/logo.png" alt=""/>
                                </a>
                                <ul className="header-toggle">
                                    <li className="active"><a href="#">Videos</a></li>
                                    <li><a href="#">Events</a></li>
                                </ul>
                            </div>
                            <div className="headerBox__right">
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
                                    <a className="profile__user" href="#"><img src="assets/images/user.png" alt=""/></a>
                                    <ul className="profile__dropdown">
                                        <li><a href="#">Profile</a></li>
                                        <li><a href="#">Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bannerBox gradient-bg2">
                    <div className="bannerBox__inner">
                        <div className="container">

                            <div id="splide-banner-desktop" className="splide show-on-desktop">
                                <Splide options={{
                                    direction: 'ttb',
                                    height: '50rem',
                                    arrows: false,
                                    perPage: 1,
                                }}>

                                    <SplideSlide>

                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>

                                    <SplideSlide>
                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>
                                    <SplideSlide>
                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>
                                </Splide>

                            </div>

                            <div id="splide-banner-mobile" className="splide hide-on-desktop">
                                <Splide options={{
                                    autioHeight: true,
                                    arrows: false,
                                    perPage: 1,
                                }}>

                                    <SplideSlide>
                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>
                                    <SplideSlide>
                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>
                                    <SplideSlide>
                                        <div className="bannerBox__slide">
                                            <div className="bannerBox__left">
                                                <h1 className="bannerBox__title mg-b20">Diagnosis & Monitoring of
                                                    airway diseases in the Era of Social Distancing</h1>
                                                <div className="bannerBox__status mg-b25">
                                                    <h3 className="bannerBox__status-title">Symposium</h3>
                                                    <span className="bannerBox__status-mark">LIVE</span>
                                                </div>
                                                <a href="#" className="btn btn-primary bannerBox__btn">ENTER
                                                    EVENT</a>
                                            </div>
                                            <div className="bannerBox__right">
                                                <img className="bannerBox__pic" src="assets/images/inspire-logo.png"
                                                     alt=""/>
                                            </div>
                                        </div>
                                    </SplideSlide>
                                </Splide>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabBox">
                    <div className="container">
                        <ul className="tabBox__list">
                            <li>Topics :</li>
                            <li><a href="#">Vaccination</a></li>
                            <li><a href="#">Resp. Devices</a></li>
                            <li><a href="#">CT Scans</a></li>
                            <li><a href="#">DRTB</a></li>
                            <li><a href="#">Neurology</a></li>
                        </ul>
                        <div className="contentBox">

                            <h2 className="contentBox__title">Recommended Videos</h2>
                            <Splide options={{
                                autoHeight: true,
                                pagination: false,
                                perPage: 4,
                                gap: '2rem',
                                arrows: false,
                                breakpoints: {
                                    1199: {
                                        perPage: 3,
                                    },
                                    767: {
                                        gap: '1rem',
                                        perPage: 2,
                                    },
                                }
                            }}>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                            </Splide>

                            <h2 className="contentBox__title">Videos on Covid19</h2>
                            <Splide options={{
                                autoHeight: true,
                                pagination: false,
                                perPage: 4,
                                gap: '2rem',
                                arrows: false,
                                breakpoints: {
                                    1199: {
                                        perPage: 3,
                                    },
                                    767: {
                                        gap: '1rem',
                                        perPage: 2,
                                    },
                                }
                            }}>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                            </Splide>

                            <h2 className="contentBox__title">Videos on Tuberculosis</h2>
                            <Splide options={{
                                autoHeight: true,
                                pagination: false,
                                perPage: 4,
                                gap: '2rem',
                                arrows: false,
                                breakpoints: {
                                    1199: {
                                        perPage: 3,
                                    },
                                    767: {
                                        gap: '1rem',
                                        perPage: 2,
                                    },
                                }
                            }}>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                            </Splide>
                            <h2 className="contentBox__title">Videos on Covid19</h2>
                            <Splide options={{
                                autoHeight: true,
                                pagination: false,
                                perPage: 4,
                                gap: '2rem',
                                arrows: false,
                                breakpoints: {
                                    1199: {
                                        perPage: 3,
                                    },
                                    767: {
                                        gap: '1rem',
                                        perPage: 2,
                                    },
                                }
                            }}>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">

                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                                <SplideSlide className="contentBox__item ">
                                    <div>
                                        <img className="contentBox__item-pic" src="assets/images/video1.jpg"
                                             alt=""/>
                                        <a href="#" className="contentBox__item-title">Panel Discussion on Drug
                                            resistant TB</a>
                                        <a className="contentBox__item-plus" href="#"><i
                                            className="icon-video-plus"></i></a>
                                    </div>
                                </SplideSlide>
                            </Splide>
                        </div>
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
        </section>;
    }
}


export default Home;
