"use client";

import { Button } from "primereact/button";
import styles from './ForumCreatePostButton.module.css';

const ForumCreatePostButton = () => {
  return (
    <>
      <Button size="small" rounded className={styles.createPostBtn} label="Create Post" icon="pi pi-plus" />
    </>
  );
};

export default ForumCreatePostButton;
