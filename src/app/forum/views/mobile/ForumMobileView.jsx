"use client";
import { Button } from "primereact/button";
import ForumCategoryMenuMobile from "../../components/ForumCategoryMenu/mobile/ForumCategoryMenuMobile";
import styles from "./ForumMobileView.module.css";
import ForumCreatePostButton from "../../components/ForumCreatePostButton/ForumCreatePostButton";
import ForumSearchBar from "../../components/ForumSearchBar/ForumSearchBar";
import { Dialog } from "primereact/dialog";
import ForumGuidelinesCard from "../../components/ForumGuidelines/ForumGuidelinesCard";
import { useState } from "react";
const ForumMobileView = ({
  forumCategoryTitle,
  setForumCategoryTitle,
  forumCategories,
  userIdRef,
  accessToken,
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

      <div className={styles.pageContainer}>
        <Dialog
          header="Forum Community Guidelines"
          visible={guideLinesVisibility}
          onHide={() => setGuideLinesVisibility(false)}
        >
          <ForumGuidelinesCard />
        </Dialog>
        <div className={styles.utilityContainer}>
          <ForumSearchBar />
          <div className={styles.categoryMenuContainer}>
            <ForumCategoryMenuMobile
              setForumCategoryTitle={setForumCategoryTitle}
              forumCategoryTitle={forumCategoryTitle}
              forumCategories={forumCategories}
            />
          </div>
        </div>
        <h2>{forumCategoryTitle}</h2>
        <div className={styles.postsContainer}></div>
        <div className={styles.createPostBtnContainer}>
          <ForumCreatePostButton
            forumCategories={forumCategories}
            userIdRef={userIdRef}
            accessToken={accessToken}
          />
        </div>
      </div>
    </>
  );
};

export default ForumMobileView;
