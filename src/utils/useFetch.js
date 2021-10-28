import { useState, useEffect, useCallback, useRef } from "react";
import { NewsManager } from "../Managers/NewsManager";

function useFetch(speciality, page) {
  //   let lastNews = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [lastNews, setLastNews] = useState(null);

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      NewsManager.getMoreNews(speciality ? speciality : "", lastNews)
        .then(async (res) => {
          if (res.data.length > 0) {
            console.log("object", res);
            console.log("list", list);
            if (list.length !== 0) {
              const newNewsData = [...list];

              let newData = newNewsData.filter(
                (d) => d.speciality === speciality
              );

              var allIds = newData.map((d) => {
                return d.id;
              });

              for (let i = 0; i < res.data.length; i++) {
                if (allIds.indexOf(res.data[i].id) === -1) {
                  newData.push(res.data[i]);
                }
              }
              //   lastNews.current.value = res.lastVisible;
              setLastNews(res.lastVisible);
              setList(newData);
            } else {
              console.log("hrere", res.data);
              //   lastNews.current.value = res.lastVisible;

              setList(res.data);
              setLastNews(res.lastVisible);
            }
          } else {
            // lastNews.current.value = null;

            setLastNews(null);
            setList([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [speciality, page]);

  useEffect(() => {
    sendQuery(speciality);
  }, [speciality, sendQuery, page]);

  return { loading, error, list };
}

export default useFetch;
