"use client";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { useSession } from "next-auth/react";
import { findAllJobListingsByCorporate } from "../api/auth/jobListing/route";
import styles from "./page.module.css";
import { Toolbar } from "primereact/toolbar";
import "primeflex/primeflex.css";
import CreateJobListingForm from "@/components/CreateJobListingForm/CreateJobListingForm";
import { Dialog } from "primereact/dialog";

const JobListingManagementMobile = () => {
  const [jobListing, setJobListing] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();

  const userIdRef =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  console.log(userIdRef);
  console.log(accessToken);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case "Verified":
        return "success";
      case "Unverified":
        return "danger";
    }
  };

  useEffect(() => {
    findAllJobListingsByCorporate(userIdRef, accessToken)
      .then((jobListing) => setJobListing(jobListing))
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [refreshData, userIdRef, accessToken]);

  const itemTemplate = (jobListing) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h4>{jobListing.title}</h4>
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
        <div className={styles.cardFooter}>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            className={styles.buttonSpacing}
            onClick={() => {}}
          />
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            className={styles.buttonSpacing}
            onClick={() => {}}
          />
        </div>
      </div>
    );
  };

  const handleJobListingCreation = async (newJobListing) => {
    try {
      // Send the new listing data to the backend
      const response = await fetch(`http://localhost:8080/job-listing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newJobListing,
          corporateId: userIdRef, // Assuming the session has the user's ID
        }),
      });

      const payload = {
        ...newJobListing,
        corporateId: userIdRef,
      };
      console.log("Payload:", payload);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create the job listing"
        );
      }
      setRefreshData((prev) => !prev);
      // Close the modal dialog
      setShowCreateDialog(false);
    } catch (error) {
      console.error(
        "There was an error creating the job listing:",
        error.message
      );
    }
  };

  const header = (
    <div className="p-d-flex p-jc-between">
      <h2 className={styles.headerTitle}>Job Listing Management</h2>
      <Button
        label="Add A Job Listing"
        onClick={() => setShowCreateDialog(true)}
      />
    </div>
  );

  return (
    <div className="container">
      <DataView
        value={jobListing}
        layout="grid"
        rows={10}
        paginator
        header={header}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No job listing found"
        itemTemplate={itemTemplate}
        pt={{
          grid: { className: "surface-ground" },
        }}
      />

      <Dialog
        header="Create Job Listing"
        visible={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
        style={{ width: "50vw" }}
      >
        <CreateJobListingForm onCreate={handleJobListingCreation} />
      </Dialog>

    </div>
  );
};

export default JobListingManagementMobile;
