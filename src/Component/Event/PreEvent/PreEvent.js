import React from 'react'

function PreEvent() {
    return (
        <>
            <section class="wrapper" id="root">
                <div class="topicsBox__wrapper">
                    {/* Header */}
                    <div class="headerBox">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="headerBox__left">
                            </div>
                            <div class="headerBox__right headerBox__right--nogap">
                                <button class="btn btn-secondary"><i class="icon-invite"></i> Invite your friends</button>
                                <div class="notification">
                                    <a class="notification__btn" href="#"><i class="icon-bell"></i></a>
                                    <ul class="notification__dropdown">
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                        <li><a href="#">Lorem ipsum dolor set amet, Lorem ipsum dolor set amet.</a></li>
                                    </ul>
                                </div>
                                <div class="headerBox__profile">
                                    <a class="profile__user" href="#"><img src="assets/images/user.png" alt="" /></a>
                                    <ul class="profile__dropdown">
                                        <li><a href="#">Profile</a></li>
                                        <li><a href="#">Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BannerBox */}
                    <div class="bannerBox">
                        <div class="bannerBox__inner bannerBox__inner2 gradient-bg4">
                            <div class="bannerBox__slide">
                                <div class="bannerBox__left">
                                    <h1 class="bannerBox__maintitle">50+ Eminent Speakers</h1>
                                    <p class="bannerBox__subtitle mg-b70">Two days of engaging<br />sessions</p>
                                    <p class="bannerBox__date mg-b40">9<sup>th</sup> &amp; 10<sup>th</sup> April 2021</p>
                                    <div class="d-flex">
                                        <a href="#" class="btn btn-secondary bannerBox__btn mg-r20">Add to Calender</a>
                                        <a href="#" class="btn btn-secondary--outline bannerBox__btn">WATCH TRAILER</a>
                                    </div>
                                </div>
                                <div class="bannerBox__right">
                                    <img class="bannerBox__pic" src="assets/images/logos/impact-logo.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab box */}

                    <div class="tabBox tabBox--new">
                        <div class="maincardBox">

                            <h2 class="maincardBox__title mg-b25">AGENDA</h2>

                            <div class="maincardBox__card-wrapper">
                                <div class="maincardBox__card maincardBox__card--large">
                                    <div class="maincardBox__card-left">
                                        <div class="maincardBox__card-video"
                                            style={{ backgroundImage: 'url(assets/images/video-thumb.jpg)' }}>
                                            <a href="javascript:void(0)" class="maincardBox__card-video__play"><i
                                                class="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div class="maincardBox__card-right">
                                        <h4 class="mg-b15 maincardBox__card-title">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.</h4>
                                        <p class="mg-b25 maincardBox__card-desc">Neque est maecenas id arcu. Placerat in
                                    faucibus amet massa consectetur vitae. Diam ipsum, risus, amet mauris neque. </p>
                                        <p class="mg-b20 maincardBox__card-date">APRIL 9,
                                    2021&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;10:30 AM</p>
                                        <h4 class="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                                        <a href="#" class="maincardBox__card-profile">
                                            <img class="maincardBox__card-profile-pic" src="assets/images/user.png" alt="" />
                                            <div class="maincardBox__card-profile-text">
                                                <p class="maincardBox__card-profile-title">Dr Jc halley</p>
                                                <p class="maincardBox__card-profile-subtitle">MBBS, Aligarh University</p>
                                            </div>
                                        </a>
                                        <button class="like-btn like-btn--active"><i class="icon-like"></i> 232</button>
                                    </div>
                                </div>
                                <div class="maincardBox__card maincardBox__card--large">
                                    <div class="maincardBox__card-left">
                                        <div class="maincardBox__card-video"
                                            style={{ backgroundImage: 'url(assets/images/video-thumb.jpg)' }}>
                                            <a href="javascript:void(0)" class="maincardBox__card-video__play"><i
                                                class="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div class="maincardBox__card-right">
                                        <h4 class="mg-b15 maincardBox__card-title">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.</h4>
                                        <p class="mg-b25 maincardBox__card-desc">Neque est maecenas id arcu. Placerat in
                                    faucibus amet massa consectetur vitae. Diam ipsum, risus, amet mauris neque. </p>
                                        <p class="mg-b20 maincardBox__card-date">APRIL 9,
                                    2021&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;10:30 AM</p>
                                        <h4 class="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                                        <a href="#" class="maincardBox__card-profile">
                                            <img class="maincardBox__card-profile-pic" src="assets/images/user.png" alt="" />
                                            <div class="maincardBox__card-profile-text">
                                                <p class="maincardBox__card-profile-title">Dr Jc halley</p>
                                                <p class="maincardBox__card-profile-subtitle">MBBS, Aligarh University</p>
                                            </div>
                                        </a>
                                        <button class="like-btn like-btn--active"><i class="icon-like"></i> 232</button>
                                    </div>
                                </div>
                                <div class="maincardBox__card maincardBox__card--large">
                                    <div class="maincardBox__card-left">
                                        <div class="maincardBox__card-video"
                                            style={{ backgroundImage: 'url(assets/images/video-thumb.jpg)' }}>
                                            <a href="javascript:void(0)" class="maincardBox__card-video__play"><i
                                                class="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div class="maincardBox__card-right">
                                        <h4 class="mg-b15 maincardBox__card-title">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.</h4>
                                        <p class="mg-b25 maincardBox__card-desc">Neque est maecenas id arcu. Placerat in
                                    faucibus amet massa consectetur vitae. Diam ipsum, risus, amet mauris neque. </p>
                                        <p class="mg-b20 maincardBox__card-date">APRIL 9,
                                    2021&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;10:30 AM</p>
                                        <h4 class="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                                        <a href="#" class="maincardBox__card-profile">
                                            <img class="maincardBox__card-profile-pic" src="assets/images/user.png" alt="" />
                                            <div class="maincardBox__card-profile-text">
                                                <p class="maincardBox__card-profile-title">Dr Jc halley</p>
                                                <p class="maincardBox__card-profile-subtitle">MBBS, Aligarh University</p>
                                            </div>
                                        </a>
                                        <button class="like-btn like-btn--active"><i class="icon-like"></i> 232</button>
                                    </div>
                                </div>
                                <div class="maincardBox__card maincardBox__card--large">
                                    <div class="maincardBox__card-left">
                                        <div class="maincardBox__card-video"
                                            style={{ backgroundImage: 'url(assets/images/video-thumb.jpg)' }}>
                                            <a href="javascript:void(0)" class="maincardBox__card-video__play"><i
                                                class="icon-play"></i></a>
                                        </div>
                                    </div>
                                    <div class="maincardBox__card-right">
                                        <h4 class="mg-b15 maincardBox__card-title">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.</h4>
                                        <p class="mg-b25 maincardBox__card-desc">Neque est maecenas id arcu. Placerat in
                                    faucibus amet massa consectetur vitae. Diam ipsum, risus, amet mauris neque. </p>
                                        <p class="mg-b20 maincardBox__card-date">APRIL 9,
                                    2021&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;10:30 AM</p>
                                        <h4 class="mg-b20 maincardBox__card-title">SPEAKERS</h4>
                                        <a href="#" class="maincardBox__card-profile">
                                            <img class="maincardBox__card-profile-pic" src="assets/images/user.png" alt="" />
                                            <div class="maincardBox__card-profile-text">
                                                <p class="maincardBox__card-profile-title">Dr Jc halley</p>
                                                <p class="maincardBox__card-profile-subtitle">MBBS, Aligarh University</p>
                                            </div>
                                        </a>
                                        <button class="like-btn like-btn--active"><i class="icon-like"></i> 232</button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* footer box */}
                    <footer class="footerBox">
                        <ul>
                            <li class="active"><a href="#">
                                <i class="icon-home"></i>
                            Home</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-search"></i>
                            Search</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-notifications2"></i>
                            Notification</a>
                            </li>
                            <li><a href="#">
                                <i class="icon-profile"></i>
                            Profile</a>
                            </li>
                        </ul>
                    </footer>
                </div>
            </section>
        </>
    )
}

export default PreEvent
