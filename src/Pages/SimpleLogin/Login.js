import React, { Component } from 'react';
import firebase from "../../Firebase/firebase"
import { withRouter } from 'react-router-dom';
// import Agenda from "../../Components/Event/Agenda/Agenda";
import './Login.css'
import PhoneInput from "react-phone-number-input";
// import VideoModal from '../../Components/VideoModal/VideoModal';
import { HOME_ROUTE, REGISTER_ROUTE } from '../../AppConstants/Routes';
import EventManager from '../../Managers/EventManager';
// import AgendaNavBar from '../../Components/Event/AgendaNavBar/AgendaNavBar';
import { MonthName } from '../../AppConstants/Months';
import 'react-phone-number-input/style.css'
import AuthPageStaticSide from '../../Containers/AuthPageStaticSide/AuthPageStaticSide';

const defaultErr = {
    phoneNumber: "",
    otp: ""
}
class Login extends Component {

    state = {
        isLoading: false,
        phoneNumber: null,
        otp: "",
        showOtp: false,
        showVideo: false,
        errors: {
            ...defaultErr
        },
    }
    firstTime = true;

    componentDidMount() {
        if (window.eventNameForLoginAnalytics)
            window.eventNameForLoginAnalytics = null;
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
        this.setState({ isLoading: true })
        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            this.setState({ isLoading: false })
            return;
        }
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.phoneNumber + "@cipla.com", this.state.phoneNumber)
            .then((confirmationResult) => {
                // this.redirectToHome();
                this.setState({ isLoading: false })
            })
            .catch((error) => {
                let errors = this.state.errors;

                if (error.code === "auth/user-not-found") {
                    errors.phoneNumber = "Please enter a valid phone number.";
                } else {
                    errors.phoneNumber = error.message;
                }
                this.setState({ errors: errors });
                this.setState({ isLoading: false })

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
        // this.setState({ phoneNumber: number || "" });
        this.setState({
            phoneNumber: number || "",
            errors: { ...defaultErr }
        });
    }

    redirectToRegister = () => {
        const { history } = this.props;
        let newPath = REGISTER_ROUTE
        let query = new URLSearchParams(this.props.location.search).get("return")
        if (query) {
            newPath += (query ? `?return=${encodeURIComponent(query)}` : '')
        }
        console.log(newPath)
        if (history) history.push(newPath);
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">

                <div ref={this.captcha}>
                    <div id={"recaptcha-container"}></div>
                </div>
                <AuthPageStaticSide />

                <article className={`login2Box login2Box__small`}>

                    {
                        !this.state.showOtp &&
                        <>
                            <div class="login2Box__header ">
                                <h3 class="login2Box__header-title mg-r10">
                                    Not Registered for the Event?
                                        </h3>
                                <button class="btn btn-secondary" onClick={this.redirectToRegister}>Register</button>
                            </div>
                            <div class="login2Box__body pd-t80">
                                <h1 className="login2Box__title mg-b25">Log in</h1>

                                <form onSubmit={this.handleSubmit}>

                                    <div className="form-group mg-b30">
                                        <p className=" mg-b10" style={{ color: "#015189" }}>Please enter your Registered Mobile Number</p>
                                        <PhoneInput
                                            international
                                            countryCallingCodeEditable={false}
                                            defaultCountry={"IN"}
                                            className="form-control"
                                            name="phoneNumber"
                                            placeholder="Enter your registered number."
                                            value={this.state.phoneNumber}
                                            onChange={(number) =>
                                                this.setValue(number)
                                            }
                                        />
                                        {this.state.errors.phoneNumber &&
                                            <span className="input-error2">{this.state.errors.phoneNumber}</span>}
                                        {this.state.errors.phoneNumber && <span className="input-error">{this.state.errors.phoneNumber}</span>}
                                    </div>


                                    <div className="mg-b0 d-flex justify-content-between">
                                        <button id={"sign-in"} type={"submit"} className="btn btn-secondary" disabled={this.state.isLoading ? true : false} >
                                            {this.state.isLoading ? (
                                                <>
                                                    <img src="/assets/images/loader.gif" alt="loading" />
                                                </>
                                            ) : ' Log in'}
                                        </button>
                                    </div>
                                    {/* <a className="btn btn-link" href="/register/impact">Not Registered? Click here</a> */}
                                </form>
                            </div>
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
                    <img src="assets/images/login-bg-top.png" alt="" className="login-bg-top" />

                    {/* <img src="assets/images/login-bg-bottom.png" alt="" className="login-bg-bottom" /> */}

                </article>

            </div>);
    }
}


export default withRouter(Login);