"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./CreatePost.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { createPost } from "@/app/api/forum/route";
import { Toast } from "primereact/toast";

const CreatePost = (userIdRef, accessToken) => {
  //hardcoded for now, will fetch from backend in the future.
  const forumCategories = [
    {
      label: "Events",
    },
    {
      label: "Career",
    },
    {
      label: "Miscellaneous",
    },
    {
      label: "Confession",
    },
  ];

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState ({
    forumPostTitle: postTitle,
    createdAt: new Date(),
    forumPostMessage: postContent,
    forumCategory: selectedCategory,
    isAnonymous: anonymous,
    jobSeekerId: userIdRef,
  })
  const toast = useRef(null);

  const handleSubmit = async () => {
    try {
      const response = await createPost(
        formData,
        accessToken
      );
      console.log("Forum post has been created");
    } catch (error) {
      console.error(
        "There was an error creating the forum post",
        error.message
      )
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error creating the forum post",
        life: 5000,
      });
    }
  };

  return (
    <>
    <Toast ref={toast} />
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
          onChange={(e) => setPostTitle(e.target.value)}
          className={styles.textarea}
        />
      </div>
      <div className={styles.postContentContainer}>
        <h4 className={styles.postContentHeader}>Content</h4>
        <InputTextarea
          rows={10}
          cols={75}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className={styles.textarea}
        />
      </div>
      <div className={styles.categoriesContainer}>
        <h4 className={styles.categoriesHeader}>Category</h4>
        <div className={styles.categories}>
          {forumCategories.map((category) => (
            <div className={styles.categoryLabelContainer}>
              <RadioButton
                value={category.label}
                name="category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                checked={selectedCategory === category.label}
              />
              <label className={styles.categoryLabel}>{category.label}</label>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.anonymousContainer}>
      <div className={styles.anonymous}>
          <div>
            <Checkbox
              inputId="anonymous"
              onChange={(e) => setAnonymous(e.checked)}
              checked={anonymous}
            />
          </div>
          <label htmlFor="anonymous" className={styles.anonymousText}>
            Do you wish your post to be anonymous?
          </label>
        </div>
      </div>
      <div className={styles.guideLinesContainer}>
        <h4 className={styles.guideLinesHeader}>Guidelines</h4>
        <div className={styles.guideLines}>
          <div>
            <Checkbox
              inputId="guideLines"
              onChange={(e) =>  setCheckedGuideLines(e.checked)}
              checked={checkedGuideLines}
              required
            />
          </div>
          <label htmlFor="guideLines" className={styles.guideLinesText}>
            I have read and understand the community guidelines. I am aware that
            my post may be edited or rejected to uphold community guidelines.
          </label>
        </div>
      </div>
      <div className={styles.submitButtonContainer}>
        <Button label="Submit" size="small" rounded onClick={handleSubmit} />
      </div>
    </>
  );
};

export default CreatePost;
