"use client";

import { Button } from "primereact/button";
import styles from "./DeletePostCard.module.css";
import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { deleteOwnPostByPostIdAndUserId } from "@/app/api/forum/route";
import { Toast } from "primereact/toast";
const DeletePostCard = ({
  forumPost,
  hideDeleteDialog,
  deleteDialogOpen,
  userIdRef,
  accessToken,
  setRefreshData,
}) => {
  const toast = useRef(null);
  const deletePost = async () => {
    try {
      await deleteOwnPostByPostIdAndUserId(
        forumPost.forumPostId,
        userIdRef,
        accessToken
      );
      setRefreshData((prev) => !prev);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Your post has been deleted",
        life: 5000,
      });
      hideDeleteDialog();
    } catch (error) {
      console.error("There was an error deleting this post", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "There was an error deleting this post",
        life: 5000,
      });
    }
  };
  const deleteForumPostDialogFooter = () => (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        rounded
        outlined
        onClick={hideDeleteDialog}
      />
      <Button label="Yes" rounded icon="pi pi-check" onClick={deletePost} />
    </>
  );

  return (
    <>
    <Toast ref={toast} />
      <Dialog
        visible={deleteDialogOpen}
        onHide={hideDeleteDialog}
        draggable={false}
        footer={deleteForumPostDialogFooter}
        header={`Delete Post ID ${forumPost.forumPostId}`}
      >
        <p>
          Are you sure you want to delete this post with ID{" "}
          <strong>{forumPost.forumPostId}</strong> and post title{" "}
          <strong>{forumPost.forumPostTitle}</strong>?
        </p>
      </Dialog>
    </>
  );
};

export default DeletePostCard;
