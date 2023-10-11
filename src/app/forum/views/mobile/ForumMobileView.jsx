"use client";
import { Button } from "primereact/button";
import ForumCategoryMenuMobile from "../../components/ForumCategoryMenu/mobile/ForumCategoryMenuMobile";
import styles from "./ForumMobileView.module.css";
import ForumCreatePostButton from "../../components/ForumCreatePostButton/ForumCreatePostButton";
import ForumSearchBar from "../../components/ForumSearchBar/ForumSearchBar";
import { Dialog } from "primereact/dialog";
import ForumGuidelinesCard from "../../components/ForumGuidelines/ForumGuidelinesCard";
import { useState } from "react";
import ForumPosts from "../../components/ForumPosts/ForumPosts";
const ForumMobileView = ({
  forumCategoryTitle,
  setForumCategoryTitle,
  forumCategories,
  userIdRef,
  accessToken,
  forumPosts,
  setRefreshData,
  onSearchQueryChange,
  searchQuery,
  setForumGuideLinesByCategory,
  forumGuideLinesByCategory
}) => {
  const [guideLinesVisibility, setGuideLinesVisibility] = useState(false);
  return (
    <>
      <div className={styles.pageHeader}>
        <h2>Forum</h2>
        <Button
          className={styles.infoButton}
          icon="pi pi-info"
          rounded
          onClick={() => setGuideLinesVisibility(true)}
        />
      </div>
      <div className={styles.createPostBtnContainer}>
        <ForumCreatePostButton
          forumCategories={forumCategories}
          userIdRef={userIdRef}
          accessToken={accessToken}
          setRefreshData={setRefreshData}
        />
      </div>

      <div className={styles.pageContainer}>
        <Dialog
          header="Forum Community Guidelines"
          visible={guideLinesVisibility}
          onHide={() => setGuideLinesVisibility(false)}
        >
          <ForumGuidelinesCard forumCategoryTitle={forumCategoryTitle} forumGuideLinesByCategory={forumGuideLinesByCategory} />
        </Dialog>
        <div className={styles.utilityContainer}>
          <ForumSearchBar
            onSearchQueryChange={onSearchQueryChange}
            searchQuery={searchQuery}
          />
          <div className={styles.categoryMenuContainer}>
            <ForumCategoryMenuMobile
              setForumCategoryTitle={setForumCategoryTitle}
              forumCategoryTitle={forumCategoryTitle}
              forumCategories={forumCategories}
              setForumGuideLinesByCategory={setForumGuideLinesByCategory}
            />
          </div>
        </div>
        <h2>{forumCategoryTitle}</h2>
        <div className={styles.postsContainer}>
          <ForumPosts
            forumPosts={forumPosts}
            userIdRef={userIdRef}
            accessToken={accessToken}
            setRefreshData={setRefreshData}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </>
  );
};

export default ForumMobileView;
