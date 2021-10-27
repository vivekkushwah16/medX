import {
  NEWS_COLLECTION,
  SPECIALITY_COLLECTION,
} from "../AppConstants/CollectionConstants";
import { firestore } from "../Firebase/firebase";

export const NewsManager = {
  getNews: (speciality) => {
    return new Promise(async (res, rej) => {
      try {
        let ref = "";
        if (speciality) {
          ref = firestore
            .collection(NEWS_COLLECTION)
            .where("speciality", "==", speciality)
            .limit(10);
        } else {
          ref = firestore.collection(NEWS_COLLECTION).limit(10);
        }
        const query = await ref.get();
        if (query.empty) {
          res([]);
        }
        let _data = query.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        });
        res(_data);
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
