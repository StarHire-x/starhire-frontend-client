"use client";
import { DataScroller } from "primereact/datascroller";
import styles from "./ForumComments.module.css";
import moment from "moment";
import Image from "next/image";
import HumanIcon from "../../../../../public/icon.png";
import { Card } from "primereact/card";
import Utility from "@/common/helper/utility";

const ForumComments = ({ forumComments }) => {
  const formatRawDate = (rawDate) => {
    return moment(rawDate).format("DD MMMM YYYY, hh:mm A");
  };

  const itemTemplate = (data) => {
    return (
      <>
        <div className={styles.commentContainer}>
          <div className={styles.userSection}>
            <div className={styles.userProfilePhoto}>
              {data?.jobSeeker.profilePictureUrl ? (
                <Image
                  className={styles.userProfilePhoto}
                  alt="Profile Photo"
                  width={40}
                  height={40}
                  src={data?.jobSeeker.profilePictureUrl}
                />
              ) : (
                <Image
                  alt="Profile Photo"
                  width={40}
                  height={40}
                  src={HumanIcon}
                />
              )}
            </div>
            <div className={styles.userNameText}>
              {data.isAnonymous === false
                ? data?.jobSeeker.userName
                : "Anonymous"}
            </div>
          </div>
          <div className={styles.commentAndDateTimeSection}>
            <Card className={styles.commentMsgCard}>
              {data?.forumCommentMessage}
            </Card>
            <div className={styles.commentTimeStamp}>
              {Utility.timeAgo(data?.createdAt)}
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className={styles.card}>
        <DataScroller
          value={forumComments}
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

export default ForumComments;
