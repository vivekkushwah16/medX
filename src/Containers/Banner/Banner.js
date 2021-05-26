import React, { useContext } from "react";
import {
  UpcompingEventBanner,
  LiveEventBanner,
  ImageSingleButtonBanner,
  PromoVideoBanner,
  Custom1,
  Custom2,
} from "../../Components/Banners";
import * as Scroll from "react-scroll";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHistory } from "react-router-dom";
import { EVENT_ROUTE, RootRoute } from "../../AppConstants/Routes";
import { MediaModalContext } from "../../Context/MedialModal/MediaModalContextProvider";
import { MediaModalType } from "../../AppConstants/ModalType";
import { isMobileOnly } from "react-device-detect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
let scroll = Scroll.animateScroll;
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

const BannerType = {
  LiveEvent: "liveEvent",
  ImageSingleButton: "imageSingleButton",
  UpcompingEvent: "upcompingEvent",
  PromoVideoBanner: "promoVideoBanner",
  Custom1: "Custom1",
  Custom2: "Custom2",
};

const BannerData = [
  {
    type: BannerType.LiveEvent,
    mainTitle: "Mucormycosis - What lies beneath",
    subTitle: "",
    eventId: "orient21-26may",
    mainImageUrl: "/assets/images/logos/impact-logo.png",
    // mainImageUrl: '/assets/images/logos/evolveLogo.png',
  },
  {
    type: BannerType.Custom2,
    buttonText: "Watch Now",
    mainImageUrl: "/assets/images/Banner_07052021.jpg",
    logoImageUrl: "/assets/images/logoSessionLive.png",
    route: "Impact Sessions",
  },
  {
    type: BannerType.Custom1,
    mainTitle: "EXPERT VIEWS",
    subTitle_line1: "Watch Anywhere,",
    subTitle_line2: "Watch Anytime",
    // trailerUrl: '',
    buttonText: "Start Watching",
    mainImageUrl: "assets/images/AdobeStock_369176443.jpeg",
    // speakerId: 'speaker-kmfz0vco',
    route: "ottContent",
  },
  {
    type: BannerType.PromoVideoBanner,
    subTitle_line1: "Concepts of ",
    mainTitle: "Respiratory Sounds",
    // subTitle_line2: 'resistant TB',
    videoUrl: "https://player.vimeo.com/video/536652520",
    buttonText: "Watch Now",
    mainImageUrl: "/assets/images/AdobeStock_205914003.jpeg",
    // speakerId: 'speaker-kmfz0vco',
    // eventId: 'event-kmde59n5'
  },
  // {
  //     type: BannerType.UpcompingEvent,
  //     mainTitle: '50+ Eminent Speakers',
  //     subTitle_line1: 'Two days of engaging',
  //     subTitle_line2: 'sessions',
  //     trailerUrl: '',
  //     calendarData: {},
  //     dateString: '9th & 10th April, 2021',
  //     mainImageUrl: 'assets/images/logos/impact-logo.png',
  // }
];

function Banner() {
  let history = useHistory();
  const { showMediaModal } = useContext(MediaModalContext);

  const goToRoute = async (id) => {
    // console.log(id);

    var thing = document.getElementById("bannerParentDiv");
    window.scrollTo(0, thing.scrollHeight - 200);
    // let a =Scroll.Link;

    // console.log(thing.scrollHeight);
    // console.log(document.body.clientHeight);
    //thing.scrollTop = 0;//document.body.scrollHeight*2; //- document.body.clientHeight;
    // .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    // window.open('/#ottContent', '_self');
    // history.push(`/#homeVideoContainer`);
  };
  const enterEvent = (eventId) => {
    history.push(`/${eventId}`);
  };
  const watchVideo = (videoUrl) => {
    //open video
    showMediaModal(MediaModalType.Videos, videoUrl);
  };
  const watchTrailer = (videoUrl) => {
    //open video
    showMediaModal(
      MediaModalType.Videos,
      "https://player.vimeo.com/video/528854507"
    );
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 300,
    arrows: true,
    slidesToShow: 1,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    autoplay: true,
    autoplaySpeed: 10000,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div
      className="bannerBox bannerBox--large"
      id="bannerParentDiv"
      style={{ position: "relative" }}
    >
      <Slider className="slider-banner-desktop" {...settings}>
        {BannerData.map((item) => (
          <>
            {item.type === BannerType.LiveEvent && (
              <LiveEventBanner data={item} enterEvent={enterEvent} />
            )}
            {item.type === BannerType.ImageSingleButton && (
              <ImageSingleButtonBanner
                data={item}
                watchTrailer={watchTrailer}
              />
            )}
            {item.type === BannerType.PromoVideoBanner && (
              <PromoVideoBanner data={item} watchVideo={watchVideo} />
            )}
            {item.type === BannerType.UpcompingEvent && (
              <UpcompingEventBanner data={item} watchTrailer={watchTrailer} />
            )}
            {item.type === BannerType.Custom1 && (
              <Custom1 data={item} goToRoute={goToRoute} />
            )}
            {item.type === BannerType.Custom2 && (
              <Custom2 data={item} goToRoute={goToRoute} />
            )}
          </>
        ))}
      </Slider>
      {isMobileOnly && (
        <div class="arrow bounce">
          {/* <i className="icon-play whiteColor"></i> */}
          <FontAwesomeIcon
            icon={faAngleDown}
            className="whiteColor"
            onClick={goToRoute}
          ></FontAwesomeIcon>
          {/* <a class="fa fa-arrow-down fa-2x" onClick={goToRoute} href="#"></a> */}
        </div>
      )}
    </div>
  );
}

export default Banner;
