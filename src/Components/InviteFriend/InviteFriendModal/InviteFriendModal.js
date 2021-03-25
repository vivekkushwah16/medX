import React, { useContext, useState } from 'react'
import { useAlert } from 'react-alert';
import fb from "./assets/fb.png";
import twitter from "./assets/twitter.png";
import axios from 'axios';
import whatsapp from "./assets/whatsapp.png";
import { UserContext } from '../../../Context/Auth/UserContextProvider';
import './invite.css'

const mailUrl = 'http://event.markonnect.in/inviteFriend'

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default function InviteFriendModal(props) {
    const alert = useAlert();
    const [url, setUrl] = useState(window.location.href);
    const [textArea, setTextarea] = useState({});
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(false)

    const { user, userInfo } = useContext(UserContext)


    const copyCodeToClipboard = () => {
        textArea.disabled = false;
        const el = textArea;
        el.select();
        document.execCommand("copy");
        alert.success("Copied to clipboard!!")
        textArea.disabled = true;
    };

    const shareOnce = () => {
        if (navigator.share) {
            navigator.share({
                url: window.location.href,
            });
        }
    };

    const sendMail = () => {
        return new Promise((res, rej) => {
            setError(false);
            setLoading(true)
            if (email === "") {
                setError(true)
                setLoading(false)
                return
            }
            if (!validateEmail(email)) {
                setError(true)
                setLoading(false)
            }
            axios.post(mailUrl,
                {
                    name: user.displayName,
                    senderMail: email.toLowerCase(),
                    email: userInfo.email,
                }).then(res => {
                    alert.success("Mail sent successfully!!")
                    setLoading(false)
                }).catch(err => {
                    setError(true)
                    alert.error("Failed: Mail not sent.")
                    setLoading(false)
                })
        })
    }

    return (
        <div className="modalBox modalBox--small active blackTint modalBoxAppearAnim">
            <div className="modalBox__inner modalBoxChildScaleAnim">
                <div className="modalBox__header">
                    <h3 className="modalBox__title">Invite your friends</h3>
                    <button
                        className="modalBox__close"
                        onClick={() => {
                            props.handleClick();
                        }}
                    >
                        <i className="icon-close"></i>
                    </button>
                </div>
                <div className="modalBox__body">
                    <div className="form-group">
                        <label className="form-label">Link</label>
                        <div className="form-group__has-icon">
                            <i
                                className="icon-link"
                                onClick={() => copyCodeToClipboard()}
                            >
                                <span class="link-tooltip">Click here to copy.</span>
                            </i>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter url"
                                value={url}
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
                                >
                                    <img src={fb} alt="" />
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${url}`}
                                    target="_blank"
                                >
                                    <img src={twitter} alt="" />
                                </a>
                                <a href={`https://wa.me/?text=${url}`} target="_blank">
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
                                    e.preventDefault()
                                    setEmail(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    {
                        error &&
                        <>
                            <div className="form-group mg-b30">
                                <span style={{ color: 'red', marginBottom: '1rem' }}>*Enter a valid email.</span>
                            </div>
                        </>
                    }
                    <button className="btn btn-secondary" onClick={sendMail} disabled={isLoading ? true : false}>
                        {
                            isLoading ?
                                (
                                    <>
                                        <img id="btnLoader" src="/assets/images/loader.gif" alt="loading" />
                                    </>
                                ) : ('Send Mail')
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
