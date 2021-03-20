import React from 'react';
import './addToCalendar.css'

export default function addToCalendarBtn({ children, onClick }) {
  return (
    <button
      className={'btn btn-secondary bannerBox__btn '}
      onClick={onClick}
    >
      {children}
    </button>
  );
}