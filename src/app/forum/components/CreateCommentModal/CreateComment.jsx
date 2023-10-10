"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./CreateComment.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import moment from "moment";

const CreateComment = ({ userIdRef, accessToken, postData }) => {
  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  return (
    <>
      <div className={styles.dialogHeader}>
        <h1>Post #{postData.forumPostId}</h1>
      </div>
      <Card className={styles.postCard}>
        <div className={styles.postTitle}>{postData.forumPostTitle}</div>
        <div className={styles.userId}>
          {postData.isAnonymous === false
            ? `Posted By: ${postData.jobSeeker.userName}`
            : "Posted By: Anonymous"}
        </div>
        <div className={styles.postInfo}>
          <div className={styles.idTag}>#{postData.forumPostId}</div>
          <div
            className={`${styles.categoryTag} ${
              postData.forumCategory.forumCategoryTitle === "Events"
                ? styles.categoryTagEvents
                : postData.forumCategory.forumCategoryTitle === "Miscellaneous"
                ? styles.categoryTagMiscellaneous
                : postData.forumCategory.forumCategoryTitle === "Confessions"
                ? styles.categoryTagConfessions
                : styles.categoryTagCareer
            }`}
          >
            {postData.forumCategory.forumCategoryTitle}
          </div>
        </div>
        <div className={styles.content}>{postData.forumPostMessage}</div>
        <div className={styles.footer}>
          <div className={styles.dateTimeText}>
            {formatRawDate(postData.createdAt)}
          </div>
        </div>
      </Card>
    </>
  );
};

export default CreateComment;
