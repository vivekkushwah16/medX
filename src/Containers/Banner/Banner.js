import React, { useContext, useEffect, useState } from "react";
import {
  UpcompingEventBanner,
  LiveEventBanner,
  ImageSingleButtonBanner,
  PromoVideoBanner,
  Custom1,
  Custom2,
  LiveEventBanner2,
  MainNewsBanner,
} from "../../Components/Banners";
import * as Scroll from "react-scroll";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHistory, useLocation } from "react-router-dom";
import { EVENT_ROUTE, RootRoute } from "../../AppConstants/Routes";
import { MediaModalContext } from "../../Context/MedialModal/MediaModalContextProvider";
import { MediaModalType } from "../../AppConstants/ModalType";
import { isIOS, isMobileOnly } from "react-device-detect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { firestore } from "../../Firebase/firebase";
import { BACKSTAGE_COLLECTION } from "../../AppConstants/CollectionConstants";
import {
  bronchtalkindia_autoLogIn,
  bronchtalkindia_autoRegistration,
  customScrollToId,
} from "../../utils";
import {
  UserBronchTalkMetaDataContext,
  UserContext,
} from "../../Context/Auth/UserContextProvider";
import { redirectClinet } from "../../utils/HandleUrlParam";
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
  NewsBanner: "newsBanner",
  Custom3: "Custom3",
  Custom1: "Custom1",
  Custom2: "Custom2",
};

const PriorityBannerData = [];

const BannerData = [
  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle:
  //     "Sign-up to join discussion with leading Urology experts",
  //   subTitle: ``,
  //   eventId: "cme250921",
  //   eventName: "cme250921",//url
  //   mainImageUrl: "",
  //   needCountDown: true,
  //   mainImageUrl:
  //     "https://storage.googleapis.com/cipla-impact.appspot.com/cme250921/1more-collateral.png",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {
  //     }
  //   },
  // },
  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle:
  //     "A two day state of the art scientific fest",
  //   subTitle: `Don’t miss out the interesting sessions from experts of paediatric medicine`,
  //   eventId: "ipaedia21",
  //   eventName: "ipaedia21",
  //   mainImageUrl: "",
  //   needCountDown: true,
  //   mainImageUrl:
  //     "https://storage.googleapis.com/cipla-impact.appspot.com/ipaedia21/ipaedia_banner.png",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {
  //     }
  //   },
  // },

  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle: `Benefits of Empagliflozin across the Heart Failure Spectrum`,
  //   subTitle: ``,
  //   eventId: "cme2910212",
  //   eventName: "cme2910212",
  //   needCountDown: false,
  //   mainImageUrl: "/assets/images/cipla29thOctoberr.jpg",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {},
  //   },
  // },
  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle: `Bilastine in Allergic Rhinitis: Current Concepts and Future Perspectives`,
  //   subTitle: ``,
  //   eventId: "cme291021",
  //   eventName: "cme291021",
  //   needCountDown: false,
  //   mainImageUrl: "/assets/images/cipla27thOct2.png",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {},
  //   },
  // },
  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle: `Urology Global Residents I-true Postgraduate program`,
  //   subTitle: ``,
  //   eventId: "cme301021",
  //   eventName: "cme301021",
  //   needCountDown: false,
  //   mainImageUrl: "/assets/images/cipla30Oct.jpg",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {},
  //   },
  // },
  // {
  //   type: BannerType.LiveEvent,
  //   mainTitle: `In Conversation with Experts on “Rare, but not so uncommon ILDs”`,
  //   subTitle: ``,
  //   eventId: "cme271021",
  //   eventName: "cme271021",
  //   needCountDown: false,
  //   mainImageUrl: "/assets/images/cipla27thOct.jpg",
  //   style: {
  //     bannerLeftStyle: {},
  //     bannerRightStyle: {
  //       position: "realtive",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       alignItems: "center",
  //     },
  //     bannerImageStyle: {},
  //   },
  // },
  {
    type: BannerType.NewsBanner,
    mainTitle: "Introducing",
    subTitle_line1: "ciplamedX | NEWS",
    subTitle_line2: "Get latest medical",
    subTitle_line3: "news and updates",
    buttonText: "Explore now",
    mainImageUrl: "/assets/images/banner/mainNewsBanner.jpeg",
    route: "news",
  },
  {
    type: BannerType.platformPromo,
    platformId: "BronchTalk",
    mainTitle:
      "An exclusive community of doctors analysing and studying Bronchiectasis",
    subTitle: `By the experts, for the experts`,
    mainImageUrl: "/assets/images/bronchlogo.png",
    style: {
      bannerLeftStyle: {},
      bannerRightStyle: {
        position: "realtive",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      bannerImageStyle: {
        maxWidth: "20rem",
      },
    },
  },
  {
    type: BannerType.Custom2,
    buttonText: "Watch Now",
    mainImageUrl: "/assets/images/Banner_07052021.jpg",
    logoImageUrl: "/assets/images/logoSessionLive.png",
    route: "ImpactSessions",
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
  //   type: BannerType.UpcompingEvent,
  //   mainTitle: "50+ Eminent Speakers",
  //   subTitle_line1: "Two days of engaging",
  //   subTitle_line2: "sessions",
  //   trailerUrl: "",
  //   calendarData: {},
  //   dateString: "9th & 10th April, 2021",
  //   mainImageUrl: "assets/images/logos/impact-logo.png",
  // },
];

function Banner() {
  const [banners, setBanners] = useState(BannerData);
  let history = useHistory();
  const { showMediaModal } = useContext(MediaModalContext);
  const userBronchTalkMetaDataContext = useContext(
    UserBronchTalkMetaDataContext
  );
  const userContext = useContext(UserContext);
  const [showloader, setShowLoader] = useState(false);
  let location = useLocation();

  const goToRoute = async (id) => {
    console.log(id);

    var thing = document.getElementById("bannerParentDiv");
    //   redirectClinet(history, location, '/home', [], [], "bannerParentDiv")
    // setTimeout(()=>{
    if (isIOS) {
      // history.push(`/home#${id}`)
      customScrollToId(id);
    } else {
      window.scroll(0, thing.scrollHeight - 200);
    }

    // },1)
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

  useEffect(() => {
    firestore
      .collection(BACKSTAGE_COLLECTION)
      .doc("banners")
      .onSnapshot((data) => {
        if (data.exists) {
          let newBannerData = data.data().bannersData;
          let prossedData = [];
          newBannerData.forEach((banner) => {
            if (!banner.isDisabled) prossedData.push(banner);
          });
          setBanners((prev) => [...prossedData, ...BannerData]);
        }
      });
  }, []);

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
    // responsive: [
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       arrows: false,
    //     },
    //   },
    // ],
  };

  const handlePlatformPromo = (id) => {
    switch (id) {
      case "BronchTalk": {
        const registerBT = () => {
          let userInfo = userContext.userInfo;
          let fullname = `${userInfo.firstName} ${
            userInfo.lastName ? userInfo.lastName : ""
          }`;
          let mobile = userInfo.phoneNumber;
          if (mobile.includes("+91")) {
            mobile = mobile.substr(3, mobile.length - 1);
          }
          let apiInput = {
            fullname,
            email: userInfo.email,
            mobile,
            state: userInfo.state,
            city: userInfo.city,
            specialty: userInfo.speciality,
          };
          console.log(apiInput);
          console.log("register");
          bronchtalkindia_autoRegistration(apiInput);
        };

        if (userBronchTalkMetaDataContext) {
          if (userBronchTalkMetaDataContext.password) {
            bronchtalkindia_autoLogIn({
              email: userBronchTalkMetaDataContext.email,
              pass: userBronchTalkMetaDataContext.password,
            });
          } else {
            registerBT();
          }
        } else {
          registerBT();
        }
      }
    }
  };
  return (
    <div
      className="bannerBox bannerBox--large"
      id="bannerParentDiv"
      style={{ position: "relative" }}
    >
      <Slider className="slider-banner-desktop" {...settings}>
        {banners
          .filter((res) =>
            userContext.showNewsbanner
              ? res
              : res.type !== BannerType.NewsBanner
          )
          .map((item, index) => (
            <div key={item.mainImageUrl}>
              {item.type === BannerType.LiveEvent && (
                <LiveEventBanner
                  data={item}
                  enterEvent={enterEvent}
                  needCountDown={item.needCountDown}
                />
              )}

              {item.type === BannerType.NewsBanner && (
                <MainNewsBanner data={item} />
              )}

              {item.type === BannerType.platformPromo && (
                <LiveEventBanner2
                  data={item}
                  enterEvent={handlePlatformPromo}
                />
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
            </div>
          ))}
      </Slider>

      {isMobileOnly && (
        <div className="arrow bounce">
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
