"use client";
import { useState, useEffect } from "react";
import styles from "./CreatePost.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";

const CreatePost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

  return (
    <>
      <div className={styles.header}>
        <h3>New Post</h3>
        <h5 className={styles.newPostMessage}>
          Your post is tied to your account. Please read the forum guidelines
          and be responsible when creating a post on StarHire's forum to avoid
          post removal. Happy Posting!
        </h5>
      </div>
      <div className={styles.postTitleContainer}>
        <h4 className={styles.postTitleHeader}>Title</h4>
        <InputTextarea
          rows={1}
          cols={75}
          value={postTitle}
          onChange={(e) => handlePostTitleChange(e)}
        />
      </div>
      <div className={styles.postContentContainer}>
        <h4 className={styles.postContentHeader}>Content</h4>
        <InputTextarea
          rows={10}
          cols={75}
          value={postContent}
          onChange={(e) => handlePostContentChange(e)}
        />
      </div>
      <div className={styles.categories}>

      </div>
    </>
  );
};

export default CreatePost;
