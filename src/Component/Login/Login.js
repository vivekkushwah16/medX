import React, {Component} from 'react';
import {Link} from "react-router-dom";
import firebase, {auth} from "../../Firebase/firebase"


class Login extends Component {

    state = {
        email: "",
        showOtp: false,
        errors: {
            email: ""
        }
    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }


    handleSubmit = (event) => {
        event.preventDefault();

        // this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            return;
        }

        window.appVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible"
            }
        );
        const appVerifier = window.appVerifier;
        firebase
            .auth()
            .signInWithPhoneNumber(this.state.email, appVerifier)
            .then((confirmationResult) => {
                this.setState({showOtp: true});
                window.confirmationResult = confirmationResult;
            })
            .catch((error) => {
                console.log("Error:" + error.code);
            });
    }

    onVerifyCodeSubmit = event => {
        event.preventDefault();
        const verificationId = this.state.otp;
        window.confirmationResult
            .confirm(verificationId)
            .then( (result) => {
                // User signed in successfully.
                var user = result.user;
                user.getIdToken().then(idToken => {
                    console.log(idToken);
                });
            })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                console.error("Error while checking the verification code", error);
                window.alert(
                    "Error while checking the verification code:\n\n" +
                    error.code +
                    "\n\n" +
                    error.message
                );
            });

    }

    validateForm = () => {
        let errors = this.state.errors;

        errors.email = this.state.email.length > 0 ? '' : 'Please enter a valid phone number or email.';

        this.setState({errors: errors});
    }

    isValidForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }


    render() {
        return (
            <div className="loginBox__wrapper loginBox__wrapper--cover min-height-full"
                 style={{"backgroundImage": "url(assets/images/login-bg2.jpg)"}}>
                <div id={"recaptcha-container"}></div>
                <header className="headerBox">
                    <img src="assets/images/logo.png" alt=""/>
                </header>

                <div className="loginBox__label">One Stop Resource for your Medical Practice</div>

                <article className="loginBox loginBox__small">
                    {
                        !this.state.showOtp &&
                        <>
                            <h1 className="loginBox__title mg-b50">Sign in</h1>

                            <form className="mg-b80" onSubmit={this.handleSubmit}>
                                <div className="form-group mg-b30">
                                    <input
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Email or phone number"/>
                                </div>
                                <div className="mg-b20">
                                    <button id={"sign-in"} type={"submit"} className="btn btn-primary">Sign In</button>
                                </div>
                            </form>
                        </>
                    }
                    {
                        this.state.showOtp &&
                        <>
                            <h1 className="loginBox__title mg-b50">One Time Pasword</h1>

                            <form className="mg-b80" onSubmit={this.onVerifyCodeSubmit}>
                                <div className="form-group mg-b30">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={this.state.otp}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="OTP"/>
                                </div>
                                <div className="mg-b20">
                                    <button id={"sign-in"} type={"submit"} className="btn btn-primary">Submit OTP</button>
                                </div>
                            </form>
                        </>
                    }

                    <p className="loginBox__link pd-t50">New to CiplaMed? <Link to="/register">Sign up now</Link></p>

                </article>

            </div>);
    }
}


export default Login;
