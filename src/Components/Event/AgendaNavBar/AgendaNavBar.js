import React, { useEffect, useRef, useState } from "react";

export default function AgendaNavBar(props) {
  const {
    className,
    currentDate,
    dates,
    handleClick,
    containerClass,
    forceAgendaVisibleMobile,
    stickyOnScroll,
  } = props;
  const navBar = useRef(null);
  const [sticky, setSticky] = useState(false);
  const [yOffset, setyOffset] = useState(0);
  useEffect(() => {
    if (stickyOnScroll) {
      // console.log(navBar.current)
      if (navBar.current) {
        // yOffset = navBar.current.offsetTop
        setyOffset(navBar.current.offsetTop);
        // console.log(navBar.current.offsetTop)
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }
  }, [navBar.current]);

  const handleScroll = () => {
    try {
      if (yOffset > 0) {
        // console.log(window.pageYOffset >= yOffset, yOffset)
        if (window.pageYOffset >= yOffset) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    } catch (error) {
      // console.log(error)
    }
  };

  return (
    <nav
      className={`navigarion-bar ${sticky ? "navigarion-bar_sticky" : ""} ${className ? className : ""
        }`}
      style={
        forceAgendaVisibleMobile ? { borderBottom: "1px solid #005188" } : {}
      }
      ref={navBar}
    >
      <div className={`${containerClass ? containerClass : "container-small"}`}>
        <div className="d-flex align-items-center">
          <h2
            className="navigarion-bar__title"
            style={
              forceAgendaVisibleMobile
                ? { display: "initial", "margin-left": "2rem" }
                : { "margin-left": "2rem" }
            }
          >
            AGENDA |{" "}
          </h2>
          <ul
            className="navigarion-bar__menu"
            style={
              forceAgendaVisibleMobile
                ? { borderBottom: "0", justifyContent: "unset" }
                : {}
            }
          >
            {dates &&
              dates.map((date) => (
                <li
                  key={`agednaNav-${className}-${date}`}
                  className={`${currentDate === date ? "active" : ""}`}
                  onClick={(event) => handleClick(date, event)}
                >
                  <button
                    className={`btn btn-sm btn-secondary ${currentDate === date ? "active" : ""
                      }`}
                  >
                    {date}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
