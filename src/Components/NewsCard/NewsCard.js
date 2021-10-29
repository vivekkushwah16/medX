import styles from "./NewsCard.module.css";
import ShareVideoLink from "../../Components/ShareVideoLink/ShareVideoLink";
import { useContext, useState } from "react";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import {
  NEWS_READMORE_CLICK,
  NEWS_SHARE_CLICK,
} from "../../AppConstants/AnalyticsEventName";

// share icon
const shareIcon = () => {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.98146 11.0536C3.72518 11.0514 4.44076 10.769 4.98561 10.2628L10.3085 13.3043C10.1301 14.0012 10.2087 14.7391 10.5299 15.3827C10.8511 16.0264 11.3934 16.5329 12.0575 16.8094C12.7216 17.0859 13.463 17.1141 14.1462 16.8886C14.8293 16.6631 15.4083 16.1992 15.7773 15.5816C16.1463 14.9641 16.2806 14.2344 16.1555 13.526C16.0304 12.8176 15.6544 12.1779 15.0962 11.7241C14.5381 11.2703 13.8352 11.0326 13.1161 11.0547C12.3971 11.0768 11.7101 11.3571 11.1809 11.8444L5.85801 8.80287C5.91413 8.59029 5.94474 8.37007 5.94984 8.14984L11.1792 5.16105C11.6827 5.61917 12.3284 5.89018 13.0081 5.92863C13.6877 5.96707 14.3599 5.77061 14.9119 5.37219C15.4639 4.97378 15.8621 4.39766 16.0396 3.74048C16.2172 3.08331 16.1633 2.38506 15.8871 1.76288C15.6109 1.1407 15.1291 0.632444 14.5225 0.323381C13.916 0.0143181 13.2216 -0.076749 12.5559 0.0654573C11.8902 0.207664 11.2936 0.574491 10.8663 1.1044C10.439 1.63431 10.2069 2.29506 10.209 2.97579C10.2124 3.22068 10.2455 3.46471 10.3085 3.7011L5.47538 6.462C5.1951 6.02841 4.80684 5.67518 4.34875 5.43704C3.89066 5.19889 3.37849 5.08402 2.86257 5.1037C2.34665 5.12338 1.84472 5.27695 1.40611 5.54931C0.967493 5.82167 0.607278 6.20345 0.360855 6.65714C0.114433 7.11083 -0.00972055 7.62083 0.000594096 8.13702C0.0109087 8.65322 0.155336 9.15785 0.419687 9.60134C0.684037 10.0448 1.05922 10.4119 1.50836 10.6665C1.95751 10.9211 2.46517 11.0545 2.98146 11.0536Z"
        fill="#9D9D9D"
      />
    </svg>
  );
};
function truncate(str, limit) {
  if (str.length > limit) {
    return str.substring(0, limit) + " ...";
  }
  return str;
}

const NewsCard = ({ data }) => {
  const [share, setshare] = useState({ open: false, newsLink: "" });
  const { addGAWithUserInfo } = useContext(AnalyticsContext);

  const handleReadMoreBtn = (alldata) => {
    addGAWithUserInfo(NEWS_READMORE_CLICK, {
      newsLink: alldata.newsLink,
      id: alldata.id,
      title: alldata.title,
      speciality: alldata.speciality,
    });
    window.open(alldata.newsLink, "_blank");
  };

  const handleShareBtn = (alldata) => {
    addGAWithUserInfo(NEWS_SHARE_CLICK, {
      newsLink: alldata.newsLink,
      id: alldata.id,
      title: alldata.title,
      speciality: alldata.speciality,
    });
    setshare({ open: true, newsLink: alldata.newsLink });
  };

  return (
    <>
      <div className={styles["newsCard__container"]}>
        <div className={styles["upperContainer"]}>
          <div className={styles["title"]}>{data.title}</div>
          <div className={styles["image"]}>
            <img src={data.thumbnail} alt="" />
          </div>
        </div>
        <div className={styles["date"]}>{data.date}</div>
        <div className={styles["description"]}>
          {truncate(data.description, 210)}
          <div
            onClick={() => handleReadMoreBtn(data)}
            className={styles["readMore__Btn"]}
          >
            Read More
          </div>
        </div>
        <div className={styles["shareBtn"]}>
          <div
            onClick={() => handleShareBtn(data)}
            className={styles["shareBtn__container"]}
          >
            <span className={styles["shareBtn__container__icon"]}>
              {shareIcon()}
            </span>
            Share
          </div>
        </div>
        <div className={styles["source"]}>{data.source}</div>
      </div>
      {share.open && (
        <ShareVideoLink
          hideEmail
          message={`Check out this news from CiplaMedX: LINK: ${data.newsLink}`}
          zIndex={18}
          forcedURL={data.newsLink}
          email_endpoint={
            "https://ciplamedx-mail.djvirtualevents.com/shareVideo"
          }
          closeInvitePopup={() => setshare({ open: false, newsLink: "" })}
          title={data.title}
        />
      )}
    </>
  );
};

export default NewsCard;
