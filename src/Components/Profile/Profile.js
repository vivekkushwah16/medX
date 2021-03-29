import React, { useContext } from 'react'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { logout } from '../../Firebase/firebase'

const defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/djfarmademo.appspot.com/o/profileimages%2Fblank-avatar.png?alt=media&token=2af15226-9bd7-47ce-bc72-f3c1a12a0780";

export default function Profile() {
    const { userInfo } = useContext(UserContext)

    return (
        <div className="headerBox__profile">
            <a className="profile__user" href="#">
                <img src={defaultImageUrl} alt="" />
            </a>
            <ul className="profile__dropdown">
                <a href="#" className="profile__dropdown-profile">
                    <div className="profile__dropdown-profile-pic">
                        <img src={defaultImageUrl} alt="" />
                        {/* <i className="icon-crown"></i> */}
                    </div>
                    <div className="profile__dropdown-profile-text">
                        <p className="profile__dropdown-profile-title">{userInfo.firstName} {userInfo.lastName}</p>
                        <p className="profile__dropdown-profile-subtitle">{userInfo.profession}, {userInfo.speciality}</p>
                        <p className="profile__dropdown-profile-subtitle">{userInfo.phoneNumber}</p>
                    </div>
                </a>
                {/* <ul className="">
                    <li><a href="#">My Account</a></li>
                    <li><a href="#">Achievement</a></li>
                    <li><a href="#">Watchlist</a></li>
                    <li><a href="#">Community connections</a></li>
                </ul> */}
                <button className="btn btn-block btn-grey" onClick={logout}>Log out</button>
            </ul>
        </div >
    )
}
