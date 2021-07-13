import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import ReactDOM from "react-dom";
import DownIcon from "../../assets/images/icons/down.svg";
import UpIcon from "../../assets/images/icons/up.svg";
import ErrorIcon from "../../assets/images/icons/error.svg";
import CloseIcon from "../../assets/images/icons/close.svg";
import "./DoctorFormModal.css";
const instituteValues = [
  "Andhra Pradesh Medical Council",
  "Arunachal Pradesh Medical Council",
  "Assam Medical Council",
  "Bhopal Medical Council",
  "Bihar Medical Council",
  "Bombay Medical Council",
  "Chandigarh Medical Council",
  "Chattisgarh Medical Council",
  "Delhi Medical Council",
  "Goa Medical Council",
  "Gujarat Medical Council",
  "Haryana Medical Council",
  "Himachal Pradesh Medical Council",
  "Hyderabad Medical Council",
  "Jammu & Kashmir Medical Council",
  "Jharkhand Medical Council",
  "Karnataka Medical Council",
  "Madhya Pradesh Medical Council",
  "Madras Medical Council",
  "Mahakoshal Medical Council",
  "Maharashtra Medical Council",
  "Manipur Medical Council",
  "Medical Council of India",
  "Medical Council of Tanganyika",
  "Mizoram Medical Council",
  "Mysore Medical Council",
  "Nagaland Medical Council",
  "Orissa Council of Medical Registration",
  "Pondicherry Medical Council",
  "Punjab Medical Council",
  "Rajasthan Medical Council",
  "Sikkim Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana State Medical Council",
  "Travancore Cochin Medical Council, Trivandrum",
  "Tripura State Medical Council",
  "Uttar Pradesh Medical Council",
  "Uttarakhand Medical Council",
  "Vidharba Medical Council",
  "West Bengal Medical Council",
];

const DoctorFormModal = (props) => {
  let history = useHistory();
  const [regId, setRegId] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("");
  const [showInstitutes, setShowInstitutes] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState({
    regIdError: "",
    yearError: "",
    instituteError: "",
  });

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      handleClose();
    }
  };

  const handleSubmit = () => {
    let obj = {
      regId,
      institute,
      year,
    };
    if (regId === "") {
      return setError({ regIdError: "Registeration number is required" });
    }
    if (year === "") {
      return setError({ yearError: "Registeration year is required" });
    }
    if (institute === "") {
      return setError({ instituteError: "Institute is required" });
    }
    setError({});
    props.handleSubmit(obj);
    props.handledoctorResultLoading(true);
  };

  const handleInstituteValues = (value) => {
    setInstitute(value);
    setShowInstitutes(false);
    setSearchText("");
  };
  const handleClose = () => {
        document.getElementsByTagName("body")[0].style.overflow = "auto";
    props.handledoctorResultLoading(false);
    props.handleDoctorError();
    props.onClose();
    handleClearState();
  };
  const handleClearState = () => {
    setInstitute("");
    setRegId("");
    setYear("");
  };
  return (
    props.show && (
      <div className="modal" onClick={() => handleClose()}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {!props.verified ? (
            <>
              <div className="modal-header">
                <h4 className="modal-title">
                  Please validate your credentials
                  <br />
                  to proceed further
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <input
                    type="text"
                    value={regId}
                    autofocus
                    className="form-control"
                    onChange={(e) => setRegId(e.target.value)}
                    placeholder="Registeration Number"
                    required
                  />
                  {error.regIdError && (
                    <span className="input-error2">{error.regIdError}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="tel"
                    value={year}
                    maxLength="4"
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year of Registeration"
                    required
                  />
                  {error.yearError && (
                    <span className="input-error2">{error.yearError}</span>
                  )}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input
                    style={{ cursor: "pointer", backgroundColor: "beige" }}
                    type="text"
                    className="form-control"
                    value={institute}
                    onClick={() => setShowInstitutes(!showInstitutes)}
                    readOnly
                    placeholder="State Medical Council"
                    required
                  />
                  <div
                    className="institute-arrow-icon"
                    onClick={() => setShowInstitutes(!showInstitutes)}
                  >
                    <img
                      src={showInstitutes ? UpIcon : DownIcon}
                      height="16px"
                      alt=""
                    />
                  </div>
                  {error.instituteError && (
                    <span className="input-error2">{error.instituteError}</span>
                  )}
                </div>
                {showInstitutes && (
                  <div className="institute-values form-group">
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search..."
                    />
                    <div
                      className="institute-values-item"
                      onClick={() => handleInstituteValues("")}
                    >
                      None
                    </div>
                    {instituteValues
                      .filter((val) => {
                        if (searchText === "") {
                          return val;
                        } else if (
                          val.toLowerCase().includes(searchText.toLowerCase())
                        ) {
                          return val;
                        }
                        return "";
                      })
                      .map((value) => (
                        <div
                          className="institute-values-item"
                          onClick={() => handleInstituteValues(value)}
                          key={value}
                        >
                          {value}
                        </div>
                      ))}
                  </div>
                )}
                {props.doctorError && (
                  <div className="doc-error">
                    <span style={{ paddingRight: "5px" }}>
                      <img src={ErrorIcon} height="20px" alt="" />
                    </span>
                    {props.doctorError}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="modal-body doc-verified">
              <div class="success-positioning d-flex">
                <div class="success-icon">
                  <div class="success-icon__tip"></div>
                  <div class="success-icon__long"></div>
                </div>
              </div>
              <h2>Verified</h2>
              <h4>Congratulations! Account is verified.</h4>
            </div>
          )}
          {!props.verified ? (
            <>
              <div className="modal-footer">
                {/* {!props.doctorResultLoading && (
                <button
                  id="close"
                  onClick={() => {
                    history.push("/home/profile");
                    handleClose();
                  }}
                  className="btn btn-secondary"
                >
                  Edit Profile
                </button>
              )} */}
                <button
                  id="submit"
                  className="btn btn-secondary save__btn"
                  style={{
                    backgroundColor: props.doctorResultLoading && "#fff",
                  }}
                  onClick={
                    // !props.doctorResultLoading
                    //   ? () => {
                    //       props.handleDoctorError();
                    //       handleSubmit();
                    //     }
                    //   : null
                     ()=>{props.handleDoctorError();
                     handleSubmit();}
                  }
                >
                  {props.doctorResultLoading ? (
                    <img
                      src="/assets/images/loader.gif"
                      alt="loading"
                      style={{ maxHeight: "20px" }}
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
              <div className="p-b">
                Want to edit your profile?
                <span
                  className="p-b-l"
                  onClick={() => {
                    history.push("/home/profile");
                    handleClose();
                  }}
                >
                  Click here
                </span>
              </div>
            </>
          ) : (
            <div className="modal-footer">
              <button
                id="submit"
                onClick={() => {
                  handleClose();
                  props.handleVerificationState();
                }}
                className="btn btn-secondary"
              >
                Continue
              </button>
            </div>
          )}
          <div
            onClick={() => {
              handleClose();
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
          >
            <img src={CloseIcon} alt="" />
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorFormModal;
