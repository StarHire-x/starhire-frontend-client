"use client";

import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import styles from "./ForumPosts.module.css";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import CreateComment from "../CreateCommentModal/CreateComment";
import { useState } from "react";
import Utility from "@/common/helper/utility";
import DeletePostCard from "../DeletePostCard/DeletePostCard";

const ForumPosts = ({
  forumPosts,
  userIdRef,
  accessToken,
  setRefreshData,
  searchQuery,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postData, setPostData] = useState("");

  const filteredPosts = forumPosts.filter((post) =>
    post.forumPostTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const openDeleteDialog = (data) => {
    setDeleteDialogOpen(true);
    setPostData(data);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const truncatedMessage = (data) => {
    return data.forumPostMessage.length > 500
      ? data.forumPostMessage.substring(0, 500) + " ..."
      : data.forumPostMessage;
  };

  const itemTemplate = (data) => {
    return (
      <div className={styles.postContainer}>
        <div className={styles.postTitle}>
          <div className={styles.postTitleText}>{data.forumPostTitle}</div>
          {data.jobSeeker.userId === userIdRef && (
            <Button
              size="small"
              icon="pi pi-delete-left"
              rounded
              onClick={() => openDeleteDialog(data)}
              className={styles.commentButton}
            ></Button>
          )}
        </div>
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

        <div className={styles.content}>
          {truncatedMessage(data)}
          {data.forumPostMessage.length > 500 && (
            <span className={styles.showMore} onClick={() => openDialog(data)}>
              Show More
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.dateTimeText}>
            {Utility.timeAgo(data.createdAt)}
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
          value={filteredPosts}
          itemTemplate={itemTemplate}
          rows={5}
          inline
          scrollHeight="500px"
          header="Scroll Down to Load More"
        />
      </div>

      <DeletePostCard
        forumPost={postData}
        hideDeleteDialog={hideDeleteDialog}
        deleteDialogOpen={deleteDialogOpen}
        userIdRef={userIdRef}
        accessToken={accessToken}
        setRefreshData={setRefreshData}
        hideCommentDialog={hideDialog}
      />

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
          openDeleteDialog={openDeleteDialog}
        />
      </Dialog>
    </>
  );
};

export default ForumPosts;
