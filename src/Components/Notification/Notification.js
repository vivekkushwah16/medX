import React from "react";
import { updateNotification } from "../../utils/notificationsManager";

export default function Notification(props) {
  const {
    data,
    //  handleClick
  } = props;

  const handleClick = (e, notification) => {
    if (!notification.opened) {
      let newData = { ...notification, opened: true };
      updateNotification(newData, (res) => {
        // console.log("clicked", res);
      });
    }
  };

  return (
    <div className="notification">
      <a className="notification__btn" href="#">
        <i className="icon-bell"></i>
        {data && data.length > 0 && (
          <div className="notification_indicator"></div>
        )}
      </a>
      <ul className="notification__dropdown">
        {data &&
          data.map((notification, index) => (
            <li
              key={`${notification}_${index}`}
              style={{ background: notification.opened && "rgba(0,0,0,0.1)" }}
            >
              <a
                key={index}
                onClick={(e) => handleClick(e, notification)}
                href={notification.link}
              >
                <span className="notification__icon">
                  <img
                    src={notification.icon}
                    alt=""
                    height="100%"
                    width="100%"
                  />
                </span>
                <span className="notification__data">
                  <span className="notification__title">
                    {`${notification.title.substring(0, 30)}`}
                  </span>
                  <br />
                  <span className="notification__body">{`${notification.body.substring(
                    0,
                    30
                  )}`}</span>
                </span>
              </a>
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
