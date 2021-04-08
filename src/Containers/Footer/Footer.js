import React from 'react'
import './footer.css'

export default function Footer() {
    return (
        <footer class="footerBox" style={{ zIndex: 5 }}>
            {/* <div className="">
                <img src="/assets/images/ciplamed-logo2.png"></img>
                <div>

                </div>
            </div> */}
            <div className="copyright">
                © Copyright 2021 -- All rights reserved
            </div>
            {/* <ul>
                <li class="active"><a href="#">
                    <i class="icon-home"></i>
                   Home</a>
                </li>
                <li><a href="#">
                    <i class="icon-search"></i>
                    Search</a>
                </li>
                <li><a href="#">
                    <i class="icon-bell"></i>
                    Notification</a>
                </li>
                <li><a href="#">
                    <i class="icon-profile"></i>
                    Profile</a>
                </li>
            </ul> */}
        </footer>
    )
}
