import React from 'react'
import './Event.css'
import Footer from '../../Containers/Footer/Footer'
import Header from '../../Containers/Header/Header'

export default function Event() {
    return (
        <section className="wrapper" id="root">
            <div className="topicsBox__wrapper">

                <div className="headerBox">
                    <div className="d-flex align-items-flex-start justify-content-between">
                        <div className="headerBox__left">
                            <a href="#" className="headerBox__logo3">
                                <img src="assets/images/logos/impact-logo2.png" alt="" />
                            </a>
                        </div>
                        <div className="headerBox__right headerBox__right--nogap">
                            <button className="btn btn-secondary">Get your certificate</button>
                            <button className="btn btn-secondary">Feedback</button>
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
                                <div className="profile__dropdown">
                                    <a href="#" className="profile__dropdown-profile">
                                        <div className="profile__dropdown-profile-pic">
                                            <img src="assets/images/user.png" alt="" />
                                            <i className="icon-crown"></i>
                                        </div>
                                        <div className="profile__dropdown-profile-text">
                                            <p className="profile__dropdown-profile-title">Dr. Anubha Jain</p>
                                            <p className="profile__dropdown-profile-subtitle">MD Acharya College of medical sciences</p>
                                        </div>
                                    </a>
                                    <ul className="">
                                        <li><a href="#">My Account</a></li>
                                        <li><a href="#">Achievement</a></li>
                                        <li><a href="#">Watchlist</a></li>
                                        <li><a href="#">Community connections</a></li>
                                    </ul>
                                    <button className="btn btn-block btn-grey">Log out</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="eventBox">
                    <div className="container">
                        <div className="d-flex row d-sm-block">
                            <div className="eventBox__left col">
                                <div className="eventBox__video">
                                    <img src="assets/images/video3.jpg" alt="" />
                                </div>
                                <div className="eventBox__tabs-wrapper">
                                    <ul className="eventBox__tabs">
                                        <li><a className="active" href="#">About</a></li>
                                        <li><a href="#">Agenda</a></li>
                                        <li><a href="#">Trending</a></li>
                                        <li className="hide-on-desktop"><a href="#">Polls</a></li>
                                        <li><a href="#">Partner with us</a></li>
                                        <li className="show-on-desktop"><a href="#" className="like-btn"><i className="icon-like"></i> 232</a></li>
                                    </ul>

                                    <div className="text-right pd-t20 pd-b20 hide-on-desktop">
                                        <a href="#" className="like-btn"><i className="icon-like"></i> 232</a>
                                    </div>

                                </div>
                            </div>
                            <div className="eventBox__right show-on-desktop col">
                                <div className="communityBox">
                                    <h2 className="communityBox__title">Ask a question</h2>
                                    <div className="communityBox__send mg-b20">
                                        <div className="communityBox__send--submitted">
                                            <h3 className="mg-b15">Thank You!</h3>
                                            <p>Your question has been submitted to our Moderators</p>
                                            <a href="#" className="close"><i className="icon-close"></i></a>
                                        </div>
                                    </div>

                                    <h2 className="communityBox__title mg-b10">Polls</h2>
                                    <hr></hr>
                                    <div className="communityBox__question">
                                        <h3 className="communityBox__title">Q1. HOW TO DESIGN A VIRTUAL EVENT?</h3>
                                        <ul className="communityBox__options">
                                            <li>
                                                <div className="custom-slider">
                                                    <span className="custom-slider__text">By Understanding Users.</span>
                                                    <div className="custom-slider__bar">
                                                        <span className="custom-slider__mark">70%</span>
                                                        <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-slider">
                                                    <span className="custom-slider__text">By Understanding Users.</span>
                                                    <div className="custom-slider__bar">
                                                        <span className="custom-slider__mark">70%</span>
                                                        <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-slider">
                                                    <span className="custom-slider__text">By Understanding Users.</span>
                                                    <div className="custom-slider__bar">
                                                        <span className="custom-slider__mark">70%</span>
                                                        <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom-slider">
                                                    <span className="custom-slider__text">By Understanding Users.</span>
                                                    <div className="custom-slider__bar">
                                                        <span className="custom-slider__mark">70%</span>
                                                        <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </section>
    )
}
