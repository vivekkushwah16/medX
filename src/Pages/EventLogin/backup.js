<header class="headerBox">
<div class="container-small">
    <div class="d-flex align-items-center justify-content-between">
        <div class="headerBox__left">
            <a href="#" class="headerBox__logo4">
                <img src="assets/images/cipla-logo.png" alt="" />
            </a>
        </div>

    </div>
</div>
</header>

{/*  Older header
<header className="headerBox">
<div className="d-flex align-items-center justify-content-between">
    <div className="headerBox__left">
        <a href="#" className="headerBox__logo">
            <img src="assets/images/cipla-logo.png" alt="" />
        </a>
    </div>
    <div className="headerBox__right">
        <a href="#" className="headerBox__logo2">
            <img src="assets/images/logo2.png" alt="" />
        </a>
    </div>
</div>
</header> */}

<div className="login2Box__left">
<div class="bannerBox">
    <div class="bannerBox__inner bannerBox__inner--small bannerBox__inner4 gradient-bg1">
        <div class="bannerBox__slide">
            <div class="container-small">
                <div class="d-flex">
                    <div class="bannerBox__left">
                        <h1 class="bannerBox__subtitle mg-b10">2 Days of Cutting-Edge academic feast </h1>
                        <p class="bannerBox__desc mg-b35">With 7 International and 14 National Experts in Respiratory Medicine</p>
                        <div class="d-flex d-sm-block justify-content-between">
                            {/* <a href="#" class="btn btn-sm btn-secondary bannerBox__btn mg-r20 d-flex align-items-center" onClick={(e)=>{
                                e.preventDefault()
                                this.setState({
                                    showVideo: true
                                })
                            }}>Watch Trailer <i class="icon-play mg-l10"></i></a> */}
                        </div>
                    </div>
                    <div class="bannerBox__right">

                        <img class="bannerBox__pic" src="assets/images/impact-logo3.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<AgendaNavBar className={"hide-on-tablet"} dates={this.state.agendaDates} currentDate={this.state.currentDate} handleClick={this.handleDateChange} />

{/* <div className="login2Box-text">
    <div className="login2Box__label">
        <h2 className="login2Box__label-title mg-b20" style={{ textTransform: 'uppercase' }}>2 Days of cutting edge academic feast  </h2>
        <p className="login2Box__label-desc">with 7 international and 14 national experts in Respiratory Medicine</p>
    </div>
    <div className="login2Box__video">
        <img src="assets/images/video-thumb.jpg" alt="" />
    </div>
</div> */}

<ul className="mobile-tabs">
    <li className={`${this.state.currentTab === TABS.LoginTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.LoginTab)}><span>Login</span></a></li>
    <li className={`${this.state.currentTab === TABS.AgendaTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.AgendaTab)}><span>AGENDA</span></a></li>
</ul>


{
    this.state.agendaData && this.state.currentTab !== TABS.LoginTab &&
    <Agenda dates={this.state.agendaDates} currentDate={this.state.currentDate} data={this.state.agendaData} haveVideo={false} haveLikeButton={false} handleDateChange={this.handleDateChange} ></Agenda>
}
</div>
