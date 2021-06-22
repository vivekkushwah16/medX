import React from 'react'
import { Link } from 'react-router-dom'
import { RootRoute } from '../../AppConstants/Routes'
import CIPLAMEDXLOGO_WHITE from '../../assets/images/ciplamed-logo2.png'

export default function AuthPageStaticSide() {
    return (
        <>
            <div className="login2Box__Simple_Left" >
                <Link to={RootRoute} className={"headerBox__logo5"}>
                    <img src={CIPLAMEDXLOGO_WHITE} alt="CIPLAMEDXLOGO" />
                </Link>
                <div className="loginBox__Simple_label">
                    <b>Expert Views</b>  <br></br>
                Watch Anywhere, Watch Anytime
            </div>


            </div>
        </>
    )
}
