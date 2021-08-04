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
  { smcId: "1", name: "Andhra Pradesh Medical Council" },
  { smcId: "2", name: "Arunachal Pradesh Medical Council" },
  { smcId: "3", name: "Assam Medical Council" },
  { smcId: "28", name: "Bhopal Medical Council" },
  { smcId: "4", name: "Bihar Medical Council" },
  { smcId: "29", name: "Bombay Medical Council" },
  { smcId: "30", name: "Chandigarh Medical Council" },
  { smcId: "5", name: "Chattisgarh Medical Council" },
  { smcId: "6", name: "Delhi Medical Council" },
  { smcId: "7", name: "Goa Medical Council" },
  { smcId: "8", name: "Gujarat Medical Council" },
  { smcId: "9", name: "Haryana Medical Council" },
  { smcId: "10", name: "Himachal Pradesh Medical Council" },
  { smcId: "45", name: "Hyderabad Medical Council" },
  { smcId: "11", name: "Jammu & Kashmir Medical Council" },
  { smcId: "12", name: "Jharkhand Medical Council" },
  { smcId: "13", name: "Karnataka Medical Council" },
  { smcId: "15", name: "Madhya Pradesh Medical Council" },
  { smcId: "36", name: "Madras Medical Council" },
  { smcId: "35", name: "Mahakoshal Medical Council" },
  { smcId: "16", name: "Maharashtra Medical Council" },
  { smcId: "26", name: "Manipur Medical Council" },
  { smcId: "46", name: "Medical Council of India" },
  { smcId: "47", name: "Medical Council of Tanganyika" },
  { smcId: "42", name: "Mizoram Medical Council" },
  { smcId: "37", name: "Mysore Medical Council" },
  { smcId: "41", name: "Nagaland Medical Council" },
  { smcId: "17", name: "Orissa Council of Medical Registration" },
  { smcId: "38", name: "Pondicherry Medical Council" },
  { smcId: "18", name: "Punjab Medical Council" },
  { smcId: "19", name: "Rajasthan Medical Council" },
  { smcId: "20", name: "Sikkim Medical Council" },
  { smcId: "21", name: "Tamil Nadu Medical Council" },
  { smcId: "43", name: "Telangana State Medical Council" },
  { smcId: "50", name: "Travancore Cochin Medical Council, Trivandrum" },
  { smcId: "22", name: "Tripura State Medical Council" },
  { smcId: "23", name: "Uttar Pradesh Medical Council" },
  { smcId: "24", name: "Uttarakhand Medical Council" },
  { smcId: "40", name: "Vidharba Medical Council" },
  { smcId: "25", name: "West Bengal Medical Council" },
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

  const handleInstituteValues = (value) => {
    setInstituteIndex(value.smcId);
    setInstitute(value.name);
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
                          onClick={() => handleInstituteValues("")}
                        >
                          None
                        </div>
                        {instituteValues
                          .filter((val) => {
                            if (searchText === "") {
                              return val;
                            } else if (
                              val.name
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                            ) {
                              return val;
                            }
                            return "";
                          })
                          .map((value) => (
                            <div
                              className="institute-values-item"
                              onClick={() => handleInstituteValues(value)}
                              key={value.smcId}
                            >
                              {value.name}
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
