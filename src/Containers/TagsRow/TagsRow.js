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

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button className="slider-btn slider-btn-next" onClick={onClick}>
        <i className="icon-angle-right"></i>
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button className="slider-btn slider-btn-prev" onClick={onClick}>
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
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1334,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleScroll = () => {
    try {
      if (yOffset > 0) {
        // console.log(window.pageYOffset >= yOffset, yOffset)
        if (window.pageYOffset >= yOffset) {
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
        return navBar.current.offsetTop < 0
          ? window.innerHeight + navBar.current.offsetTop + 100
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
                checkForActiveTag(currTag.tag) && "active"
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
