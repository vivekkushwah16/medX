import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { SEARCH_CLOUD_NAME } from "../../AppConstants/CloudFunctionName";
import { SEARCH_ROUTE } from "../../AppConstants/Routes";
import SearchResultVideo from "../../Components/SearchResultVideo";
import Header from "../../Containers/Header/Header";
import { cloudFunction } from "../../Firebase/firebase";
import ScreenAddOns from "../../Containers/ScreenAddOn/ScreenAddOn";
import "./index.css";

const dummyData = {
  code: "ok",
  result: [
    {
      videoUrl: "https://player.vimeo.com/video/553223115",
      speakers: ["speaker-koy02xmk"],
      description: "Therapeutic strategies for early COVID-19 : Recent updates",
      tags: ["respiratory", "covid19"],
      likes: 1,
      views: 45,
      title: "Inhaled Budesonide in Covid",
      thumnailUrl:
        "https://firebasestorage.googleapis.com/v0/b/cipla-impact.appspot.com/o/impact2021%2Fvideo%2FDr%20Richard.png?alt=media&token=2e378ee6-41dd-4d2e-af5f-8bf52633cc5f",
      id: "video-koy0esx2",
      timestamp: 1621582599171,
      videoTimestamp: [
        {
          title:
            "Introduction & early observation of respiratory aliments with COVID-19",
          startTime: 8,
          endTime: 244,
        },
        {
          startTime: 244,
          title:
            "Can inhaled corticosteriods stop COVID-19 getting worse? (STOIC Study)",
          endTime: 456,
        },
        {
          endTime: 563,
          startTime: 456,
          title: "STOIC Study: Primary End points",
        },
        {
          title: "STOIC Study: Secondary End points",
          startTime: 563,
          endTime: 720,
        },
        {
          title: "STOIC Study: Strengths & Limitations",
          endTime: 863,
          startTime: 720,
        },
        {
          title: "STOIC Study: Conclusion",
          startTime: 863,
          endTime: 879,
        },
        {
          endTime: 970,
          title:
            "Inhaled budesonide for elderly COVID-19 patients: Interim analysis from the PRINCIPLE trial",
          startTime: 879,
        },
        {
          startTime: 970,
          title: "PRINCIPLE Trial : Primary End Points",
          endTime: 989,
        },
        {
          title: "PRINCIPLE Trial: Results",
          endTime: 1153,
          startTime: 989,
        },
      ],
      band: "Pink",
      lastmodified: 1624040465811,
      objectID: "video-koy0esx2",
    },
  ],
};

function CheckBox({ label, onChange, checked, disabled }) {
  return (
    <label class="checkbox_container">
      {label}
      <input
        type="checkbox"
        name={label}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <span class="checkmark"></span>
    </label>
  );
}

function RadioButton({ name, label, value, onClick, checked }) {
  return (
    <label class="radio radio-before">
      <span class="radio__input">
        <input
          type="radio"
          name={name}
          value={value}
          onClick={onClick}
          checked={checked}
        />
        <span class="radio__control"></span>
      </span>
      <span class="radio__label">{label}</span>
    </label>
  );
}

const SORTBY_VALUES = {
  byViews: "views",
  byLikes: "likes",
  byUploadDate: "uploadDate",
};

const FILTERBY_VALUES = [
  // "respiratory",
  // "expert views",
  "asthma",
  "impact sessions",
  "copd",
  // "expertviews",
  "nebulization",
  "ild/ipf",
  "telemedicine",
  "bronchiectasis",
  "allergic rhinitis",
  // "cardiovascular",
  // "conversation",
  "covid19",
  "diagnosis",
  "heartfailure",
  // "inhalation devices",
  "pediatric asthma",
  "pulmonary hypertension",
  // "recommendations",
];
// {
//     respiratory: "respiratory",
//     expertViews: "expert views",
//     asthma: "asthma",
//     impactSessions: "impact sessions",
//     copd: "copd",
//     expertviews: "expertviews",
//     nebuilzation: "nebulization",
//     "ild/ipf": "ild/ipf",
//     telemedicine: "telemedicine",
//     bronchiectasis: "bronchiectasis",
//     allergicRhinitis: "allergic rhinitis",
//     cardiovascular: "cardiovascular",
//     conversation: "conversation",
//     covid19: "covid19",
//     diagnosis: "diagnosis",
//     heartfailure: "heartfailure",
//     inhalationDevices: "inhalation devices",
//     pediatricAsthma: "pediatric asthma",
//     pulmonaryhypertension: "pulmonary hypertension",
//     recommendations: "recommendations",
// }

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState(null);
  // const [searchResults, setSearchResults] = useState(dummyData.result)
  const [sortBy, setSortBy] = useState(null);
  const [filterBy, setFilterBy] = useState([]);
  const [showLoading, setLoading] = useState(false);

  const lastQuery = useRef("");

  const history = useHistory();
  let urlQuery = useQuery();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const doQuery = useCallback(() => {
    if (!lastQuery.current || lastQuery.current == null) {
      return;
    }
    console.log(lastQuery.current, filterBy, sortBy);
    let query = {
      keyword: lastQuery.current,
      doSorting: false,
      doFilter: false,
    };
    let newURL = `${SEARCH_ROUTE}?keyword=${encodeURIComponent(
      lastQuery.current
    )}`;

    if (sortBy) {
      query = {
        ...query,
        doSorting: true,
        sortBy,
      };
      newURL += `&sort=${encodeURIComponent(sortBy)}`;
    }

    if (filterBy) {
      if (filterBy.length > 0) {
        let filters = "";
        newURL += `&filter=`;
        if (filterBy.length === 1) {
          newURL += `${encodeURIComponent(filterBy[0])}`;
          filters = `tags:"${filterBy[0]}"`;
        } else {
          filterBy.forEach((element, index) => {
            if (index !== filterBy.length - 1) {
              newURL += `${encodeURIComponent(element)},`;
              filters += `tags:"${element}" AND `;
            } else {
              newURL += `${encodeURIComponent(element)}`;
              filters += `tags:"${element}"`;
            }
          });
        }
        query = {
          ...query,
          doFilter: true,
          filters,
        };
      }
    }
    setLoading(true);
    if (window.location.pathname === SEARCH_ROUTE) {
      history.push(newURL);
    }

    const cloudRef = cloudFunction.httpsCallable(SEARCH_CLOUD_NAME);
    cloudRef(JSON.stringify(query))
      .then((res) => {
        // console.log(res.data);//what if someBody reSearched Everything ???
        setSearchResults(res.data.result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(error);
        console.log(code, message, details);
      });
  }, [sortBy, filterBy, searchResults]);

  const implementSearch = useCallback(
    (keyword) => {
      lastQuery.current = keyword;
      doQuery();
    },
    [searchResults]
  );

  const handleRadioClick = (event) => {
    if (event.target.checked && sortBy !== event.target.value) {
      setSortBy(event.target.value);
    } else {
      setSortBy(null);
    }
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      let __filterBy = filterBy;
      if (!__filterBy) {
        __filterBy = [];
      }
      __filterBy.push(event.target.name);
      setFilterBy(__filterBy);
      doQuery();
    } else {
      if (filterBy) {
        let __filterBy = filterBy.filter((item) => item !== event.target.name);
        setFilterBy(__filterBy);
      }
    }
  };

  useEffect(() => {
    if (lastQuery.current) {
      doQuery();
    }
  }, [filterBy, sortBy]);

  useMemo(() => {
    let exec = (_urlQuery) => {
      let _keyword = _urlQuery.get("keyword");

      let _sort = _urlQuery.get("sort");

      let _filter = _urlQuery.get("filter");
      if (_keyword) {
        _keyword = decodeURIComponent(_keyword);
        lastQuery.current = _keyword;
      }

      if (_sort) {
        _sort = decodeURIComponent(_sort);
        setSortBy(_sort);
      }

      if (_filter) {
        _filter = _urlQuery
          .get("filter")
          .split(",")
          .map((item) => decodeURIComponent(item));
        setFilterBy(_filter);
      }

      if (_keyword && !_sort && !_filter) {
        doQuery();
      }
    };

    if (window.location.pathname === SEARCH_ROUTE) {
      exec(urlQuery);
    } else if (window.location.pathname.includes("/search/video")) {
      let returnParam = decodeURIComponent(urlQuery.get("return"));
      let __query = new URLSearchParams(`?${returnParam}`);
      exec(__query);
    }
  }, []);

  return (
    <>
      <div className="topicsBox__wrapper" id="searchPageConatiner">
        <Header
          hideInviteFriend={true}
          whiteLogo={true}
          stickyOnScroll={true}
          showSearchBar={true}
          initalSearchKeyword={lastQuery.current}
          doSearch={implementSearch}
        />
        <div className="searchPage_Body">
          <div className="searchPage_SideBar">
            <form>
              <div className="searchOptionsCotainer">
                <p className="option_heading">Sort By</p>
                <RadioButton
                  name={"sort"}
                  label={"Views"}
                  value={SORTBY_VALUES.byViews}
                  onClick={handleRadioClick}
                  checked={sortBy === SORTBY_VALUES.byViews}
                />
                <RadioButton
                  name={"sort"}
                  label={"Likes"}
                  value={SORTBY_VALUES.byLikes}
                  onClick={handleRadioClick}
                  checked={sortBy === SORTBY_VALUES.byLikes}
                />
                <RadioButton
                  name={"sort"}
                  label={"UploadDate"}
                  value={SORTBY_VALUES.byUploadDate}
                  onClick={handleRadioClick}
                  checked={sortBy === SORTBY_VALUES.byUploadDate}
                />
              </div>

              <div className="searchOptionsCotainer">
                <p className="option_heading">Filter By</p>
                {FILTERBY_VALUES.map((filter) => (
                  <CheckBox
                    key={filter}
                    label={filter}
                    onChange={handleCheckboxChange}
                    checked={filterBy.indexOf(filter) !== -1}
                    disabled={showLoading}
                  />
                ))}
              </div>
            </form>
          </div>
          <div
            className="searchPage_ResultContainer"
            style={{
              marginTop:
                window.innerWidth <= 600 && window.innerHeight >= 320
                  ? "8rem"
                  : window.innerWidth <= 600 && window.innerHeight < 320
                  ? "0rem"
                  : "",
            }}
          >
            {showLoading && (
              <div className="loaderContainer">
                <div className="lds-dual-ring"></div>
              </div>
            )}
            {!searchResults && (
              <p className="emptyMsg">
                Please use search for exploring awesome content.
              </p>
            )}
            {searchResults?.length <= 0 && (
              <p className="emptyMsg">Nothing Found</p>
            )}
            {searchResults &&
              searchResults.map((video) => (
                <SearchResultVideo
                  key={video.id}
                  currentVideoData={video}
                  openVideoPop={(currentVideoData) => {
                    let returnUrl = window.location.search;
                    if (returnUrl) {
                      returnUrl = returnUrl.substring(1, returnUrl.length);
                      let pushURl = `/search/${
                        currentVideoData.id
                      }?return=${encodeURIComponent(returnUrl)}`;
                      history.push(pushURl);
                    } else {
                      history.push(`/search/${currentVideoData.id}`);
                    }
                  }}
                />
              ))}
            {searchResults && <hr />}
          </div>
        </div>
      </div>

      <ScreenAddOns />
    </>
  );
}
