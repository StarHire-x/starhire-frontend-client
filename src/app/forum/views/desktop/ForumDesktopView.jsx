"use client";
import ForumCategoryMenu from "../../components/ForumCategoryMenu/desktop/ForumCategoryMenu";
import ForumCreatePostButton from "../../components/ForumCreatePostButton/ForumCreatePostButton";
import ForumGuidelinesCard from "../../components/ForumGuidelines/ForumGuidelinesCard";
import ForumSearchBar from "../../components/ForumSearchBar/ForumSearchBar";
import styles from "./ForumDesktopView.module.css";

const ForumDesktopView = ({ forumCategoryTitle, setForumCategoryTitle }) => {
  return (
    <>
      <h2 style={{paddingLeft: "20px"}}>Forum</h2>
      <div className={styles.pageContainer}>
        <div className={styles.categoriesMenuContainer}>
          <ForumCategoryMenu setForumCategoryTitle={setForumCategoryTitle} />
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.topMiddleContainer}>
            <div className={styles.searchBarContainer}>
              <ForumSearchBar />
            </div>
            <div className={styles.createPostBtnContainer}>
              <ForumCreatePostButton />
            </div>
          </div>
          <h2>{forumCategoryTitle}</h2>
          <div className={styles.postsContainer}></div>
        </div>
        <div className={styles.guideLinesContainer}>
          <ForumGuidelinesCard />
        </div>
      </div>
    </>
  );
};

export default ForumDesktopView;
