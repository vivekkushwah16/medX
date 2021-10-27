import { useState, useEffect } from "react";
import NewsCard from "../../Components/NewsCard/NewsCard";
import NewsHeader from "../../Components/NewsHeader/NewsHeader";
import styles from "./News.module.css";

const dropDownIcon = () => {
  return (
    <svg
      width="17"
      height="11"
      viewBox="0 0 17 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L8.5 9L16 1" stroke="#25B9D3" strokeWidth="2" />
    </svg>
  );
};

const newsData = [
  {
    id: "1",
    enable: true,
    title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
    thumbnail: "./assets/images/doctors.jpg",
    date: "7th Jan, 2020",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
    source: "From Crux News",
    newsLink: "https://www.google.com",
  },
  {
    id: "2",
    enable: true,
    title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
    thumbnail: "./assets/images/doctors.jpg",
    date: "7th Jan, 2020",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
    source: "From Crux News",
    newsLink: "https://www.google.com",
  },
  {
    id: "3",
    enable: true,
    title: "Lorem ipsum dolor sit amet, consect etur adipiscing elit.",
    thumbnail: "./assets/images/doctors.jpg",
    date: "7th Jan, 2020",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque est maecenas id arcu. Placerat in faucibus amet massa consectetur vitae.Diam ipsum.",
    source: "From Crux News",
    newsLink: "https://www.google.com",
  },
];

const SPECIALITY = [
  "CARDIOLOGIST",
  "CLINICAL CARDIOLOGIST",
  "ECHO CARDIOLOGIST",
  "PEAD CARDIOLOGIST",
  "PRACTICING CARDIOLOGIST",
  "INTERVENTIONAL CARDIOLOGIST",
  "MBBS CARDIOLOGIST D CARD",
  "MBBS DIABETOLOGIST D DIAB",
  "CTV SURGEON",
  "CVTS",
  "ELECTROPHYSIOLOGIST",
  "CHEST PHYSICIAN",
  "PULMONOLOGIST",
  "DIABETOLOGIST",
  "PRACTICING DIABETOLOGIST",
  "ENDOCRINOLOGIST",
  "GASTRO SURGEON",
  "GASTROENTEROLOGIST",
  "DENTIST",
  "DERMATOLOGIST",
  "COSMETIC DERMATOLOGIST",
  "COSMETIC SURGEON",
  "PAEDIATRIC DERMATOLOGIST",
  "PLASTIC SURGEON",
  "HAIR TRANSPLANT SURGEON",
  "TRICHOLOGIST",
  "OPHTHALMOLOGIST",
  "OPTH CATARACT",
  "OPTHAL CORNEA",
  "OPTHAL GLAUCOMA",
  "OPTHAL PHACO",
  "OPTHAL RETINA",
  "OPTOMETRIST",
  "ORTHOPEDICIAN",
  "ORTHO SURGEON",
  "GYNAECOLOGIST",
  "HAEMATOLOGIST",
  "IVF",
  "EMBRYOLOGIST",
  "NEUROSURGEON",
  "NEUROLOGIST",
  "PAED NEUROLOGIST",
  "PSYCHIATRIST",
  "ID SPECIALIST",
  "INTENSIVE CARE",
  "PRACTICING ICU CCU",
  "PAEDIATRICIAN",
  "NEONATOLOGIST",
  "ONCOLOGIST",
  "RADIATION ONCOLOGIST",
  "RHEUMATOLOGIST",
  "NEPHROLOGIST",
  "SURGEON",
  "PAEDIATRIC SURGEON",
  "ENT SURGEON",
  "URO ONCOLOGIST",
  "UROLOGIST",
  "VASCULAR SURGEON",
  "MICROBIOLOGIST",
  "GENERAL PHYSICIAN",
  "CONSULTANT PHYSICIAN",
  "GP NON MBBS",
  "ANAESTHETIST",
  "NON MBBS",
  "PURCHASE PHARMACY",
  "OTHERS",
];

const News = () => {
  const [speciality, setSpeciality] = useState(null);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  //   console.log("object", speciality);

  return (
    <>
      <NewsHeader />
      <div className={styles["news__container"]}>
        <div className={styles["news__innerContainer"]}>
          <h1>
            Welcome
            <span className={styles["news__person__name"]}>
              Dr Pranab Baral
            </span>
          </h1>
          <h2>
            Here are the top stories for you on
            {/* Respiratory Medicine <span>{dropDownIcon()}</span> */}
            {console.log("object", speciality)}
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
              {SPECIALITY.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </h2>
          {newsData.map(
            (news) => news.enable && <NewsCard key={news.id} data={news} />
          )}
        </div>
      </div>
    </>
  );
};

export default News;
