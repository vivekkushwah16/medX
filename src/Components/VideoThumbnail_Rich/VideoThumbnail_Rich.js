import React, { useContext, useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { VIDEO_CLICK } from "../../AppConstants/AnalyticsEventName";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { UserContext } from "../../Context/Auth/UserContextProvider";

const bandClassNames = [
  "",
  "contentBox__item-title--pink",
  "contentBox__item-title--orange",
];

const baseBandClass = "contentBox__item-title--";
const bandColor = {
  Respiratory: "",
  COPD: "contentBox__item-title--pink",
  Asthma: "",
  ["ILD/IPF"]: "contentBox__item-title--orange",
  ["Telemedicine"]: "contentBox__item-title--pink",
  ["Allergic Rhinitis"]: "contentBox__item-title--orange",
};

function VideoThumbnail_Rich(props) {
  const {
    videosData,
    videoInfo,
    openVideoPop,
    openDoctorForm,
    grid,
    refresh,
    tag,
  } = props;
  const [metadata, setMetadata] = useState(null);
  const { user, getVideoMetaData } = useContext(UserContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  const [bandClassName, setBandClassName] = useState(bandColor[tag]);

  useEffect(() => {
    getVideoMetaData(videoInfo.id).then((data) => {
      setMetadata(data);
      // setBandClassName(data.band ? baseBandClass + data.band : bandClassNames[Math.round(Math.random() * 3)])

      // console.log(data);
    });
  }, [videoInfo, refresh]);

  const getTagList = () => {
    let val = "";
    videoInfo.tags.map((tag, index) => {
      val += `${index > 0 ? ", " : ""}${tag}`;
    });
    return val;
  };

  const addAnalytics = () => {
    addGAWithUserInfo(VIDEO_CLICK, { tag: tag, videoId: videoInfo.id });
    addCAWithUserInfo(
      `/${VIDEO_CLICK}/${user.uid}_${videoInfo.id}`,
      false,
      { tag: tag, videoId: videoInfo.id },
      true
    );
  };

  const showDoctorFormhandle = () =>{
openDoctorForm(metadata, videoInfo, videosData, tag);
  }
  return (
    <div
      className={"col-25 col-md-50 col-sm-100"}
      style={!grid ? { width: "100%" } : {}}
    >
      <div
        className={
          isMobileOnly ? "contentBox__item w-20" : "contentBox__item w-25"
        }
        id={videoInfo.id}
        onClick={() => {
          addAnalytics();
          openVideoPop(metadata, videoInfo, videosData, tag);
          showDoctorFormhandle();
        }}
        style={{ backgroundImage: `url(${videoInfo.thumnailUrl})` }}
        // onClickCapture={() => {openVideoPop(videoInfo, videosData);handleOnItemClick()}}
      >
        {/* <img className="contentBox__item-pic" src={videoInfo.thumnailUrl} alt="" /> */}
        <a
          href=""
          style={{ pointerEvents: "none" }}
          className="contentBox__item-play"
        >
          <i className="icon-play"></i>
        </a>
        <a className={`contentBox__item-title ${bandClassName}`}>
          {videoInfo.title}
          <br></br>
          <span className="contentBox_tag">{getTagList()}</span>
          {/* <ul>
                        {videoInfo.tags.map(tag => (<li>{tag}</li>))}
                    </ul> */}
        </a>

        {/* <a class="contentBox__item-plus" href="#"><i class="icon-video-plus"></i></a>  */}

        {/* <div className="maincardBox__card-menu">
                    <button className="maincardBox__card-menu-btn"><i className="icon-dots"></i></button>
                    <ul className="maincardBox__card-menu-dropdown">
                        <li><a href="#">Watch This Video</a></li>
                        <li><a href="#">Not Interested</a></li>
                    </ul>
                </div> */}
        <div className="custom-slider">
          <div className="custom-slider__bar">
            <div
              className="custom-slider__bar-inner"
              style={{
                width: `${
                  metadata
                    ? (metadata.lastKnownTimestamp / metadata.duration) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoThumbnail_Rich;
