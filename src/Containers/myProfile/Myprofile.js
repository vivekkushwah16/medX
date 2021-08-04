import React, { useContext, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import "./Myprofile.css";
import { useHistory } from "react-router-dom";
import { firestore, auth } from "../../Firebase/firebase";
// const SPECIALITY = [
//   "Chest Physician",
//   "Consulting Physician",
//   "General Physician",
//   "Cardiologist",
//   "Paediatrics",
//   "Others",
// ];
const SPECIALITY = [
  "CARDIOLOGIST",
  "CLINICAL CARDIOLOGIST",
  "ECHO CARDIOLOGIST",
  "PEAD CARDIOLOGIST",
  "PRACTICING CARDIOLOGIST",
  "INTERVENTIONAL CARDIOLOGIST",
  "MBBS CARDIOLOGIST D CARD",
  "MBBS DIABETOLOGIST D DIAB",
  "CTV SURGEON",
  "CVTS",
  "ELECTROPHYSIOLOGIST",
  "CHEST PHYSICIAN",
  "PULMONOLOGIST",
  "DIABETOLOGIST",
  "PRACTICING DIABETOLOGIST",
  "ENDOCRINOLOGIST",
  "GASTRO SURGEON",
  "GASTROENTEROLOGIST",
  "DENTIST",
  "DERMATOLOGIST",
  "COSMETIC DERMATOLOGIST",
  "COSMETIC SURGEON",
  "PAEDIATRIC DERMATOLOGIST",
  "PLASTIC SURGEON",
  "HAIR TRANSPLANT SURGEON",
  "TRICHOLOGIST",
  "OPHTHALMOLOGIST",
  "OPTH CATARACT",
  "OPTHAL CORNEA",
  "OPTHAL GLAUCOMA",
  "OPTHAL PHACO",
  "OPTHAL RETINA",
  "OPTOMETRIST",
  "ORTHOPEDICIAN",
  "ORTHO SURGEON",
  "GYNAECOLOGIST",
  "HAEMATOLOGIST",
  "IVF",
  "EMBRYOLOGIST",
  "NEUROSURGEON",
  "NEUROLOGIST",
  "PAED NEUROLOGIST",
  "PSYCHIATRIST",
  "ID SPECIALIST",
  "INTENSIVE CARE",
  "PRACTICING ICU CCU",
  "PAEDIATRICIAN",
  "NEONATOLOGIST",
  "ONCOLOGIST",
  "RADIATION ONCOLOGIST",
  "RHEUMATOLOGIST",
  "NEPHROLOGIST",
  "SURGEON",
  "ORTHO SURGEON",
  "PAEDIATRIC SURGEON",
  "ENT SURGEON",
  "URO ONCOLOGIST",
  "UROLOGIST",
  "VASCULAR SURGEON",
  "MICROBIOLOGIST",
  "GENERAL PHYSICIAN",
  "CONSULTANT PHYSICIAN",
  "GP NON MBBS",
  "ANAESTHETIST",
  "NON MBBS",
  "PURCHASE PHARMACY",
  "OTHERS",
];
function Myprofile(props) {
  const { userInfo, user, forceUpdateUserInfo } = useContext(UserContext);
  // console.log(userInfo);
  const [firstName, setFirstname] = useState(userInfo.firstName);
  const [lastName, setLastname] = useState(userInfo.lastName);
  const [email, setEmail] = useState(userInfo.email);
  const [mobile, setMobile] = useState(userInfo.phoneNumber);
  const [profession, setprofession] = useState(userInfo.profession);
  const [speciality, setspeciality] = useState(userInfo.speciality);
  const [country, setcountry] = useState(userInfo.country);
  const [state, setstate] = useState(userInfo.state);
  const [city, setcity] = useState(userInfo.city);
  const [pincode, setpincode] = useState(userInfo.pincode);
  const [year, setYear] = useState(userInfo.year);
  const [regId, setRegId] = useState(userInfo.regId);
  const [institute, setInstitute] = useState(userInfo.institute);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();
  const updateUserDeatils = async (e) => {
    e.preventDefault();
    try {
      if (firstName === "") {
        setError("firstname");
        return;
      }
      if (lastName === "") {
        setError("lastname");
        return;
      }
      if (speciality === "Your Seciality") {
        setError("speciality");
        return;
      }
      if (country === "Select country") {
        setError("countrt");
        return;
      }
      if (state === "Select State") {
        setError("state");
        return;
      }
      if (city === "") {
        setError("city");
        return;
      }
      if (pincode === "") {
        setError("pincode");
        return;
      }
      setLoading(true);
      await firestore.collection("profiles").doc(user.uid).update({
        city: city,
        country: country,
        firstName: firstName,
        lastName: lastName,
        pincode: pincode,
        profession: profession,
        speciality: speciality,
        state: state,
      });
      if (firstName !== userInfo.firstName || lastName !== userInfo.lastName) {
        await user.updateProfile({ displayName: `${firstName} ${lastName}` });
      }
      setLoading(false);
      await forceUpdateUserInfo();
      console.log(user.displayName);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className="modalBox modalBox--large active videoModalBox"
      id="videoPopupDiv"
    >
      <span
        className="modalBox__overlay"
        onClick={() => {
          if (history)
            history.push(props.returnUrl ? props.returnUrl : "/home");
        }}
      ></span>
      <div className="modalBox__inner myprofile">
        <div className="modalBox__header background-black">
          <div className="left__part">
            <a
              className="profile__user"
              href="#"
              style={{ pointerEvents: "none" }}
            >
              {`${
                userInfo.firstName ? userInfo.firstName[0].toUpperCase() : ""
              }${userInfo.lastName ? userInfo.lastName[0].toUpperCase() : ""} `}
            </a>
            <h3 className="modalBox__title" style={{ color: "#F5F5F5" }}>
              My Profile
            </h3>
          </div>
          <button
            className="modalBox__close-link"
            onClick={() => {
              if (history)
                history.push(props.returnUrl ? props.returnUrl : "/home");
            }}
          >
            CLOSE
          </button>
        </div>

        <div className="modalBox__body background-black">
          <div className="profile__cont">
            <div className="profile-selector">
              <div
                className={` ${
                  history?.location.pathname.includes("/home/profile") &&
                  "profile-selected"
                }`}
                onClick={() => {
                  if (history) history.push("/home/profile");
                }}
              >
                My Profile
              </div>
              <div
                className={` ${
                  history?.location.pathname.includes("/interest") &&
                  "profile-selected"
                }`}
                onClick={() => {
                  if (history) history.push("/interest");
                }}
              >
                My Interests
              </div>
            </div>
            <div className="login2Box__body">
              <form>
                <div className="row">
                  <div className="col-50">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        className="form-control background-black"
                        placeholder="First Name"
                        name="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                          setFirstname(e.target.value);
                        }}
                      />
                      {error === "firstname" && (
                        <span className="input-error2">* Enter Firstname</span>
                      )}
                    </div>
                  </div>
                  <div className="col-50">
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control background-black"
                        placeholder="Last Name"
                        name="lastName"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                          setLastname(e.target.value);
                        }}
                      />
                      {error === "lastname" && (
                        <span className="input-error2">* Enter Lastname</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={email}
                    disabled={true}
                    style={{ cursor: "not-allowed" }}
                    className="form-control background-black"

                    // onChange={this.handleInputChange}
                  />
                  {/* {this.state.errors.email && (
                    <span className="input-error2">{this.state.errors.email}</span>
                )} */}
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Phone Number</label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry={"IN"}
                    className="form-control background-black"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    id="mobile"
                    value={mobile}
                    disabled={true}
                    style={{ cursor: "not-allowed" }}
                    //   onChange={this.setValue}
                  />
                  {/* {this.state.errors.phoneNumber && (
                  <span className="input-error2">
                    {this.state.errors.phoneNumber}
                  </span>
                )} */}
                </div>
                <div className="form-group">
                  <label htmlFor="Profession">Profession</label>
                  <div className="custom-select  background-black">
                    <select
                      className="form-control"
                      name="profession"
                      id="Profession"
                      value={profession}
                      onChange={(e) => {
                        setprofession(e.target.value);
                      }}
                    >
                      {/* <option>Select Profession</option> */}
                      <option value="Doctor">Doctor</option>
                      <option value="Paramedics">Paramedics</option>
                      {/* <option>HCP</option> */}
                      <option value="Cipla Employee">Cipla Employee</option>
                    </select>
                    {error === "profession" && (
                      <span className="input-error2">* Select Profession</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="speciality">Speciality</label>
                  <div className="custom-select background-black">
                    <select
                      className="form-control"
                      name="speciality"
                      id="speciality"
                      value={speciality}
                      onChange={(e) => {
                        setspeciality(e.target.value);
                      }}
                    >
                      <option style={{ pointerEvents: "none" }}>
                        Your Speciality
                      </option>

                      {SPECIALITY.map((sp, index) => (
                        <option key={index} value={sp}>
                          {sp}
                        </option>
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
                    {error === "Your Speciality" && (
                      <span className="input-error2">* Select Speciality</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>

                  <div className="custom-select  background-black">
                    <CountryDropdown
                      defaultOptionLabel="Select country"
                      name="country"
                      id="country"
                      className="form-control"
                      value={country}
                      onChange={(e) => {
                        setcountry(e);
                      }}
                    />
                    {error === "country" && (
                      <span className="input-error2">* Select Country</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="region">Region</label>

                  <div className="custom-select background-black">
                    <RegionDropdown
                      defaultOptionLabel="Select State"
                      name="state"
                      className="form-control"
                      id="region"
                      country={country}
                      value={state}
                      onChange={(e) => {
                        setstate(e);
                      }}
                    />
                    {error === "state" && (
                      <span className="input-error2">* Select State</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control background-black"
                    placeholder="City"
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e) => {
                      setcity(e.target.value);
                    }}
                  />
                  {error === "city" && (
                    <span className="input-error2">* Enter City</span>
                  )}
                </div>
                <div className="form-group mg-b35">
                  <label htmlFor="pincode">Pincode</label>

                  <input
                    type="text"
                    className="form-control background-black"
                    placeholder="Pincode"
                    name="pincode"
                    id="pincode"
                    value={pincode}
                    onChange={(e) => {
                      setpincode(e.target.value);
                    }}
                    maxLength={6}
                  />
                  {error === "pincode" && (
                    <span className="input-error2">* Enter Pincode</span>
                  )}
                </div>
                {/* <label
                  className="custom-checkbox mg-b30"
                  style={{ display: "flex" }}
                >
                  <input
                    name="termsAndConditions"
                    type="checkbox"
                    // checked={this.state.termsAndConditions}
                    // onChange={this.handleInputChange}
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
                    . I also agree to receive periodic Emails/SMS from Cipla in
                    my primary area of interest.
                  </p>
                </label> */}
                {/* {this.state.errors.termsAndConditions && (
                  <span className="input-error">
                  {this.state.errors.termsAndConditions}
                  </span>
                )} */}
                <div
                  className="form-group doctor-profile-container"
                  // style={{ border: !userInfo.doctorVerified && "none" }}
                >
                  <div className="doctor-profile-verify-text">
                    Your Medical Registration Details
                  </div>

                  <div
                    onClick={() => {
                      if (history)
                        history.push(
                          props.returnUrl ? props.returnUrl : "/home"
                        );
                      props.showForm();
                    }}
                    className="doctor-profile-verify-btn"
                    style={{
                      right: !userInfo.doctorVerified && "50%",
                      transform: !userInfo.doctorVerified && "translateX(50%)",
                      top: !userInfo.doctorVerified && "1.3rem",
                    }}
                  >
                    {!userInfo.doctorVerified ? "Verify Details" : "Edit"}
                  </div>

                  {year !== undefined && (
                    <div className="form-group">
                      <label htmlFor="year" style={{ color: "grey" }}>
                        Year of Registeration
                      </label>
                      <input
                        type="text"
                        placeholder="Year"
                        name="year"
                        id="year"
                        value={year}
                        disabled={true}
                        style={{ cursor: "not-allowed" }}
                        className="form-control background-black"

                        // onChange={this.handleInputChange}
                      />
                      {/* {this.state.errors.email && (
                    <span className="input-error2">{this.state.errors.email}</span>
                )} */}
                    </div>
                  )}
                  {institute !== undefined && (
                    <div className="form-group">
                      <label htmlFor="institute" style={{ color: "grey" }}>
                        State Medical Council
                      </label>
                      <input
                        type="text"
                        placeholder="State Medical Council"
                        name="institute"
                        id="institute"
                        value={institute}
                        disabled={true}
                        style={{ cursor: "not-allowed" }}
                        className="form-control background-black"

                        // onChange={this.handleInputChange}
                      />
                      {/* {this.state.errors.email && (
                    <span className="input-error2">{this.state.errors.email}</span>
                )} */}
                    </div>
                  )}
                  {regId !== undefined && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="regId" style={{ color: "grey" }}>
                        Registeration Number
                      </label>
                      <input
                        type="text"
                        placeholder="Registeration Number"
                        name="regId"
                        id="regId"
                        value={regId}
                        disabled={true}
                        style={{ cursor: "not-allowed" }}
                        className="form-control background-black"

                        // onChange={this.handleInputChange}
                      />
                      {/* {this.state.errors.email && (
                    <span className="input-error2">{this.state.errors.email}</span>
                )} */}
                    </div>
                  )}
                </div>
                <div className="mg-b30 d-flex justify-content-between">
                  <button
                    onClick={updateUserDeatils}
                    className="btn btn-secondary save__btn"
                    id="RegisterBtn"
                    type={"submit"}
                    // disabled={this.state.isLoading ? true : false}
                  >
                    {isLoading ? (
                      <>
                        <img
                          src="/assets/images/loader.gif"
                          alt="loading"
                          style={{ maxHeight: "20px" }}
                        />
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myprofile;
