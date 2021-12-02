import React from "react";
import { SpeakerProfileType } from "../../../AppConstants/SpeakerProfileType";
import SpeakerProfile from "../../../Containers/SpeakerProfile.js/SpeakerProfile";

export default function About(props) {
  const { data } = props;
  return (
    <div id="tab1" className="eventBox__tabs-content active">
      {/* <h1 className="eventBox__title mg-b30">{data.title}</h1> */}
      {/* <h4 className="eventBox__subtitle mg-b40">200 LIVE Viewers</h4> */}
      {/* {
                data.description &&
                <p className="eventBox__desc mg-b40">
                    {data.description}
                    <br></br>
                </p>
            } */}

      {data.speakers && data.speakers.length > 0 && (
        <>
          {/* <h3 className="eventBox__small-title mg-b20">Know Your Faculty</h3> */}
          <div
            className="d-flex addChildMarginBt-10 "
            style={{ flexWrap: "wrap", justifyContent: "flex-start" }}
          >
            {data.speakers.map((id) => (
              <SpeakerProfile
                key={id}
                type={SpeakerProfileType.CARD_PROFILE}
                id={id}
                fromTitle={props.fromTitle}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
