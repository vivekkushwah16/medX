import React from 'react'

export default function AskQuestion() {
    return (
        <>
            <h2 className="communityBox__title">Ask a question</h2>
            <div className="communityBox__send mg-b20">
                <div className="communityBox__send--submitted">
                    <h3 className="mg-b15">Thank You!</h3>
                    <p>Your question has been submitted to our Moderators</p>
                    <a href="#" className="close"><i className="icon-close"></i></a>
                </div>
            </div>
        </>
    )
}
