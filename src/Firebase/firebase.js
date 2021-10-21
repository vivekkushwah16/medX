import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/analytics";
import "firebase/functions";
import "firebase/messaging";
import XLSX from "xlsx";

import { PROFILE_COLLECTION } from "../AppConstants/CollectionConstants";
import { USER_TOKEN_UPDATE } from "../AppConstants/CloudFunctionName";

const firebaseConfig = {
  apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
  authDomain: "cipla-impact.firebaseapp.com",
  databaseURL: "https://cipla-impact-default-rtdb.firebaseio.com",
  projectId: "cipla-impact",
  storageBucket: "cipla-impact.appspot.com",
  messagingSenderId: "1009487366735",
  appId: "1:1009487366735:web:1d55b85d23d818bcac383a",
  measurementId: "G-JJY7JWKTV3",
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const firestore = firebase.firestore();
export const database = firebase.database();
export const analytics = firebase.analytics();
export const auth = firebase.auth();
// export const firebaseMessaging = firebase.messaging()
export const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null


export const cloudFunction = firebase.app().functions("asia-south1");
// cloudFunction.useEmulator("localhost", 5001)

window.testCloud = (name, obj) => {
  const verifyCLoudFunctionRef = cloudFunction.httpsCallable(
    name
  );
  verifyCLoudFunctionRef(JSON.stringify(obj))
    .then((res) => {
      console.log(res)
    })
    .catch(err => console.log(err))
}
// export const cloudFunctionUS = firebase.functions()

// export const cloudFunction = firebase.functions().useEmulator("localhost", 4000);

export const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
};

export const getUserProfile = (uid) => {
  return new Promise(async (res, rej) => {
    try {
      const doc = await firestore.collection(PROFILE_COLLECTION).doc(uid).get();
      if (doc.exists) {
        res(doc.data());
      } else {
        res({});
      }
    } catch (error) {
      rej(error);
    }
  });
};
export const askForPermissionToReceiveNotifications = async (user) => {
  try {
    if (messaging) {

      // const firebaseMessaging = firebase.messaging();
      await messaging.requestPermission();
      const token = await messaging.getToken({
        vapidKey:
          "BJ9-wIY9F5wie3fzoPYHzPa34H-V_X3nkKSA7LIUpe_kRcGgX584JMojPTSvWdwQeDvOgl9F3qmipEjXVNXLnZ0",
      });
      // firestore.collection('cloudMessaging').doc(user.uid).set({
      //     uid: user.uid,
      //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      //     token: firebase.firestore.FieldValue.arrayUnion(token)
      // })
      if (token) {
        let userData = {
          uid: user.uid,
          token: token,
        };

        const cloudRef = cloudFunction.httpsCallable(USER_TOKEN_UPDATE);
        cloudRef(JSON.stringify(userData))
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // firebaseMessaging.onMessage((payload) => {
      //   console.log("Message received. ", payload);
      // });
      // console.log(firebaseMessaging);
      console.log("Your token is:", token);
      return token;

    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export const onMessageListener = (callback) => {
  if (messaging) {
    messaging.onMessage((payload) => {
      console.log("payload", payload)
      if (callback) {
        callback(payload)
      }
    });
  }
}

export const sendNotificationToTopic = (data) => {
  const cloudRef = cloudFunction.httpsCallable("sendNotificationToTopic");
  cloudRef(JSON.stringify(data))
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};


export const subscribeAllTokens = (data) => {
  const cloudRef = cloudFunction.httpsCallable("subscribeAllTokens");
  cloudRef(JSON.stringify(data))
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};


export const sendEventBasedNotification = (data) => {
  const cloudRef = cloudFunction.httpsCallable("sendEventBasedNotification");
  cloudRef(JSON.stringify(data))
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

window.sendNotificationToTopic = sendNotificationToTopic;
window.subscribeAllTokens = subscribeAllTokens;
window.sendEventBasedNotification = sendEventBasedNotification;

export const copyFromRealtoFirestore = () => {
  try {
    //1. read from db first
    const path = "/user_registered";
    database.ref(path).once(
      "value",
      async (snapShot) => {
        if (snapShot.exists()) {
          const val = snapShot.val();
          const regIds = Object.keys(val);
          for (let i = 0; i < regIds.length; i++) {
            let regId = regIds[i];
            let value = val[regId];
            //2. check if entry have a valid movile number
            if (value.hasOwnProperty("phoneNumber")) {
              //3. QUERY FIRESTORE
              const _docRef = firestore
                .collection(PROFILE_COLLECTION)
                .where("phoneNumber", "==", value["phoneNumber"]);
              //4.prepare date
              const dateTimestamp = new Date(value.date).getTime();
              //5. update date
              const query = await _docRef.get();
              if (!query.empty) {
                let _doc_id = query.docs[0].id;
                await firestore
                  .collection(PROFILE_COLLECTION)
                  .doc(_doc_id)
                  .update({
                    date: dateTimestamp,
                  });
              }
              console.log(dateTimestamp, value.phoneNumber, "Updated");
            }
          }
        }
      },
      (err) => { }
    );
  } catch (error) {
    console.log(error);
  }
};

export const exportFile = (data, sheetName, filename) => {
  const wb = XLSX.utils.book_new();
  const wsAll = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, wsAll, sheetName);
  XLSX.writeFile(wb, filename);
};
