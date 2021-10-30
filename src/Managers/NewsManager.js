import {
  NEWS_COLLECTION,
  SPECIALITY_COLLECTION,
} from "../AppConstants/CollectionConstants";
import { firestore } from "../Firebase/firebase";

const NEWS_LIMIT = 10;
export const NewsManager = {
  getNews: (speciality) => {
    return new Promise(async (res, rej) => {
      try {
        let ref = "";
        if (speciality) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("speciality", "==", speciality)
            .orderBy("timestamp", "desc")
            .limit(NEWS_LIMIT);
        } else {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .orderBy("timestamp", "desc")
            .limit(NEWS_LIMIT);
        }
        const query = await ref.get();
        if (query.empty) {
          res({ data: [], lastVisible: "" });
        }
        const lastVisible = query && query.docs[query.docs.length - 1];

        let _data = query.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        });
        res({ data: _data, lastVisible: lastVisible });
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  },
  getMoreNews: (speciality, lastNews) => {
    return new Promise(async (res, rej) => {
      try {
        let ref = "";
        if (speciality && lastNews) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("speciality", "==", speciality)
            .orderBy("timestamp", "desc")
            .startAfter(lastNews)
            .limit(NEWS_LIMIT);
        } else if (speciality && !lastNews) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("speciality", "==", speciality)
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

        let _data = query.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        });
        res({ data: _data, lastVisible: lastVisible });
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  },
  getSpeciality: () => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(SPECIALITY_COLLECTION);
        // const ref2 = firestore.collection(NEWS_COLLECTION);

        // let data = {
        //   date: "8th Jan, 2020",
        //   description:
        //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.2",
        //   enable: true,
        //   newsLink: "https://www.google.com",
        //   source: "From Crux News2",
        //   speciality: "cvts",
        //   thumbnail: "./assets/images/doctors.jpg",
        //   timestamp: "",
        //   title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.2",
        // };
        // const query2 = await ref2.doc().set(data);

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
