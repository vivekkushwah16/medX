import React, { useContext, useEffect, useState } from "react";
import { SPEAKER_PROFILE_CLICK_EVENT } from "../../AppConstants/AnalyticsEventName";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { UserContext } from "../../Context/Auth/UserContextProvider";

export function BannerSpeaker(props) {
  const { profile } = props;
  return (
    <div className="bannerBox__profile mg-b50">
      <img className="bannerBox__profile-pic" src={profile.photoURL} alt="" />
      <div className="bannerBox__profile-text">
        <p className="bannerBox__profile-title">{profile.name}</p>
        <p className="bannerBox__profile-subtitle">{profile.designation}</p>
      </div>
    </div>
  );
}

const FACEBOOKLink = "https://www.facebook.com/";
const TWITTERLink = "https://twitter.com/";
const LINKEDINLink = "https://www.linkedin.com/";

export function CardSpeaker(props) {
  const { profile } = props;
  const [isProfileActive, setIsProfileActive] = useState(false);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);
  const { user } = useContext(UserContext);

  const openSocialLink = (link) => {
    window.open(link, "_Blank");
  };

  useEffect(() => {
    var elems = document.querySelectorAll(".maincardBox__card-profile");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active");
    });
    if (isProfileActive) {
      document.getElementById(profile.id).classList.add("active");
    }
  }, [isProfileActive]);
  return (
    <div
      key={`${profile.id}-profile`}
      id={`${props.fromTitle ? "" : profile.id}`}
      className={`maincardBox__card-profile`}
      style={{ marginRight: "2rem" }}
    >
      {/* ${isProfileActive ? 'active' : ''}`} > */}
      {isProfileActive && (
        <div
          className="maincardBox__card-profile-popover-closeConatiner"
          style={{
            // background: 'red',
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsProfileActive(false);
          }}
        ></div>
      )}
      <div className={`maincardBox__card-profile-popover`}>
        <a
          href="#"
          className="maincardBox__card-profile-popover-close"
          onClick={(e) => {
            e.preventDefault();
            setIsProfileActive(false);
          }}
        >
          <i className="icon-close"></i>
        </a>
        <div className="maincardBox__card-profile-popover-pic">
          <img src={profile.photoURL} alt="" />
        </div>
        <div className="maincardBox__card-profile-popover-text">
          <h3 className="maincardBox__card-profile-popover-title">
            {profile.name}
          </h3>
          <ul className="maincardBox__card-profile-popover-desc">
            {profile.profileLine.length > 0 ? (
              profile.profileLine.map((line, index) => (
                <li key={`underline-${profile.id}-${index}`}> {line}</li>
              ))
            ) : (
              <></>
            )}
          </ul>

          {/* <div className="social-media">
                        <a href={profile.social.facebook ? profile.social.facebook : FACEBOOKLink} target="_Blank">  <img src="assets/images/facebook.png" width="75" alt=""
                        //   onClick={() => openSocialLink(profile.social.facebook ? profile.social.facebook : FACEBOOKLink)} 
                        /></a>
                        <a href={profile.social.twitter ? profile.social.twitter : TWITTERLink} target="_Blank">
                            <img src="assets/images/twitter.png" width="75" alt=""
                            // onClick={() => openSocialLink(profile.social.twitter ? profile.social.twitter : TWITTERLink)} 
                            /></a>

                        <a href={profile.social.linkedIn ? profile.social.linkedIn : LINKEDINLink} target="_Blank">
                            <img src="assets/images/linkedIn.png" width="75" alt=""
                            // onClick={() => openSocialLink(profile.social.linkedIn ? profile.social.linkedIn : LINKEDINLink)} 
                            />
                        </a>

                    </div> */}
        </div>
      </div>
      <img
        className="maincardBox__card-profile-pic"
        src={profile.photoURL}
        alt=""
        onClick={() => {
          setIsProfileActive(true);
        }}
      />
      <div
        className="maincardBox__card-profile-text"
        onClick={() => {
          setIsProfileActive(true);
          if (user) {
            addGAWithUserInfo(SPEAKER_PROFILE_CLICK_EVENT, { id: profile.id });
            addCAWithUserInfo(
              `/${SPEAKER_PROFILE_CLICK_EVENT}/${user.uid}_${profile.id}`,
              false,
              { id: profile.id },
              true
            );
          }
        }}
      >
        <p
          className="maincardBox__card-profile-title"
          style={{ textDecoration: "none" }}
        >
          {profile.name}
        </p>
        <p
          className="maincardBox__card-profile-subtitle"
          // style={{color:'#ffffff96'}}
        >
          {profile.designation}
        </p>
      </div>
    </div>
  );
}
