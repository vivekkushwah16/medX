import React, { useState } from 'react'

function AgendaCard(props) {
    const [like, setLike] = useState(true);
    return (
        <div class="maincardBox__card maincardBox__card--large">
            <div class="maincardBox__card-left">
                <div class="maincardBox__card-video"
                    onClick={() => { props.handleClick() }}
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
                <button class={`like-btn ${like ? 'like-btn--active' : ''}`} onClick={() => setLike(!like)}><i class="icon-like"></i> 232</button>
            </div>
        </div>

    )
}

export default AgendaCard
