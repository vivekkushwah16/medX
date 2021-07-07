import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";
import SearchIcon from "./SearchIcon.svg";

const SearchBar = React.memo((props) => {
  let history = useHistory();
  const [text, setText] = useState(
    props.initalSearchKeyword ? props.initalSearchKeyword : ""
  );
  const { doSearch, sticky } = props;

  return (
    <div
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
