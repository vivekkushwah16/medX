import React from 'react'

export default function Notification(props) {
    const { data } = props
    return (
        <div class="notification">
            <a class="notification__btn" href="#"><i class="icon-bell"></i></a>
            <ul class="notification__dropdown">
                {
                    data.map(notification => (
                        <li>
                            <a href="#">{notification}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
