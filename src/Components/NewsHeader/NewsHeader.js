import { useHistory } from "react-router";
import style from "./NewsHeader.module.css";
const NewsHeader = () => {
  let history = useHistory();

  const handleBackBtn = () => {
    history.push("/");
  };

  return (
    <div className={style.news__header}>
      <span className={style.headerBack__btn} onClick={handleBackBtn}>
        <svg
          width="18"
          height="25"
          viewBox="0 0 18 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2L3 14.5L16 27" stroke="white" strokeWidth="3" />
        </svg>
      </span>
      <div className={style.header__title} onClick={handleBackBtn}>
        CiplaMedX News
      </div>
    </div>
  );
};

export default NewsHeader;
