import React, { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./ReviewPanel.module.css";
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
import CreateReviewForm from "../CreateReviewForm/CreateReviewForm";
import { createReview } from "@/app/api/review/route";

const ReviewPanel = ({
  formData,
  setFormData,
  review,
  roleRef,
  sessionTokenRef,
  setRefreshData,
  handleInputChange,
  dropdownList,
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
            { label: "User Name", value: "userName" },
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
    const userId = formData.userId;

    const role = roleRef;

    console.log("Hello");

    if (Object.keys(formErrors).length > 0) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fix the form errors before submitting.",
        life: 5000,
      });
      return;
    }

    let reqBody;

    if (formData.endDate === "null") {
      reqBody = {
        jobSeekerId: formData.jobSeekerId,
        corporateId: userId,
        startDate: formData.startDate,
        description: formData.description,
        reviewType: "Job_Seeker",
        submissionDate: new Date(),
      };
    } else {
      reqBody = {
        jobSeekerId: formData.jobSeekerId,
        corporateId: userId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        reviewType: "Job_Seeker",
        submissionDate: new Date(),
      };
    }

    console.log(reqBody);
    try {
      const response = await createReview(reqBody, sessionTokenRef);
      if (!response.error) {
        console.log("Review created successfully:", response);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Review created successfully!",
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    setFormData(initialFormData);
    setShowCreateReviewDialog(false);
  };

  const editReview = async (e) => {
    e.preventDefault();
  };

  const removeReview = async (reviewId) => {
    try {
    } catch (error) {}
  };

  const itemTemplate = (review) => {
    return (
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <h4>Username: {review.jobSeeker.userName}</h4>
            <h4 className={styles.hideOnMobile}>|</h4>
            <h4>Full name: {review.jobSeeker.fullName}</h4>
            <h4 className={styles.hideOnMobile}>|</h4>
            <h4>Review Type: {review.reviewType}</h4>
          </div>
          <div className={styles.cardHeaderRight}>
            <h4>{formatDate(review.startDate)}</h4>
            <h4 className={styles.hideOnMobile}>-</h4>
            <h4>
              {formatDate(review.endDate) === "01/01/1970"
                ? "Present"
                : formatDate(review.endDate)}
            </h4>
          </div>
        </div>
        <div className={styles.cardDescription}>
          <p>{review.description}</p>
        </div>
        <div className={styles.cardFooter}>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            severity="success"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedReviewData(review);
              setShowEditReviewDialog(review);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedReviewData(review);
              setShowDeleteReviewDialog(review);
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
        value={sortFunction(review)}
        className={styles.dataViewContainer}
        layout="grid"
        rows={3}
        header={reviewHeader}
        itemTemplate={itemTemplate}
        color="black"
      ></DataView>

      <Dialog
        header="Create Review"
        visible={showCreateReviewDialog}
        onHide={hideCreateReviewDialog}
        className={styles.cardDialog}
      >
        <CreateReviewForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          addReview={addReview}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          roleRef={roleRef}
          dropdownList={dropdownList}
        />
      </Dialog>

      <Dialog
        header="Edit Review"
        visible={showEditReviewDialog}
        onHide={hideEditReviewDialog}
        className={styles.cardDialog}
      >
        {/* <EditReviewForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          editReview={editReview}
          selectedReview={selectedReviewData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        /> */}
      </Dialog>

      <Dialog
        header="Delete Review"
        visible={showDeleteReviewDialog}
        onHide={hideDeleteReviewDialog}
        className={styles.cardDialog}
        footer={deleteDialogFooter}
      >
        <h3>
          Confirm Delete Review:{" "}
          {showDeleteReviewDialog && showDeleteReviewDialog.reviewId},
        </h3>
      </Dialog>
    </div>
  );
};

export default ReviewPanel;
