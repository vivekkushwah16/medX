import React, { createContext, useState, useEffect } from "react";
import {
  BACKSTAGE_COLLECTION,
  MEDIAMETADATA_COLLECTION,
  NOTICEBOARD_COLLECTION,
  PLATFORM_BACKSTAGE_DOC,
  PROFILE_COLLECTION,
  USERMETADATA_COLLECTION,
  BRONCHTALK_COLLECTION,
} from "../../AppConstants/CollectionConstants";
import { MediaType } from "../../AppConstants/TypeConstant";
import firebase, {
  analytics,
  auth,
  database,
  getUserProfile,
  firestore,
  askForPermissionToReceiveNotifications,
} from "../../Firebase/firebase";
import VideoManager from "../../Managers/VideoManager";

export const UserContext = createContext();
export const UserMetaDataContext = createContext();
export const UserBronchTalkMetaDataContext = createContext();

const ValidForNews = ["diabetology",
  "cardiology",
  "respiratory medicine",
  "urology",
  "paediatrics"]

const UserContextProvider = (props) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userAuth"))
  );
  const [initalCheck, setInitalCheck] = useState(false);
  const [userInfo, setuserInfo] = useState(false);
  const [mediaMetaData, setMediaMetaData] = useState({});
  const [userMetaData, setUserMetaData] = useState({ events: [] });
  const [userBronchTalkMetaData, setUserBronchTalkMetaData] = useState(null);
  const [showNewsbanner, toggleNewsBanner] = useState(false);

  useEffect(() => {
    if (userInfo) {
      if (ValidForNews.indexOf(userInfo.speciality.toLowerCase()) !== -1) {
        toggleNewsBanner(true)
      } else {
        toggleNewsBanner(false)
      }
    }
  }, [userInfo])

  useEffect(() => {
    // firestore.collection(BACKSTAGE_COLLECTION).doc(PLATFORM_BACKSTAGE_DOC).onSnapshot((doc) => {
    //     if (!doc.exists) {
    //         console.log("backstagePlatform doc not exists")
    //     }
    //     const data = doc.data()
    //     localStorage.setItem('platformData', JSON.stringify(data))
    //     setPlatformData(data)
    // })

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // console.log(user)
        window.user = user;
        localStorage.setItem("userAuth", JSON.stringify(user));
        setUser(user);
        askForPermissionToReceiveNotifications(user)
        setInitalCheck(true);
        analytics.setUserId(user.uid);
        addUserLoginAnalytics(user.uid);
        getUserMetaData(user.uid);
        getUserBronchTalkMetaData(user.uid);
        // const userInfo = await getUserProfile(user.uid)
        // console.log(userInfo)
        // setuserInfo(userInfo)
      } else {
        localStorage.removeItem("userAuth");
        sessionStorage.clear()
        localStorage.clear()
        setUser(null);
        setInitalCheck(true);
      }
    });
  }, []);

  const addUserLoginAnalytics = async (uid) => {
    const userInfo = await getUserProfile(uid);
    setuserInfo(userInfo);
    // console.log(userInfo);
    let _data = {
      userId: uid,
      profession: userInfo.profession,
      speciality: userInfo.speciality,
      country: userInfo.country,
      state: userInfo.state,
      city: userInfo.city,
      date: new Date(),
    };
    if (window.eventNameForLoginAnalytics)
      _data = { ..._data, eventId: window.eventNameForLoginAnalytics };
    analytics.logEvent("user_login", _data);
    // /user_login/${uid}_${new Date().getTime()}
    await database.ref(`/user_login/${uid}`).update({
      ..._data,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      loginTimestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const getVideoMetaData = async (mediaId) => {
    return new Promise((res, rej) => {
      try {
        const mediaMetaIds = Object.keys(mediaMetaData);
        if (mediaMetaIds.indexOf(mediaId) !== -1) {
          if (!mediaMetaData[mediaId]) {
            let data = getMediaDoc(mediaId);
            res(data);
          }
          //found in old data
          res(mediaMetaData[mediaId]);
        } else {
          let data = getMediaDoc(mediaId);
          res(data);
        }
      } catch (error) {
        rej(error);
      }
    });
  };

  const setVideoMetaData = async (videoId, lastKnownTimestamp, duration) => {
    return new Promise((res, rej) => {
      try {
        VideoManager.setVideoLastKnownTimestamp(
          videoId,
          user.uid,
          lastKnownTimestamp,
          duration
        );
        setMediaMetaData({
          ...mediaMetaData,
          [videoId]: {
            videoId: videoId,
            userId: user.uid,
            type: MediaType.VIDEO_MEDIA,
            lastKnownTimestamp: lastKnownTimestamp,
            duration: duration,
          },
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  const getMediaDoc = async (mediaId) => {
    let docId = `${mediaId}_${user.uid}`;
    let ref = firestore.collection(MEDIAMETADATA_COLLECTION).doc(docId);
    const doc = await ref.get();
    let data = {};
    if (doc.exists) {
      data = doc.data();
    }
    // console.log(data)
    let newData = { ...mediaMetaData, [mediaId]: data };
    setMediaMetaData(newData);
    return data;
  };

  const isVerifiedUser = () => {
    return new Promise(async (res, rej) => {
      try {
        if (!userInfo) {
          const __userInfo = await getUserProfile(user.uid);

          setuserInfo(__userInfo);
          res(__userInfo.verified);
        } else {
          res(userInfo.verified);
        }
      } catch (error) {
        rej(error);
      }
    });
  };
  const isVerifiedDoctor = () => {
    return new Promise(async (res, rej) => {
      try {
        if (!userInfo) {
          const __userInfo = await getUserProfile(user.uid);

          setuserInfo(__userInfo);
          res(__userInfo.doctorVerified);
        } else {
          setuserInfo({
            ...userInfo,
            doctorVerified: userInfo.doctorVerified ? true : false,
          });
          res(userInfo.doctorVerified);
        }
      } catch (error) {
        rej(error);
      }
    });
  };
  const updateVerifiedDoctor = async (data) => {
    return new Promise(async (res, rej) => {
      try {
        await firestore
          .collection(PROFILE_COLLECTION)
          .doc(user.uid)
          .update({
            ...data,
            docorVerifiedTime: firebase.firestore.Timestamp.now(),
          });
        setuserInfo({ ...userInfo, doctorVerified: true });
        res(userInfo.doctorVerified);
      } catch (error) {
        rej(error);
      }
    });
  };
  const getDoctorVerificationClickCount = async () => {
    return new Promise(async (res, rej) => {
      try {
        const doc = await firestore
          .collection(USERMETADATA_COLLECTION)
          .doc(user.uid)
          .get();
        if (doc.exists) {
          setuserInfo({
            ...userInfo,
            doctorVerificationClickCount:
              doc.data().doctorVerificationClickCount,
          });
          res(doc.data().doctorVerificationClickCount);
        } else {
          res(1);
        }
      } catch (error) {
        rej(error);
      }
    });
  };
  const updateDoctorVerificationClickCount = async (data) => {
    return new Promise(async (res, rej) => {
      try {
        await firestore
          .collection(USERMETADATA_COLLECTION)
          .doc(user.uid)
          .update(data);
        res();
      } catch (error) {
        rej(error);
      }
    });
  };
  const forceUpdateUserInfo = async () => {
    return new Promise(async (res, rej) => {
      try {
        const __userInfo = await getUserProfile(user.uid);
        setuserInfo(__userInfo);
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  const getUserMetaData = (uid) => {
    return new Promise(async (res, rej) => {
      try {
        if (uid) {
          const doc = await firestore
            .collection(USERMETADATA_COLLECTION)
            .doc(uid)
            .get();
          if (doc.exists) {
            setUserMetaData(doc.data());
            res(doc.data());
          }
          res();
        }
      } catch (error) {
        rej(error);
      }
    });
  };
  const getUserBronchTalkMetaData = (uid) => {
    console.log("uid", uid, BRONCHTALK_COLLECTION)
    return new Promise(async (res, rej) => {
      try {
        if (uid) {
          const doc = await firestore
            .collection(BRONCHTALK_COLLECTION)
            .doc(uid)
            .get();
          if (doc.exists) {
            setUserBronchTalkMetaData(doc.data());
            res(doc.data());
          } else {
            res();
          }
        }
      } catch (error) {
        console.log("SASasasassa here", error)
        window.error = error
        rej(error);
      }
    });
  };

  return (
    <>
      <UserContext.Provider
        value={{
          user: user,
          initalCheck,
          userInfo,
          getVideoMetaData,
          setVideoMetaData,
          mediaMetaData,
          isVerifiedUser,
          isVerifiedDoctor,
          updateVerifiedDoctor,
          forceUpdateUserInfo,
          getDoctorVerificationClickCount,
          updateDoctorVerificationClickCount,
          showNewsbanner
        }}
      >
        <UserMetaDataContext.Provider value={userMetaData}>
          <UserBronchTalkMetaDataContext.Provider value={userBronchTalkMetaData}>
            {props.children}
          </UserBronchTalkMetaDataContext.Provider>
        </UserMetaDataContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default UserContextProvider;
