"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { findAllJobListingsByCorporate } from "@/app/api/jobListing/route";
import styles from "../page.module.css";
import "primeflex/primeflex.css";

const ViewAllMyJobListingsManagementPage = () => {
  const [jobListing, setJobListing] = useState(null);
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

  console.log(session);
  console.log(userIdRef);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Unverified":
        return "danger";
      case "Rejected":
        return "danger";
    }
  };

  useEffect(() => {
    if (session.status === "unauthenticated" || session.status === "loading") {
      router.push("/login");
    } else if (session.status === "authenticated") {
      findAllJobListingsByCorporate(userIdRef, accessToken)
        .then((jobListing) => {
          // logic to get num of pending job apps to be processed by corporate
          jobListing?.map((selectedJobListing) => {
            let updatedJobListing = selectedJobListing;
            updatedJobListing.numOfPendingJobAppsToProcess =
              updatedJobListing?.jobApplications.filter(
                (jobApp) =>
                  jobApp?.jobApplicationStatus === "Processing" ||
                  jobApp?.jobApplicationStatus === "Waiting_For_Interview"
              )?.length;
            return updatedJobListing;
          });
          const sortedJobListings = jobListing?.sort(
            (x, y) =>
              y?.numOfPendingJobAppsToProcess - x?.numOfPendingJobAppsToProcess
          );
          setJobListing(sortedJobListings);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  const itemTemplate = (jobListing) => {
    const cardLink = `/jobListingManagement/viewAllMyJobListings/viewJobApplications?id=${jobListing.jobListingId}`;
    <a href={cardLink} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardHeader}></div>
      </div>
    </a>;
    return (
      <a href={cardLink} className={styles.cardLink}>
        <div className={styles.card}>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className={styles.cardHeader}
          >
            <h3>{jobListing.title}</h3>
            <Badge
              value={jobListing?.numOfPendingJobAppsToProcess}
              style={{ backgroundColor: "#35acfe" }}
            ></Badge>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardRow}>
              <span>Job ID:</span>
              <span>{jobListing.jobListingId}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Location:</span>
              <span>{jobListing.address}</span>
            </div>
            <div className={styles.cardRow}>
              <span>Average Salary</span>
              <div className={styles.payRangeDiv}>
                {jobListing.payRange.split("_").map((range, key) => (
                  <span key={key}>{range}</span>
                ))}
              </div>
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
      </a>
    );
  };

  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  if (session.status === "authenticated") {
    return (
      <>
        <div className={styles.header}>
          <h1 className={styles.headerTitle} style={{ marginBottom: "15px" }}>
            My Job Listings
          </h1>
        </div>

        <div className={styles.cardsGrid}>
          {jobListing && jobListing.map((job) => itemTemplate(job))}
        </div>
      </>
    );
  }
};

export default ViewAllMyJobListingsManagementPage;
