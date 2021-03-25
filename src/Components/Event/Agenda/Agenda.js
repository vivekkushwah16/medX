import React, { Component } from 'react';
import AgendaCard from '../../AgendaCard/AgendaCard';

class Agenda extends Component {
    render() {
        const { data, haveVideo, haveLikeButton, startVideo } = this.props
        return <>
            <div className={`maincardBox`} style={{ display: 'flex', flexDirection: 'column' }}>

                <h2 className="maincardBox__title mg-b25">AGENDA</h2>
                <div className="maincardBox__card-wrapper">
                    {
                        data &&
                        data.map((timeline, index) => (
                            <AgendaCard  timeline={timeline} haveVideo={haveVideo} haveLikeButton={haveLikeButton} handleClick={startVideo} animate={true} placeIndex={index} />
                        ))
                    }
                </div>
            </div>
        </>;
    }
}


export default Agenda;
