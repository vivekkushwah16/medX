import React, { Component } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { analytics, database } from '../../Firebase/firebase';

import './Register.css'
import Agenda from "../../Components/Event/Agenda/Agenda";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import VideoModal from '../../Components/VideoModal/VideoModal';
import { LOGIN_ROUTE } from '../../AppConstants/Routes';
import EventManager from '../../Managers/EventManager';
import { isMobileOnly } from 'react-device-detect';
var uniqid = require('uniqid');


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const TABS = {
    bothTab: 2,
    Register: 0,
    AgendaTab: 1,
}
class Register extends Component {
    pagetop = React.createRef();

    state = {
        isLoading: false,
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
            termsAndConditions: "",
            alreadyRegistered: false,
        },
        agendaData: null,
        currentTab: !isMobileOnly ? TABS.bothTab : TABS.Register

    }

    componentDidMount = async () => {
        const agendaData = await EventManager.getAgenda('event-kmde59n5')
        this.setState({ agendaData })
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize = () => {
        if (window.innerWidth > 991) {
            this.setState({
                currentTab: TABS.bothTab
            })
        } else {
            this.setState((prevState) => ({
                currentTab: prevState.currentTab === TABS.Register ? TABS.Register : TABS.AgendaTab
            }))
        }
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
        this.setState({ isLoading: true })

        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state.errors);
            this.setState({ isLoading: false })
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
            .then(async res => {
                analytics.logEvent("user_registered", {
                    country: this.state.country,
                    state: this.state.state,
                    city: this.state.city,
                    profession: this.state.profession,
                    speciality: this.state.speciality,
                    date: new Date()
                })
                let _data = {
                    email: this.state.email,
                    phoneNumber: this.state.phoneNumber,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    profession: this.state.profession,
                    speciality: this.state.speciality,
                    country: this.state.country,
                    state: this.state.state,
                    city: this.state.city,
                    date: new Date()
                }
                await database.ref(`/user_registered/${uniqid('user_registered_')}`).update(_data)
                this.setState({ isLoading: false })
                this.redirectToLogin();
            }).catch((error) => {
                if (error.response) {
                    let data = error.response.data;
                    if (data.message && data.message.code === "auth/email-already-exists") {
                        this.setState((prev) => ({
                            errors: { ...prev.errors, alreadyRegistered: true }
                        }))
                        if (this.pagetop.current) {
                            this.pagetop.current.scrollIntoView();
                        }
                        // let errors = this.state.errors;
                        // errors.email = data.message.message;
                        // this.setState({ errors: errors });
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
                this.setState({ isLoading: false })
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
                    <VideoModal link={'https://player.vimeo.com/video/528854507'} close={() => { this.setState({ showVideo: false }) }}></VideoModal>
                }
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
                </header>
                {/* 2 days of cutting edge academic feast with 7 international and 14 national experts in Respiratory Medicine  */}
                <div className="login2Box__left">
                    <div className="login2Box-text">
                        <div className="login2Box__label">
                            <h2 className="login2Box__label-title mg-b20" style={{ textTransform: 'uppercase' }}>2 Days of cutting edge academic feast  </h2>
                            <p className="login2Box__label-desc">with 7 international and 14 national experts in Respiratory Medicine</p>
                        </div>
                        <div className="login2Box__video">
                            {/* <a href="#" className="login2Box__video__play"><i className="icon-play" onClick={(e) => { e.preventDefault(); this.setState({ showVideo: true }) }}></i></a> */}
                            <img src="assets/images/video-thumb.jpg" alt="" />
                        </div>
                    </div>
                    <ul className="mobile-tabs">
                        <li className={`${this.state.currentTab === TABS.Register ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.Register)}><span>Register</span></a></li>
                        <li className={`${this.state.currentTab === TABS.AgendaTab ? 'active' : ''}`}><a href="#" onClick={(e) => this.ToggleTab(e, TABS.AgendaTab)}><span>AGENDA</span></a></li>
                    </ul>
                    {
                        this.state.agendaData && this.state.currentTab !== TABS.Register &&
                        <Agenda data={this.state.agendaData} haveVideo={false} haveLikeButton={false}></Agenda>
                    }
                </div>

                <article ref={this.pagetop} className={`login2Box ${this.state.currentTab === TABS.AgendaTab ? 'd-none' : ''}`}>
                    <h1 className="login2Box__title mg-b40">Register Yourself</h1>
                    {
                        this.state.errors.alreadyRegistered &&
                        <>
                            <span style={{ color: 'red' }}>*This Mobile Number/Email-Id is already in use.</span><br></br>
                        </>
                    }
                    <a className="btn btn-link" href="/login">Already Registered? Login</a>

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
                                countryCallingCodeEditable={false}
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
                                    {/* <option>Select Profession</option> */}
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
                                    <option value="CRITICAL CARE MEDICINE">CRITICAL CARE MEDICINE</option>
                                    <option value="INFECTIOUS DISEASES">INFECTIOUS DISEASES</option>
                                    <option value="INFECTIOUS DISEASES">NEPHROLOGY</option>
                                    <option value="GASTROENTEROLOGY &mp; HEPATOLOGY">GASTROENTEROLOGY &amp; HEPATOLOGY</option>
                                    <option value="HIV / AIDS">HIV / AIDS</option>
                                    <option value="ONCOLOGY">ONCOLOGY</option>
                                    <option value="ONCOLOGY">PULMONOLOGIST</option>
                                    <option value="GENERAL MEDICINE">GENERAL MEDICINE</option>
                                    <option value="CARDIOLOGY">CARDIOLOGY</option>
                                    <option value="DERMATOLOGY">DERMATOLOGY</option>
                                    <option value="DENTISTRY">DENTISTRY</option>
                                    <option value="DIABETOLOGY">DIABETOLOGY</option>
                                    <option value="ENT">ENT</option>
                                    <option value="MUSCULOSKELETAL DISEASES">MUSCULOSKELETAL DISEASES</option>
                                    <option value="NEUROPSYCHIATRY">NEUROPSYCHIATRY</option>
                                    <option value="OBSTETRICS &amp; GYNAECOLOGY">OBSTETRICS &amp; GYNAECOLOGY</option>
                                    <option value="OPHTHALMOLOGY">OPHTHALMOLOGY</option>
                                    <option value="PEDIATRICS">PEDIATRICS</option>
                                    <option value="RESPIRATORY MEDICINE">RESPIRATORY MEDICINE</option>
                                    <option value="SURGERY">SURGERY</option>
                                    <option value="UROLOGY">UROLOGY</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                                {this.state.errors.speciality &&
                                    <span className="input-error2">{this.state.errors.speciality}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <CountryDropdown
                                    defaultOptionLabel="Select country"
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
                                    defaultOptionLabel="Select State"
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
                                maxLength={6}
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
                            I accept <a href="http://www.africau.edu/images/default/sample.pdf" target="_blank">term and condition</a> </label>
                        {this.state.errors.termsAndConditions &&
                            <span className="input-error">{this.state.errors.termsAndConditions}</span>}

                        <div className="mg-b30 d-flex justify-content-between">
                            <button className="btn btn-secondary" id="RegisterBtn" type={"submit"} disabled={this.state.isLoading ? true : false}>
                                {this.state.isLoading ? (
                                    <>
                                        <img src="/assets/images/loader.gif" alt="loading" />
                                    </>
                                ) : 'Register'}
                            </button>
                        </div>


                    </form>

                </article>

            </div>

        );
    }

}


export default withRouter(Register);
