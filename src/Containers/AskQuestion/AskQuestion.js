import React, { useContext, useState } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { eventContext } from "../../Context/Event/EventContextProvider";

const possibleState = {
  canAskQuestion: 0,
  askedQuestion: 1,
};

export default function AskQuestion(props) {
  const { sendQuestion, id: eventId, showCloseButton, handleCloseBtn } = props;
  const [currentState, setCurrentState] = useState(
    possibleState.canAskQuestion
  );
  const [question, setQuestion] = useState("");
  const { userInfo } = useContext(UserContext);
  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSendButton = async (event) => {
    const ques = question;
    if (ques.length > 0) {
      setQuestion("");
      setCurrentState(possibleState.askedQuestion);
      // console.log(ques);
      await sendQuestion(eventId, ques);
      // console.log("done");
    }
  };

  return (
    <>
      <div class="d-flex justify-content-between align-items-center pd-b10">
        <h2 className="communityBox__title">Ask The Experts</h2>
        {showCloseButton && (
          <button
            class="btn btn-grey communityBox__close"
            onClick={handleCloseBtn}
          >
            Close
          </button>
        )}
      </div>
      <div className="communityBox__send mg-b20">
        {currentState === possibleState.canAskQuestion && (
          <>
            {/* <img src="assets/images/user.png" alt="" /> */}
            <a
              className="profile__user"
              style={{ pointerEvents: "none" }}
              href="#"
            >
              {`${
                userInfo.firstName ? userInfo.firstName[0].toUpperCase() : ""
              }${userInfo.lastName ? userInfo.lastName[0].toUpperCase() : ""} `}
            </a>

            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Ask a question"
                onChange={handleInputChange}
                value={question}
              />
              <button class="btn" onClick={handleSendButton}>
                <i class="icon-send"></i>
              </button>
            </div>
          </>
        )}
        {currentState === possibleState.askedQuestion && (
          <div className="communityBox__send--submitted">
            <h3 className="mg-b15">Thank You!</h3>
            <p>Your question has been submitted to our Moderators</p>
            <a
              href="#"
              className="close"
              onClick={(e) => {
                e.preventDefault();
                setCurrentState(possibleState.canAskQuestion);
              }}
            >
              <i className="icon-close"></i>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
