import React, { useContext } from 'react';
import './addToCalendar.css'

export default function addToCalendarBtn({ children, onClick }) {

  const handleClick = (e) => {
    if (window.AddToCalendarAnalytic) {
      window.AddToCalendarAnalytic()
    }
    onClick(e)
  }

  return (
    <button
      id="addToCal"
      className={'btn bannerBox__btn '}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export function addToCalendarBlueBtn({ children, onClick }) {

  const handleClick = (e) => {
    if (window.AddToCalendarAnalytic) {
      window.AddToCalendarAnalytic()
    }
    onClick(e)
  }

  return (
    <button
      id="addToCal"
      className={'btn btn-secondary bannerBox__btn wt-btn'}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}