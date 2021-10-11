import React from "react";

export default function Notification(props) {
  const { data, handleClick } = props;
  return (
    <div className="notification">
      <a className="notification__btn" href="#">
        <i className="icon-bell"></i>
        {/* <div className="notification_indicator"></div> */}
      </a>
      <ul className="notification__dropdown">
        {data.map((notification, index) => (
          <li key={`${notification}_${index}`}>
            <a key={index} onClick={handleClick} href="#">
              <span className="notification__icon">
                <img src="/logo192.png" alt="" height="100%" width="100%" />
              </span>
              <span className="notification__data">
                <span className="notification__title">
                  {notification.title}
                </span>
                <br />
                <span className="notification__body">{notification.body}</span>
              </span>
            </a>

            {/* <a key={index} onClick={handleClick} href="#">
              {notification.title}
              {notification.body}
            </a> */}
          </li>
        ))}
        {!data ||
          (data.length === 0 && (
            <li>
              <a>No Notifications</a>
            </li>
          ))}
      </ul>
    </div>
  );
}
