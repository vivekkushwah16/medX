import React, {
  Component,
  createRef,
  useContext,
  useEffect,
  useMemo,
} from "react";
// import { Splide, SplideSlide } from '@splidejs/react-splide';
import VideoPopup from "../../Containers/VideoPopup/VideoPopup";
import stringSimilarity from "string-similarity";
// import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import "./Home.css";
import top from "./top.svg";
import Banner from "../../Containers/Banner/Banner";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import VideoRow from "../../Containers/VideoRow/VideoRow";
// import VideoManager from '../../Managers/VideoManager';
import Header from "../../Containers/Header/Header";
import TagsRow from "../../Containers/TagsRow/TagsRow";
import Footer from "../../Containers/Footer/Footer";
import { isMobileOnly } from "react-device-detect";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import {
  cloudFunction,
  cloudFunctionUS,
  firestore,
  logout,
} from "../../Firebase/firebase";
import {
  BACKSTAGE_COLLECTION,
  PLATFORM_BACKSTAGE_DOC,
} from "../../AppConstants/CollectionConstants";
import swal from "sweetalert";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  withRouter,
} from "react-router-dom";
import axios from "axios";
import {
  SEND_OTP_CLOUDFUNCTION,
  UPDATE_MOBILENUMBER_CLOUDFUNCTION,
  VERIFY_OTP_COLUDFUNCTION,
} from "../../AppConstants/CloudFunctionName";
import VideoManager from "../../Managers/VideoManager";
import { DoctorManager } from "../../Managers/DoctorManager";
import Myprofile from "../../Containers/myProfile/Myprofile";
import Chatbot from "../../Components/chatbot/Chatbot";
import IntersetSelection from "../../Containers/IntersetSelection";
import { INTEREST_ROUTE } from "../../AppConstants/Routes";
import SearchBar from "../../Components/SearchBar/SearchBar";
import DoctorFormModal from "../../Components/DoctorFormModal/DoctorFormModal";

const ComponentWillMountHook = (fun) => useMemo(fun, []);

function HandleUrlParam(props) {
  const { videopopVisible, openVideoPop } = props;
  const { getVideoMetaData } = useContext(UserContext);
  //useHistory to redirect
  let history = useHistory();
  //params will tell us the video Id
  let { videoId } = useParams();
  //using query we will get the tag
  let urlQuery = useQuery();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const loadVideoWithOutTag = async () => {
    try {
      //we first read the video from db using Id and then we will get the tag from it
      let currentVideoData = await VideoManager.getVideoWithId(videoId);
      let tag = currentVideoData.tags[0];
      loadVideoWithTag(tag, currentVideoData);
    } catch (error) {
      history.push("/home");
    }
  };

  const loadVideoWithTag = async (currentTag, _CurrentVideoData) => {
    try {
      //get all video with the tag, we have to show them in suggestions
      let currentVideoData = null;
      if (_CurrentVideoData) {
        currentVideoData = _CurrentVideoData;
      } else {
        currentVideoData = await VideoManager.getVideoWithId(videoId);
      }
      const videoArr = await VideoManager.getVideoWithTag([currentTag]);
      //get video meta data, will tell how much I have watch the video
      const metaData = await getVideoMetaData(videoId);
      openVideoPop(metaData, currentVideoData, videoArr, currentTag, false);
    } catch (error) {
      history.push("/home");
    }
  };

  ComponentWillMountHook(async () => {
    //check if videoPopVisible, if not then it's a direct link open
    if (!videopopVisible) {
      //we will find the tag
      let currentTag = urlQuery.get("tag");
      currentTag = decodeURIComponent(currentTag);
      if (currentTag && currentTag !== "null") {
        loadVideoWithTag(currentTag);
      } else {
        loadVideoWithOutTag();
      }
    }
  });
  useEffect(() => {
    return () => {
      document.getElementsByTagName("body")[0].style.overflow = "auto";
    };
  }, []);
  return <>{props.children}</>;
}
const RecommendedRow = [
  {
    tag: "RecommendedVideos",
    header: "Recommended Videos",
    videoFetchFunction: VideoManager.getBasicRecommendedVideos,
  },
];
const preDefinedRows = [
  // {
  //   tag: "RecommendedVideos",
  //   header: "Recommended Videos",
  //   videoFetchFunction: VideoManager.getBasicRecommendedVideos,
  // },
  {
    tag: "TrendingVideos",
    header: "Trending Videos",
    videoFetchFunction: VideoManager.getTrendingVideos,
    fetchParameters: { limit: 10 },
  },
  {
    tag: "LatestVideos",
    header: "Latest Videos",
    videoFetchFunction: VideoManager.getLatestVideos,
    fetchParameters: { limit: 10 },
  },
];

class Home extends Component {
  state = {
    data: null,
    videopopVisible: false,
    videoPopId: null,
    currentVideosData: null,
    rows: [
      { tag: "COPD", header: "Videos on COPD" },
      { tag: "nebulization", header: "Videos of Nebulization" },
      { tag: "Asthma", header: "Videos on Asthma" },
      { tag: "ILD/IPF", header: "Videos on ILD/IPF" },
      // { tag: "anti fungal", header: "Videos of Anti Fungal" },
      { tag: "Telemedicine", header: "Videos on Telemedicine" },
      { tag: "Impact Sessions", header: "Videos of Impact session" },
      { tag: "covid19", header: "Videos on COVID-19" },
      { tag: "HeartFailure", header: "Videos of Heart Failure" },
      { tag: "Inhalation Devices", header: "Videos of Inhalation Devices" },
      { tag: "Diagnosis", header: "Videos of Diagnosis" },
      { tag: "Pulmonary Hypertension", header: "Videos of Pulmonary Hypertension" },
      { tag: "Pediatric asthma", header: "Videos of Pediatric asthma" },
      { tag: "Bronchiectasis", header: "Videos of Bronchiectasis" },
      { tag: "Allergic Rhinitis", header: "Videos of Allergic Rhinitis" },
      // {
      //   tag: [
      //     "Inhalation Devices",
      //     "Diagnosis",
      //     "Pulmonary Hypertension",
      //     "Pediatric asthma",
      //     "Bronchiectasis",
      //     "Allergic Rhinitis",
      //   ],
      //   header: "Videos on Other Respiratory Diseases",
      //   multipleTags: true,
      // },
    ],

    tags: [
      { tag: "Impact Sessions", header: "Impact Sessions" },
      { tag: "COPD", header: "COPD" },
      { tag: "Asthma", header: "Asthma" },
      { tag: "Pediatric asthma", header: "Pediatric Asthma" },
      { tag: "Pulmonary Hypertension", header: "Pulmonary Hypertension" },
      { tag: "Bronchiectasis", header: "Bronchiectasis" },
      { tag: "Allergic Rhinitis", header: "Allergic Rhinitis" },
      { tag: "Diagnosis", header: "Diagnosis" },
      { tag: "Inhalation Devices", header: "Inhalation Devices" },
      { tag: "ILD/IPF", header: "ILD/IPF" },
      { tag: "Telemedicine", header: "Telemedicine" },
      { tag: "covid19", header: "COVID-19" },
      { tag: "HeartFailure", header: "Heart Failure" },
      { tag: "nebulization", header: "Nebulization" },
      // { tag: "anti fungal", header: "Anti Fungal" },
      // { tag: ['Asthma', 'ILD/IPF'], header: 'Others', multipleTags: true }
    ],
    activeTag: { tag: "Impact Sessions", header: "Videos of Impact session" },
    lastPlayed: null,
    lastVideoMetadata: null,
    platformData: JSON.parse(localStorage.getItem("platformData")),
    doctorFormModalShow: false,
    doctorFormData: "",
    // doctorNameVerified: localStorage.getItem("doctorVerified") ? true : false,
    doctorNameVerified: this.context.userInfo.doctorVerified ? true : false,
    doctorError: "",
    doctorResultLoading: false,
  };

  contentBoXTop = createRef();

  scrollToTargetAdjusted = () => {
    if (this.contentBoXTop.current) {
      var element = this.contentBoXTop.current;
      var headerOffset = 150;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition =
        elementPosition - headerOffset + (window.scrollY ? window.scrollY : 0);
      // let isInTheView = (elementPosition + 100 > window.scrollY) && ((elementPosition + 100) < (window.scrollY + window.innerHeight))
      // console.log((elementPosition + 100 > window.scrollY), ((elementPosition + 100) < (window.scrollY + window.innerHeight)), isInTheView)
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  onTagSelect = (tag) => {
    // if (this.contentBoXTop.current) {
    //     this.contentBoXTop.current.scrollIntoView();
    // }
    this.scrollToTargetAdjusted();
    let _tag = this.state.rows.filter((r) =>
      !r.multipleTags ? r.tag === tag.tag : r.tag.indexOf(tag.tag) !== -1
    )[0];
    if (_tag.multipleTags) {
      this.setState({ activeTag: { ..._tag, currentTag: tag.tag } });
    } else {
      this.setState({ activeTag: _tag });
    }
    return;
    this.setState({ activeTag: tag });
    return;
    this.state.activeTag.tag == tag.tag
      ? this.setState({ activeTag: "" })
      : this.setState({ activeTag: tag });
  };

  //#region verification flow

  runEnteringMobileNumberProcess = () => {
    const updateMobileNumberCLoudFunctionRef = cloudFunction.httpsCallable(
      UPDATE_MOBILENUMBER_CLOUDFUNCTION
    );
    swal({
      title: "Update Number",
      text: "Please enter your updated Mobile Number.",
      icon: "info",
      closeOnClickOutside: false,
      buttons: {
        cancel: true,
        confirm: {
          text: "Confirm",
          closeModal: false,
        },
      },
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter Mobile Number (with country code eg. +91XXXX)",
          type: "text",
          required: true,
        },
      },
    }).then((value) => {
      if (value == null) {
        return;
      }
      if (value.length > 0) {
        updateMobileNumberCLoudFunctionRef(
          JSON.stringify({ phoneNumber: value.trim(), verifyAcocunt: true })
        )
          .then((res) => {
            console.log(res.data);
            if (res.data.status === "done") {
              swal({
                title: "Number Updated",
                text: "Please Re-Login to complete the process.",
                icon: "success",
              }).then(() => {
                logout();
              });
            } else if (
              res.data.status === "fail" &&
              res.data.code === "auth/phone-number-already-exists"
            ) {
              swal({
                title: "Already Exists",
                text: "Another account is already registered with same Mobile Number.",
                icon: "error",
              });
            } else if (
              res.data.status === "fail" &&
              res.data.code === "auth/invalid-phone-number"
            ) {
              swal({
                title: "Invalid Number",
                text: "Please enter a valid Mobile Number.",
                icon: "error",
              }).then(() => {
                this.runEnteringMobileNumberProcess();
              });
            } else if (
              res.data.status === "fail" &&
              res.data.code === "auth/invalid-email"
            ) {
              swal({
                title: "Invalid Format",
                text: "Please enter your Number in proper format.",
                icon: "error",
              }).then(() => {
                this.runEnteringMobileNumberProcess();
              });
            } else if (res.data.status === "fail" && res.data.code) {
              swal({
                title: "Error",
                text: res.data.message,
                icon: "error",
              }).then(() => {
                this.runEnteringMobileNumberProcess();
              });
            } else {
              swal({
                title: "Try Again",
                text: "Sorry something went wrong, please try again.",
                icon: "error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.runEnteringMobileNumberProcess();
      }
    });
  };

  showEnterOTP_UpdateInfo = () => {
    const verifyCLoudFunctionRef = cloudFunction.httpsCallable(
      VERIFY_OTP_COLUDFUNCTION
    );
    swal({
      title: "Verification Code",
      text: "Please enter verification code sent to your Registered Email Id to update your Mobile Number.",
      icon: "info",
      closeOnClickOutside: false,
      buttons: {
        cancel: true,
        confirm: {
          text: "Confirm",
          closeModal: false,
        },
      },
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter OTP",
          type: "text",
          required: true,
        },
      },
    }).then((value) => {
      if (value == null) {
        return;
      }
      if (value.length > 0) {
        verifyCLoudFunctionRef(JSON.stringify({ otp: value }))
          .then((res) => {
            console.log(res);
            if (res.data.type === "success") {
              this.runEnteringMobileNumberProcess();
            } else if (
              res.data.type === "error" &&
              res.data.message === "OTP not match"
            ) {
              swal({
                title: "Incorrect OTP",
                text: "Please try again with a valid OTP.",
                icon: "error",
                buttons: {
                  Resend: {
                    text: "Resend OTP (max: 3)",
                    closeModal: false,
                  },
                  Retry: {
                    text: "Retry",
                    closeModal: false,
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "Resend":
                    this.runUpdateInfoProcess();
                    break;
                  case "Retry":
                    this.showEnterOTP_UpdateInfo();
                    break;
                  default:
                }
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "OTP expired"
            ) {
              swal({
                title: "OTP Expired",
                text: "This OTP has expired. Please try again.",
                icon: "error",
              }).then(() => {
                this.runNonVerifiedProcess();
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "Max limit reached for this otp verification"
            ) {
              swal({
                title: "Retries Exhausted",
                text: "Too many invalid attempts. Please try again later.",
                icon: "error",
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "Otp empty or not numeric"
            ) {
              swal({
                title: "Incorrect OTP",
                text: "Please try again with a valid OTP.",
                icon: "error",
              }).then(() => {
                this.showEnterOTP_UpdateInfo();
              });
            } else {
              swal({
                title: "Try Again",
                text: "Sorry something went wrong, please try again.",
                icon: "error",
              }).then(() => {
                this.runNonVerifiedProcess();
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.showEnterOTP_UpdateInfo();
      }
    });
  };

  runUpdateInfoProcess = () => {
    let count = sessionStorage.getItem("otpCountUpdateInfo");
    if (count > 4) {
      swal({
        title: "No Resends Left",
        text: "You have reached max limit to send OTP requests. Please try again later.",
        icon: "error",
      });
      return;
    }

    const cloudRef = cloudFunction.httpsCallable(SEND_OTP_CLOUDFUNCTION);
    cloudRef(JSON.stringify({ uid: this.context.uid }))
      .then((res) => {
        console.log(res);
        count = count ? count + 1 : 1;
        sessionStorage.setItem("otpCount", count);
        this.showEnterOTP_UpdateInfo();
      })
      .catch((error) => {
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(error);
        console.log(code, message, details);
        swal({
          title: "TryAgain",
          text: "Something went wrong, please try again.",
          icon: "error",
        }).then(() => {
          this.runNonVerifiedProcess();
        });
      });
  };

  showEnterOTP = () => {
    const verifyCLoudFunctionRef = cloudFunction.httpsCallable(
      VERIFY_OTP_COLUDFUNCTION
    );
    swal({
      title: "Enter OTP",
      text: "Please check your Registered Mobile Number or Email Id for the OTP.",
      icon: "info",
      closeOnClickOutside: false,
      buttons: {
        cancel: true,
        confirm: {
          text: "Confirm",
          closeModal: false,
        },
      },
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter OTP",
          type: "text",
          required: true,
        },
      },
    }).then((value) => {
      if (value == null) {
        return;
      }
      if (value.length > 0) {
        verifyCLoudFunctionRef(
          JSON.stringify({ otp: value, verifyAcocunt: true })
        )
          .then((res) => {
            console.log(res);
            if (res.data.type === "success") {
              swal({
                title: "Account Verified",
                text: "Congratulations your account has been verified. You may now access the platform.",
                icon: "success",
                closeOnClickOutside: false,
                button: {
                  text: "Continue",
                  closeModal: false,
                },
              }).then(async () => {
                await this.context.forceUpdateUserInfo();
                swal.close();
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "OTP not match"
            ) {
              swal({
                title: "Incorrect OTP",
                text: "Please try again with a valid OTP.",
                icon: "error",
                buttons: {
                  Resend: {
                    text: "Resend OTP (max: 3)",
                    closeModal: false,
                  },
                  Retry: {
                    text: "Retry",
                    closeModal: false,
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "Resend":
                    this.runOTPProcess();
                    break;
                  case "Retry":
                    this.showEnterOTP();
                    break;
                  default:
                }
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "OTP expired"
            ) {
              swal({
                title: "OTP Expired",
                text: "This OTP has expired. Please try again.",
                icon: "error",
              }).then(() => {
                this.runNonVerifiedProcess();
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "Max limit reached for this otp verification"
            ) {
              swal({
                title: "Retries Exhausted",
                text: "Too many invalid attempts. Please try again later.",
                icon: "error",
              });
            } else if (
              res.data.type === "error" &&
              res.data.message === "Otp empty or not numeric"
            ) {
              swal({
                title: "Incorrect OTP",
                text: "Please try again with a valid OTP.",
                icon: "error",
              }).then(() => {
                this.showEnterOTP();
              });
            } else {
              swal({
                title: "Try Again",
                text: "Sorry something went wrong, please try again.",
                icon: "error",
              }).then(() => {
                this.runNonVerifiedProcess();
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.showEnterOTP();
      }
    });
  };

  runOTPProcess = () => {
    let count = sessionStorage.getItem("otpCount");
    if (count > 4) {
      swal({
        title: "No Resends Left",
        text: "You have reached max limit to send OTP requests. Please try again later.",
        icon: "error",
      });
      return;
    }
    const cloudRef = cloudFunction.httpsCallable(SEND_OTP_CLOUDFUNCTION);
    cloudRef(JSON.stringify({ uid: this.context.uid }))
      .then((res) => {
        console.log(res);
        count = count ? count + 1 : 1;
        sessionStorage.setItem("otpCount", count);
        this.showEnterOTP();
      })
      .catch((error) => {
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(error);
        console.log(code, message, details);
        swal({
          title: "Try Again",
          text: "Sorry something went wrong, please try again.",
          icon: "error",
        }).then(() => {
          this.runNonVerifiedProcess();
        });
      });
  };

  runNonVerifiedProcess = async () => {
    try {
      swal({
        title: "Verify Account",
        text: "Pleae verify your account using OTP to access the CiplaMedX platform.",
        icon: "info",
        closeOnClickOutside: false,
        buttons: {
          cancel: true,
          updateInfo: {
            text: "Update Mobile Number",
            closeModal: false,
          },
          SendOtp: {
            text: "Send OTP",
            closeModal: false,
          },
        },
      }).then((value) => {
        console.log(value);
        document.body.style.overflow = "auto";
        switch (value) {
          case "updateInfo":
            this.runUpdateInfoProcess();
            break;
          case "SendOtp":
            // this.showEnterOTP()
            this.runOTPProcess();
            break;
          default:
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  //function to open the videoPop
  openVideoPop = async (
    metadata,
    videoData,
    videosData,
    tagSelectedFrom,
    updateUrl = true
  ) => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    // console.log(metadata, videoData, videosData, tagSelectedFrom);
    //first check for verified user
    let isVerified = await this.context.isVerifiedUser();
    if (!isVerified) {
      this.runNonVerifiedProcess();
      return;
    }
    // let isVerifiedDoctor = await this.context.isVerifiedDoctor();
    // let count = parseInt(localStorage.getItem("doctorFormCount"));
    // count = count ? count + 1 : 1;
    // localStorage.setItem("doctorFormCount", count);

    // if (count >= 5 && !isVerifiedDoctor) {
    // this.setState({ doctorFormModalShow: true });
    // } else {
    //if user is verified play video
    this.closeVideoPop(metadata);
    setTimeout(() => {
      this.setState(
        {
          currentVideosData: videosData,
          videopopVisible: true,
          videoPopupData: { ...videoData, tagSelectedFrom },
          lastVideoMetadata: metadata,
        },
        () => {
          if (updateUrl) {
            const { history } = this.props;
            if (history)
              history.push(`/home/${videoData.id}?tag=${tagSelectedFrom}`);
          }
        }
      );
    }, 100);
    // }
  };

  closeVideoPop = (videoData) => {
    this.setState({
      currentVideosData: null,
      videopopVisible: false,
      videoPopupData: null,
      lastPlayed: videoData,
    });
  };

  componentDidMount() {
    console.log(this.context.userInfo);

    if (this.context.userInfo) {
    }

    firestore
      .collection(BACKSTAGE_COLLECTION)
      .doc(PLATFORM_BACKSTAGE_DOC)
      .onSnapshot((doc) => {
        if (!doc.exists) {
          console.log("backstagePlatform doc not exists");
        }
        const data = doc.data();
        localStorage.setItem("platformData", JSON.stringify(data));
        this.setState({
          platformData: data,
        });
        if (data.liveEventCTA) {
          if (data.liveEventCTA.active) {
            swal({
              title: data.liveEventCTA.title,
              text: data.liveEventCTA.message,
              icon: "info",
              button: data.liveEventCTA.buttonText,
            }).then(() => {
              const { history } = this.props;
              if (history) history.push(data.liveEventCTA.redirectTo);
            });
          }
        }
      });

    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > window.innerHeight ||
        document.documentElement.scrollTop > window.innerHeight
      ) {
        if (document.querySelector(".back_to_top")) {
          document.querySelector(".back_to_top").style.display = "flex";
        }
      } else {
        if (document.querySelector(".back_to_top")) {
          document.querySelector(".back_to_top").style.display = "none";
        }
      }
    });
  }
  scrollIntoViewHead = (head) => {
    head.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
    // window.scrollTo({ top: 0 });
  };
  doSearch = (searchText) => {
    this.props.history.push({
      pathname: "/search",
      search: `?keyword=${searchText}`,
    });
  };
  doctorFormModalClose = () => {
    this.setState({ doctorFormModalShow: false });
  };
  handleDoctorFormData = async (data) => {
    this.setState({ doctorFormData: data });
    let result = await DoctorManager.getDoctor(data);
    let finalResult = result.filter(
      (res) => res.institute === data.institute
      // res.institute.includes(data.institute)
    );
    let userName = this.context.user.displayName.toLowerCase();
    let name = finalResult.length === 1 && finalResult[0].name.toLowerCase();

    // in case of no result
    if (finalResult.length <= 0) {
      return this.setState({
        doctorError: "No Match Found",
        doctorResultLoading: false,
      });
    }
    this.setState({ doctorNameVerified: true, doctorResultLoading: false });
    this.context.updateVerifiedDoctor({ doctorVerified: true });

    // for name matching

    // let containsName = stringSimilarity.compareTwoStrings(name, userName);

    // if (containsName > 0.6) {
    //   this.setState({ doctorNameVerified: true, doctorResultLoading: false });
    //   this.context.updateVerifiedDoctor({ doctorVerified: true });
    // } else {
    //   this.setState({
    //     doctorError: "Registered name not matching",
    //     doctorNameVerified: false,
    //     doctorResultLoading: false,
    //   });
    // }
  };

  handleDoctorError = () => {
    this.setState({ doctorError: "" });
  };
  handledoctorResultLoading = (bool) => {
    this.setState({ doctorResultLoading: bool });
  };

  render() {
    return (
      // <section className="wrapper" id="root" style={{background: 'black'}}>
      <>
        {/* <DoctorFormModal
          show={this.state.doctorFormModalShow}
          onClose={this.doctorFormModalClose}
          handleSubmit={this.handleDoctorFormData}
          verified={this.state.doctorNameVerified}
          doctorError={this.state.doctorError}
          handleDoctorError={this.handleDoctorError}
          doctorResultLoading={this.doctorResultLoading}
          handledoctorResultLoading={this.handledoctorResultLoading}
        /> */}
        <div
          id="scrollable"
          style={{ position: "absolute", top: "0", height: 1, width: 1 }}
        ></div>
        <div className="scroll__btn" style={{}}>
          <div className="back_to_top" style={{ display: "none" }}>
            <img
              src={top}
              alt=""
              style={{ minWidth: "100%" }}
              onClick={() => {
                this.scrollIntoViewHead(document.getElementById("scrollable"));
              }}
            />
          </div>
          <Chatbot
            videoVisible={this.state.videopopVisible}
            history={this.props}
            videoData={this.state.videoPopupData}
          />
        </div>
        <div className="topicsBox__wrapper" id="homePageConatiner">
          <Header
            hideInviteFriend={true}
            whiteLogo={true}
            stickyOnScroll={true}
            showSearchBar={true}
            doSearch={this.doSearch}
          // scrollIntoView={scrollIntoViewHead}
          />
          <Banner />

          <div className="tabBox" id="homeVideoContainer">
            <div className="container" id="ottContent">
              <div
                style={{
                  zIndex: "1",
                  position: "absolute",
                  right: "0",
                  top: "0",
                  width: "7%",
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(to right, transparent , black)",
                }}
              ></div>
              <SearchBar
                doSearch={this.doSearch}
                initalSearchKeyword={""}
                sticky={false}
              />
              <TagsRow
                tags={this.state.tags}
                stickyOnScroll={true}
                onTagSelect={this.onTagSelect}
                activeTag={this.state.activeTag}
              />
              {this.state.activeTag !== "" && (
                <VideoRow
                  key={this.state.activeTag}
                  heading={`${this.state.activeTag.header}`}
                  lastPlayed={this.state.lastPlayed}
                  tag={this.state.activeTag.tag}
                  openVideoPop={this.openVideoPop}
                  grid={false}
                  multipleTags={this.state.activeTag.multipleTags}
                />
              )}
              <div className="contentBox" ref={this.contentBoXTop}>
                {RecommendedRow.map((row) => (
                  <VideoRow
                    key={row.tag}
                    heading={row.header}
                    lastPlayed={this.state.lastPlayed}
                    tag={row.tag}
                    openVideoPop={this.openVideoPop}
                    grid={false}
                    multipleTags={row.multipleTags}
                    systemTags
                    rowData={row}
                  />
                ))}

                {preDefinedRows.map((row) => (
                  <VideoRow
                    key={row.tag}
                    heading={row.header}
                    lastPlayed={this.state.lastPlayed}
                    tag={row.tag}
                    openVideoPop={this.openVideoPop}
                    grid={false}
                    multipleTags={row.multipleTags}
                    systemTags
                    rowData={row}
                  />
                ))}

                {this.state.rows.map((row) => (
                  <div key={row.header}>
                    {row.tag !== this.state.activeTag.tag && (
                      <VideoRow
                        key={row.tag}
                        heading={row.header}
                        lastPlayed={this.state.lastPlayed}
                        tag={row.tag}
                        openVideoPop={this.openVideoPop}
                        grid={false}
                        multipleTags={row.multipleTags}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Footer />
        </div>

        <Switch>
          <Route path={`/home/profile`}>
            {this.context.userInfo ? (
              <Myprofile />
            ) : (
              <div className="loaderContainer">
                <div className="lds-dual-ring"></div>
              </div>
            )}
          </Route>
          <Route path={`/home/:videoId`}>
            <HandleUrlParam
              openVideoPop={this.openVideoPop}
              videopopVisible={this.state.videopopVisible}
            >
              {!this.state.videopopVisible && (
                <div className="loaderContainer">
                  <div className="lds-dual-ring"></div>
                </div>
              )}
              {this.state.videopopVisible && (
                <VideoPopup
                  metadata={this.state.lastVideoMetadata}
                  videoData={this.state.videoPopupData}
                  currVideosData={this.state.currentVideosData}
                  closeVideoPop={(videoData) => {
                    this.closeVideoPop(videoData);
                    const { history } = this.props;
                    if (history) history.push(`/home`);
                  }}
                  openVideoPop={this.openVideoPop}
                />
              )}
            </HandleUrlParam>
          </Route>
          <Route exact path={`/home`}>
            <CheckState
              resetVideoPopup={() => {
                this.setState({
                  videopopVisible: false,
                });
              }}
              showIntersetSelection={() => {
                const { history } = this.props;
                if (history) history.push(INTEREST_ROUTE);
              }}
            />
          </Route>
        </Switch>
      </>
      // </section>
    );
  }
}

export default withRouter(Home);
Home.contextType = UserContext;

function CheckState(props) {
  const { resetVideoPopup, showIntersetSelection } = props;
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo && !userInfo.interests && showIntersetSelection) {
      // console.log(userInfo)
      showIntersetSelection();
    }
  }, [userInfo]);
  useEffect(() => {
    resetVideoPopup();
  }, []);
  return null;
}
