"use client";
import { DataScroller } from "primereact/datascroller";
import styles from "./ForumComments.module.css";
import moment from "moment";
import Image from "next/image";
import HumanIcon from "../../../../../public/icon.png";

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
                  width={60}
                  height={60}
                  src={data?.jobSeeker.profilePictureUrl}
                />
              ) : (
                <Image
                  alt="Profile Photo"
                  width={60}
                  height={60}
                  src={HumanIcon}
                />
              )}
            </div>
            <div className={styles.userNameText}>
              {data?.jobSeeker.userName}
            </div>
          </div>
          <div className={styles.commentMsg}>{data?.forumCommentMessage}</div>
          <div className={styles.commentTimeStamp}>
            {formatRawDate(data?.createdAt)}
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
