import { useState, useEffect, useCallback, useRef } from "react";
import { NewsManager } from "../Managers/NewsManager";

function useFetch(speciality, page) {
  let prevSpeciality = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState({ data: [], lastNews: null });

  console.log("list", list);
  console.log("speciality", speciality);
  console.log("page", page);

  const sendQuery = useCallback(async () => {
    console.log("DSdsdsdsds", prevSpeciality.current);
    console.log(
      "prevSpeciality.current !== speciality ? null : list.lastNews",
      prevSpeciality.current !== speciality ? null : list.lastNews
    );
    try {
      await setLoading(true);
      await setError(false);
      NewsManager.getMoreNews(
        prevSpeciality.current !== speciality
          ? speciality
          : prevSpeciality.current,
        prevSpeciality.current !== speciality ? null : list.lastNews
      )
        .then(async (res) => {
          //   prevSpeciality.current = speciality;
          if (res.data.length > 0) {
            // console.log("object", res);
            // console.log("list", list.data);
            if (list.data.length !== 0) {
              const newNewsData = [...list.data];

              let newData = await newNewsData.filter(
                (d) => d.prevSpeciality.current === prevSpeciality.current
              );

              var allIds = await newData.map((d) => {
                return d.id;
              });

              for (let i = 0; i < res.data.length; i++) {
                if (allIds.indexOf(res.data[i].id) === -1) {
                  newData.push(res.data[i]);
                }
              }
              await setList({ data: newData, lastNews: res.lastVisible });
            } else {
              //   console.log("hrere", res.data);
              await setList({ data: res.data, lastNews: res.lastVisible });
            }
            return;
          } else {
            // console.log("Asaasasaasasasa here");
            setList({ data: [], lastNews: null });
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    } catch (err) {
      //   console.log("Asaasasaasasasa dsdssdsdssdsds");
      setList({ data: [], lastNews: null });
      setError(err);
    }
  }, [speciality, page]);

  useEffect(() => {
    sendQuery(speciality);
  }, [speciality, sendQuery, page]);

  useEffect(() => {
    //   console.log(
    //     "specialifsdiodhgkidhfkjdfhndzjkgrdnkjdrbngjsdgbsdfhjg",
    //     speciality
    //   );
    prevSpeciality.current = speciality;
    //   setList({ list: null, lastNews: null });
  }, [speciality]);

  return { loading, error, list: list.data };
}

export default useFetch;
