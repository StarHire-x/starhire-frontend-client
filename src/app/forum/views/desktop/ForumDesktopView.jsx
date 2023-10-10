"use client";
import ForumCategoryMenu from "../../components/ForumCategoryMenu/desktop/ForumCategoryMenu";
import ForumCreatePostButton from "../../components/ForumCreatePostButton/ForumCreatePostButton";
import ForumGuidelinesCard from "../../components/ForumGuidelines/ForumGuidelinesCard";
import ForumSearchBar from "../../components/ForumSearchBar/ForumSearchBar";
import ForumPosts from "../../components/ForumPosts/ForumPosts";
import styles from "./ForumDesktopView.module.css";
import { useEffect } from "react";

const ForumDesktopView = ({
  forumCategoryTitle,
  setForumCategoryTitle,
  userIdRef,
  accessToken,
  forumCategories,
  forumPosts,
  setRefreshData
}) => {

  return (
    <>
      <h2 style={{ paddingLeft: "20px" }}>Forum</h2>
      <div className={styles.pageContainer}>
        <div className={styles.categoriesMenuContainer}>
          <ForumCategoryMenu
            forumCategories={forumCategories}
            setForumCategoryTitle={setForumCategoryTitle}
          />
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.topMiddleContainer}>
            <div className={styles.searchBarContainer}>
              <ForumSearchBar />
            </div>
            <div className={styles.createPostBtnContainer}>
              <ForumCreatePostButton
                userIdRef={userIdRef}
                accessToken={accessToken}
                forumCategories={forumCategories}
                setRefreshData={setRefreshData}
              />
            </div>
          </div>
          <h2 style={{ marginTop: "10px" }}>{forumCategoryTitle}</h2>
          <div className={styles.postsContainer}>
            <ForumPosts forumPosts={forumPosts} userIdRef={userIdRef} accessToken={accessToken}/>
          </div>
        </div>
        <div className={styles.guideLinesContainer}>
          <ForumGuidelinesCard />
        </div>
      </div>
    </>
  );
};

export default ForumDesktopView;
