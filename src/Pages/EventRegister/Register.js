import React, { Component } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { analytics } from '../../Firebase/firebase';

import './Register.css'
import Agenda from "../../Components/Event/Agenda/Agenda";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import VideoModal from '../../Components/VideoModal/VideoModal';
import { LOGIN_ROUTE } from '../../AppConstants/Routes';
import EventManager from '../../Managers/EventManager';
import { isMobileOnly } from 'react-device-detect';


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const TABS = {
    bothTab: 2,
    Register: 0,
    AgendaTab: 1,
}
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
        showVideo: false,
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
        },
        agendaData: null,
        currentTab: !isMobileOnly ? TABS.bothTab : TABS.Register

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
    }

    redirectToLogin = () => {
        const { history } = this.props;
        if (history) history.push(LOGIN_ROUTE);
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

        this.setState({ errors: errors });
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
            profession: this.state.profession,
            speciality: this.state.speciality,
            country: this.state.country,
            state: this.state.state,
            city: this.state.city,
            pincode: this.state.pincode,
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
                        this.setState({ errors: errors });
                    }
                    if (data.message && data.message.code === "auth/invalid-phone-number") {
                        let errors = this.state.errors;
                        errors.phoneNumber = "Please enter valid phone number.";
                        this.setState({ errors: errors });
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
        this.setState({ phoneNumber: number || "" });
    }

    enterEvent = (event) => {
        event.preventDefault();
        this.handleSubmit(event);
    }

    ToggleTab = (event, currentTab) => {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            currentTab: currentTab
        })
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">
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
                        <li class={`${this.state.currentTab === TABS.Register ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.Register)}><span>Register</span></a></li>
                        <li class={`${this.state.currentTab === TABS.AgendaTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.AgendaTab)}><span>AGENDA</span></a></li>
                    </ul>
                    {
                        this.state.agendaData && this.state.currentTab !== TABS.Register &&
                        <Agenda data={this.state.agendaData} haveVideo={false} haveLikeButton={false}></Agenda>
                    }
                </div>

                <article className={`login2Box ${this.state.currentTab === TABS.AgendaTab ? 'd-none' : ''}`}>
                    <h1 className="login2Box__title mg-b40">Register Yourself</h1>

                    <a className="btn btn-link" href="/login">Already Registered? Click here</a>

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
                                international
                                defaultCountry={"IN"}
                                className="form-control "
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
                                    onChange={(val) => this.setState({ country: val })}
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
                                    onChange={(val) => this.setState({ state: val })}
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
                        <label className="custom-checkbox mg-b30">
                            <input
                                name="termsAndConditions"
                                type="checkbox"
                                checked={this.state.termsAndConditions}
                                onChange={this.handleInputChange} />
                            I accept term and condition</label>
                        {this.state.errors.termsAndConditions &&
                            <span className="input-error">{this.state.errors.termsAndConditions}</span>}

                        <div className="mg-b30 d-flex justify-content-between">
                            <button className="btn btn-secondary" type={"submit"}>Register</button>
                        </div>


                    </form>

                </article>

            </div>

        );
    }

}


export default withRouter(Register);