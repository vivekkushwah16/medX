import { useState, useEffect, useCallback, useRef } from "react";
import { NewsManager } from "../Managers/NewsManager";


function useFetch(speciality, page) {
  let prevSpeciality = useRef(speciality);
  let lastDocRef = useRef(null);
  let lastPageRef = useRef(page);
  let limitHitRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState({ data: [], lastNews: null });

  const sendQuery = useCallback(async (repeated) => {
    try {
      await setLoading(true);
      await setError(false);
      NewsManager.getMoreNews(
        speciality,
        lastDocRef.current
      )
        .then(async (res) => {
          if (res.data.length > 0) {
            if (list.data.length !== 0) {
              const newNewsData = [...list.data];
              let newData = await newNewsData.filter(
                (d) => d.speciality === prevSpeciality.current
              );
              var allIds = await newData.map((d) => {
                return d.id;
              });

              for (let i = 0; i < res.data.length; i++) {
                if (allIds.indexOf(res.data[i].id) === -1) {
                  newData.push(res.data[i]);
                }
              }
              lastDocRef.current = res.lastVisible
              await setList({ data: newData, lastNews: res.lastVisible });
            } else {
              lastDocRef.current = res.lastVisible
              await setList({ data: res.data, lastNews: res.lastVisible });
            }
            return;
          } else {
            if (!repeated) {
              lastDocRef.current = null
              setList({ data: [], lastNews: null });
            } else {
              limitHitRef.current = true
            }
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    } catch (err) {
      setList({ data: [], lastNews: null });
      setError(err);
    }
  }, [speciality, page]);

  useEffect(() => {
    if (speciality === prevSpeciality.current) {
      if (lastPageRef.current !== page && !limitHitRef.current) {
        lastPageRef.current = page
        sendQuery(true);
      }
    } else {
      prevSpeciality.current = speciality
      lastDocRef.current = null
      lastPageRef.current = 0
      limitHitRef.current = false
      sendQuery(false);
    }
  }, [speciality, sendQuery, page]);

  return { loading, error, list: list.data };
}

export default useFetch;
