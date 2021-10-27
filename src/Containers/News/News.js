import { useState, useEffect, useContext } from "react";
import NewsCard from "../../Components/NewsCard/NewsCard";
import NewsHeader from "../../Components/NewsHeader/NewsHeader";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import { firestore } from "../../Firebase/firebase";
import { NewsManager } from "../../Managers/NewsManager";
import styles from "./News.module.css";

// const newsData = [
//   {
//     id: "1",
//     enable: true,
//     title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
//     thumbnail: "./assets/images/doctors.jpg",
//     date: "7th Jan, 2020",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
//     source: "From Crux News",
//     newsLink: "https://www.google.com",
//   },
//   {
//     id: "2",
//     enable: true,
//     title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
//     thumbnail: "./assets/images/doctors.jpg",
//     date: "7th Jan, 2020",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
//     source: "From Crux News",
//     newsLink: "https://www.google.com",
//   },
//   {
//     id: "3",
//     enable: true,
//     title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
//     thumbnail: "./assets/images/doctors.jpg",
//     date: "7th Jan, 2020",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
//     source: "From Crux News",
//     newsLink: "https://www.google.com",
//   },
// ];

// const SPECIALITY = [
//   "CARDIOLOGIST",
//   "CLINICAL CARDIOLOGIST",
//   "ECHO CARDIOLOGIST",
//   "PEAD CARDIOLOGIST",
//   "PRACTICING CARDIOLOGIST",
//   "INTERVENTIONAL CARDIOLOGIST",
//   "MBBS CARDIOLOGIST D CARD",
//   "MBBS DIABETOLOGIST D DIAB",
//   "CTV SURGEON",
//   "CVTS",
//   "ELECTROPHYSIOLOGIST",
//   "CHEST PHYSICIAN",
//   "PULMONOLOGIST",
//   "DIABETOLOGIST",
//   "PRACTICING DIABETOLOGIST",
//   "ENDOCRINOLOGIST",
//   "GASTRO SURGEON",
//   "GASTROENTEROLOGIST",
//   "DENTIST",
//   "DERMATOLOGIST",
//   "COSMETIC DERMATOLOGIST",
//   "COSMETIC SURGEON",
//   "PAEDIATRIC DERMATOLOGIST",
//   "PLASTIC SURGEON",
//   "HAIR TRANSPLANT SURGEON",
//   "TRICHOLOGIST",
//   "OPHTHALMOLOGIST",
//   "OPTH CATARACT",
//   "OPTHAL CORNEA",
//   "OPTHAL GLAUCOMA",
//   "OPTHAL PHACO",
//   "OPTHAL RETINA",
//   "OPTOMETRIST",
//   "ORTHOPEDICIAN",
//   "ORTHO SURGEON",
//   "GYNAECOLOGIST",
//   "HAEMATOLOGIST",
//   "IVF",
//   "EMBRYOLOGIST",
//   "NEUROSURGEON",
//   "NEUROLOGIST",
//   "PAED NEUROLOGIST",
//   "PSYCHIATRIST",
//   "ID SPECIALIST",
//   "INTENSIVE CARE",
//   "PRACTICING ICU CCU",
//   "PAEDIATRICIAN",
//   "NEONATOLOGIST",
//   "ONCOLOGIST",
//   "RADIATION ONCOLOGIST",
//   "RHEUMATOLOGIST",
//   "NEPHROLOGIST",
//   "SURGEON",
//   "PAEDIATRIC SURGEON",
//   "ENT SURGEON",
//   "URO ONCOLOGIST",
//   "UROLOGIST",
//   "VASCULAR SURGEON",
//   "MICROBIOLOGIST",
//   "GENERAL PHYSICIAN",
//   "CONSULTANT PHYSICIAN",
//   "GP NON MBBS",
//   "ANAESTHETIST",
//   "NON MBBS",
//   "PURCHASE PHARMACY",
//   "OTHERS",
// ];

const News = () => {
  const [speciality, setSpeciality] = useState(null);
  const { user } = useContext(UserContext);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSpeciality, setAllSpeicality] = useState([]);

  useEffect(() => {
    window.scroll(0, 0);
    let data = {
      speciality: speciality,
    };
    getNews(data);
  }, [speciality]);

  useEffect(() => {
    getSpeciality();
  }, []);

  const getNews = async (data) => {
    NewsManager.getNews(data.speciality ? data.speciality : "")
      .then((res) => {
        setNewsData(res);
        setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
      });
  };

  const getSpeciality = () => {
    NewsManager.getSpeciality()
      .then((res) => {
        setAllSpeicality(res);
      })
      .catch((err) => {
        setAllSpeicality([]);
      });
  };

  return (
    <>
      <NewsHeader />
      <div className={styles["news__container"]}>
        <div className={styles["news__innerContainer"]}>
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
            newsData.length > 0 ? (
              newsData.map(
                (news) => news.enable && <NewsCard key={news.id} data={news} />
              )
            ) : (
              <div>No News</div>
            )
          ) : (
            <div className="loaderContainer">
              <div className="lds-dual-ring"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
