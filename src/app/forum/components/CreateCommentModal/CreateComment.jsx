"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./CreateComment.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import moment from "moment";
import { Button } from "primereact/button";
import { createComment } from "@/app/api/forum/route";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

const CreateComment = ({
  userIdRef,
  accessToken,
  postData,
  setRefreshData,
}) => {
  const [comment, setComment] = useState("");
  const [commentValid, setCommentValid] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const maxCharacterCount = 8000;
  const toast = useRef(null);

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const [formData, setFormData] = useState({
    createdAt: new Date(),
    isAnonymous: false,
    forumPostId: postData.forumPostId,
    jobSeekerId: userIdRef,
    forumCommentMessage: "",
  });

  const handleCommentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setComment(inputValue);
      setCommentValid(inputValue.trim() !== ''); 
      setFormData((prevData) => ({
        ...prevData,
        forumCommentMessage: e.target.value,
      }));
    }
  };

  const handleAnonymousChange = (e) => {
    setAnonymous(e.checked);
    setFormData((prevData) => ({
      ...prevData,
      isAnonymous: e.checked,
    }));
  };

  const resetForm = () => {
    setComment("");
    setAnonymous(false);
    setCommentValid(false);
    setFormData({
      createdAt: new Date(),
      isAnonymous: false,
      forumPostId: postData.forumPostId,
      jobSeekerId: userIdRef,
      forumCommentMessage: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentValid) {
      setFormValid(true);

      try {
        const response = await createComment(formData, accessToken);
        console.log("Forum comment has been created");
        resetForm();
        setRefreshData((prev) => !prev);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Your comment has been posted",
          life: 5000,
        });
      } catch (error) {
        console.error(
          "There was an error creating the forum comment",
          error.message
        );
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "There was an error creating the forum comment",
          life: 5000,
        });
      }
    } else {
      setFormValid(false);

      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please leave a comment",
        life: 5000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.leaveCommentHeader}>
            <h3>Leave a comment!</h3>
          </div>
          <div className={styles.leaveCommentContent}>
            <InputTextarea
              rows={5}
              cols={75}
              value={comment}
              onChange={(e) => handleCommentChange(e)}
              className={styles.textarea}
            />
          </div>
          <div className={styles.leaveCommentFooter}>
            <div className={styles.anonymous}>
              <Checkbox
                inputId="anonymous"
                onChange={(e) => handleAnonymousChange(e)}
                checked={anonymous}
              />
              <label htmlFor="anonymous" className={styles.anonymousText}>
                Anonymous?
              </label>
            </div>
            <div className={styles.characterCount}>
              {maxCharacterCount - comment.length} characters left
            </div>
            <div className={styles.commentButtonContainer}>
              <Button
                icon="pi pi-arrow-right"
                size="small"
                className={styles.commentButton}
              />
            </div>
          </div>
        </form>
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
