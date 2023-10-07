"user client";
import ForumCategoryMenuMobile from "../../components/ForumCategoryMenu/mobile/ForumCategoryMenuMobile";
import styles from "./ForumMobileView.module.css";
const ForumMobileView = ({ forumCategoryTitle, setForumCategoryTitle }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.categoriesMenuContainer}>
        <ForumCategoryMenuMobile
          setForumCategoryTitle={setForumCategoryTitle}
          forumCategoryTitle={forumCategoryTitle}
        />
      </div>
      <h2>{forumCategoryTitle}</h2>
    </div>
  );
};

export default ForumMobileView;
