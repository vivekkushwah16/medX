import React, { createRef, useContext, useEffect } from 'react';
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider';

export default function AddToCalendarDropDown({ children }) {

    // const {} = useContext(AnalyticsContext)
    const dropdownStyles = createRef(null)

    useEffect(() => {
        let dropdownStylesCurrentRef = null
        if (dropdownStyles.current) {
            dropdownStylesCurrentRef = dropdownStyles.current
            dropdownStylesCurrentRef.childNodes.forEach(node => {
                node.addEventListener('click', handleClick)
            })
        }
        return (() => {

            if (dropdownStylesCurrentRef) {
                dropdownStylesCurrentRef.childNodes.forEach(node => {
                    node.removeEventListener('click', handleClick)
                })
            }
        })
    }, [dropdownStyles])

    const handleClick = (e) => {
        if (e.target.innerHTML) {
            window.AddToCalendarAnalytic(e.target.innerHTML)
        }
    }

    return (
        <div className="dropdownStyles" ref={dropdownStyles}>
            {children}
        </div>
    );
}