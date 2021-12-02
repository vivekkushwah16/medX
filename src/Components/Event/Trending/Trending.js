import React from "react";
import TrendingItem from "./Items/TrendingItem";

export default function Trending(props) {
  const { data, addAnalytics } = props;
  return (
    <div id="tab3" className="eventBox__tabs-content active">
      {/* <div className="trendingBox"> */}
      <div className="maincardBox maincardBox--large maincardBox--mobile-visible">
        <div className="maincardBox__card-wrapper">
          <div className="container" style={{ maxWidth: "65rem" }}>
            {data.map((item, index) => (
              <TrendingItem
                key={index}
                data={item}
                addAnalytics={addAnalytics}
                fromTrending={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
