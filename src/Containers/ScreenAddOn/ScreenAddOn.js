import React, {
    Component,
    useContext,
    useEffect,
    useMemo,
} from "react";
import VideoPopup from "../../Containers/VideoPopup/VideoPopup";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import {
    cloudFunction,
    logout,
} from "../../Firebase/firebase";
import swal from "sweetalert";
import {
    Route,
    Switch,
    useHistory,
    useLocation,
    useParams,
    withRouter,
} from "react-router-dom";
import {
    SEND_OTP_CLOUDFUNCTION,
    UPDATE_MOBILENUMBER_CLOUDFUNCTION,
    VERIFY_OTP_COLUDFUNCTION,
} from "../../AppConstants/CloudFunctionName";
import VideoManager from "../../Managers/VideoManager";
import Myprofile from "../../Containers/myProfile/Myprofile";

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
            history.push(getRetrunURL(BASEURL));
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
            history.push(getRetrunURL(BASEURL));
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
let BASEURL = "/search"
class ScreenAddOn extends Component {
    BASEURL = window.location.pathname
    state = {
        data: null,
        videopopVisible: false,
        videoPopId: null,
        currentVideosData: null,
        lastPlayed: null,
        lastVideoMetadata: null,
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
                        if (history) {
                            let returnUrl = window.location.search
                            if (returnUrl) {
                                returnUrl = returnUrl.substring(1, returnUrl.length)
                                let pushURl = `${BASEURL}/${videoData.id}?tag=${tagSelectedFrom}&return=${encodeURIComponent(returnUrl)}`
                                console.log(pushURl)
                                history.push(pushURl);
                            } else {
                                history.push(`${BASEURL}/${videoData.id}?tag=${tagSelectedFrom}`);
                            }
                        }
                    }
                }
            );
        }, 100);
    };

    closeVideoPop = (videoData) => {
        this.setState({
            currentVideosData: null,
            videopopVisible: false,
            videoPopupData: null,
            lastPlayed: videoData,
        });
    };

    render() {
        return (
            <>
                <Switch>
                    <Route path={`${BASEURL}/profile`}>
                        {this.context.userInfo ? (
                            <Myprofile />
                        ) : (
                            <div className="loaderContainer">
                                <div className="lds-dual-ring"></div>
                            </div>
                        )}
                    </Route>
                    <Route path={`${BASEURL}/:videoId`}>
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
                                        if (history) history.push(getRetrunURL(BASEURL));
                                    }}
                                    openVideoPop={this.openVideoPop}
                                />
                            )}
                        </HandleUrlParam>
                    </Route>
                    <Route exact path={`${BASEURL}`}>
                        <CheckState
                            resetVideoPopup={() => {
                                this.setState({
                                    videopopVisible: false,
                                });
                            }}
                        />
                    </Route>
                </Switch>
            </>
            // </section>
        );
    }
}

export default withRouter(ScreenAddOn);
ScreenAddOn.contextType = UserContext;

function CheckState(props) {
    const { resetVideoPopup } = props;
    useEffect(() => {
        resetVideoPopup();
    }, []);
    return null;
}


function getRetrunURL(baseUrl) {
    let returnPath = `${baseUrl}`
    if (window.location.search) {
        let urlQuery = new URLSearchParams(window.location.search);
        let _return = decodeURIComponent(urlQuery.get("return"));
        if (_return) {
            returnPath += `?${_return}`
        }
    }
    return returnPath
}