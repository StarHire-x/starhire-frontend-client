"use client";

import { Button } from "primereact/button";
import styles from "./ReportPostCard.css";
import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
const ReportPostCard = ({
  forumPost,
  hideReportDialog,
  reportDialogOpen,
  userIdRef,
  accessToken,
  setRefreshData,
  hideCommentDialog
}) => {
  const toast = useRef(null);
  const reportPost = async () => {
    // try {
    //   await deleteOwnPostByPostIdAndUserId(
    //     forumPost.forumPostId,
    //     userIdRef,
    //     accessToken
    //   );
    //   setRefreshData((prev) => !prev);
    //   toast.current.show({
    //     severity: "success",
    //     summary: "Success",
    //     detail: "Your post has been deleted",
    //     life: 5000,
    //   });
    //   hideDeleteDialog();
    //   hideCommentDialog();
    // } catch (error) {
    //   console.error("There was an error deleting this post", error.message);
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "There was an error deleting this post",
    //     life: 5000,
    //   });
    // }
  };
  const reportForumPostDialogFooter = () => (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        rounded
        outlined
        onClick={hideReportDialog}
      />
      <Button label="Yes" rounded icon="pi pi-check" onClick={reportPost} />
    </>
  );

  return (
    <>
    <Toast ref={toast} />
      <Dialog
        visible={reportDialogOpen}
        onHide={hideReportDialog}
        draggable={false}
        footer={reportForumPostDialogFooter}
        header={`Report Post ID ${forumPost.forumPostId}`}
      >
        <p>
          Are you sure you want to report this post with ID{" "}
          <strong>{forumPost.forumPostId}</strong> and post title{" "}
          <strong>{forumPost.forumPostTitle}</strong>?
        </p>
      </Dialog>
    </>
  );
};

export default ReportPostCard;
