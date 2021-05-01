import React from 'react'

export default function Notification(props) {
    const { data, handleClick } = props
    return (
        <div className="notification">
            <a className="notification__btn" href="#"><i className="icon-bell"></i>
                {/* <div className="notification_indicator"></div> */}
            </a>
            <ul className="notification__dropdown">
                {
                    data.map((notification, index) => (
                        <li>
                            <a key={index} onClick={handleClick} href="#">{notification}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
