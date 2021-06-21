import React from "react";
import { SpeakerProfileType } from "../../AppConstants/SpeakerProfileType";
import "./index.css";
import SpeakerProfile from '../../Containers/SpeakerProfile.js/SpeakerProfile'

let characterLimit = 300;
function SearchResultVideo(props) {
    const { currentVideoData, openVideoPop } = props;
    return (
        <>
            <div
                className="searchResult mg-b20"
                onClick={() => {
                    openVideoPop(currentVideoData);
                }}
            >
                <div
                    className="searchResult_media"
                    style={{ backgroundImage: `url(${currentVideoData.thumnailUrl})` }}
                >
                    <a href="#" className="searchResult_playIcon">
                        <i className="icon-play"></i>
                    </a>
                </div>
                <div className="searchResult_media_rightContainer">
                    <div className="searchResult_media_info">
                        <h4 className="mg-b15 maincardBox__card-title search_video_txt">
                            {currentVideoData.title}
                        </h4>
                        <p className="mg-b25 maincardBox__card-desc search_video_txt">
                            {currentVideoData.description.length > characterLimit ? `${currentVideoData.description.substr(0, characterLimit)}... ` : currentVideoData.description}
                        </p>
                    </div>
                    {currentVideoData.speakers.length === 1 ? (
                        <>
                            {currentVideoData.speakers.map((id) => (
                                <SpeakerProfile
                                    type={SpeakerProfileType.CARD_PROFILE}
                                    id={id}
                                    nonClickable
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div
                                className="wrap-speakers"
                                style={{ display: "flex", flexWrap: "wrap" }}
                            >
                                {currentVideoData.speakers.map((id) => (
                                    <SpeakerProfile
                                        type={SpeakerProfileType.CARD_PROFILE}
                                        id={id}
                                        nonClickable
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default SearchResultVideo;
