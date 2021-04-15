import React from 'react'

export default function Noticeboard(props) {
    return (
        <>
            <div className="communityBox__send mg-b20">

                <div className="communityBox__send--submitted">
                    {/* <h3 className="mg-b15"></h3> */}
                    <h2 className="communityBox__title mg-b5">Noticeboard</h2>
                    <hr className="mg-b10"></hr>
                    <p> {props.message ? props.message : '💡 Late Breaker Session!'}</p>
                </div>

            </div>
        </>
    )
}
