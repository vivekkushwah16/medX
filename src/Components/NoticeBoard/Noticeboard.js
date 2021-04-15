import React, { useContext } from 'react'
import { MediaModalType } from '../../AppConstants/ModalType';
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'

export default function Noticeboard(props) {

    const { showMediaModal } = useContext(MediaModalContext)

    return (
        <>
            <div className="communityBox__noticeboard mg-b20">
                <h2 className="communityBox__title mg-b10">Noticeboard</h2>
                <hr></hr>
                <div className="communityBox__noticeboard_body mg-t5" onClick={(event) => {
                    event.preventDefault();
                    if (props.message) {
                        showMediaModal(MediaModalType.PDF, props.message.url)
                    }
                }}>
                    <p className={props.message && props.message.url ? 'text_underline' : ''}> {props.message ? props.message.title : '💡 Late Breaker Session!'}</p>
                </div>
            </div>
            {/* <div className="communityBox__send--submitted">
                    <h2 className="communityBox__title mg-b5">Noticeboard</h2>
                    <hr className="mg-b10"></hr>
                    <p> {props.message ? props.message : '💡 Late Breaker Session!'}</p>
                </div> */}

        </>
    )
}
