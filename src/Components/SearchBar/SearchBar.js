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
  console.log(history);
  return (
    <div
      className="search-container"
      style={{
        top:
          !sticky && history.location.pathname.includes("home") ? "77vh" : "",
      }}
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
