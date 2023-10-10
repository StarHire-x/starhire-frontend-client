"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./CreateComment.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import moment from "moment";

const CreateComment = ({ userIdRef, accessToken, postData }) => {
  const [comment, setComment] = useState("");
  const maxCharacterCount = 8000;

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const [formData, setFormData] = useState({
    createdAt: new Date(),
    isAnonymous: false,
    // forumPostId: "",
    jobSeekerId: userIdRef,
    forumCommentMessage: "",
  });

  // const handleCommentChange = (e) => {
  //   setComment(e.target.value);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     forumCommentMessage: e.target.value,
  //   }));
  // };

  const handleCommentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setComment(inputValue);
      setFormData((prevData) => ({
        ...prevData,
        forumCommentMessage: e.target.value,
      }));
    }
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

      <div className={styles.leaveCommentContainer}>
        <div className={styles.leaveCommentHeader}>
          <h3>Leave a comment!</h3>
        </div>
        <div className={styles.leaveCommentContent}>
          <InputTextarea
            rows={2}
            cols={75}
            value={comment}
            onChange={(e) => handleCommentChange(e)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.characterCount}>{maxCharacterCount - comment.length} characters left</div>
      </div>
      <div className={styles.allCommentsContainer}>
        <div className={styles.allCommentsHeader}>
          <h3>All Comments</h3>
        </div>
      </div>
    </>
  );
};

export default CreateComment;
