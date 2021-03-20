import React from 'react'

export default function Profile() {
    return (
        <div className="headerBox__profile">
            <a className="profile__user" href="#">
                <img src={'assets/images/user.png'} alt="" />
            </a>
            <ul className="profile__dropdown">
                {/* <li>
                    <a href="#">Profile</a>
                </li> */}
                <li>
                    <a href="#">Logout</a>
                </li>
            </ul>
        </div>
    )
}
