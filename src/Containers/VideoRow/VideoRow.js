import React, { useEffect, useState, useCallback, useContext, useRef } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoThumbnail_Rich from "../../Components/VideoThumbnail_Rich/VideoThumbnail_Rich";
import VideoManager from "../../Managers/VideoManager";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import TagsRow from "../TagsRow/TagsRow";
import { isMobileOnly } from "react-device-detect";
import { GET_SIMPLE_RECOMMENDATION } from "../../AppConstants/CloudFunctionName";
import { cloudFunction } from "../../Firebase/firebase";

const checkArrowHide = (props) => {
  let width = window.innerWidth;
  if (props.slideCount - props.currentSlide === 4 && width > 1700) {
    return "none";
  } else if (
    props.slideCount - props.currentSlide === 3 &&
    width > 850 &&
    width <= 1700
  ) {
    return "none";
  } else if (props.slideCount - props.currentSlide === 2 && width <= 820) {
    return "none";
  }
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`slider-btn slider-btn-next  ${
        // className.includes("slick-disabled")
        //   ? "slick-disabled"
        //   // : props.slideCount < 3
        //   // ? "slick-disabled"
        //   : ""
        ""
        }`}
      style={{
        display: className.includes("slick-disabled")
          ? "none"
          : checkArrowHide(props),
        justifyContent: "flex-end",
        width: "5vw",
      }}
      onClick={onClick}
    >
      <i
        style={{ fontWeight: 900, textShadow: "0 0 10px white" }}
        className="icon-angle-right"
      ></i>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`slider-btn slider-btn-prev ${className.includes("slick-disabled") ? "slick-disabled" : ""
        }`}
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        width: "5vw",
      }}
    >
      <i
        style={{ fontWeight: 900, textShadow: "0 0 10px white" }}
        className="icon-angle-left"
      ></i>
    </button>
  );
}

function VideoRow(props) {
  const { heading, tag, lastPlayed, openVideoPop, grid, multipleTags, systemTags, rowData } = props;
  const [videosData, setData] = useState(null);
  const { userInfo } = useContext(UserContext);
  const isGetSystemTagCalled = useRef(false)

  useEffect(() => {
    if (systemTags) {
      getSystemTags()
    } else {
      if (multipleTags) {
        getVideosFromMultipleTags()
      } else {
        getVideos()
      }
    }
  }, [tag])

  // useEffect(() => {
  //   if (systemTags && "RecommendedVideos" === rowData.tag) {
  //     if (userInfo.interests && !isGetSystemTagCalled.current) {
  //       console.log("Recommendataion called")
  //       getSystemTags()
  //     }
  //   }

  // }, [userInfo, tag, systemTags])

  const getVideosFromMultipleTags = async () => {
    let arr = [];
    for (let i = 0; i < tag.length; i++) {
      let a = await VideoManager.getVideoWithTag([tag[i]]);
      arr = [...arr, ...a]
    }
    setData(arr);
  }

  const getVideos = async () => {
    // console.log([tag])
    const arr = await VideoManager.getVideoWithTag([tag]);
    // console.log(arr);
    setData(arr);
  }

  const getSystemTags = useCallback(
    async () => {
      isGetSystemTagCalled.current = true
      let startTime = new Date()
      // console.log(startTime)
      if (rowData && rowData.videoFetchFunction) {
        let arr = []
        if (rowData.fetchParameters) {
          arr = await rowData.videoFetchFunction(rowData.fetchParameters)
        } else if ("RecommendedVideos" === rowData.tag) {

          const getRecommendation = cloudFunction.httpsCallable(
            GET_SIMPLE_RECOMMENDATION
          );
          // console.log("called")
          // console.log(new Date())
          getRecommendation().then(res => {
            if (res.data.status === "done") {
              // console.log(res.data)
              // console.log("ourtime:", (new Date().getTime() - startTime.getTime()) / 1000)
              // console.log(new Date())
              setData(res.data.videos);
            }
          }).catch(err => {
            console.log(err)
          })
          return
        } else {
          arr = await rowData.videoFetchFunction()
        }
        setData(arr);
      }
    }, [rowData, userInfo]
  )


  var settings = {
    dots: false,
    infinite: false,
    speed: 300,
    rows: 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    className: "slider-video",
    // responsive: [
    //     {
    //         breakpoint: 1024,
    //         settings: {
    //             slidesToShow: 3,
    //             slidesToScroll: 3,
    //         }
    //     },
    //     {
    //         breakpoint: 600,
    //         settings: {
    //             slidesToShow: 2,
    //             slidesToScroll: 2
    //         }
    //     },
    //     {
    //         breakpoint: 480,
    //         settings: {
    //             slidesToShow: 1.5,
    //             slidesToScroll: 1.5
    //         }
    //     }
    // ]
  };
  let _lastPlayed = lastPlayed
  if (!lastPlayed) {
    _lastPlayed = { id: -1 }
  }
  return (
    <>
      {videosData ? (
        <>
          <h2 className="contentBox__title mg-b5 " id={tag}>
            {heading}
          </h2>
          {grid ? (
            <div className="contentBox__item-wrapper row">
              {videosData.map((vd) => (
                <div key={vd}>
                  {vd && (
                    // vd.id == _lastPlayed.id &&
                    <VideoThumbnail_Rich
                      videoInfo={vd}
                      videosData={videosData}
                      openVideoPop={openVideoPop}
                      grid={grid}
                      refresh={
                        _lastPlayed && vd.id == _lastPlayed.id
                          ? Math.random()
                          : ""
                      }
                      tag={tag}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Slider {...settings}>
              {videosData.map((vd) => (
                <div key={vd}>
                  <VideoThumbnail_Rich
                    videoInfo={vd}
                    videosData={videosData}
                    openVideoPop={openVideoPop}
                    grid={grid}
                    refresh={
                      _lastPlayed && vd.id == _lastPlayed.id
                        ? Math.random()
                        : ""
                    }
                    tag={tag}
                  />
                </div>
              ))}
            </Slider>
          )}
        </>
      ) : (
        <></>
      )
      }
    </>
  );
}

export default VideoRow;
