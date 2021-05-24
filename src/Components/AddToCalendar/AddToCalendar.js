import React, { useEffect, useContext } from "react";
import AddToCalendarHOC from "react-add-to-calendar-hoc";
import addToCalendarBtn, { addToCalendarBlueBtn } from "./addToCalendarBtn";
import AddToCalendarDropDown from "./AddToCalendarDropDown";
import moment from "moment";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { ADDTOCALENDAR_ANALYTICS_EVENT } from "../../AppConstants/AnalyticsEventName";

export default function AddToCalendar(props) {
  const startDatetime = moment("2021-05-26 19:00:00").utc();
  const endDatetime = startDatetime.clone().add(1, "hours");
  const duration = endDatetime.diff(startDatetime, "hours");
  const event = {
    description: "Orient '21 - Mucormycosis- What lies beneath",
    duration,
    endDatetime: endDatetime.format("YYYYMMDDTHHmmssZ"),
    location: "https://ciplamedx.com/orient21-26may/register",
    startDatetime: startDatetime.format("YYYYMMDDTHHmmssZ"),
    title: "Orient '21 on CiplaMedX",
  };
  const AddToCalendarComp = props.blueBtn
    ? AddToCalendarHOC(addToCalendarBlueBtn, AddToCalendarDropDown)
    : AddToCalendarHOC(addToCalendarBtn, AddToCalendarDropDown);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  window.AddToCalendarAnalytic = (optionName = "") => {
    if (optionName === "") {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT, {
        eventId: "orient21-26may",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT,
        true,
        { eventId: "orient21-26may" },
        true
      );
    } else {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName, {
        eventId: "orient21-26may",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName,
        true,
        { eventId: "orient21-26may" },
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
