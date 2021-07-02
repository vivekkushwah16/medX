import React, { useMemo } from 'react'
import AgendaCard from '../../AgendaCard/AgendaCard';
import AgendaNavBar from '../AgendaNavBar/AgendaNavBar';


export default function AgendaTab(props) {
    const { data, haveVideo, haveLikeButton, startVideo, activeTimeline, agendaDates, cureentAgendaDate, handleDateChange, allData } = props
    let activeAgendaStartTime = useMemo(() => {
        if (allData && activeTimeline) { return allData.filter(d => d.id === activeTimeline)[0].startTime }
        else { return null }
    }, [allData, activeTimeline])
    // if (activeTimeline) {
    //     activeAgendaStartTime = allData.filter(d => d.id === activeTimeline)[0].startTime
    // }
    return (

        <div id="tab2" class="eventBox__tabs-content active">
            <>
                {
                    agendaDates &&
                    <>
                        <AgendaNavBar containerClass="container" className={"hide-on-tablet"} dates={agendaDates} currentDate={cureentAgendaDate} handleClick={handleDateChange} stickyOnScroll={true} />
                        <AgendaNavBar containerClass="container" className={"show-on-tablet show-on-tablet--flex "} dates={agendaDates} currentDate={cureentAgendaDate} handleClick={handleDateChange} forceAgendaVisibleMobile={true} stickyOnScroll={true} />
                    </>
                }

                {
                    data &&
                    cureentAgendaDate &&
                    data[cureentAgendaDate].map((timeline, index) => (
                        // <div className="maincardBox__card-wrap">
                        <>
                            < AgendaCard
                                timeline={timeline} haveVideo={haveVideo} haveLikeButton={activeTimeline !== null ? activeAgendaStartTime >= timeline.startTime : false} handleClick={startVideo} animate={true} placeIndex={index}
                                forEventPage={true} wantHeaderFooter={true}
                                showLive={activeTimeline !== null ? timeline.id === activeTimeline : activeTimeline}
                            />
                        </>
                        // </div>
                    ))
                }
            </>
        </div >
    )
}

