import { useState, useEffect, useContext, useCallback, useRef } from "react";
import NewsCard from "../../Components/NewsCard/NewsCard";
import NewsHeader from "../../Components/NewsHeader/NewsHeader";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { NewsManager } from "../../Managers/NewsManager";
import useFetch from "../../utils/useFetch";
import styles from "./News.module.css";

const News = () => {
  const { user, userInfo } = useContext(UserContext);
  const [speciality, setSpeciality] = useState(
    userInfo.speciality ? userInfo.speciality.toLowerCase() : "others"
  );
  // const [newsData, setNewsData] = useState([]);
  // const [lastNews, setLastNews] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [allSpeciality, setAllSpeicality] = useState([]);
  const [page, setPage] = useState(1);
  const { loading, error, list } = useFetch(speciality, page);
  const loader = useRef(null);
  // console.log(list)
  // useEffect(() => {
  //   // window.scroll(0, 0);
  //   let data = {
  //     speciality: speciality,
  //   };
  //   getNews(data);
  // }, [speciality]);

  useEffect(() => {
    getSpeciality();
    // document.addEventListener("scroll", trackScrolling);
    return () => {
      // document.removeEventListener("scroll", trackScrolling);
    };
  }, []);

  // const getNews = async (data) => {
  //   NewsManager.getNews(data.speciality ? data.speciality : "")
  //     .then((res) => {
  //       setNewsData(res.data);
  //       setLastNews(res.lastVisible);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // setLoading(false);
  //     });
  // };

  const getSpeciality = () => {
    NewsManager.getSpeciality()
      .then((res) => {
        setAllSpeicality(res);
      })
      .catch((err) => {
        setAllSpeicality([]);
      });
  };

  // const fetchMoreNews = () => {
  //   // setLoading(true);
  //   NewsManager.getMoreNews(speciality ? speciality : "", lastNews)
  //     .then((res) => {
  //       const newNewsData = [...newsData];
  //       for (let i = 0; i < res.data.length; i++) {
  //         if (newNewsData.indexOf(res.data[i].id) === -1) {
  //           newNewsData.push(res.data[i]);
  //         }
  //       }

  //       setNewsData(newNewsData);
  //       setLastNews(res.lastVisible);
  //       // window.scrollIntoView()
  //       // setLoading(false);
  //       // document.addEventListener("scroll", trackScrolling);
  //       window.scrollIntoView();
  //     })
  //     .catch((err) => {
  //       // setLoading(false);
  //     });
  // };

  // const isBottom = (el) => {
  //   let isBottom = false;
  //   // console.log("innerheight", el.clientHeight);
  //   // console.log("scrollHeight", window);
  //   // console.log(
  //   //   "el.getBoundingClientRect().bottom",
  //   //   el.getBoundingClientRect().bottom
  //   // );

  //   console.log("el.innerHeight", { el });

  //   let difference =
  //     el.getBoundingClientRect().bottom - el.getBoundingClientRect().height;

  //   // let sub =
  //   //   el.getBoundingClientRect().bottom + el.getBoundingClientRect().height;
  //   // let h = el.getBoundingClientRect().top + el.getBoundingClientRect().height;
  //   // console.log("object", h);
  //   // scrollTop + clientHeight >= scrollHeight - 5
  //   // let y = el.getBoundingClientRect().height - 100;
  //   // console.log("object", y);
  //   // console.log("object", (y - h) / 100);
  //   // console.log("difference", difference);
  //   // console.log("sub", sub);
  //   // console.log("percentage", (difference / 100) * sub);

  //   if (el.getBoundingClientRect().bottom <= window.innerHeight) {
  //     isBottom = true;
  //   } else {
  //     isBottom = false;
  //   }
  //   return isBottom;
  //   // return el.getBoundingClientRect().bottom <= window.innerHeight;
  // };

  // const trackScrolling = () => {
  //   const wrappedElement = document.getElementById("main_inner_news_container");
  //   if (isBottom(wrappedElement)) {
  //     console.log("header bottom reached");
  //     // fetchMoreNews();
  //     // document.removeEventListener("scroll", trackScrolling);
  //   }
  // };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <>
      <NewsHeader />
      <div className={styles["news__container"]}>
        <div
          className={styles["news__innerContainer"]}
          id="main_inner_news_container"
        >
          <h1>
            Welcome
            <span className={styles["news__person__name"]}>
              {user.displayName}
            </span>
          </h1>
          <h2>
            Here are the top stories for you on
            <select
              className="form-control"
              name="speciality"
              id={styles["stories__dropdown"]}
              style={{
                maxWidth: speciality ? `${speciality.length * 20}px` : "150px",
              }}
              value={speciality}
              onChange={(e) =>
                // e.target.value === "Speciality"
                //   ? setSpeciality("")
                //   :
                setSpeciality(e.target.value)
              }
            >
              <option>Speciality</option>
              {allSpeciality.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </h2>
          {!loading ? (
            list && list.length > 0 ? (
              list.map(
                (news) => news.enable && <NewsCard key={news.id} data={news} />
              )
            ) : (
              <div className={styles.no_news}>No News</div>
            )
          ) : (
            <div className="loaderContainer">
              <div className="lds-dual-ring"></div>
            </div>
          )}
          <div ref={loader} />
        </div>
      </div>
    </>
  );
};

export default News;
