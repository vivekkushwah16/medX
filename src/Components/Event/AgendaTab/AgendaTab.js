import React from 'react'
import AgendaCard from '../../AgendaCard/AgendaCard';


export default function AgendaTab(props) {
    const { data, haveVideo, haveLikeButton, startVideo, activeTimeline } = props

    return (
        <div id="tab2" class="eventBox__tabs-content active">
            {
                data &&
                data.map((timeline, index) => (
                    // <div className="maincardBox__card-wrap">
                    <>
                        < AgendaCard
                            timeline={timeline} haveVideo={haveVideo} haveLikeButton={haveLikeButton} handleClick={startVideo} animate={true} placeIndex={index}
                            forEventPage={true} wantHeaderFooter={true}
                            showLive={activeTimeline !== null ? timeline.id === activeTimeline : activeTimeline}
                        />
                    </>
                    // </div>
                ))
            }
        </div >
    )
}

