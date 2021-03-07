import React, {Component} from 'react';
import {Link} from "react-router-dom";
import firebase, {auth} from "../../Firebase/firebase"
import {withRouter} from 'react-router-dom';


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


    render() {
        return (
            <div className="loginBox__wrapper loginBox__wrapper--cover min-height-full"
                 style={{"backgroundImage": "url(assets/images/login-bg2.jpg)"}}>
                <div ref={this.captcha}>
                    <div id={"recaptcha-container"}></div>
                </div>
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
                                        name="phoneNumber"
                                        value={this.state.phoneNumber}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Email or phone number"/>
                                    {this.state.errors.phoneNumber && <span className="input-error">{this.state.errors.phoneNumber}</span>}
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
                                    {this.state.errors.otp && <span className="input-error">{this.state.errors.otp}</span>}

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


export default withRouter(Login);
