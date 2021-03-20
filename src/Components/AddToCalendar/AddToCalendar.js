import React from 'react'
import AddToCalendarHOC from 'react-add-to-calendar-hoc';
import addToCalendarBtn from './addToCalendarBtn';
import AddToCalendarDropDown from './AddToCalendarDropDown';
import moment from 'moment';

export default function AddToCalendar() {
    const startDatetime = moment('2021-04-10').utc();
    const endDatetime = startDatetime.clone().add(6, 'hours');
    const duration = endDatetime.diff(startDatetime, 'hours');
    const event = {
        description: 'Description of event. Going to have a lot of fun doing things that we scheduled ahead of time.',
        duration,
        endDatetime: endDatetime.format('YYYYMMDDTHHmmssZ'),
        location: 'Online',
        startDatetime: startDatetime.format('YYYYMMDDTHHmmssZ'),
        title: 'Cipla Impact',
    }
    const AddToCalendarComp = AddToCalendarHOC(addToCalendarBtn, AddToCalendarDropDown);
    return (
        <AddToCalendarComp
            className='addToCalendar'
            linkProps={{
                className: 'linkStyles',
            }}
            event={event}
        />
    )
}
