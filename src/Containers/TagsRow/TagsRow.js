import React, { useContext, useState, useRef, useMemo, useEffect } from "react";
import { TAG_CLICKED } from "../../AppConstants/AnalyticsEventName";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import Slider from "react-slick";
import "./TagsRow.css";

export default function TagsRow(props) {
  const { tags, onTagSelect, activeTag, stickyOnScroll } = props;
  const { user } = useContext(UserContext);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  const navBar = useRef(null);
  const [sticky, setSticky] = useState(false);

  const checkArrowHide = (props) => {
    let width = window.innerWidth;
    if (props.slideCount - props.currentSlide === 2 && width <= 360) {
      return "none";
    } else if (
      props.slideCount - props.currentSlide === 3 &&
      width > 360 &&
      width <= 414
    ) {
      return "none";
    } else if (
      props.slideCount - props.currentSlide === 5 &&
      width > 414 &&
      width <= 1024
    ) {
      return "none";
    } else if (
      props.slideCount - props.currentSlide === 6 &&
      width > 1024 &&
      width <= 1496
    ) {
      return "none";
    } else if (
      props.slideCount - props.currentSlide === 7 &&
      width > 1496 &&
      width <= 1600
    ) {
      return "none";
    } else if (props.slideCount - props.currentSlide === 8 && width > 1600) {
      return "none";
    }
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button
        style={{
          display: className.includes("slick-disabled")
            ? "none"
            : checkArrowHide(props),
            position: "relative",
        }}
        className={`slider-btn slider-btn-next `}
        onClick={onClick}
      >
        <div style={{width: "10rem",
            position: "absolute",
            left: "-7rem",
            height: "100%",}}>
          </div>
        <i className="icon-angle-right"></i>
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button
        style={{
          display: className.includes("slick-disabled") ? "none" : "block",
        }}
        className={`slider-btn slider-btn-prev`}
        onClick={onClick}
      >
        <i className="icon-angle-left"></i>
      </button>
    );
  }
  var settings = {
    dots: false,
    infinite: false,
    arrows: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    // slidesToShow: 1,
    variableWidth: true,
    slidesToScroll: 1,
    rows: 1,
  };

  const handleScroll = () => {
    try {
      if (yOffset > 0) {
        // console.log(window.pageYOffset >= yOffset, yOffset)
        // window.pageYOffset >= yOffset;
        if (window.pageYOffset >= window.innerHeight * 0.9) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    } catch (error) {
      // console.log(error)
    }
  };

  const calculateYoffset = () => {
    // console.log('navBar', navBar.current, stickyOnScroll)
    if (stickyOnScroll) {
      if (navBar.current) {
        window.addEventListener("scroll", handleScroll);
        // console.log(navBar.current.offsetTop)
        return navBar.current.offsetTop <= 0
          ? window.innerHeight + navBar.current.offsetTop - 100
          : navBar.current.offsetTop;
      }
    }
    return null;
  };
  const yOffset = useMemo(() => calculateYoffset(), [navBar.current]);

  useEffect(() => {
    return () => {
      if (yOffset) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const checkForActiveTag = (tag) => {
    if (activeTag.multipleTags) {
      return activeTag.currentTag === tag;
    } else {
      return activeTag.tag == tag;
    }
  };

  return (
    <ul
      ref={navBar}
      className={`tabBox__list ${sticky ? "tabBox__list_sticky" : ""}`}
    >
      {/* <li>Topics : </li> */}
      <Slider style={{ display: "flex" }} {...settings}>
        {tags.map((currTag) => (
          // <li><a className={activeTag.tag==currTag.tag?"tagDiv tagDivactive":"tagDiv"} onClick={()=>onTagSelect(currTag)}>{currTag.header}</a></li>
          <li key={currTag.header}>
            <a
              className={
                // checkForActiveTag(currTag.tag) ? "active mg-b20" : "mg-b20"
                checkForActiveTag(currTag.tag) ? "active" : ""
              }
              onClick={() => {
                addGAWithUserInfo(TAG_CLICKED, { tag: currTag.tag });
                addCAWithUserInfo(
                  `/${TAG_CLICKED}/${user.uid}_${currTag.tag}`,
                  false,
                  { tag: currTag.tag },
                  true
                );
                onTagSelect(currTag);
              }}
            >
              {currTag.header}
            </a>
          </li>
        ))}
      </Slider>
    </ul>
  );
}
