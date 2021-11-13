import React, { useEffect, useState, useRef } from "react";
import {
  POLLRESPONSE_COLLECTION,
  POLL_COLLECTION,
  PROFILE_COLLECTION,
} from "../../AppConstants/CollectionConstants";
import { firestore } from "../../Firebase/firebase";
import "./PollResponseContainer.css";
import { exportFile } from "../../utils/index";

var userRecord = {};

const PollResponseContainer = ({ eventId: id }) => {
  let [pollData, setPollData] = useState(null);
  let excelData = useRef({});
  let excelKeys = useRef({});

  useEffect(() => {
    getPollData();
  }, []);

  const getPollData = async () => {
    try {
      let eventId = id && id.toLowerCase();

      let docrRef = firestore
        .collection(POLL_COLLECTION)
        .where("eventId", "==", eventId)
        .orderBy("timestamp", "desc");

      await docrRef.get().then(async (data) => {
        let newQuestionsArray = [];
        excelKeys.current = {};

        for (let i = data.docs.length - 1; i > -1; i--) {
          let doc = data.docs[i];

          let newObj = {
            question: doc.data().question,
            options: doc.data().options,
            totalResponse: doc.data().totalResponse,
            pollId: doc.data().id,
          };

          excelKeys.current = {
            ...excelKeys.current,
            [doc.data().id]: doc.data().question,
          };

          newQuestionsArray.push(newObj);
        }
        let usersObj = await getPollResponseData();
        setPollData({ users: usersObj, questions: newQuestionsArray });

        excelData.current = {};
        Object.keys(usersObj).forEach((userId) => {
          let userResponseObj = usersObj[userId];
          let userExcelRow = {
            email: userResponseObj[0].email,
            mobileNumber: userResponseObj[0].phoneNumber,
            userId: userResponseObj[0].user,
          };

          userResponseObj.forEach((res) => {
            let pollId = res.targetId;
            let pollResponse = res.option.value;
            userExcelRow[excelKeys.current[pollId]] = pollResponse;
          });

          excelData.current = {
            ...excelData.current,
            [userId]: userExcelRow,
          };
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const exportExcelSheet = () => {
    let eventId = id && id.toLowerCase();
    exportFile(
      Object.values(excelData.current),
      `${eventId} Poll Data`,
      `${eventId}_PollData_${new Date().getTime()}.xlsx`
    );
  };

  const getPollResponseData = async () => {
    try {
      let usersObj = {};
      let eventId = id && id.toLowerCase();

      let docrRef = firestore
        .collection(POLLRESPONSE_COLLECTION)
        .where("eventId", "==", eventId); //.orderBy("timestamp")

      await docrRef.get().then(async (data) => {
        // Accepts the array and key
        const groupBy = (array, key) => {
          // Return the end result
          return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue.data()[key]] =
              result[currentValue.data()[key]] || []).push(currentValue.data());
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
          }, {}); // empty object is the initial value for result object
        };

        // Group by color as key to the person array
        usersObj = groupBy(data.docs, "user");

        // console.log(usersObj);

        let userKeys = Object.keys(usersObj);
        for (let i = 0; i < userKeys.length; i++) {
          let key = userKeys[i];
          let _userRecord = await getUserData(key);

          usersObj[key].map((data2) => {
            if (key === data2.user) data2.email = _userRecord.email;
            data2.phoneNumber = _userRecord.phoneNumber;
          });
        }
      });
      return usersObj;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async (uid) => {
    return new Promise(async (res, rej) => {
      try {
        if (userRecord.hasOwnProperty(uid)) {
          res(userRecord[uid]);
        }
        const ref = firestore.collection(PROFILE_COLLECTION).doc(uid);
        const doc = await ref.get();
        if (!doc.exists) {
          let error = { code: "404", mesage: "userNotFound" };
          throw error;
        }
        let _data = doc.data();
        userRecord = {
          ...userRecord,
          [uid]: _data,
        };
        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  };

  const getData = (id) => {
    let newObj = {};
    let options = [];
    pollData.users[id].map((user, index) => {
      newObj.email = user.email;
      newObj.phoneNumber = user.phoneNumber;
      options.push({ ...user.option, targetId: user.targetId });
    });
    return { ...newObj, options: options };
  };

  const getOption = (id, val) => {
    let ans = [];
    val.map((data) => (data.targetId === id ? ans.push(data.value) : "-"));
    return ans;
  };

  return (
    <div style={{ width: "100%", overflow: "auto" }}>
      {pollData ? (
        <div className="PollResponseContainer_body" style={{ height: "100vh" }}>
          {pollData.questions.length > 0 ? (
            <>
              <div className="pr-btn-container" style={{ top: 0 }}>
                <button
                  className="btn btn-secondary mg-b20"
                  onClick={(event) => {
                    if (event) {
                      event.preventDefault();
                    }
                    getPollData();
                  }}
                >
                  Update
                </button>

                <button
                  className="btn btn-secondary mg-b20"
                  onClick={(event) => {
                    if (event) {
                      event.preventDefault();
                    }
                    exportExcelSheet();
                  }}
                >
                  Download
                </button>
              </div>
              <table id="pollResponse">
                <thead key={`Question-header`} className="sticky">
                  <tr>
                    <th key={`index`} className="poll_serial">
                      S No.
                    </th>
                    <th key={`Email`}>Email</th>
                    {pollData.questions.map((question, index) => (
                      <th key={question.pollId}>{question.question}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(pollData.users).map((key, index) => {
                    const { email, options } = getData(key);
                    return (
                      <tr key={`${key}_${index}`}>
                        <td key={"index"} className="poll_serial">
                          {index + 1}
                        </td>
                        <td key={"email"} className="left-sticky">
                          {email}
                        </td>
                        {pollData.questions.map((question, index) => (
                          <td key={question.pollId}>
                            {getOption(question.pollId, options)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div className="no-poll"> No Polls</div>
          )}
        </div>
      ) : (
        <div className="no-poll" style={{ height: "100vh" }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default PollResponseContainer;
