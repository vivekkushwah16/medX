import React, {Component} from 'react';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {analytics} from '../../Firebase/firebase';

import './Register.css'

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class Register extends Component {
    state = {
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        hospitalName: "",
        designation: "",
        country: "",
        state: "",
        city: "",
        termsAndConditions: false,
        errors: {
            email: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            hospitalName: "",
            designation: "",
            country: "",
            state: "",
            city: "",
            termsAndConditions: ""
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    redirectToLogin = () => {
        const {history} = this.props;
        if (history) history.push('/login');
    }

    validateForm = () => {
        let errors = this.state.errors;

        errors.email = validEmailRegex.test(this.state.email) ? '' : 'Please enter a valid email.';
        errors.phoneNumber = this.state.phoneNumber.length > 0 ? '' : 'Please enter a valid phone number.';
        errors.firstName = this.state.firstName.length > 0 ? '' : 'Please enter first name.';
        errors.hospitalName = this.state.hospitalName.length > 0 ? '' : 'Please select a hospital name.';
        errors.designation = this.state.designation.length > 0 ? '' : 'Please select a designation.';
        errors.country = this.state.country.length > 0 ? '' : 'Please select a country.';
        errors.state = this.state.state.length > 0 ? '' : 'Please select a state.';
        errors.city = this.state.city.length > 0 ? '' : 'Please enter city name.';
        errors.termsAndConditions = this.state.termsAndConditions == true ? '' : 'Please accept terms and conditions.';

        this.setState({errors: errors});
    }

    isValidForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }


    handleSubmit = (event) => {
        event.preventDefault();

        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            return;
        }

        axios.post(`/accounts`, {
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            hospitalName: this.state.hospitalName,
            designation: this.state.designation,
            country: this.state.country,
            state: this.state.state,
            city: this.state.city,
            termsAndConditions: this.state.termsAndConditions,
        })
            .then(res => {
                analytics.logEvent("user_registered", {
                    country: this.state.country,
                    state: this.state.state,
                    city: this.state.city,
                    date: new Date()
                })
                this.redirectToLogin();
            }).catch((error) => {
            if (error.response) {
                let data = error.response.data;

                if (data.message && data.message.code === "auth/email-already-exists") {
                    let errors = this.state.errors;
                    errors.email = data.message.message;
                    this.setState({errors: errors});
                }
                if (data.message && data.message.code === "auth/invalid-phone-number") {
                    let errors = this.state.errors;
                    errors.phoneNumber = "Please enter valid phone number.";
                    this.setState({errors: errors});
                }

            } else if (error.request) {
                alert(error.request);
            } else {
                alert('Error '+ error.message);
            }
            console.log(error.config);
        });

    }

    render() {
        return (
            <div className="loginBox__wrapper min-height-full gradient-bg">

                <header className="headerBox">
                    <div className="container">
                        <a href="#" className="headerBox__logo">
                            <img src="assets/images/logo.png" alt=""/>
                        </a>
                    </div>
                </header>

                <div className="loginBox__left">
                    <div className="loginBox__label">One Stop Resource for your Medical Practice</div>
                    <div className="loginBox__video">
                        <a href="#" className="loginBox__video__play"><i className="icon-play"></i></a>
                        <img src="assets/images/video-thumb.jpg" alt=""/>
                    </div>
                </div>

                <article className="loginBox">
                    <h1 className="loginBox__title mg-b30">Create your account</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Email or phone number"
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.email &&
                            <span className="input-error2">{this.state.errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Phone number"
                                   name="phoneNumber"
                                   value={this.state.phoneNumber}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.phoneNumber &&
                            <span className="input-error2">{this.state.errors.phoneNumber}</span>}
                        </div>

                        <div className="row">
                            <div className="col-50">
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="First Name"
                                           name="firstName"
                                           value={this.state.firstName}
                                           onChange={this.handleInputChange}
                                    />
                                    {this.state.errors.firstName &&
                                    <span className="input-error2">{this.state.errors.firstName}</span>}
                                </div>
                            </div>
                            <div className="col-50">
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Last Name"
                                           name="lastName"
                                           value={this.state.lastName}
                                           onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Hospital Name"
                                   name="hospitalName"
                                   value={this.state.hospitalName}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.hospitalName &&
                            <span className="input-error2">{this.state.errors.hospitalName}</span>}
                        </div>
                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Designation"
                                   name="designation"
                                   value={this.state.designation}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.designation &&
                            <span className="input-error2">{this.state.errors.designation}</span>}
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>Your Speciality</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <CountryDropdown
                                    name="country" id="country" name="country" className="form-control"
                                    value={this.state.country}
                                    onChange={(val) => this.setState({country: val})}
                                />
                                {this.state.errors.country &&
                                <span className="input-error2">{this.state.errors.country}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <RegionDropdown
                                    name="state" className="form-control"
                                    country={this.state.country}
                                    value={this.state.state}
                                    onChange={(val) => this.setState({state: val})}
                                />
                                {this.state.errors.state &&
                                <span className="input-error2">{this.state.errors.state}</span>}
                            </div>
                        </div>
                        <div className="form-group mg-b30">
                            <input type="text"
                                   className="form-control"
                                   placeholder="City"
                                   name="city"
                                   value={this.state.city}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.city &&
                            <span className="input-error2">{this.state.errors.city}</span>}
                        </div>
                        <div className="mg-b30">
                            <button className="btn btn-primary" type={"submit"}>Sign Up</button>
                        </div>
                        <label className="custom-checkbox">
                            <input
                                name="termsAndConditions"
                                type="checkbox"
                                checked={this.state.termsAndConditions}
                                onChange={this.handleInputChange}/>
                            I accept term and condition</label>
                        {this.state.errors.termsAndConditions &&
                        <span className="input-error">{this.state.errors.termsAndConditions}</span>}
                    </form>

                </article>

            </div>

        );
    }

}


export default withRouter(Register);
