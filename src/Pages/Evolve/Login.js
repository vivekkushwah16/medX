import React, { Component } from "react";
import firebase from "../../Firebase/firebase";
import { withRouter } from "react-router-dom";
// import Agenda from "../../Components/Event/Agenda/Agenda";
import "./Login.css";
import PhoneInput from "react-phone-number-input";
// import VideoModal from '../../Components/VideoModal/VideoModal';
import { HOME_ROUTE, REGISTER_ROUTE } from "../../AppConstants/Routes";
import EventManager from "../../Managers/EventManager";
import { isMobileOnly } from "react-device-detect";
// import AgendaNavBar from '../../Components/Event/AgendaNavBar/AgendaNavBar';
import { MonthName } from "../../AppConstants/Months";
import SideAgendaNoUser from "../../Containers/SideAgendaNoUser/SideAgendaNoUser";
import "react-phone-number-input/style.css";
import EventPageStatic from "../../Containers/AuthPageStaticSide/EventPageStatic";
const TABS = {
  bothTab: 2,
  LoginTab: 0,
  AgendaTab: 1,
};

const TABSName = {
  [TABS.LoginTab]: "Login",
  [TABS.AgendaTab]: "AGENDA",
};

const defaultErr = {
  phoneNumber: "",
  otp: "",
};
class Login extends Component {
  state = {
    isLoading: false,
    phoneNumber: null,
    otp: "",
    showOtp: false,
    showVideo: false,
    errors: {
      ...defaultErr,
    },
    agendaData: null,
    agendaDates: [],
    currentDate: null,
    currentTab: !isMobileOnly ? TABS.bothTab : TABS.LoginTab,
  };
  firstTime = true;

  componentDidMount = async () => {
    // const agendaData = await EventManager.getAgenda("event-kmde59n5");
    // this.processAgendaData(agendaData);
    // this.setState({ agendaData })
    this.handleResize();
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
          prevState.currentTab === TABS.LoginTab
            ? TABS.LoginTab
            : TABS.AgendaTab,
      }));
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
    this.captcha = React.createRef();
  };

  redirectToHome = () => {
    const { history } = this.props;
    if (history) history.push("/evolve");
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
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.phoneNumber + "@cipla.com",
        this.state.phoneNumber
      )
      .then((confirmationResult) => {
        this.redirectToHome();
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        let errors = this.state.errors;

        if (error.code === "auth/user-not-found") {
          errors.phoneNumber = "Please enter a valid phone number.";
        } else {
          errors.phoneNumber = error.message;
        }
        this.setState({ errors: errors });
        this.setState({ isLoading: false });
      });
  };

  onVerifyCodeSubmit = (event) => {
    event.preventDefault();
    const verificationId = this.state.otp;
    window.confirmationResult
      .confirm(verificationId)
      .then((result) => {
        // User signed in successfully.
        // var user = result.user;
        // user.getIdToken().then(idToken => {
        //     console.log(idToken);
        // });
        this.redirectToHome();
      })
      .catch((error) => {
        let errors = this.state.errors;

        if (error.code === "auth/invalid-verification-code") {
          errors.otp = "Invalid one time password.";
        } else {
          errors.otp = error.message;
        }
        this.setState({ errors: errors });
      });
  };

  validateForm = () => {
    let errors = this.state.errors;

    errors.phoneNumber =
      this.state.phoneNumber.length > 0
        ? ""
        : "Please enter a valid phone number.";

    this.setState({ errors: errors });
  };

  isValidForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  setValue = (number) => {
    // this.setState({ phoneNumber: number || "" });
    this.setState({
      phoneNumber: number || "",
      errors: { ...defaultErr },
    });
  };

  ToggleTab = (event, currentTab) => {
    if (event) {
      event.preventDefault();
    }
    if (currentTab === TABS.LoginTab) {
      this.setState({
        currentTab: TABS.LoginTab,
      });
    } else {
      this.setState({
        currentTab: TABS.AgendaTab,
      });
    }
  };

  handleDateChange = (date, event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      currentDate: date,
    });
  };

  redirectToRegister = () => {
    const { history } = this.props;
    if (history) history.push("/evolve/register");
  };

  render() {
    return (
      <div className="login2Box__wrapper min-height-full gradient-bg3">
        <div ref={this.captcha}>
          <div id={"recaptcha-container"}></div>
        </div>
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
          {!this.state.showOtp && (
            <>
              <div class="login2Box__header ">
                <h3 class="login2Box__header-title mg-r10">
                  Not Registered for the Event?
                </h3>
                <button
                  class="btn btn-secondary"
                  onClick={this.redirectToRegister}
                >
                  Register
                </button>
              </div>
              <div class="login2Box__body pd-t80">
                <h1 className="login2Box__title mg-b25">Log in</h1>

                <form onSubmit={this.handleSubmit}>
                  <div className="form-group mg-b30">
                    <p className=" mg-b10" style={{ color: "#015189" }}>
                      Please enter your Registered Mobile Number
                    </p>
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry={"IN"}
                      className="form-control"
                      name="phoneNumber"
                      placeholder="Enter your registered number."
                      value={this.state.phoneNumber}
                      onChange={(number) => this.setValue(number)}
                    />
                    {this.state.errors.phoneNumber && (
                      <span className="input-error2">
                        {this.state.errors.phoneNumber}
                      </span>
                    )}
                    {this.state.errors.phoneNumber && (
                      <span className="input-error">
                        {this.state.errors.phoneNumber}
                      </span>
                    )}
                  </div>

                  <div className="mg-b0 d-flex justify-content-between">
                    <button
                      id={"sign-in"}
                      type={"submit"}
                      className="btn btn-secondary"
                      disabled={this.state.isLoading ? true : false}
                    >
                      {this.state.isLoading ? (
                        <>
                          <img src="/assets/images/loader.gif" alt="loading" />
                        </>
                      ) : (
                        " Log in"
                      )}
                    </button>
                  </div>
                  {/* <a className="btn btn-link" href="/register/impact">Not Registered? Click here</a> */}
                </form>
              </div>
            </>
          )}
          {this.state.showOtp && (
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
                    placeholder="OTP"
                  />
                  {this.state.errors.otp && (
                    <span className="input-error">{this.state.errors.otp}</span>
                  )}
                </div>

                <div className="mg-b0 d-flex justify-content-between">
                  <button
                    id={"sign-in"}
                    type={"submit"}
                    className="btn btn-secondary"
                  >
                    Submit OTP
                  </button>
                </div>
              </form>
            </>
          )}
          <img
            src="assets/images/login-bg-top.png"
            alt=""
            className="login-bg-top"
          />

          <img
            src="assets/images/login-bg-bottom.png"
            alt=""
            className="login-bg-bottom"
          />
        </article>
      </div>
    );
  }
}

export default withRouter(Login);
