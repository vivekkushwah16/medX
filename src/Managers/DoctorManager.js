import { DOCTOR_COLLECTION } from "../AppConstants/CollectionConstants";
import { firestore } from "../Firebase/firebase";

export const DoctorManager = {
  getDoctor: (data) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore
          .collection(DOCTOR_COLLECTION)
          .where("registrationId", "==", data.regId)
          .where("year", "==", parseInt(data.year));
        const query = await ref.get();
        if (query.empty) {
          res([]);
        }
        let _data = query.docs.map((doc) => doc.data());
        res(_data);
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  },
};
