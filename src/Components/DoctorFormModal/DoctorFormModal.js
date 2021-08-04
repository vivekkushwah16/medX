import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
// import ReactDOM from "react-dom";
import { UserContext } from "../../Context/Auth/UserContextProvider";
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
const years = [
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
  "2009",
  "2008",
  "2007",
  "2006",
  "2005",
  "2004",
  "2003",
  "2002",
  "2001",
  "2000",
  "1999",
  "1998",
  "1997",
  "1996",
  "1995",
  "1994",
  "1993",
  "1992",
  "1991",
  "1990",
  "1989",
  "1988",
  "1987",
  "1986",
  "1985",
  "1984",
  "1983",
  "1982",
  "1981",
  "1980",
  "1979",
  "1978",
  "1977",
  "1976",
  "1975",
  "1974",
  "1973",
  "1972",
  "1971",
  "1970",
  "1969",
  "1968",
  "1967",
  "1966",
  "1965",
  "1964",
  "1963",
  "1962",
  "1961",
  "1960",
  "1959",
  "1958",
  "1957",
  "1956",
  "1955",
  "1954",
  "1953",
  "1952",
  "1951",
  "1950",
  "1949",
  "1948",
  "1947",
  "1946",
  "1945",
  "1944",
  "1943",
  "1942",
  "1941",
  "1940",
  "1939",
  "1938",
  "1937",
  "1936",
  "1935",
  "1934",
  "1933",
  "1932",
  "1931",
];

const DoctorFormModal = (props) => {
  let history = useHistory();
  const { userInfo } = useContext(UserContext);
  const [regId, setRegId] = useState(userInfo.regId);
  const [institute, setInstitute] = useState(userInfo.institute);
  const [instituteIndex, setInstituteIndex] = useState("");
  const [year, setYear] = useState(userInfo.year);
  const [showInstitutes, setShowInstitutes] = useState(false);

  const [showYears, setShowYears] = useState(false);
  const [searchYear, setSearchYear] = useState("");
  const [showForm, setShowForm] = useState(
    userInfo.doctorVerified ? true : false
  );
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

  useEffect(() => {
    if (userInfo.doctorVerified) {
      setRegId(userInfo.regId);
      setYear(userInfo.year);
      setInstitute(userInfo.institute);
      setShowForm(true);
    }
    return () => {
      // cleanu
    };
  }, [userInfo]);

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
    props.handleSubmit(obj, instituteIndex);
    // props.handledoctorResultLoading(true);
  };

  const handleInstituteValues = (value, index) => {
    setInstituteIndex(index);
    setInstitute(value);
    setShowInstitutes(false);
    setSearchText("");
  };
  const handleYearsValues = (value) => {
    setYear(value);
    setShowYears(false);
    setSearchYear("");
  };
  const handleClose = (profileBtn) => {
    document.getElementsByTagName("body")[0].style.overflow = "auto";

    let count = parseInt(localStorage.getItem("count"));
    // if edit profile button clicked then maintain count
    // if (count < 14 && profileBtn) {
    //   localStorage.setItem("count", count - 1);
    // }

    // if (count < 14 && !profileBtn) {
    //   props.openVideoPopafterClose();
    // }
    console.log(history.location);
    if (count < 14 && !userInfo.doctorVerified) {
      props.openVideoPopafterClose();
    }

    // updating click count of doctor modal
    // props.updateDoctorVerificationClickCount({
    //   doctorVerificationClickCount: count ? count : 1,
    // });
    // updateClickCount();

    setShowForm(false);
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
  // const updateClickCount = () => {
  //   let count = parseInt(localStorage.getItem("count"));
  //   props.updateDoctorVerificationClickCount({
  //     doctorVerificationClickCount: count ? count : 1,
  //   });
  // };
  return (
    props.show && (
      <div className="modal" onClick={() => handleClose()}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {!props.verified ? (
            <>
              {showForm ? (
                <div>
                  <div className="modal-header">
                    {!userInfo.doctorVerified ? (
                      <h4 className="modal-title">
                        Please validate your credentials
                        <br />
                        to proceed further
                      </h4>
                    ) : (
                      <h4 className="modal-title">
                        Please update your credentials
                        <br />
                        to proceed further
                      </h4>
                    )}
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <input
                        type="text"
                        value={regId}
                        autoFocus
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
                      {/* <input
                        className="form-control"
                        type="tel"
                        value={year}
                        maxLength="4"
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Year of Registeration"
                        required
                      /> */}
                      <input
                        style={{ cursor: "pointer", backgroundColor: "beige" }}
                        type="text"
                        className="form-control"
                        value={year}
                        onClick={() => setShowYears(!showYears)}
                        readOnly
                        placeholder="Year of Registeration"
                        required
                      />
                      <div
                        className="institute-arrow-icon"
                        onClick={() => setShowYears(!showYears)}
                      >
                        <img
                          src={showYears ? UpIcon : DownIcon}
                          height="16px"
                          alt=""
                        />
                      </div>
                      {error.yearError && (
                        <span className="input-error2">{error.yearError}</span>
                      )}
                    </div>
                    {showYears && (
                      <div className="institute-values form-group">
                        <input
                          className="form-control"
                          type="text"
                          onChange={(e) => setSearchYear(e.target.value)}
                          placeholder="Search..."
                        />

                        {years
                          .filter((val) => {
                            if (searchYear === "") {
                              return val;
                            } else if (
                              val
                                .toLowerCase()
                                .includes(searchYear.toLowerCase())
                            ) {
                              return val;
                            }
                            return "";
                          })
                          .map((value) => (
                            <div
                              className="institute-values-item"
                              onClick={() => handleYearsValues(value)}
                              key={value}
                            >
                              {value}
                            </div>
                          ))}
                      </div>
                    )}
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
                        <span className="input-error2">
                          {error.instituteError}
                        </span>
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
                          onClick={() => handleInstituteValues("", "")}
                        >
                          None
                        </div>
                        {instituteValues
                          .filter((val) => {
                            if (searchText === "") {
                              return val;
                            } else if (
                              val
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            ) {
                              return val;
                            }
                            return "";
                          })
                          .map((value, index) => (
                            <div
                              className="institute-values-item"
                              onClick={() =>
                                handleInstituteValues(value, index + 1)
                              }
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
                </div>
              ) : (
                <div className="modal-body doc-verified">
                  <div className="success-positioning d-flex">
                    <div className="success-icon">
                      <div className="info-icon">i</div>
                    </div>
                  </div>
                  <h2>Verify Account</h2>
                  <h4>{props.doctorFormModalText}</h4>
                </div>
              )}
            </>
          ) : (
            <div className="modal-body doc-verified">
              <div className="success-positioning d-flex">
                <div className="success-icon">
                  <div className="success-icon__tip"></div>
                  <div className="success-icon__long"></div>
                </div>
              </div>
              <h2>Verified</h2>

              <h4>Congratulations! Account is verified.</h4>
            </div>
          )}
          {!props.verified ? (
            <>
              {showForm ? (
                <div>
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
                        () => {
                          props.handleDoctorError();
                          handleSubmit();
                        }
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
                  {/* <div className="p-b">
                    Want to edit your profile?
                    <span
                      className="p-b-l"
                      onClick={() => {
                        history.push("/home/profile");
                        handleClose(true);
                      }}
                    >
                      Click here
                    </span>
                  </div> */}
                </div>
              ) : (
                <div>
                  <div
                    className="modal-footer"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <button
                      style={{ marginLeft: "10px" }}
                      id="submit"
                      className="btn btn-secondary save__btn"
                      onClick={() => {
                        // updateClickCount();
                        setShowForm(true);
                      }}
                    >
                      Continue
                    </button>
                    <button
                      style={{ background: "#fff", color: "#015189" }}
                      id="close"
                      onClick={() => handleClose()}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="modal-footer">
              <button
                id="submit"
                onClick={() => {
                  handleClose();
                }}
                className="btn btn-secondary"
              >
                Continue
              </button>
            </div>
          )}
          {showForm && (
            <div
              onClick={() => {
                handleClose();
              }}
              className="doctor-modal-cls-btn"
              style={{}}
            >
              <img src={CloseIcon} alt="" />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorFormModal;
