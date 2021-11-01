import style from "./NewsBanner.module.css";
import { useHistory } from "react-router";
import { useContext } from "react";
import { AnalyticsContext } from "../../Context/Analytics/AnalyticsContextProvider";
import { NEWS_EXPLORE_CLICK } from "../../AppConstants/AnalyticsEventName";

const newsLogo = "./assets/images/newsLogo.png";

const NewsBanner = () => {
  let history = useHistory();
  const { addGAWithUserInfo } = useContext(AnalyticsContext);
  const handleExploreBtn = () => {
    addGAWithUserInfo(NEWS_EXPLORE_CLICK);
    history.push("/news");
  };

  return (
    <div
      className={style.newsBanner__container}
      style={{ backgroundImage: `url("./assets/images/newsBanner.png")` }}
    >
      <div className={style.newsBanner__logo}>
        <img src={newsLogo} alt="" />
      </div>
      <div className={style.newsBanner__desc}>
        <h2>Browse the latest news from trusted medical sources</h2>
        <h2 className={style.sub__title}>Read anytime, Read anywhere</h2>
      </div>
      <div className={style.newsBanner__btn}>
        <button
          className={`btn btn-secondary ${style.btn}`}
          onClick={handleExploreBtn}
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default NewsBanner;
