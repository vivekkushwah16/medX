import React, { useState } from 'react'
import { eventContext } from '../../Context/Event/EventContextProvider'

const possibleState = {
    canAskQuestion: 0,
    askedQuestion: 1
}

export default function AskQuestion(props) {
    const { sendQuestion, id: eventId } = props
    const [currentState, setCurrentState] = useState(possibleState.canAskQuestion)
    const [question, setQuestion] = useState("")

    const handleInputChange = (event) => {
        setQuestion(event.target.value)
    }

    const handleSendButton = async (event) => {
        const ques = question;
        if (ques.length > 0) {
            setQuestion("")
            setCurrentState(possibleState.askedQuestion)
            console.log(ques)
            await sendQuestion(eventId, ques)
            console.log("done")
        }
    }

    return (
        <>
            <h2 className="communityBox__title">Ask a question</h2>
            <div className="communityBox__send mg-b20">
                {
                    currentState === possibleState.canAskQuestion &&
                    <>
                        <img src="assets/images/user.png" alt="" />
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Ask a question" onChange={handleInputChange} value={question} />
                            <button class="btn" onClick={handleSendButton}><i class="icon-send"></i></button>
                        </div>
                    </>
                }
                {
                    currentState === possibleState.askedQuestion &&
                    <div className="communityBox__send--submitted">
                        <h3 className="mg-b15">Thank You!</h3>
                        <p>Your question has been submitted to our Moderators</p>
                        <a href="#" className="close" onClick={(e)=>{e.preventDefault();setCurrentState(possibleState.canAskQuestion)}}><i className="icon-close"></i></a>
                    </div>
                }
            </div>
        </>
    )
}
