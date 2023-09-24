import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./JobExperiencePanel.module.css"
import CreateJobExperienceForm from "../CreateJobExperienceForm/CreateJobExperienceForm";
import { Rating } from "primereact/rating";

const JobExperiencePanel = ({
  formData,
  setFormData,
  jobExperience,
  sessionTokenRef,
  setRefreshData,
  handleInputChange,
}) => {

  const [showCreateJobExperienceDialog, setShowCreateJobExperienceDialog] =
    useState(false);
  const [showEditJobExperienceDialog, setShowEditJobExperienceDialog] =
    useState(false);
  const [showDeleteJobExperienceDialog, setShowDeleteJobExperienceDialog] =
    useState(false);

  const jobExperienceHeader = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 className={styles.headerTitle}>My Job Experience</h2>
      <Button
        label="Add A Job Experience"
        onClick={() => setShowCreateJobExperienceDialog(true)}
      />
    </div>
  );

  const hideCreateJobExperienceDialog = () => {
    setShowCreateJobExperienceDialog(false);
  };

  const createJobExperience = async (e) => {
    e.preventDefault();
    const userId = formData.userId;

    const reqBody = {
      jobSeekerId: userId,
      employerName: formData.employerName,
      jobTitle: formData.jobTitle,
      jobExperienceStartDate: formData.jobExperienceStartDate,
      jobExperienceEndDate: formData.jobExperienceEndDate,
      jobDescription: formData.jobDescription,
    };

    console.log(reqBody);

    try {

    } catch (error) {
      alert(error.message)
    }
    setShowCreateJobExperienceDialog(false);
  };

  const deleteJobExperience = async (e) => {
    e.preventDefault();
  };

  const itemTemplate = (jobListing) => {
    return (
      <div className={styles.card}>
        {/* <div className={styles.cardHeader}>
          <h5>{jobListing.title}</h5>
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
            onClick={() => {
              setSelectedJobListingData(jobListing);
              setShowEditDialog(jobListing);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobListingData(jobListing);
              setShowDeleteDialog(jobListing);
            }}
          />
        </div> */}
        Mickey mouse
      </div>
    );
  };

  return (
    <Panel header="Job Experience" toggleable>
      <div className={styles.container}>
        <DataView
          value={jobExperience}
          className={styles.dataViewContainer}
          layout="grid"
          rows={3}
          header={jobExperienceHeader}
          itemTemplate={itemTemplate}
        ></DataView>

        <Dialog
          header="Create Job Experience"
          visible={showCreateJobExperienceDialog}
          onHide={hideCreateJobExperienceDialog}
          className={styles.cardDialog}
        >
          <CreateJobExperienceForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            createJobExperience={createJobExperience}
          />
        </Dialog>
      </div>
    </Panel>
  );
};

export default JobExperiencePanel;