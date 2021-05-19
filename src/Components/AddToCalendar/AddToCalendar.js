import React, { useEffect, useContext } from "react";
import AddToCalendarHOC from "react-add-to-calendar-hoc";
import addToCalendarBtn, { addToCalendarBlueBtn } from "./addToCalendarBtn";
import AddToCalendarDropDown from "./AddToCalendarDropDown";
import moment from "moment";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { ADDTOCALENDAR_ANALYTICS_EVENT } from "../../AppConstants/AnalyticsEventName";

export default function AddToCalendar(props) {
  const startDatetime = moment("2021-05-23 18:00:00").utc();
  const endDatetime = startDatetime.clone().add(3.75, "hours");
  const duration = endDatetime.diff(startDatetime, "hours");
  const event = {
    description:
      "Evolve '21 - Tune In to Explore Newer Paradigms in Respiratory Medicine.",
    duration,
    endDatetime: endDatetime.format("YYYYMMDDTHHmmssZ"),
    location: "https://ciplamedx.com/evolve/register",
    startDatetime: startDatetime.format("YYYYMMDDTHHmmssZ"),
    title: "Evolve '21 on CiplaMedX",
  };
  const AddToCalendarComp = props.blueBtn
    ? AddToCalendarHOC(addToCalendarBlueBtn, AddToCalendarDropDown)
    : AddToCalendarHOC(addToCalendarBtn, AddToCalendarDropDown);
  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  window.AddToCalendarAnalytic = (optionName = "") => {
    if (optionName === "") {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT, {
        eventId: "evolve",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT,
        true,
        { eventId: "evolve" },
        true
      );
    } else {
      addGAWithUserInfo(ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName, {
        eventId: "evolve",
      });
      addCAWithUserInfo(
        ADDTOCALENDAR_ANALYTICS_EVENT + "_" + optionName,
        true,
        { eventId: "evolve" },
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
