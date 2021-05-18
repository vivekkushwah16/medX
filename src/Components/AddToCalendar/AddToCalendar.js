import React, { useEffect, useContext } from "react";
import AddToCalendarHOC from "react-add-to-calendar-hoc";
import addToCalendarBtn, { addToCalendarBlueBtn } from "./addToCalendarBtn";
import AddToCalendarDropDown from "./AddToCalendarDropDown";
import moment from "moment";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { ADDTOCALENDAR_ANALYTICS_EVENT } from "../../AppConstants/AnalyticsEventName";

export default function AddToCalendar(props) {
  const startDatetime = moment("2021-04-16 19:00:00").utc();
  const endDatetime = startDatetime.clone().add(2.5, "hours");
  const duration = endDatetime.diff(startDatetime, "hours");
  const event = {
    description:
      "Impact 21 - International Meet on Changing Paradigms in Chest Medicine",
    duration,
    endDatetime: endDatetime.format("YYYYMMDDTHHmmssZ"),
    location: "https://ciplamedx.com/register/impact",
    startDatetime: startDatetime.format("YYYYMMDDTHHmmssZ"),
    title: "Cipla Impact 21",
  };
  const AddToCalendarComp = props.blueBtn
    ? AddToCalendarHOC(addToCalendarBlueBtn, AddToCalendarDropDown)
    : AddToCalendarHOC(addToCalendarBtn, AddToCalendarDropDown);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  window.AddToCalendarAnalytic = (optionName = "") => {
    if (optionName === "") {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT, {
        eventId: "event-kmde59n5",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT,
        true,
        { eventId: "event-kmde59n5" },
        true
      );
    } else {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName, {
        eventId: "event-kmde59n5",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName,
        true,
        { eventId: "event-kmde59n5" },
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
