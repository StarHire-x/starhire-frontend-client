"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CreateATicketForm from "@/components/CreateATicketForm/CreateATicketForm";
import CreateATicketFormUnLoggedIn from "@/components/CreateATicketForm/CreateATicketFormUnLoggedIn";
import styles from "./page.module.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Enums from "@/common/enums/enums";
import { createTicket } from "@/app/api/Ticket/route";

const CreateATicketPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const router = useRouter();

  const userIdRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const userLoggedIn =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.role;

  console.log(userLoggedIn);

  const params = useSearchParams();
  const problem = params.get("problem");
  //this param is only used when user wish to report the forum post directly from the forum website.
  const forumPostId = params.get("forumPostId"); //it will fetch the forum post id from forum page to ticket page.

  const toast = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case Enums.ACTIVE:
        return "success";
      case "Unverified":
        return "danger";
      case Enums.INACTIVE:
        return "danger";
    }
  };

  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

  /*
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      findAllJobListingsByCorporate(userIdRef, accessToken)
        .then((jobListing) => {
          setJobListing(jobListing);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, userIdRef, accessToken]);
  */

  /*
  const itemTemplate = (jobListing) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>{jobListing.title}</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardRow}>
            <span>Job ID:</span>
            <span>{jobListing.jobListingId}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Location:</span>
            <span>{jobListing.jobLocation}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Average Salary</span>
            <span>${jobListing.averageSalary}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Listing Date:</span>
            <span>{formatDate(jobListing.listingDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Start Date:</span>
            <span>{formatDate(jobListing.jobStartDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Status:</span>
            <Tag
              value={jobListing.jobListingStatus}
              severity={getStatus(jobListing.jobListingStatus)}
            />
          </div>
        </div>
      </div>
    );
  };
*/

  const handleTicketCreation = async (newTicket) => {
    let payload;
    try {
      if (userLoggedIn === "Corporate") {
        payload = {
          ...newTicket,
          corporateId: userIdRef,
          ticketCategory: problem,
        };
      } else if (userLoggedIn === "Job_Seeker") {
        payload = {
          ...newTicket,
          jobSeekerId: userIdRef,
          ticketCategory: problem,
        };
      } else {
        payload = {
          ...newTicket,
          ticketCategory: problem,
        };
      }
      const response = await createTicket(payload, accessToken);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Your Ticket has been sent to our Admin Team for review",
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("There was an error creating the ticket", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  if (
    session.status === "authenticated" ||
    session.status === "unauthenticated"
  ) {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.header}>
          <h1 className={styles.headerTitle} style={{ marginBottom: "15px" }}>
            Ticket Management
          </h1>
        </div>

        <div className={styles.cardsGrid}>
          {/* {jobListing.map((job) => itemTemplate(job))} */}
          {session.status === "unauthenticated" ? (
            <CreateATicketFormUnLoggedIn onCreate={handleTicketCreation} />
          ) : (
            <CreateATicketForm onCreate={handleTicketCreation} forumPostId={forumPostId} />
          )}
        </div>
      </>
    );
  }
};

export default CreateATicketPage;
