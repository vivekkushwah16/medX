import React, { useContext, useState } from "react";
import { useAlert } from "react-alert";
import fb from "./assets/fb.png";
import twitter from "./assets/twitter.png";
import axios from "axios";
import whatsapp from "./assets/whatsapp.png";
import { UserContext } from "../../Context/Auth/UserContextProvider";
// import "./invite.css";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import {
  INVITEYOURFRIEND_EVENT_EMAIL,
  INVITEYOURFRIEND_EVENT_FACEBOOK,
  INVITEYOURFRIEND_EVENT_TWITTER,
  INVITEYOURFRIEND_EVENT_WHATSAPP,
} from "../../AppConstants/AnalyticsEventName";
import { EVENT_INVITEYOURPEER_ENDPOINT } from "../../AppConstants/APIEndpoints";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ShareVideoLink(props) {
  const alert = useAlert();
  const [url, setUrl] = useState(window.location.href);
  // const [url, setUrl] = useState("https://ciplamedx.com/evolve/register");
  const [urlShare, setUrlShare] = useState(window.encodeURI(props.message));
  //   window.encodeURI(
  //     props.message
  //       ? props.message
  //       : "Join us for Evolve '21 on the CiplaMedX platform by registering at the following link: https://ciplamedx.com/evolve/register"
  //   )
  // );
  const [textArea, setTextarea] = useState({});
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { user, userInfo } = useContext(UserContext);

  const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

  const copyCodeToClipboard = () => {
    textArea.disabled = false;
    const el = textArea;
    el.select();
    document.execCommand("copy");
    alert.success("Copied to clipboard!!");
    textArea.disabled = true;
  };

  const shareOnce = () => {
    if (navigator.share) {
      navigator.share({
        text: props.message,
        url: window.location.href,
      });
    }
  };

  const sendMail = () => {
    return new Promise((res, rej) => {
      setError(false);
      setLoading(true);
      if (email === "") {
        setError(true);
        setLoading(false);
        return;
      }
      if (!validateEmail(email)) {
        setError(true);
        setLoading(false);
      }
      // const link =
      //   window.location.hostname === "localhost"
      //     ? "https://ciplamedx.com/evolve/register"
      //     : window.location.href;
      const link = window.location.href;
      axios
        .post(
          props.email_endpoint
            ? props.email_endpoint
            : EVENT_INVITEYOURPEER_ENDPOINT,
          {
            name: user.displayName,
            email: email.toLowerCase(),
            senderMail: userInfo.email,
            link,
            title: props.title,
          }
        )
        .then((res) => {
          alert.success("Mail sent successfully!!");
          setLoading(false);
          addAnalytics(INVITEYOURFRIEND_EVENT_EMAIL);
        })
        .catch((err) => {
          // console.log(err);
          setError(true);
          alert.error("Failed: Mail not sent.");
          setLoading(false);
        });
    });
  };

  const addAnalytics = (name) => {
    addGAWithUserInfo(name, { eventId: "evovle" });
    addCAWithUserInfo(name, true, { eventId: "evovle" }, true);
  };

  return (
    <div
      className="modalBox modalBox--small active blackTint modalBoxAppearAnim inviteFriendModal"
      style={props.zIndex ? { zIndex: props.zIndex } : {}}
    >
      <div className="modalBox__inner modalBoxChildScaleAnim">
        <div className="modalBox__header">
          <h3 className="modalBox__title">Invite your peers</h3>
          <button
            className="modalBox__close"
            onClick={() => {
              props.handleClick
                ? props.handleClick()
                : props.closeInvitePopup();
            }}
          >
            <i className="icon-close"></i>
          </button>
        </div>
        <div className="modalBox__body">
          <div className="form-group">
            <label className="form-label">Link</label>
            <div className="form-group__has-icon">
              <i className="icon-link" onClick={() => copyCodeToClipboard()}>
                <span className="link-tooltip">Click here to copy.</span>
              </i>

              <input
                type="text"
                className="form-control"
                placeholder="Enter url"
                value={url}
                style={{ paddingRight: "9rem" }}
                ref={(textarea) => {
                  setTextarea(textarea);
                }}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                disabled={true}
              />
              <div className="share__btns">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                  target="_blank"
                  onClick={() => {
                    addAnalytics(INVITEYOURFRIEND_EVENT_FACEBOOK);
                  }}
                >
                  <img src={fb} alt="" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${urlShare}`}
                  target="_blank"
                  onClick={() => {
                    addAnalytics(INVITEYOURFRIEND_EVENT_TWITTER);
                  }}
                >
                  <img src={twitter} alt="" />
                </a>
                <a
                  href={`https://wa.me/?text=${urlShare}`}
                  target="_blank"
                  onClick={() => {
                    addAnalytics(INVITEYOURFRIEND_EVENT_WHATSAPP);
                  }}
                >
                  <img src={whatsapp} alt="" />
                </a>
              </div>
              <button
                className="single__share btn-secondary"
                onClick={shareOnce}
              >
                Share
              </button>
            </div>
          </div>
          <div className="form-group mg-b30">
            <label className="form-label">Email</label>
            <div className="form-group__has-icon">
              <i className="icon-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email ID"
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>

          {error && (
            <>
              <div className="form-group mg-b30">
                <span style={{ color: "red", marginBottom: "1rem" }}>
                  *Enter a valid email.
                </span>
              </div>
            </>
          )}
          <button
            className="btn btn-secondary"
            onClick={sendMail}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <>
                <img
                  id="btnLoader"
                  src="/assets/images/loader.gif"
                  alt="loading"
                />
              </>
            ) : (
              "Send Mail"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
