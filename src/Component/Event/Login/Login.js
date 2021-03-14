import React, {Component} from 'react';
import {Link} from "react-router-dom";
import firebase, {auth} from "../../../Firebase/firebase"
import {withRouter} from 'react-router-dom';
import Agenda from "../Agenda/Agenda";
import './Login.css'
import PhoneInput from "react-phone-number-input";

class Login extends Component {

    state = {
        phoneNumber: "",
        otp: "",
        showOtp: false,
        errors: {
            phoneNumber: "",
            otp:""
        }
    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
        this.captcha = React.createRef();

    }

    redirectToHome = () => {
        const {history} = this.props;
        if (history) history.push('/home');
    }


    handleSubmit = (event) => {
        event.preventDefault();

        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            return;
        }

        if(this.appVerifier){
            this.appVerifier.clear();
            if(this.captcha && this.captcha.current)
            {
                this.captcha.current.innerHTML = `<div id="recaptcha-container"></div>`
            }
        }

        this.appVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
                'size': 'invisible'
            }
        );
        firebase
            .auth()
            .signInWithPhoneNumber(this.state.phoneNumber, this.appVerifier)
            .then((confirmationResult) => {
                this.setState({showOtp: true});
                window.confirmationResult = confirmationResult;
            })
            .catch((error) => {
                let errors = this.state.errors;

                if(error.code ===  "auth/invalid-phone-number"){
                    errors.phoneNumber =  "Please enter a valid phone number.";
                }else {
                    errors.phoneNumber =  error.message;
                }
                this.setState({ errors: errors});

            });
    }

    onVerifyCodeSubmit = event => {
        event.preventDefault();
        const verificationId = this.state.otp;
        window.confirmationResult
            .confirm(verificationId)
            .then( (result) => {
                // User signed in successfully.
                // var user = result.user;
                // user.getIdToken().then(idToken => {
                //     console.log(idToken);
                // });
                this.redirectToHome();
            })
            .catch((error) => {
               let errors = this.state.errors;

               if(error.code === "auth/invalid-verification-code"){
                   errors.otp =  "Invalid one time password.";
               }else {
                   errors.otp =  error.message;
               }
                this.setState({ errors: errors});

            });

    }

    validateForm = () => {
        let errors = this.state.errors;

        errors.phoneNumber = this.state.phoneNumber.length > 0 ? '' : 'Please enter a valid phone number.';

        this.setState({errors: errors});
    }

    isValidForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }


    setValue = (number) => {
        this.setState({phoneNumber: number || ""});
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">

                <div ref={this.captcha}>
                    <div id={"recaptcha-container"}></div>
                </div>

                <Agenda></Agenda>


                <article className="login2Box login2Box__small">
                    <img src="assets/images/login-bg-top.png" alt="" className="login-bg-top"/>

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
                                        placeholder="OTP"/>
                                    {this.state.errors.otp && <span className="input-error">{this.state.errors.otp}</span>}

                                </div>

                                <div className="mg-b0 d-flex justify-content-between">
                                    <button id={"sign-in"} type={"submit"} className="btn btn-secondary">Submit OTP</button>
                                </div>

                            </form>
                        </>
                    }

                    <img src="assets/images/login-bg-bottom.png" alt="" className="login-bg-bottom"/>

                </article>

            </div>);
    }
}


export default withRouter(Login);
