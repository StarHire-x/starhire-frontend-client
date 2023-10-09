"use client";
import { getAllForumPostsByForumCategory } from "@/app/api/forum/route";
import ForumCategoryMenu from "../../components/ForumCategoryMenu/desktop/ForumCategoryMenu";
import ForumCreatePostButton from "../../components/ForumCreatePostButton/ForumCreatePostButton";
import ForumGuidelinesCard from "../../components/ForumGuidelines/ForumGuidelinesCard";
import ForumSearchBar from "../../components/ForumSearchBar/ForumSearchBar";
import styles from "./ForumDesktopView.module.css";
import { useEffect } from "react";

const ForumDesktopView = ({
  forumCategoryTitle,
  setForumCategoryTitle,
  userIdRef,
  accessToken,
  forumCategories,
}) => {
  const forumCategoryTitleToId = {};
  forumCategories.forEach((category) => {
    forumCategoryTitleToId[category.forumCategoryTitle] =
      category.forumCategoryId;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (forumCategoryTitle !== "My Posts" && forumCategoryTitle !== "Recent Posts") { //don't fetch "My Posts" & "Recents Posts" here. It will be a different API method. Don't remove this line else will have console log error.
        const forumCategoryId = forumCategoryTitleToId[forumCategoryTitle];
        const response = await getAllForumPostsByForumCategory(
          forumCategoryId,
          accessToken
        );
      }
    };
    fetchData();
  }, [accessToken, forumCategoryTitle]);

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
              />
            </div>
          </div>
          <h2 style={{ marginTop: "10px" }}>{forumCategoryTitle}</h2>
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
