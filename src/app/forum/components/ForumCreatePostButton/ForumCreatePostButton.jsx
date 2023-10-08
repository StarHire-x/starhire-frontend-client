"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import styles from "./ForumCreatePostButton.module.css";
import CreatePost from "../CreatePost/CreatePost";
import { Dialog } from "primereact/dialog";

const ForumCreatePostButton = () => {
  const[visible, setVisible] = useState(false);

  const handleOnClick = () => {
    setVisible(true);
  }

  const onHide = () => {
    setVisible(false);
  }

  return (
    <>
      <Button
        size="small"
        rounded
        className={styles.createPostBtn}
        label="Create Post"
        icon="pi pi-plus"
        onClick={handleOnClick}
      />
      <Dialog header="Create a Post" visible={visible} onHide={onHide} className={styles.createPostDialog}>
        <CreatePost />
      </Dialog>
    </>
  );
};

export default ForumCreatePostButton;
