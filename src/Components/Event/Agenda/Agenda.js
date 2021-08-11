import React, { Component } from 'react';
import AgendaCard from '../../AgendaCard/AgendaCard';
import AgendaNavBar from '../AgendaNavBar/AgendaNavBar';

class Agenda extends Component {
    render() {
        const { data, haveVideo, haveLikeButton, startVideo, currentDate, dates, handleDateChange, containerClass } = this.props
        return <>
            <div className={`maincardBox`} style={{ display: 'flex', flexDirection: 'column' }}>

                {/* <h2 className="maincardBox__title mg-b25">AGENDA</h2> */}
                <AgendaNavBar className={"show-on-tablet show-on-tablet--flex"} currentDate={currentDate} dates={dates} handleClick={handleDateChange} stickyOnScroll={true} />

                <div className="maincardBox__card-wrapper">
                    <div className={`${containerClass ? containerClass : "container-small"}`}>
                        {
                            data &&
                            data[currentDate].map((timeline, index) => (
                                <AgendaCard timeline={timeline} haveVideo={haveVideo} haveLikeButton={haveLikeButton} handleClick={startVideo} animate={true} placeIndex={index} wantHeaderFooter={true} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>;
    }
}


export default Agenda;
