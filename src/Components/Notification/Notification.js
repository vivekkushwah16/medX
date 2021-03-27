import React from 'react'

export default function Notification(props) {
    const { data } = props
    return (
        <div className="notification">
            <a className="notification__btn" href="#"><i className="icon-bell"></i></a>
            <ul className="notification__dropdown">
                {
                    data.map((notification, index) => (
                        <li>
                            <a key={index} href="#">{notification}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
