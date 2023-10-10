"use client";

import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import styles from "./ForumPosts.module.css";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import CreateComment from "../CreateCommentModal/CreateComment";
import { useState } from "react";

const ForumPosts = ({ forumPosts, userIdRef, accessToken }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const hideDialog = () => {
    setDialogOpen(false);
  };

  const itemTemplate = (data) => {
    console.log(data);

    return (
      <div className={styles.postContainer}>
        <div className={styles.postTitle}>{data.forumPostTitle}</div>
        <div className={styles.userId}>
          {data.isAnonymous === false
            ? `Posted By: ${data.jobSeeker.userName}`
            : "Posted By: Anonymous"}
        </div>
        <div className={styles.postInfo}>
          <div className={styles.idTag}>#{data.forumPostId}</div>
          <div
            className={`${styles.categoryTag} ${
              data.forumCategory.forumCategoryTitle === "Events"
                ? styles.categoryTagEvents
                : data.forumCategory.forumCategoryTitle === "Miscellaneous"
                ? styles.categoryTagMiscellaneous
                : data.forumCategory.forumCategoryTitle === "Confessions"
                ? styles.categoryTagConfessions
                : styles.categoryTagCareer
            }`}
          >
            {data.forumCategory.forumCategoryTitle}
          </div>
        </div>

        <div className={styles.content}>{data.forumPostMessage}</div>

        <div className={styles.footer}>
          <div className={styles.dateTimeText}>
            {formatRawDate(data.createdAt)}
          </div>
          <Button
            size="small"
            icon="pi pi-comments"
            rounded
            onClick={openDialog}
            className={styles.commentButton}
          ></Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.card}>
        <DataScroller
          value={forumPosts}
          itemTemplate={itemTemplate}
          rows={5}
          inline
          scrollHeight="500px"
          header="Scroll Down to Load More"
        />
      </div>
      <Dialog
        header="Leave a comment!"
        visible={dialogOpen}
        onHide={hideDialog}
      >
        <CreateComment userIdRef={userIdRef} accessToken={accessToken} />
      </Dialog>
    </>
  );
};

export default ForumPosts;
