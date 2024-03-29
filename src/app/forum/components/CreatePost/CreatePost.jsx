"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./CreatePost.module.css";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { createPost } from "@/app/api/forum/route";
import { Toast } from "primereact/toast";
import Enums from "@/common/enums/enums";

const CreatePost = ({
  userIdRef,
  accessToken,
  forumCategories,
  onSubmitSuccess,
  setRefreshData,
}) => {
  forumCategories = forumCategories?.filter(
    (forumCategory) => forumCategory.forumCategoryTitle !== "My Posts"
  ); // don't want show 'My Posts' as an option for user to select

  const forumCategoryTitleToId = {};
  forumCategories.forEach((category) => {
    forumCategoryTitleToId[category.forumCategoryTitle] =
      category.forumCategoryId;
  });

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [checkedGuideLines, setCheckedGuideLines] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    createdAt: new Date(),
    isAnonymous: false,
    forumPostStatus: Enums.PENDING,
    jobSeekerId: userIdRef,
  });
  const toast = useRef(null);
  const maxCharacterCount = 8000;

  const [titleValid, setTitleValid] = useState(true);
  const [contentValid, setContentValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const [guideLinesValid, setGuideLinesValid] = useState(true);
  const [formValid, setFormValid] = useState(true);

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      forumPostTitle: e.target.value,
    }));
  };

  const handlePostContentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterCount) {
      setPostContent(e.target.value);
      setFormData((prevData) => ({
        ...prevData,
        forumPostMessage: e.target.value,
      }));
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    const selectedCategoryId = forumCategoryTitleToId[e.target.value];
    setFormData((prevData) => ({
      ...prevData,
      forumCategoryId: selectedCategoryId,
    }));
  };

  const handleAnonymousChange = (e) => {
    setAnonymous(e.checked);
    setFormData((prevData) => ({
      ...prevData,
      isAnonymous: e.checked,
    }));
  };

  const resetForm = () => {
    setPostTitle("");
    setPostContent("");
    setSelectedCategory("");
    setCheckedGuideLines("");
    setAnonymous(false);
    setFormData({
      createdAt: new Date(),
      isAnonymous: false,
      forumPostStatus: Enums.PENDING,
      jobSeekerId: userIdRef,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check title validity
    if (!postTitle.trim()) {
      setTitleValid(false);
    } else {
      setTitleValid(true);
    }

    // Check content validity
    if (!postContent.trim()) {
      setContentValid(false);
    } else {
      setContentValid(true);
    }

    // Check category validity
    if (!selectedCategory) {
      setCategoryValid(false);
    } else {
      setCategoryValid(true);
    }

    // Check guidelines validity
    if (!checkedGuideLines) {
      setGuideLinesValid(false);
    } else {
      setGuideLinesValid(true);
    }

    if (
      postTitle.trim() &&
      postContent.trim() &&
      selectedCategory &&
      checkedGuideLines
    ) {
      setFormValid(true);

      try {
        const response = await createPost(formData, accessToken);
        console.log("Forum post has been created");
        resetForm();
        onSubmitSuccess();
        setRefreshData((prev) => !prev); // refresh the forum posts once post creation
      } catch (error) {
        console.error(
          "There was an error creating the forum post",
          error.message
        );
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "There was an error creating the forum post",
          life: 5000,
        });
      }
    } else {
      // The form is invalid, do not submit
      setFormValid(false);

      // Show a toast message for each empty field
      if (!postTitle.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please fill up the title",
          life: 5000,
        });
      }

      if (!postContent.trim()) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please fill up the content",
          life: 5000,
        });
      }

      if (!selectedCategory) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please select a category",
          life: 5000,
        });
      }

      if (!checkedGuideLines) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please agree to the guidelines",
          life: 5000,
        });
      }
    }
  };

  // const buttonClick = () => {
  //   console.log("SEE HERE!!");
  //   console.log("userid", userIdRef.userIdRef)
  //   console.log("access token", userIdRef.accessToken)
  // }

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.header}>
          <h3>New Post</h3>
          <h5 className={styles.newPostMessage}>
            Your post is tied to your account. Please read the forum guidelines
            and be responsible when creating a post on StarHire&apos;s forum to
            avoid post removal. Happy posting!
          </h5>
        </div>
        <div className={styles.postTitleContainer}>
          <h4 className={styles.postTitleHeader}>Title</h4>
          <InputTextarea
            rows={1}
            cols={75}
            value={postTitle}
            onChange={(e) => handlePostTitleChange(e)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.postContentContainer}>
          <h4 className={styles.postContentHeader}>Content</h4>
          <InputTextarea
            rows={10}
            cols={75}
            value={postContent}
            onChange={(e) => handlePostContentChange(e)}
            className={styles.textarea}
          />
          <div className={styles.characterCount}>
            {maxCharacterCount - postContent.length} characters left
          </div>
        </div>
        <div className={styles.categoriesContainer}>
          <h4 className={styles.categoriesHeader}>Category</h4>
          <div className={styles.categories}>
            {forumCategories.map((category) => (
              <div
                key={category.forumCategoryTitle}
                className={styles.categoryLabelContainer}
              >
                <RadioButton
                  value={category.forumCategoryTitle}
                  name="category"
                  onChange={(e) => handleCategoryChange(e)}
                  checked={selectedCategory === category.forumCategoryTitle}
                />
                <label className={styles.categoryLabel}>
                  {category.forumCategoryTitle}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.anonymousContainer}>
          <div className={styles.anonymous}>
            <div>
              <Checkbox
                inputId="anonymous"
                onChange={(e) => handleAnonymousChange(e)}
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
                onChange={(e) => setCheckedGuideLines(e.checked)}
                checked={checkedGuideLines}
              />
            </div>
            <label htmlFor="guideLines" className={styles.guideLinesText}>
              I have read and understand the community guidelines. I am aware
              that my post may be edited or rejected to uphold community
              guidelines.
            </label>
          </div>
        </div>
        <div className={styles.submitButtonContainer}>
          <Button label="Submit" size="small" rounded />
        </div>
      </form>
    </>
  );
};

export default CreatePost;
