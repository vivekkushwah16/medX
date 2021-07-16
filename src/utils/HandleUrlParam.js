import { useContext, useEffect, useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { UserContext } from "../Context/Auth/UserContextProvider";
import VideoManager from "../Managers/VideoManager";

const ComponentWillMountHook = (fun) => useMemo(fun, []);

export function HandleUrlParam(props) {
    const { videopopVisible, openVideoPop } = props;
    const { getVideoMetaData } = useContext(UserContext);
    //useHistory to redirect
    let history = useHistory();
    //params will tell us the video Id
    let { videoId } = useParams();
    //using query we will get the tag
    let urlQuery = useQuery();
    function useQuery() {
      return new URLSearchParams(useLocation().search);
    }
  
    const loadVideoWithOutTag = async () => {
      try {
        //we first read the video from db using Id and then we will get the tag from it
        let currentVideoData = await VideoManager.getVideoWithId(videoId);
        let tag = currentVideoData.tags[0];
        loadVideoWithTag(tag, currentVideoData);
      } catch (error) {
        history.push("/home");
      }
    };
  
    const loadVideoWithTag = async (currentTag, _CurrentVideoData) => {
      try {
        //get all video with the tag, we have to show them in suggestions
        let currentVideoData = null;
        if (_CurrentVideoData) {
          currentVideoData = _CurrentVideoData;
        } else {
          currentVideoData = await VideoManager.getVideoWithId(videoId);
        }
        const videoArr = await VideoManager.getVideoWithTag([currentTag]);
        //get video meta data, will tell how much I have watch the video
        const metaData = await getVideoMetaData(videoId);
        openVideoPop(metaData, currentVideoData, videoArr, currentTag, false);
      } catch (error) {
        history.push("/home");
      }
    };

    ComponentWillMountHook(async () => {
      //check if videoPopVisible, if not then it's a direct link open
      if (!videopopVisible) {
        //we will find the tag
        let currentTag = urlQuery.get("tag");
        currentTag = decodeURIComponent(currentTag);
        if (currentTag && currentTag !== "null") {
          loadVideoWithTag(currentTag);
        } else {
          loadVideoWithOutTag();
        }
      }
    });
    useEffect(() => {
      return () => {
        document.getElementsByTagName("body")[0].style.overflow = "auto";
      };
    }, []);
    return <>{props.children}</>;
  }
  