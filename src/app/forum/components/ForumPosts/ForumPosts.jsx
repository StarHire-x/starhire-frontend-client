"use client";

import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import styles from "./ForumPosts.module.css";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import CreateComment from "../CreateCommentModal/CreateComment";
import { useState } from "react";

const ForumPosts = ({ forumPosts, userIdRef, accessToken, setRefreshData }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postData, setPostData] = useState("");

  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const openDialog = (data) => {
    setDialogOpen(true);
    setPostData(data); //pass the data of the post to CreateCommentModal
  };

  const hideDialog = () => {
    setDialogOpen(false);
  };

  const itemTemplate = (data) => {
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
            onClick={() => openDialog(data)}
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
        visible={dialogOpen}
        onHide={hideDialog}
        className={styles.createCommentModal}
        draggable={false}
      >
        <CreateComment
          userIdRef={userIdRef}
          accessToken={accessToken}
          postData={postData}
          setRefreshData={setRefreshData}
        />
      </Dialog>
    </>
  );
};

export default ForumPosts;
