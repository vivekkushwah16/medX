import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
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
  const [regId, setRegId] = useState("3608");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("1972");
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
    if (institute === "" || institute === "None") {
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
          {/* <div className="modal-header">
            <h4 className="modal-title">{"props.title"}</h4>
          </div> */}
          {props.doctorError !== "" && (
            <div
              style={{
                color: "#b51f5a",
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "500",
              }}
            >
              {props.doctorError}
            </div>
          )}
          {!props.verified ? (
            <div className="modal-body">
              <div className="form-group">
                {/* <label htmlFor="regId">Browse By Registeration Number:</label> */}
                <input
                  type="text"
                  value={regId}
                  autofocus
                  className="form-control"
                  //   id="regId"
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder="Enter Registeration Number"
                  required
                />
                {error.regIdError && (
                  <span className="input-error2">{error.regIdError}</span>
                )}
              </div>
              <div className="form-group">
                {/* <label htmlFor="year">Browse By Year of Registeration:</label> */}
                <input
                  className="form-control"
                  type="tel"
                  value={year}
                  //   id="year"
                  maxLength="4"
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Enter Year of Registeration"
                  required
                />
                {error.yearError && (
                  <span className="input-error2">{error.yearError}</span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                {/* <label htmlFor="institute">State Medical Council:</label> */}
                <input
                  style={{ cursor: "pointer" }}
                  type="text"
                  className="form-control"
                  value={institute}
                  //   id="institute"
                  onClick={() => setShowInstitutes(!showInstitutes)}
                  readOnly
                  placeholder="Enter State Medical Council"
                  required
                />
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
                    onClick={() => handleInstituteValues("None")}
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
              {/* </div> */}
            </div>
          ) : (
            <div className="modal-body">Verified</div>
          )}
          {!props.verified ? (
            <div className="modal-footer">
              {!props.doctorResultLoading && (
                <button
                  id="close"
                  onClick={() => handleClose()}
                  //   className="button"
                  className="btn btn-secondary"
                >
                  Close
                </button>
              )}
              <button
                id="submit"
                className="btn btn-secondary"
                onClick={
                  !props.doctorResultLoading
                    ? () => {
                        props.handleDoctorError();
                        handleSubmit();
                      }
                    : null
                }
                // className="button"
              >
                {props.doctorResultLoading ? "verifying..." : "Submit"}
              </button>
            </div>
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
        </div>
      </div>
    )
  );
};

export default DoctorFormModal;
