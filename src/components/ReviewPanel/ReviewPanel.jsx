import React, { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./JobExperiencePanel.module.css";
import CreateJobExperienceForm from "../CreateJobExperienceForm/CreateJobExperienceForm";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import {
  createJobExperience,
  updateJobExperience,
  deleteJobExperience,
} from "@/app/api/jobExperience/route";
import EditJobExperienceForm from "../EditJobExperienceForm/EditJobExperienceForm";
import { Toast } from "primereact/toast";

const ReviewPanel = ({
  formData,
  setFormData,
  review,
  roleRef,
  sessionTokenRef,
  setRefreshData,
  handleInputChange,
}) => {
  const [showCreateReviewDialog, setShowCreateReviewDialog] = useState(false);
  const [showEditReviewDialog, setShowEditReviewDialog] = useState(false);
  const [showDeleteReviewDialog, setShowDeleteReviewDialog] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [selectedReviewData, setSelectedReviewData] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const initialFormData = {
    reviewId: "",
    jobSeekerId: "",
    corporateId: "",
    description: "",
    startDate: "",
    endDate: "",
    reviewType: "",
    attitudeJS: "",
    professionalismJS: 0,
    passionJS: 0,
    benefitsCP: 0,
    cultureCP: 0,
    growthCP: 0,
  };

  const toast = useRef(null);

  const reviewHeader = (
    <div
      className={styles.jobExperienceDiv}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 className={styles.headerTitle}>My Reviews</h2>
      <div>
        <Dropdown
          color="#fefbf6"
          value={sortKey}
          options={[
            { label: "Start Date", value: "startDate" },
            { label: "Job Title", value: "jobTitle" },
          ]}
          onChange={(e) => setSortKey(e.value)}
          placeholder="Sort By"
        />
        <Dropdown
          value={sortOrder}
          options={[
            { label: "Asc", value: 1 },
            { label: "Desc", value: -1 },
          ]}
          onChange={(e) => setSortOrder(e.value)}
          placeholder="Order"
        />
      </div>
      <Button
        icon="pi pi-plus"
        rounded
        severity="success"
        onClick={() => setShowCreateReviewDialog(true)}
      />
    </div>
  );

  const sortFunction = (data) => {
    if (sortKey && sortOrder) {
      return [...data].sort((a, b) => {
        const value1 = a[sortKey];
        const value2 = b[sortKey];
        if (value1 < value2) return -1 * sortOrder;
        if (value1 > value2) return 1 * sortOrder;
        return 0;
      });
    }
    return data;
  };

  const hideCreateReviewDialog = () => {
    setShowCreateReviewDialog(false);
  };

  const hideEditReviewDialog = () => {
    setShowEditReviewDialog(false);
  };

  const hideDeleteReviewDialog = () => {
    setShowDeleteReviewDialog(false);
  };

  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => removeReview(selectedReviewData.reviewId)}
      />
    </React.Fragment>
  );

  const addReview = async (e) => {
    e.preventDefault();
  };

  const editReview = async (e) => {
    e.preventDefault();
  };

  const removeJobExperience = async (jobExperienceId) => {
    try {
    } catch (error) {}
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
            <h4>{formatDate(jobExperience.startDate)}</h4>
            <h4 className={styles.hideOnMobile}>-</h4>
            <h4>
              {formatDate(jobExperience.endDate) === "01/01/1970"
                ? "Present"
                : formatDate(jobExperience.endDate)}
            </h4>
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
              setSelectedJobExperienceData(jobExperience);
              setShowEditJobExperienceDialog(jobExperience);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobExperienceData(jobExperience);
              setShowDeleteJobExperienceDialog(jobExperience);
            }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <DataView
        value={sortFunction(jobExperience)}
        className={styles.dataViewContainer}
        layout="grid"
        rows={3}
        header={jobExperienceHeader}
        itemTemplate={itemTemplate}
        color="black"
      ></DataView>

      <Dialog
        header="Create Review"
        visible={showCreateJobExperienceDialog}
        onHide={hideCreateJobExperienceDialog}
        className={styles.cardDialog}
      >
        <CreateJobExperienceForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          addJobExperience={addJobExperience}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      </Dialog>

      <Dialog
        header="Edit Job Experience"
        visible={showEditJobExperienceDialog}
        onHide={hideEditJobExperienceDialog}
        className={styles.cardDialog}
      >
        <EditJobExperienceForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          editJobExperience={editJobExperience}
          selectedJobExperience={selectedJobExperienceData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      </Dialog>

      <Dialog
        header="Delete Job Experience"
        visible={showDeleteJobExperienceDialog}
        onHide={hideDeleteJobExperienceDialog}
        className={styles.cardDialog}
        footer={deleteDialogFooter}
      >
        <h3>
          Confirm Delete Job Experience:{" "}
          {showDeleteJobExperienceDialog &&
            showDeleteJobExperienceDialog.jobTitle}
          ,
          {showDeleteJobExperienceDialog &&
            showDeleteJobExperienceDialog.employerName}
        </h3>
      </Dialog>
    </div>
  );
};

export default ReviewPanel;