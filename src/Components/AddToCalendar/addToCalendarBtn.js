import React, { useRef } from 'react';
import './addToCalendar.css'

export default function addToCalendarBtn({ children, onClick }) {
  

  return (
    <button
      id="addToCal"
      className={'btn btn-secondary bannerBox__btn '}
      onClick={onClick}
    >
      {children}
    </button>
  );
}