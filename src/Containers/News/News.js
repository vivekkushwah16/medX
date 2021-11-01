import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useHistory } from "react-router";
import { RootRoute } from "../../AppConstants/Routes";
import NewsCard from "../../Components/NewsCard/NewsCard";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { NewsManager } from "../../Managers/NewsManager";
import useFetch from "../../utils/useFetch";
import Header from "../Header/Header";
import styles from "./News.module.css";
const ValidForNews = [
  "diabetology",
  "cardiology",
  "respiratory medicine",
  "urology",
  "paediatrics",
];
const News = () => {
  const { user, userInfo } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (userInfo) {
      if (ValidForNews.indexOf(userInfo.speciality.toLowerCase()) === -1) {
        history.push(RootRoute);
      }
    }
  }, [userInfo]);

  const [speciality, setSpeciality] = useState(
    userInfo.speciality ? userInfo.speciality : "Speciality"
  );

  const [allSpeciality, setAllSpeicality] = useState([]);
  const [page, setPage] = useState(0);
  const { loading, error, list } = useFetch(speciality, page);
  const loader = useRef(null);

  useEffect(() => {
    getSpeciality();
  }, []);

  const getSpeciality = () => {
    NewsManager.getSpeciality()
      .then((res) => {
        setAllSpeicality(res);
      })
      .catch((err) => {
        setAllSpeicality([]);
      });
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    setPage(0);
  }, [speciality]);
  useEffect(() => {
    setSpeciality(userInfo.speciality);
  }, [userInfo]);

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
      <Header headerType="news" />
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
              onChange={(e) => setSpeciality(e.target.value)}
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
        </div>
      </div>
      <div ref={loader} />
    </>
  );
};

export default News;
