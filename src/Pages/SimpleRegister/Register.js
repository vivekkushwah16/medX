import React, { Component } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import firebase, { analytics, cloudFunction, database, firestore } from '../../Firebase/firebase';

import './Register.css'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { LOGIN_ROUTE } from '../../AppConstants/Routes';
import { CONFIRMATIONENDPOINT } from '../../AppConstants/APIEndpoints';
import AuthPageStaticSide from '../../Containers/AuthPageStaticSide/AuthPageStaticSide';
import { UserCreation_Cloufunction } from '../../AppConstants/CloudFunctionName';
import swal from 'sweetalert';
var uniqid = require('uniqid');


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const defaultErr = {
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
}

const SPECIALITY = ["Chest Physician", "Consulting Physician", "General Physician", "Cardiologist", "Paediatrics", "Others"]
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
        errors: { ...defaultErr },
    }


    componentDidMount() {
        if (window.eventNameForLoginAnalytics)
            window.eventNameForLoginAnalytics = null;
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            errors: { ...defaultErr }
        });
    }

    redirectToLogin = () => {
        const { history } = this.props;
        let newPath = LOGIN_ROUTE
        let query = new URLSearchParams(this.props.location.search).get("return")
        if (query) {
            newPath += (query ? `?return=${encodeURIComponent(query)}` : '')
        }
        console.log(newPath)
        if (history) history.push(newPath);
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

    siginIn = (_data) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(_data.phoneNumber + "@cipla.com", _data.phoneNumber)
            .then((confirmationResult) => {
                // this.redirectToHome();
                this.setState({ isLoading: false })
            })
            .catch((error) => {
                console.log(error)
                this.setState({ isLoading: false })
            });
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


        const cloudRef = cloudFunction.httpsCallable(UserCreation_Cloufunction);
        cloudRef(JSON.stringify({
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
            date: new Date().getTime()
        }))
            .then(async (res) => {
                console.log(res);
                console.log(res.data);
                if (!res.data.userId) {
                    window.alert('Please Try Again Later');
                    this.setState({ isLoading: false })
                    return
                }
                analytics.logEvent("user_registered", {
                    userId: res.data.userId,
                    event: 'ott',
                    country: this.state.country,
                    state: this.state.state,
                    city: this.state.city,
                    profession: this.state.profession,
                    speciality: this.state.speciality,
                    pincode: this.state.pincode,
                    date: new Date().getTime()
                })
                let _data = {
                    userId: res.data.userId,
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
                    date: new Date().getTime(),
                    event: 'ott',
                }
                await database.ref(`/user_registered/${res.data.userId}`).update(_data)
                const confirmationMailResponse = await axios({
                    method: 'post',
                    url: CONFIRMATIONENDPOINT,
                    data: {
                        eventName: 'CiplaMedX',
                        email: this.state.email,
                        mobileNumber: this.state.phoneNumber,
                        name: `${this.state.firstName} ${this.state.lastName ? this.state.lastName : ''}`,
                        isDoctor: this.state.profession === 'Doctor'
                    }
                })
                await firestore.collection("userMetaData").doc(res.data.userId).set({
                    registeration: 'ott'
                })
                this.siginIn(_data)
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                var code = error.code;
                var message = error.message;
                var details = error.details;
                console.log(error);
                console.log(code, message, details);
                if (code === "already-exists") {
                    this.setState((prev) => ({
                        errors: { ...prev.errors, alreadyRegistered: true }
                    }))
                    console.log(this.pagetop.current)
                    if (this.pagetop.current) {
                        this.pagetop.current.scrollIntoView();
                    }
                }
                if (code === "failed-precondition") {
                    let errors = this.state.errors;
                    errors.phoneNumber = "Please enter valid phone number.";
                    this.setState({ errors: errors });
                }
            });
        return
        console.log('/accounts', this.state)
        axios.post("/accountsTest", {
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
            date: new Date().getTime()
        })
            .then(async res => {
                console.log(res)
                console.log(res.data);
                console.log(res.data.userId);
                if (!res.data.userId) {
                    window.alert('Please Try Again Later');
                    this.setState({ isLoading: false })
                    return
                }
                analytics.logEvent("user_registered", {
                    userId: res.data.userId,
                    event: 'ott',
                    country: this.state.country,
                    state: this.state.state,
                    city: this.state.city,
                    profession: this.state.profession,
                    speciality: this.state.speciality,
                    pincode: this.state.pincode,
                    date: new Date().getTime()
                })
                let _data = {
                    userId: res.data.userId,
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
                    date: new Date().getTime(),
                    event: 'ott',
                }
                await database.ref(`/user_registered/${res.data.userId}`).update(_data)
                const confirmationMailResponse = await axios({
                    method: 'post',
                    url: CONFIRMATIONENDPOINT,
                    data: {
                        eventName: 'Cipla Impact 2021',
                        email: this.state.email,
                        mobileNumber: this.state.phoneNumber,
                        name: `${this.state.firstName} ${this.state.lastName ? this.state.lastName : ''}`,
                        isDoctor: this.state.profession === 'Doctor'
                    }
                })
                await firestore.collection("userMetaData").doc(res.data.userId).set({
                    registeration: 'ott'
                })
                // this.setState({ isLoading: false })
                this.siginIn(_data)
                // this.redirectToLogin();
            }).catch((error) => {
                console.log(error)
                if (error.response) {
                    let data = error.response.data;
                    console.log(data);
                    if (data.message && data.message.code === "auth/email-already-exists") {
                        this.setState((prev) => ({
                            errors: { ...prev.errors, alreadyRegistered: true }
                        }))
                        console.log(this.pagetop.current)
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
                    if (data.code && (data.code === 'PhoneNumberInUser' || data.code === 'EmailInUser')) {
                        this.setState((prev) => ({
                            errors: { ...prev.errors, alreadyRegistered: true }
                        }))
                        console.log(this.pagetop.current)
                        if (this.pagetop.current) {
                            this.pagetop.current.scrollIntoView();
                        }
                    }

                } else if (error.request) {
                    console.log(error.request)
                    alert(error.request);
                } else {
                    console.log(error.message)
                    alert('Error ' + error.message);
                }
                console.log(error.config);
                this.setState({ isLoading: false })
            });

    }

    setValue = (number) => {
        this.setState({
            phoneNumber: number || "",
            errors: { ...defaultErr }
        });
    }

    enterEvent = (event) => {
        event.preventDefault();
        this.handleSubmit(event);
    }

    render() {
        return (
            <div className="login2Box__wrapper min-height-full gradient-bg3">
                <AuthPageStaticSide />

                <article className={`login2Box login2Box__small `}>
                    <div ref={this.pagetop} class="login2Box__header ">
                        <h3 class="login2Box__header-title mg-r10" style={this.state.errors.alreadyRegistered ? { color: 'red' } : {}}>
                            {
                                this.state.errors.alreadyRegistered ?
                                    // <>*This Mobile Number/Email-Id is already in use.</>
                                    <>*You are already registered. Please</>

                                    :
                                    <>Have you registered already?</>
                            }
                        </h3>
                        <button class="btn btn-secondary" onClick={this.redirectToLogin}>Log in</button>
                    </div>

                    {/* <a className="btn btn-link" href="/login">Already Registered? Login</a> */}
                    <div className="login2Box__body">
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
                                        {/* <option>HCP</option> */}
                                        <option>Cipla Employee</option>
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
                                        {
                                            SPECIALITY.map(sp => (
                                                <option value={sp}>{sp}</option>
                                            ))
                                        }

                                        {/* <option value="CRITICAL CARE MEDICINE">CRITICAL CARE MEDICINE</option>
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
                                        <option value="OTHER">OTHER</option> */}
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
                            <label className="custom-checkbox mg-b30" style={{ display: 'flex' }}>
                                <input
                                    name="termsAndConditions"
                                    type="checkbox"
                                    checked={this.state.termsAndConditions}
                                    onChange={this.handleInputChange} />
                                <p style={{ maxWidth: '90%' }}>
                                    I hereby declare that I am a healthcare professional and I agree with the <a href="/assets/pdf/Disclaimer _ CiplaMed.pdf" target="_blank"><b> disclaimer and privacy policy</b></a>. I also agree to receive periodic Emails/SMS from Cipla in my primary area of interest.
                                </p>
                            </label>
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
                    </div>

                </article>

            </div>

        );
    }

}


export default withRouter(Register);
