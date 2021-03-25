import React from 'react'

export default function Footer() {
    return (
        <footer class="footerBox" style={{zIndex: 5}}>
            <ul>
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
            </ul>
        </footer>
    )
}
