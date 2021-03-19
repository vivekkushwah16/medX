import React, { Component } from 'react';
import AgendaCard from '../../AgendaCard/AgendaCard';

class Agenda extends Component {
    render() {
        const { data, haveVideo, haveLikeButton, startVideo } = this.props
        return <>
            <div className={`maincardBox`}>

                <h2 className="maincardBox__title mg-b25">AGENDA</h2>
                <div className="maincardBox__card-wrapper">
                    {
                        data &&
                        data.map(timeline => (
                            <AgendaCard timeline={timeline} haveVideo={haveVideo} haveLikeButton={haveLikeButton} handleClick={startVideo}  />
                        ))
                    }
                </div>
            </div>
        </>;
    }
}


export default Agenda;
