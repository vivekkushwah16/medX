import React, { useEffect, useContext } from "react";
import AddToCalendarHOC from "react-add-to-calendar-hoc";
import addToCalendarBtn, { addToCalendarBlueBtn } from "./addToCalendarBtn";
import AddToCalendarDropDown from "./AddToCalendarDropDown";
import moment from "moment";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { ADDTOCALENDAR_ANALYTICS_EVENT } from "../../AppConstants/AnalyticsEventName";

export default function AddToCalendar(props) {
  const { calendatDetails, eventId, eventData } = props
  const startDatetime = moment(calendatDetails ? calendatDetails.startTime : "2021-06-05 17:00:00").utc();
  const endDatetime = startDatetime.clone().add((calendatDetails ? calendatDetails.duration : 1), "hours");
  const duration = endDatetime.diff(startDatetime, "hours");
  const event = {
    description:
      calendatDetails ? calendatDetails.description : "",
    duration,
    endDatetime: endDatetime.format("YYYYMMDDTHHmmssZ"),
    location: `https://ciplamedx.com/${eventData.eventName}/register`,
    startDatetime: startDatetime.format("YYYYMMDDTHHmmssZ"),
    title: calendatDetails ? calendatDetails.title : eventId,
  };
  const AddToCalendarComp = props.blueBtn
    ? AddToCalendarHOC(addToCalendarBlueBtn, AddToCalendarDropDown)
    : AddToCalendarHOC(addToCalendarBtn, AddToCalendarDropDown);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  window.AddToCalendarAnalytic = (optionName = "") => {
    if (optionName === "") {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT, {
        eventId: eventId,
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT,
        true,
        { eventId: eventId },
        true
      );
    } else {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName, {
        eventId: eventId,
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName,
        true,
        { eventId: eventId },
        true
      );
    }
  };

  return (
    <AddToCalendarComp
      className="addToCalendar mg-b30"
      linkProps={{
        className: "linkStyles",
      }}
      event={event}
    />
  );
}
