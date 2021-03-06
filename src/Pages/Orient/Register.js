import React, { Component } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";
import { withRouter } from "react-router-dom";
import firebase, {
  analytics,
  cloudFunction,
  database,
  firestore,
} from "../../Firebase/firebase";

import "./Register.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { LOGIN_ROUTE } from "../../AppConstants/Routes";
import EventManager from "../../Managers/EventManager";
import { isMobileOnly } from "react-device-detect";
import { MonthName } from "../../AppConstants/Months";
import SideAgendaNoUser from "../../Containers/SideAgendaNoUser/SideAgendaNoUser";
import {
  CONFIRMATIONENDPOINT,
  EVENT_CONFIRMATION_ENDPOINT,
} from "../../AppConstants/APIEndpoints";
import EventPageStatic from "../../Containers/OrientPageStatic/EventPageStatic";
import { UserCreation_Cloufunction } from "../../AppConstants/CloudFunctionName";
var uniqid = require("uniqid");

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const TABS = {
  bothTab: 2,
  Register: 0,
  AgendaTab: 1,
};

const TABSName = {
  [TABS.Register]: "Register",
  [TABS.AgendaTab]: "AGENDA",
};

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
};

const SPECIALITY = [
  "Chest Physician",
  "Consulting Physician",
  "General Physician",
  // "Cardiologist",
  "ENT",
  "Paediatrics",
  "Others",
];
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
    agendaData: null,
    agendaDates: [],
    currentDate: null,
    currentTab: !isMobileOnly ? TABS.bothTab : TABS.Register,
  };
  firstTime = true;
  componentDidMount = async () => {
    // const agendaData = await EventManager.getAgenda("event-kmde59n5");
    // this.processAgendaData(agendaData);
    // this.setState({ agendaData })
    window.addEventListener("resize", this.handleResize);
  };

  processAgendaData = (data) => {
    let newData = {};
    data.sort(function (a, b) {
      return a.startTime - b.startTime;
    });
    data.forEach((timeline) => {
      let date = `${
        MonthName[new Date(timeline.startTime).getMonth()]
      } ${new Date(timeline.startTime).getDate()}`;
      if (newData.hasOwnProperty(date)) {
        newData = {
          ...newData,
          [date]: [...newData[date], timeline],
        };
      } else {
        newData = {
          ...newData,
          [date]: [timeline],
        };
      }
    });
    let dates = Object.keys(newData);
    if (this.firstTime) {
      this.setState({
        currentDate: dates[0],
      });
      this.firstTime = false;
    }
    this.setState({
      agendaDates: dates,
      agendaData: newData,
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleResize);
  };

  handleResize = () => {
    if (window.innerWidth > 991) {
      this.setState({
        currentTab: TABS.bothTab,
      });
    } else {
      this.setState((prevState) => ({
        currentTab:
          prevState.currentTab === TABS.Register
            ? TABS.Register
            : TABS.AgendaTab,
      }));
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      errors: { ...defaultErr },
    });
  };

  redirectToLogin = () => {
    const { history } = this.props;
    if (history) history.push(this.props.loginUrl);
  };

  validateForm = () => {
    let errors = this.state.errors;

    errors.email = validEmailRegex.test(this.state.email)
      ? ""
      : "Please enter a valid email.";
    errors.phoneNumber =
      this.state.phoneNumber.length > 0
        ? ""
        : "Please enter a valid phone number.";
    errors.firstName =
      this.state.firstName.length > 0 ? "" : "Please enter first name.";
    // errors.hospitalName = this.state.hospitalName.length > 0 ? '' : 'Please select a hospital name.';
    errors.profession =
      this.state.profession.length > 0 ? "" : "Please select your profession.";
    errors.speciality =
      this.state.speciality.length > 0 ? "" : "Please select your speciality.";
    errors.country =
      this.state.country.length > 0 ? "" : "Please select yout country.";
    errors.state =
      this.state.state.length > 0 ? "" : "Please select yout state.";
    errors.city =
      this.state.city.length > 0 ? "" : "Please enter your city name.";
    errors.pincode =
      this.state.pincode.length > 0 ? "" : "Please enter your pin code.";
    errors.termsAndConditions =
      this.state.termsAndConditions == true
        ? ""
        : "Please accept terms and conditions.";

    this.setState({ errors: errors });
  };

  isValidForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  siginIn = (_data) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        _data.phoneNumber + "@cipla.com",
        _data.phoneNumber
      )
      .then((confirmationResult) => {
        // this.redirectToHome();
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    this.validateForm();

    if (!this.isValidForm(this.state.errors)) {
      console.log(this.state.errors);
      this.setState({ isLoading: false });
      return;
    }

    const cloudRef = cloudFunction.httpsCallable(UserCreation_Cloufunction);
    cloudRef(
      JSON.stringify({
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
        date: new Date().getTime(),
      })
    )
      .then(async (res) => {
        console.log(res);
        console.log(res.data);
        if (!res.data.userId) {
          window.alert("Please Try Again Later");
          this.setState({ isLoading: false });
          return;
        }
        analytics.logEvent("user_registered", {
          userId: res.data.userId,
          event: this.props.event,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          profession: this.state.profession,
          speciality: this.state.speciality,
          pincode: this.state.pincode,
          date: new Date().getTime(),
        });
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
          event: this.props.event,
        };
        await database.ref(`/user_registered/${res.data.userId}`).update(_data);
        const confirmationMailResponse = await axios({
          method: "post",
          url: EVENT_CONFIRMATION_ENDPOINT,
          data: {
            title: this.props.eventTitle,
            email: this.state.email,
            mobileNumber: this.state.phoneNumber,
            name: `${this.state.firstName} ${
              this.state.lastName ? this.state.lastName : ""
            }`,
            isDoctor: this.state.profession === "Doctor",
            event: this.props.event,
            date: `26 May 2021`,
          },
        });
        await firestore
          .collection("userMetaData")
          .doc(res.data.userId)
          .set({
            registeration: this.props.event,
            events: [this.props.event],
          });
        this.siginIn(_data);
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(error);
        console.log(code, message, details);
        console.log("xxxxxxxxxxxxxxxx");
        if (code === "already-exists") {
          this.setState((prev) => ({
            errors: { ...prev.errors, alreadyRegistered: true },
          }));
          console.log(this.pagetop.current);
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

    return;
    axios
      .post(`/accounts`, {
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
        date: new Date().getTime(),
      })
      .then(async (res) => {
        console.log(res);
        console.log(res.data.userId);

        analytics.logEvent("user_registered", {
          eventId: this.props.event,
          userId: res.data.userId,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          profession: this.state.profession,
          speciality: this.state.speciality,
          pincode: this.state.pincode,
          date: new Date().getTime(),
        });

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
          eventId: this.props.event,
        };
        await database
          .ref(`/user_registered/${uniqid("user_registered_")}`)
          .update(_data);

        const confirmationMailResponse = await axios({
          method: "post",
          url: EVENT_CONFIRMATION_ENDPOINT,
          data: {
            eventName: "Cipla Orient '21",
            email: this.state.email,
            mobileNumber: this.state.phoneNumber,
            name: `${this.state.firstName} ${
              this.state.lastName ? this.state.lastName : ""
            }`,
            isDoctor: this.state.profession === "Doctor",
          },
        });
        await firestore
          .collection("userMetaData")
          .doc(res.data.userId)
          .set({
            registeration: this.props.event,
            events: [this.props.event],
          });

        // this.setState({ isLoading: false })
        this.siginIn(_data);
        // this.redirectToLogin();
      })
      .catch((error) => {
        if (error.response) {
          let data = error.response.data;
          if (
            data.message &&
            data.message.code === "auth/email-already-exists"
          ) {
            this.setState((prev) => ({
              errors: { ...prev.errors, alreadyRegistered: true },
            }));
            console.log(this.pagetop.current);
            if (this.pagetop.current) {
              this.pagetop.current.scrollIntoView();
            }
            // let errors = this.state.errors;
            // errors.email = data.message.message;
            // this.setState({ errors: errors });
          }
          if (
            data.message &&
            data.message.code === "auth/invalid-phone-number"
          ) {
            let errors = this.state.errors;
            errors.phoneNumber = "Please enter valid phone number.";
            this.setState({ errors: errors });
          }
        } else if (error.request) {
          alert(error.request);
        } else {
          alert("Error " + error.message);
        }
        console.log(error.config);
        this.setState({ isLoading: false });
      });
  };

  setValue = (number) => {
    this.setState({
      phoneNumber: number || "",
      errors: { ...defaultErr },
    });
  };

  enterEvent = (event) => {
    event.preventDefault();
    this.handleSubmit(event);
  };

  ToggleTab = (event, currentTab) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      currentTab: currentTab,
    });
  };

  handleDateChange = (date, event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      currentDate: date,
    });
  };
  render() {
    return (
      <div className="login2Box__wrapper min-height-full gradient-bg3 event">
        {/* <SideAgendaNoUser
          agendaData={this.state.agendaData}
          agendaDates={this.state.agendaDates}
          currentDate={this.state.currentDate}
          handleDateChange={this.handleDateChange}
          tabs={TABS}
          currentTab={this.state.currentTab}
          tabsName={TABSName}
          ToggleTab={this.ToggleTab}
        /> */}
        <EventPageStatic />
        <article
          className={`login2Box login2Box__small ${
            this.state.currentTab === TABS.AgendaTab ? "" : ""
          }`}
        >
          <div ref={this.pagetop} class="login2Box__header ">
            <h3
              class="login2Box__header-title mg-r10"
              style={
                this.state.errors.alreadyRegistered ? { color: "red" } : {}
              }
            >
              {this.state.errors.alreadyRegistered ? (
                // <>*This Mobile Number/Email-Id is already in use.</>
                <>*You are already registered. Please</>
              ) : (
                <>Have you registered already?</>
              )}
            </h3>
            <button class="btn btn-secondary" onClick={this.redirectToLogin}>
              Log in
            </button>
          </div>

          {/* <a className="btn btn-link" href="/login">Already Registered? Login</a> */}
          <div className="login2Box__body">
            <h1 className="login2Box__title mg-b40">Register Yourself</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-50">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.handleInputChange}
                    />
                    {this.state.errors.firstName && (
                      <span className="input-error2">
                        {this.state.errors.firstName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-50">
                  <div className="form-group">
                    <input
                      type="text"
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
                {this.state.errors.email && (
                  <span className="input-error2">
                    {this.state.errors.email}
                  </span>
                )}
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
                {this.state.errors.phoneNumber && (
                  <span className="input-error2">
                    {this.state.errors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="form-group">
                <div className="custom-select">
                  <select
                    className="form-control"
                    name="profession"
                    value={this.state.profession}
                    onChange={this.handleInputChange}
                  >
                    {/* <option>Select Profession</option> */}
                    <option>Doctor</option>
                    <option>Paramedics</option>
                    {/* <option>HCP</option> */}
                    <option>Cipla Employee</option>
                  </select>
                  {this.state.errors.profession && (
                    <span className="input-error2">
                      {this.state.errors.profession}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="custom-select">
                  <select
                    className="form-control"
                    name="speciality"
                    value={this.state.speciality}
                    onChange={this.handleInputChange}
                  >
                    <option>Your Speciality</option>
                    {SPECIALITY.map((sp) => (
                      <option value={sp}>{sp}</option>
                    ))}

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
                  {this.state.errors.speciality && (
                    <span className="input-error2">
                      {this.state.errors.speciality}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="custom-select">
                  <CountryDropdown
                    defaultOptionLabel="Select country"
                    name="country"
                    id="country"
                    name="country"
                    className="form-control"
                    value={this.state.country}
                    onChange={(val) => this.setState({ country: val })}
                  />
                  {this.state.errors.country && (
                    <span className="input-error2">
                      {this.state.errors.country}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="custom-select">
                  <RegionDropdown
                    defaultOptionLabel="Select State"
                    name="state"
                    className="form-control"
                    country={this.state.country}
                    value={this.state.state}
                    onChange={(val) => this.setState({ state: val })}
                  />
                  {this.state.errors.state && (
                    <span className="input-error2">
                      {this.state.errors.state}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  name="city"
                  value={this.state.city}
                  onChange={this.handleInputChange}
                />
                {this.state.errors.city && (
                  <span className="input-error2">{this.state.errors.city}</span>
                )}
              </div>
              <div className="form-group mg-b30">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pincode"
                  name="pincode"
                  value={this.state.pincode}
                  onChange={this.handleInputChange}
                  maxLength={6}
                />
                {this.state.errors.pincode && (
                  <span className="input-error2">
                    {this.state.errors.pincode}
                  </span>
                )}
              </div>
              <label
                className="custom-checkbox mg-b30"
                style={{ display: "flex" }}
              >
                <input
                  name="termsAndConditions"
                  type="checkbox"
                  checked={this.state.termsAndConditions}
                  onChange={this.handleInputChange}
                />
                <p style={{ maxWidth: "90%" }}>
                  I hereby declare that I am a healthcare professional and I
                  agree with the{" "}
                  <a
                    href="/assets/pdf/Disclaimer _ CiplaMed.pdf"
                    target="_blank"
                  >
                    <b> disclaimer and privacy policy</b>
                  </a>
                  . I also agree to receive periodic Emails/SMS from Cipla in my
                  primary area of interest.
                </p>
              </label>
              {this.state.errors.termsAndConditions && (
                <span className="input-error">
                  {this.state.errors.termsAndConditions}
                </span>
              )}

              <div className="mg-b30 d-flex justify-content-between">
                <button
                  className="btn btn-secondary"
                  id="RegisterBtn"
                  type={"submit"}
                  disabled={this.state.isLoading ? true : false}
                >
                  {this.state.isLoading ? (
                    <>
                      <img src="/assets/images/loader.gif" alt="loading" />
                    </>
                  ) : (
                    "Register"
                  )}
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
