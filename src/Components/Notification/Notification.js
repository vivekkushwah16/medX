import React from "react";

export default function Notification(props) {
  const { data,
    //  handleClick
     } = props;

     const handleClick =(e,id,link)=>{
       e.preventDefault();
       let notificationArray = JSON.parse(localStorage.getItem("notifications"))
       && JSON.parse(localStorage.getItem("notifications"))
       if(notificationArray){
        let newObj =  notificationArray.filter((obj)=>obj.id===id)[0]
        var updatedArray = editObjectValue(notificationArray, newObj.id, false, true);
        localStorage.setItem("notifications", JSON.stringify(updatedArray));
       }
       window.location.href = link
     }


     const editObjectValue = (array,id, oldName, name) => {
      return array.map(item => {
          var temp = Object.assign({}, item);
          if (temp.id=== id && temp.opened === oldName) {
              temp.opened = name;
          }
          return temp;
      });
  }
    
  return (
    <div className="notification">
      <a className="notification__btn" href="#">
        <i className="icon-bell"></i>
        {data && data.length > 0 && (
          <div className="notification_indicator"></div>
        )}
      </a>
      <ul className="notification__dropdown">
        {data.map((notification, index) => (
          <li key={`${notification}_${index}`}>
            <a key={index} onClick={(e)=>handleClick(e,notification.id, notification.link)} href={notification.link}>
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
