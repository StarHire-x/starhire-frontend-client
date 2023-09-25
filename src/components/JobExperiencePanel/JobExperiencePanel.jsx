import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./JobExperiencePanel.module.css"
import CreateJobExperienceForm from "../CreateJobExperienceForm/CreateJobExperienceForm";
import { Rating } from "primereact/rating";
import { Card } from "primereact/card";

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

  const itemTemplate = (jobExperience) => {
    return (
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <h4>{jobExperience.jobTitle}</h4>
            <h4 className={styles.hideOnMobile}>|</h4>
            <h4>{jobExperience.employerName}</h4>
          </div>
          <div className={styles.cardHeaderRight}>
            <h4>{jobExperience.jobExperienceStartDate}</h4>
            <h4 className={styles.hideOnMobile}>-</h4>
            <h4>{jobExperience.jobExperienceEndDate}</h4>
          </div>
        </div>
        <div className={styles.cardDescription}>
          <p>{jobExperience.jobDescription}</p>
        </div>
        <div className={styles.cardFooter}>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            severity="success"
            className={styles.buttonSpacing}
            onClick={() => {
              e.preventDefault();
              // setSelectedJobListingData(jobListing);
              // setShowEditDialog(jobListing);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            className={styles.buttonSpacing}
            onClick={() => {
              e.preventDefault();
              // setSelectedJobListingData(jobListing);
              // setShowDeleteDialog(jobListing);
            }}
          />
        </div>
      </Card>
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