import { NEWS_COLLECTION } from "../AppConstants/CollectionConstants";
import { firestore } from "../Firebase/firebase";

export const NewsManager = {
  getNews: (speciality) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore
          .collection(NEWS_COLLECTION)
          .where("speciality", "==", speciality)
          .limit(10);
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
};
