import React, { useContext } from "react";
import { NOTIFICATION_INTERACTED } from "../../AppConstants/AnalyticsEventName";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import {
  addNewNotificationToIDB,
  updateNotification,
} from "../../utils/notificationsManager";

const CLICKED_NOTIFICATION_TABLE = "clicked_notification";

export default function Notification(props) {
  const {
    data,
    //  handleClick
  } = props;
  const { addGAWithUserInfo } = useContext(AnalyticsContext);

  const handleClick = (e, notification) => {
    if (!notification.opened) {
      let newData = { ...notification, opened: true };
      updateNotification(newData, (res) => {
        // console.log("clicked", res);
        addGAWithUserInfo(NOTIFICATION_INTERACTED, {
          msg_id: notification.id || notification.title,
          title: notification.title,
          topic: notification.topic,
        });
        addNewNotificationToIDB(CLICKED_NOTIFICATION_TABLE, newData, (res) => {
          console.log("updated new_notification-------------", res);
          window.location.href = notification.link
        });
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
                // href={notification.link}
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
