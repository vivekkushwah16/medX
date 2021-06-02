import React, { useContext, useEffect, useRef, useState } from "react";
import "./chatbot.css";
import ask from "./ask.svg";
import cut from "./cut.svg";
import chat from "./chat.svg";
import axios from "axios";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import cross from "./cross.svg";
import firebase, { firestore } from "../../Firebase/firebase";
var uniqid = require("uniqid");
function Chatbot(props) {
  const [showChat, setShow] = useState(false);
  const [topic, setTopic] = useState(
    !props.videoVisible ? "About Ciplamedx" : props.videoData.title
  );
  const [showThankyou, setThankyou] = useState(false);
  // console.log(props);
  const [message, setMessage] = useState("");
  const { user, userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    // console.log(props);
    setTopic(!props.videoVisible ? "Platform" : props.videoData.title);
  }, [props.videoVisible]);
  const sendMail = () => {
    setLoading(true);
    axios
      .post(`https://ciplamedx-mail.djvirtualevents.com/sharequery`, {
        senderName: userInfo.firstName,
        senderMail: userInfo.email,
        senderMobileNumber: userInfo.phoneNumber,
        topic: topic,
        message: message,
        uid: user.uid,
      })
      .then((res) => {
        const document = uniqid(`query-${topic}`);
        firestore
          .collection("queries")
          .doc(document)
          .set({
            senderName: `${userInfo.firstName} ${userInfo.lastName}`,
            senderMail: userInfo.email,
            senderMobileNumber: userInfo.phoneNumber,
            topic: topic,
            message: message,
            userId: user.uid,
            queryId: document,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().getTime(),
          })
          .then(() => {
            console.log(res, "done");
            setMessage("");
            setLoading(false);
            setThankyou(true);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const isListenerAttached = useRef(false);
  // const attachCloseListener = () => {
  //   isListenerAttached.current = true;
  //   document.addEventListener("click", closeAssistant);
  // };

  // const closeAssistant = (event) => {
  //   // toggleAssistantOpenState(false);
  //   // if (event.path.indexOf("div.scroll__btn"))
  //   console.log(event);
  //   let start = event.target;
  //   while (start.parentNode) {
  //     let e = start.parentNode;
  //     console.log(e.id);
  //     if (e.id === "doNotClose") {
  //       console.log("doNotClose");
  //       return;
  //     }
  //     if (e?.parentNode) start = e.parentNode;
  //     else {
  //       break;
  //     }
  //   }
  //   console.log("Close it");
  //   setShow(false);
  //   isListenerAttached.current = false;
  //   document.removeEventListener("click", closeAssistant);
  // };

  // useEffect(() => {
  //   return () => {
  //     if (isListenerAttached.current === true)
  //       document.removeEventListener("click", closeAssistant);
  //   };
  // }, []);

  // useEffect(() => {
  //   // console.log("asistant Data has been changed & openState:" + assistantOpenState)

  //   if (showChat) {
  //     timeRef.current = setTimeout(() => {
  //       attachCloseListener();
  //     }, 1000);
  //   }

  //   return () => {
  //     if (timeRef.current) {
  //       clearTimeout(timeRef.current);
  //     }
  //   };
  // }, [showChat]);

  return (
    <div className={`${showChat ? "main__chat" : ""}`} id="doNotClose">
      {showChat && (
        <div
          className="click_to_of"
          onClick={() => {
            setShow(false);
          }}
        ></div>
      )}
      <div className="chat">
        <div className={`chat__cont ${showChat ? "show" : "close"}`}>
          <div className="cross__">
            <img
              src={cross}
              alt=""
              onClick={() => {
                setShow(false);
                if (
                  (document.querySelector(".back_to_top") &&
                    document.body.scrollTop > 50) ||
                  document.documentElement.scrollTop > 50
                ) {
                  document.querySelector(".back_to_top").style.display =
                    "block";
                }
              }}
            />
          </div>
          <div className="header">
            <label for="topics">Topic:</label>
            <select
              name="topics"
              id="topics"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
              }}
              disabled={loading}
            >
              <option value="About Ciplamedx">About Ciplamedx</option>
              {props.videoVisible && <option value={topic}>{topic}</option>}
              <option value="Cipla events">Cipla events</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>
          <div className="textarea">
            {showThankyou ? (
              <p>Thank you for sharing your thaughts</p>
            ) : (
              <textarea
                disabled={loading}
                name="message"
                id="message"
                cols="30"
                rows="10"
                placeholder="Share  your thoughts"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            )}
          </div>
          <div className="submit">
            <div>
              {!showThankyou ? (
                <button onClick={sendMail} disabled={loading}>
                  {" "}
                  {loading ? (
                    <>
                      <img
                        src="/assets/images/loader.gif"
                        alt="loading"
                        style={{ maxHeight: "20px" }}
                      />
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShow(false);
                    setThankyou(false);
                  }}
                >
                  {"Close"}
                </button>
              )}
            </div>
          </div>
        </div>
        {showChat ? (
          <div
            className="chat__btn cross"
            onClick={() => {
              if (
                (document.querySelector(".back_to_top") &&
                  document.body.scrollTop > 50) ||
                document.documentElement.scrollTop > 50
              ) {
                document.querySelector(".back_to_top").style.display = "block";
              }
              setShow(false);
            }}
          >
            <img src={cut} alt="" />
          </div>
        ) : (
          <div
            className="chat__btn"
            onClick={() => {
              // document.querySelector(".chat__btn").addEventListener;
              if (document.querySelector(".back_to_top")) {
                document.querySelector(".back_to_top").style.display = "none";
              }
              setShow(true);
            }}
          >
            <img src={chat} alt="" className="chat-icon" />
            <img src={ask} alt="" className="ask" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;
