import React, { useContext, useState } from "react";
import "./chatbot.css";
import ask from "./ask.svg";
import cut from "./cut.svg";
import chat from "./chat.svg";
import axios from "axios";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import firebase, { firestore } from "../../Firebase/firebase";
var uniqid = require("uniqid");
function Chatbot(props) {
  const [showChat, setShow] = useState(false);
  const [topic, setTopic] = useState(
    props.history.location.pathName === "/home" ? "Platform" : "Current Video"
  );
  console.log(props);
  const [message, setMessage] = useState("");
  const { user, userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
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
            senderName: userInfo.firstName,
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
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={`${showChat ? "main__chat" : ""}`}>
      <div className="chat">
        <div className={`chat__cont ${showChat ? "show" : "close"}`}>
          <div className="header">
            <label for="topics">Topic:</label>
            <select
              name="topics"
              id="topics"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
              }}
            >
              <option value="Platform">Platform</option>
              <option value="Current Video">Current Video</option>
              <option value="Content">Content</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>
          <div className="textarea">
            <textarea
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
          </div>
          <div className="submit">
            <div>
              <button onClick={sendMail}>
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
