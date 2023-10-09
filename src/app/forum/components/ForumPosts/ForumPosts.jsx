"use client";

import { DataScroller } from "primereact/datascroller";
import { Button } from "primereact/button";
import styles from "./ForumPosts.module.css";
import moment from "moment";

const ForumPosts = ({ forumPosts }) => {
  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const onCommentClick = () => {
    //leave a comment here
  };

  const itemTemplate = (data) => {
    const categoryClass = `categoryTag-${data.forumCategory.forumCategoryTitle}`;
    console.log(categoryClass);

    return (
      <div className={styles.postContainer}>
        <div className={styles.postTitle}>{data.forumPostTitle}</div>

        <div className={styles.postInfo}>
          <div className={styles.idTag}>#{data.forumPostId}</div>
          <div className={styles.categoryTag}>
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
            onClick={onCommentClick}
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
    </>
  );
};

export default ForumPosts;
