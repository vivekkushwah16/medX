import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";
import SearchIcon from "./SearchIcon.svg";

const SearchBar = React.memo((props) => {
  let history = useHistory();
  const [text, setText] = useState(
    props.initalSearchKeyword ? props.initalSearchKeyword : ""
  );
  const { doSearch, sticky } = props;
  // const [sticky, setSticky] = useState(false);
  // const navBar = useRef(null);

  // const stickyOnScroll = true;
  // const handleScroll = () => {
  //   try {
  //     if (yOffset > 0) {
  //       // console.log(window.pageYOffset >= yOffset, yOffset)
  //       if (window.pageYOffset >= yOffset) {
  //         setSticky(true);
  //       } else {
  //         setSticky(false);
  //       }
  //     }
  //   } catch (error) {
  //     // console.log(error)
  //   }
  // };

  // const calculateYoffset = () => {
  //   // console.log('navBar', navBar.current, stickyOnScroll)
  //   if (stickyOnScroll) {
  //     if (navBar.current) {
  //       window.addEventListener("scroll", handleScroll);
  //       // console.log(navBar.current.offsetTop)
  //       return navBar.current.offsetTop < 0
  //         ? window.innerHeight + navBar.current.offsetTop
  //         : navBar.current.offsetTop;
  //     }
  //   }
  //   return null;
  // };
  // const yOffset = useMemo(() => calculateYoffset(), [navBar.current]);

  // useEffect(() => {
  //   return () => {
  //     if (yOffset) {
  //       window.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  return (
    <div
      // ref={navBar}
      className={`search-container ${
        !sticky && history.location.pathname.includes("home")
          ? "search-container-top"
          : sticky && history.location.pathname.includes("home")
          ? "search-container-hide"
          : history.location.pathname.includes("search") &&
            "search-mobile-container"
      }`}
    >
      <form>
        <input
          type="text"
          placeholder="Search.."
          name="search"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            doSearch(text);
          }}
        >
          <img src={SearchIcon} alt="SearchIcon" />
        </button>
      </form>
    </div>
  );
});

export default SearchBar;
