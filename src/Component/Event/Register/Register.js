import React, {Component} from 'react';
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {analytics} from '../../../Firebase/firebase';

import './Register.css'
import Agenda from "../Agenda/Agenda";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class Register extends Component {
    state = {
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        // hospitalName: "",
        profession: "Doctor",
        speciality: "",
        country: "India",
        state: "",
        city: "",
        pincode: "",
        termsAndConditions: false,
        errors: {
            email: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            // hospitalName: "",
            profession: "",
            speciality: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
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
        // errors.hospitalName = this.state.hospitalName.length > 0 ? '' : 'Please select a hospital name.';
        errors.profession = this.state.profession.length > 0 ? '' : 'Please select your profession.';
        errors.speciality = this.state.speciality.length > 0 ? '' : 'Please select your speciality.';
        errors.country = this.state.country.length > 0 ? '' : 'Please select yout country.';
        errors.state = this.state.state.length > 0 ? '' : 'Please select yout state.';
        errors.city = this.state.city.length > 0 ? '' : 'Please enter your city name.';
        errors.pincode = this.state.pincode.length > 0 ? '' : 'Please enter your pin code.';
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
            // hospitalName: this.state.hospitalName,
            profession: this.state.profession,
            speciality: this.state.speciality,
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
                alert('Error ' + error.message);
            }
            console.log(error.config);
        });

    }

    setValue = (number) => {
       this.setState({phoneNumber: number || ""});
    }

    enterEvent = (event) => {
        event.preventDefault();
        this.handleSubmit(event);
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">

                <Agenda></Agenda>

                <article className="login2Box">
                    <h1 className="login2Box__title mg-b40">Register Yourself</h1>


                    <form onSubmit={this.handleSubmit}>

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
                                   placeholder="Email"
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.email &&
                            <span className="input-error2">{this.state.errors.email}</span>}
                        </div>


                        <div className="form-group">
                            <PhoneInput
                                defaultCountry={"IN"}
                                className="form-control"
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={this.state.phoneNumber}
                                onChange={this.setValue}
                            />
                            {this.state.errors.phoneNumber &&
                            <span className="input-error2">{this.state.errors.phoneNumber}</span>}
                        </div>

                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control"
                                        name="profession"
                                        value={this.state.profession}
                                        onChange={this.handleInputChange}>
                                    <option>Doctor</option>
                                    <option>Paramedics</option>
                                    <option>HCP</option>
                                </select>
                                {this.state.errors.profession &&
                                <span className="input-error2">{this.state.errors.profession}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control"
                                        name="speciality"
                                        value={this.state.speciality}
                                        onChange={this.handleInputChange}>
                                    <option>Your Speciality</option>
                                </select>
                                {this.state.errors.speciality &&
                                <span className="input-error2">{this.state.errors.speciality}</span>}
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
                        <div className="form-group">
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
                        <div className="form-group mg-b30">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Pincode"
                                   name="pincode"
                                   value={this.state.pincode}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.pincode &&
                            <span className="input-error2">{this.state.errors.pincode}</span>}
                        </div>

                        <div className="mg-b30 d-flex justify-content-between">
                            <button className="btn btn-secondary" onClick={this.enterEvent}>Enter Event</button>
                            <button className="btn btn-secondary--link" type={"submit"}>Sign Up</button>
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
