"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import styles from "./ForumCreatePostButton.module.css";
import CreatePost from "../CreatePost/CreatePost";
import { Dialog } from "primereact/dialog";

const ForumCreatePostButton = (userIdRef) => {
  const[visible, setVisible] = useState(false);

  const handleOnClick = () => {
    setVisible(true);
  }

  const onHideDialog = () => {
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
      <Dialog header="Create Post" visible={visible} onHide={onHideDialog} className={styles.createPostDialog} draggable={false}>
        <CreatePost userIdRef={userIdRef}/>
      </Dialog>
    </>
  );
};

export default ForumCreatePostButton;
