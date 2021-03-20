import React, { Component } from 'react';
import firebase, { auth } from "../../Firebase/firebase"
import { withRouter } from 'react-router-dom';
import Agenda from "../../Components/Event/Agenda/Agenda";
import './Login.css'
import PhoneInput from "react-phone-number-input";
import VideoModal from '../../Components/VideoModal/VideoModal';
import { HOME_ROUTE } from '../../AppConstants/Routes';
import EventManager from '../../Managers/EventManager';
import { isMobileOnly } from 'react-device-detect';

const TABS = {
    bothTab: 2,
    LoginTab: 0,
    AgendaTab: 1,
}

class Login extends Component {

    state = {
        phoneNumber: "",
        otp: "",
        showOtp: false,
        showVideo: false,
        errors: {
            phoneNumber: "",
            otp: ""
        },
        agendaData: null,
        currentTab: !isMobileOnly ? TABS.bothTab : TABS.LoginTab
    }

    componentDidMount = async () => {
        const agendaData = await EventManager.getAgenda('event-kmde59n5')
        this.setState({ agendaData })
    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
        this.captcha = React.createRef();
    }

    redirectToHome = () => {
        const { history } = this.props;
        if (history) history.push(HOME_ROUTE);
    }


    handleSubmit = (event) => {
        event.preventDefault();

        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            return;
        }

        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.phoneNumber + "@cipla.com", this.state.phoneNumber)
            .then((confirmationResult) => {
                this.redirectToHome();
            })
            .catch((error) => {
                let errors = this.state.errors;

                if (error.code === "auth/user-not-found") {
                    errors.phoneNumber = "Please enter a valid phone number.";
                } else {
                    errors.phoneNumber = error.message;
                }
                this.setState({ errors: errors });

            });
    }

    onVerifyCodeSubmit = event => {
        event.preventDefault();
        const verificationId = this.state.otp;
        window.confirmationResult
            .confirm(verificationId)
            .then((result) => {
                // User signed in successfully.
                // var user = result.user;
                // user.getIdToken().then(idToken => {
                //     console.log(idToken);
                // });
                this.redirectToHome();
            })
            .catch((error) => {
                let errors = this.state.errors;

                if (error.code === "auth/invalid-verification-code") {
                    errors.otp = "Invalid one time password.";
                } else {
                    errors.otp = error.message;
                }
                this.setState({ errors: errors });

            });

    }

    validateForm = () => {
        let errors = this.state.errors;

        errors.phoneNumber = this.state.phoneNumber.length > 0 ? '' : 'Please enter a valid phone number.';

        this.setState({ errors: errors });
    }

    isValidForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }

    setValue = (number) => {
        this.setState({ phoneNumber: number || "" });
    }

    ToggleTab = (event, currentTab) => {
        if (event) {
            event.preventDefault()
        }
        if (currentTab === TABS.AgendaTab) {
            this.setState({
                currentTab: TABS.LoginTab
            })
        } else {
            this.setState({
                currentTab: TABS.AgendaTab
            })
        }
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">

                <div ref={this.captcha}>
                    <div id={"recaptcha-container"}></div>
                </div>

                {
                    this.state.showVideo &&
                    <VideoModal link={'https://player.vimeo.com/video/184520235'} close={() => { this.setState({ showVideo: false }) }}></VideoModal>
                }
                <header class="headerBox">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="headerBox__left">
                            <a href="#" class="headerBox__logo">
                                <img src="assets/images/logo2.png" alt="" />
                            </a>
                        </div>
                        <div class="headerBox__right">
                            <a href="#" class="headerBox__logo2">
                                <img src="assets/images/cipla-logo.png" alt="" />
                            </a>
                        </div>
                    </div>
                </header>

                <div class="login2Box__left">
                    <div class="login2Box-text">
                        <div class="login2Box__label">
                            <h2 class="login2Box__label-title mg-b20">50+ Eminent Speakers</h2>
                            <p class="login2Box__label-desc">Two days of Engaging Sessions</p>
                        </div>
                        <div class="login2Box__video">
                            <a href="#" class="login2Box__video__play"><i class="icon-play" onClick={(e) => { e.preventDefault(); this.setState({ showVideo: true }) }}></i></a>
                            <img src="assets/images/video-thumb.jpg" alt="" />
                        </div>
                    </div>

                    <ul class="mobile-tabs">
                        <li class={`${this.state.currentTab === TABS.LoginTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.LoginTab)}><span>Login</span></a></li>
                        <li class={`${this.state.currentTab === TABS.AgendaTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.AgendaTab)}><span>AGENDA</span></a></li>
                    </ul>


                    {
                        this.state.agendaData && this.state.currentTab !== TABS.LoginTab &&
                        <Agenda data={this.state.agendaData} haveVideo={false} haveLikeButton={false}  ></Agenda>
                    }
                </div>


                <article className={`login2Box login2Box__small ${this.state.currentTab === TABS.AgendaTab ? 'd-none' : ''}`}>
                    <img src="assets/images/login-bg-top.png" alt="" className="login-bg-top" />

                    {
                        !this.state.showOtp &&
                        <>
                            <h1 className="login2Box__title mg-b50">Log in</h1>

                            <form className="mg-b80" onSubmit={this.handleSubmit}>
                                <div className="form-group mg-b30">
                                    <PhoneInput
                                        international
                                        defaultCountry={"IN"}
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder="Enter phone number"
                                        value={this.state.phoneNumber}
                                        onChange={this.setValue}
                                    />
                                    {this.state.errors.phoneNumber &&
                                        <span className="input-error2">{this.state.errors.phoneNumber}</span>}
                                    {this.state.errors.phoneNumber && <span className="input-error">{this.state.errors.phoneNumber}</span>}
                                </div>


                                <div className="mg-b0 d-flex justify-content-between">
                                    <button id={"sign-in"} type={"submit"} className="btn btn-secondary">Log in</button>
                                </div>
                                <a className="btn btn-link" href="/register">Not Registered? Click here</a>
                            </form>
                        </>
                    }
                    {
                        this.state.showOtp &&
                        <>
                            <h1 className="login2Box__title mg-b50">One Time Password</h1>

                            <form className="mg-b80" onSubmit={this.onVerifyCodeSubmit}>
                                <div className="form-group mg-b30">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={this.state.otp}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="OTP" />
                                    {this.state.errors.otp && <span className="input-error">{this.state.errors.otp}</span>}

                                </div>

                                <div className="mg-b0 d-flex justify-content-between">
                                    <button id={"sign-in"} type={"submit"} className="btn btn-secondary">Submit OTP</button>
                                </div>

                            </form>
                        </>
                    }

                    <img src="assets/images/login-bg-bottom.png" alt="" className="login-bg-bottom" />

                </article>

            </div>);
    }
}


export default withRouter(Login);
