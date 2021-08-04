import React, { useContext } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { logout } from "../../Firebase/firebase";
import verified from "../../assets/images/UI/verified.png";
import verifiedDoctor from "../../assets/images/UI/verifiedDoctor.png";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { INTEREST_ROUTE } from "../../AppConstants/Routes";

const defaultImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/djfarmademo.appspot.com/o/profileimages%2Fblank-avatar.png?alt=media&token=2af15226-9bd7-47ce-bc72-f3c1a12a0780";

export default function Profile() {
  const { userInfo, isVerifiedUser } = useContext(UserContext);
  const { url } = useRouteMatch();
  const history = useHistory();
  return (
    <div className="headerBox__profile">
      <a className="profile__user" href="#">
        {`${userInfo.firstName ? userInfo.firstName[0].toUpperCase() : ""}${
          userInfo.lastName ? userInfo.lastName[0].toUpperCase() : ""
        } `}
        {userInfo.doctorVerified ? (
          <img className="profile_verified_badge" src={verifiedDoctor} alt="" />
        ) : userInfo.verified ? (
          <img className="profile_verified_badge" src={verified} alt="" />
        ) : (
          ""
        )}
        {/* {userInfo.verified && (
          <img className="profile_verified_badge" src={verified} alt="" />
        )} */}
      </a>
      <ul className="profile__dropdown">
        <a href="#" className="profile__dropdown-profile">
          <div className="profile__dropdown-profile-pic">
            {`${userInfo.firstName ? userInfo.firstName[0].toUpperCase() : ""}${
              userInfo.lastName ? userInfo.lastName[0].toUpperCase() : ""
            } `}

            {/* <img src={defaultImageUrl} alt="" /> */}
            {/* <i className="icon-crown"></i> */}
          </div>
          <div className="profile__dropdown-profile-text">
            <p className="profile__dropdown-profile-title">
              {userInfo.firstName} {userInfo.lastName}
            </p>
            <p className="profile__dropdown-profile-subtitle">
              {userInfo.profession}, {userInfo.speciality}
            </p>
            <p className="profile__dropdown-profile-subtitle">
              {userInfo.phoneNumber}
            </p>
          </div>
        </a>
        <ul className="">
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                if (history) history.push(`${url}/profile`);
              }}
            >
              My Profile
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                if (history) history.push(INTEREST_ROUTE);
              }}
            >
              My Interest
            </a>
          </li>
          {/* <li>
            <a href="#">Achievement</a>
          </li>
          <li>
            <a href="#">Watchlist</a>
          </li>
          <li>
            <a href="#">Community connections</a>
          </li> */}
        </ul>
        <button className="btn btn-block btn-grey" onClick={logout}>
          Log out
        </button>
      </ul>
    </div>
  );
}
