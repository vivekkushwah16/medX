import style from "./NewsBanner.module.css";
const newsLogo = "./assets/images/newsLogo.png";

const NewsBanner = () => {
  const handleExploreBtn = () => {
    console.log("explore clicked");
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
