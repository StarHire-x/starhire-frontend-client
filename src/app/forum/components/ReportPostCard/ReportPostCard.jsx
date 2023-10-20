"use client";

import { Button } from "primereact/button";
import styles from "./ReportPostCard.css";
import { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const reportPost = () => {
    router.push(`/ticketManagement/createATicket?problem=forum&forumPostId=${forumPost.forumPostId}`);
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
