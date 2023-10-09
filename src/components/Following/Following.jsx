import styles from "./following.module.css";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  followCorporate,
  getAllCorporateSocial,
  unfollowCorporate,
} from "@/app/api/auth/user/route";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import Image from "next/image";
import { Dialog } from "primereact/dialog";

const Following = ({}) => {
  const [filterKeyword, setFilterKeyword] = useState("");
  const [corporates, setCorporates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const [showCorporateDetailsDialog, setShowCorporateDetailsDialog] =
    useState(false);
  const [selectedCorporate, setSelectedCorporate] = useState(null);

  const toast = useRef(null);

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const handleFollowingStatus = async (corporate, following) => {
    try {
      if (!following) {
        await followCorporate(corporate.userId, userIdRef, accessToken);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `You are following ${corporate.companyName} `,
          life: 5000,
        });
      } else {
        await unfollowCorporate(corporate.userId, userIdRef, accessToken);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `You unfollowed ${corporate.companyName} `,
          life: 5000,
        });
      }
      setCorporates([...corporates]);
      setRefreshData(!refreshData);
    } catch (error) {
      console.error("Error when saving/un-saving:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
  };

  const hideCorporateDetailsDialog = () => {
    setShowCorporateDetailsDialog(false);
  };

  useEffect(() => {
    getAllCorporateSocial(accessToken)
      .then((data) => {
        setCorporates(data);
        console.log("Received Corporate:", data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching corporate:", error);
        setIsLoading(false);
      });
  }, [refreshData, accessToken]);

  const filteredCorporate = corporates.filter((corporate) => {
    return corporate.companyName
      .toLowerCase()
      .includes(filterKeyword.toLowerCase());
  });

  const itemTemplate = (corporate) => {
    const isCurrentlyFollowing =
      corporate.followers &&
      corporate.followers.length > 0 &&
      corporate.followers.some((item) => item.userId === userIdRef);

    return (
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {corporate.profilePictureUrl !== "" ? (
            <img
              alt={corporate.profilePictureUrl}
              src={corporate.profilePictureUrl}
              className={styles.avatarImageContainer}
            />
          ) : (
            <Image
              src={HumanIcon}
              alt="Icon"
              className={styles.avatarImageContainer}
            />
          )}
          <h5 className={styles.cardTitle}>{corporate.companyName}</h5>
        </div>
        <div className={styles.cardButtons}>
          <Button
            label="View More Details"
            rounded
            severity="info"
            size="small"
            onClick={() => {
              setSelectedCorporate(corporate);
              setShowCorporateDetailsDialog(true);
            }}
          />

          <Button
            label={isCurrentlyFollowing ? "Unfollow" : "Follow"}
            rounded
            severity={isCurrentlyFollowing ? "danger" : "success"}
            size="small"
            onClick={(e) =>
              handleFollowingStatus(corporate, isCurrentlyFollowing)
            }
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <div className={styles.header}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Keyword Search"
            style={{ width: "265px" }}
          />
        </span>
      </div>

      <div className={styles.cardGrid}>
        {filteredCorporate.map((item) => itemTemplate(item))}
      </div>

      <Dialog
        header="Corporate Details"
        visible={showCorporateDetailsDialog}
        onHide={hideCorporateDetailsDialog}
        className={styles.cardFollowing}
      >
        {selectedCorporate && (
          <div>
            {selectedCorporate.profilePictureUrl !== "" ? (
              <img
                alt={selectedCorporate.profilePictureUrl}
                src={selectedCorporate.profilePictureUrl}
                className={styles.avatarImageContainer}
              />
            ) : (
              <Image
                src={HumanIcon}
                alt="Icon"
                className={styles.avatarImageContainer}
              />
            )}
            <h3>Corporate Name: {selectedCorporate.companyName}</h3>
            <p>Corporate Email: {selectedCorporate.email}</p>
            <p>Corporate contact: {selectedCorporate.contactNo}</p>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default Following;
