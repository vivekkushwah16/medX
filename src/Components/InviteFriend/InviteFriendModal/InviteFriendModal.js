import React, { useState } from 'react'
import fb from "./assets/fb.png";
import twitter from "./assets/twitter.png";
import whatsapp from "./assets/whatsapp.png";

export default function InviteFriendModal(props) {
    const [url, setUrl] = useState(window.location.href);
    const [textArea, setTextarea] = useState({});

    const copyCodeToClipboard = () => {
        textArea.disabled = false;
        const el = textArea;
        el.select();
        document.execCommand("copy");
        textArea.disabled = true;
    };

    const shareOnce = () => {
        if (navigator.share) {
            navigator.share({
                url: window.location.href,
            });
        }
    };

    return (
        <div className="modalBox modalBox--small active blackTint">
            <div className="modalBox__inner">
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
                            ></i>
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
                            />
                        </div>
                    </div>
                    <button className="btn btn-secondary">Send Mail</button>
                </div>
            </div>
        </div>
    )
}
