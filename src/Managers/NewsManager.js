import {
  NEWS_COLLECTION,
  SPECIALITY_COLLECTION,
} from "../AppConstants/CollectionConstants";
import { firestore } from "../Firebase/firebase";

const NEWS_LIMIT = 10;
export const NewsManager = {
  getMoreNews: (speciality, lastNews) => {
    return new Promise(async (res, rej) => {
      try {
        let ref = "";
        if (speciality && lastNews) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("Specialty", "==", speciality)
            .orderBy("timestamp", "desc")
            .startAfter(lastNews)
            .limit(NEWS_LIMIT);
        } else if (speciality && !lastNews) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("Specialty", "==", speciality)
            .orderBy("timestamp", "desc")
            .limit(NEWS_LIMIT);
        }
        //  else {
        //   ref = firestore
        //     .collection(NEWS_COLLECTION)
        //     .orderBy("timestamp", "desc")
        //     .limit(NEWS_LIMIT);
        // }
        const query = await ref.get();
        if (query.empty) {
          res({ data: [], lastVisible: "" });
        }
        const lastVisible = query && query.docs[query.docs.length - 1];
        console.log("dsdsd", query.docs);

        let _data = query.docs.map((doc) => {
          let data = doc.data();
          let newData = {
            id: doc.id,
            enable: data.enable,
            thumbnail: data.ImageURL,
            speciality: data.Specialty,
            description: data.Summary,
            title: data.Title,
            timestamp: data.timestamp,
            newsLink: data.URL,
            source: "From Crux News",
            date: "7th Jan, 2020",
          };
          return newData;
        });
        res({ data: _data, lastVisible: lastVisible });
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  },
  // getMoreNews: (speciality, lastNews) => {
  //   return new Promise(async (res, rej) => {
  //     try {
  //       let ref = "";
  //       if (speciality && lastNews) {
  //         ref = firestore
  //           .collection("news_test")
  //           .where("speciality", "==", speciality)
  //           .orderBy("timestamp", "desc")
  //           .startAfter(lastNews)
  //           .limit(NEWS_LIMIT);
  //       } else if (speciality && !lastNews) {
  //         ref = firestore
  //           .collection("news_test")
  //           .where("speciality", "==", speciality)
  //           .orderBy("timestamp", "desc")
  //           .limit(NEWS_LIMIT);
  //       }
  //       //  else {
  //       //   ref = firestore
  //       //     .collection("news_test")
  //       //     .orderBy("timestamp", "desc")
  //       //     .limit(NEWS_LIMIT);
  //       // }
  //       const query = await ref.get();
  //       if (query.empty) {
  //         res({ data: [], lastVisible: "" });
  //       }
  //       const lastVisible = query && query.docs[query.docs.length - 1];

  //       let _data = query.docs.map((doc) => {
  //         let data = doc.data();
  //         data.id = doc.id;
  //         return data;
  //       });
  //       res({ data: _data, lastVisible: lastVisible });
  //     } catch (error) {
  //       console.log(error);
  //       rej(error);
  //     }
  //   });
  // },
  getSpeciality: () => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(SPECIALITY_COLLECTION);

        const query = await ref.doc("speciality").get();
        if (query.empty) {
          res([]);
        }
        let _data = query.data().speciality;
        res(_data);
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  },
};
