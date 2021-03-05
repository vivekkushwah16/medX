import React, {Component} from 'react';
import {Link} from "react-router-dom";


class Login extends Component {
    render() {
        return (
            <div className="loginBox__wrapper loginBox__wrapper--cover min-height-full"
                 style={{"backgroundImage": "url(assets/images/login-bg2.jpg)"}}>

                <header className="headerBox">
                    <img src="assets/images/logo.png" alt=""/>
                </header>

                <div className="loginBox__label">One Stop Resource for your Medical Practice</div>

                <article className="loginBox loginBox__small">
                    <h1 className="loginBox__title mg-b50">Sign in</h1>
                    <form className="mg-b80">
                        <div className="form-group mg-b30">
                            <input type="text" className="form-control" placeholder="Email or phone number"/>
                        </div>
                        <div className="form-group mg-b0">
                            <input type="password" className="form-control" placeholder="Password"/>
                        </div>
                        <p className="loginBox__link">Forgot Password? <Link to="/register">Reset Password</Link></p>
                        <div className="mg-b20">
                            <button className="btn btn-primary">Sign In</button>
                        </div>
                        <label className="custom-checkbox"><input type="checkbox"/> Remember me</label>
                    </form>

                    <p className="loginBox__link pd-t50">New to CiplaMed?  <Link to="/register">Sign up now</Link> </p>

                </article>

            </div>);
    }
}


export default Login;
