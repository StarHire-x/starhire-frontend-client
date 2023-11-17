import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import styles from './ReviewPanel.module.css';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import CreateReviewForm from '../CreateReviewForm/CreateReviewForm';
import {
  createReview,
  deleteReview,
  updateReview,
} from '@/app/api/review/route';
import EditReviewForm from '../EditReviewForm/EditReviewForm';
import Enums from '@/common/enums/enums';
import { TabView, TabPanel } from 'primereact/tabview';
import { Image } from 'primereact/image';

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
  // const [sortKey, setSortKey] = useState(null);
  // const [sortOrder, setSortOrder] = useState(null);

  const [selectedReviewData, setSelectedReviewData] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const receivedReviews = review.filter((r) =>
    roleRef === Enums.CORPORATE
      ? r.reviewType === 'Corporate'
      : r.reviewType === 'Job_Seeker'
  );

  const givenReviews = review.filter((r) =>
    roleRef === Enums.CORPORATE
      ? r.reviewType === 'Job_Seeker'
      : r.reviewType === 'Corporate'
  );

  const initialFormData = {
    reviewId: '',
    jobSeekerId: '',
    corporateId: '',
    description: '',
    startDate: '',
    endDate: '',
    reviewType: '',
    attitudeJS: '',
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 className={styles.headerTitle}>My Reviews</h2>
      {/* <div>
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
      </div> */}
      <Button
        icon="pi pi-plus"
        rounded
        severity="success"
        onClick={() => setShowCreateReviewDialog(true)}
      />
    </div>
  );

  // const sortFunction = (data) => {
  //   if (sortKey && sortOrder) {
  //     return [...data].sort((a, b) => {
  //       const value1 = a[sortKey];
  //       const value2 = b[sortKey];
  //       if (value1 < value2) return -1 * sortOrder;
  //       if (value1 > value2) return 1 * sortOrder;
  //       return 0;
  //     });
  //   }
  //   return data;
  // };

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

    console.log('Hello');

    if (Object.keys(formErrors).length > 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fix the form errors before submitting.',
        life: 5000,
      });
      return;
    }

    let reqBody;

    if (formData.endDate === 'null') {
      reqBody = {
        startDate: formData.startDate,
        description: formData.description,
        submissionDate: new Date(),
      };
    } else {
      reqBody = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        submissionDate: new Date(),
      };
    }

    if (roleRef === Enums.CORPORATE) {
      reqBody.jobSeekerId = formData.jobSeekerId;
      reqBody.corporateId = userId;
      reqBody.reviewType = 'Job_Seeker';
    } else if (roleRef === Enums.JOBSEEKER) {
      reqBody.jobSeekerId = userId;
      reqBody.corporateId = formData.corporateId;
      reqBody.reviewType = 'Corporate';
    }

    console.log(reqBody);
    try {
      const response = await createReview(reqBody, roleRef, sessionTokenRef);
      if (!response.error) {
        console.log('Review created successfully:', response);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Review created successfully!',
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setFormData(initialFormData);
    setShowCreateReviewDialog(false);
  };

  const editReview = async (e) => {
    e.preventDefault();
    const reviewId = formData.reviewId;

    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      //alert("Please fix the form errors before submitting.");
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fix the form errors before submitting.',
        life: 5000,
      });
      return;
    }

    let reqBody;

    if (formData.endDate === 'null') {
      reqBody = {
        startDate: formData.startDate,
        description: formData.description,
      };
    } else {
      reqBody = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
      };
    }

    try {
      const response = await updateReview(reviewId, reqBody, sessionTokenRef);
      if (!response.error) {
        console.log('Review updated successfully:', response);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Review updated successfully!',
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setFormData(initialFormData);
    setSelectedReviewData(null);
    setShowEditReviewDialog(false);
  };

  const removeReview = async (reviewId) => {
    try {
      const response = await deleteReview(reviewId, sessionTokenRef);
      console.log('Review is deleted', response);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Deleted review successfully!',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error('Error deleting review:', error);
      //alert("There was an error deleting the job experience:");
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setFormData(initialFormData);
    setSelectedReviewData(null);
    setShowDeleteReviewDialog(false);
  };

  const itemTemplate = (review) => {
    return (
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            {roleRef === Enums.JOBSEEKER && (
              <>
                <div className={styles.imageContainer}>
                  {review.corporate.profilePictureUrl !== '' ? (
                    <img
                      alt={review.corporate.profilePictureUrl}
                      src={review.corporate.profilePictureUrl}
                      className={styles.avatarImageContainer}
                    />
                  ) : (
                    <Image
                      src={HumanIcon}
                      alt="Icon"
                      className={styles.avatarImageContainer}
                    />
                  )}
                </div>
                <div className={styles.imageContainer}>
                  <div className={styles.imageContainer1}>
                    <label>Username: </label>
                    <h4>{review.corporate.userName}</h4>
                  </div>
                  <div className={styles.imageContainer1}>
                    <label>Submitted Date: </label>
                    <h4>{formatDate(review.submissionDate)}</h4>
                  </div>
                </div>
              </>
            )}
            {roleRef === Enums.CORPORATE && (
              <>
                <div className={styles.imageContainer}>
                  {review.jobSeeker.profilePictureUrl !== '' ? (
                    <img
                      alt={review.jobSeeker.profilePictureUrl}
                      src={review.jobSeeker.profilePictureUrl}
                      className={styles.avatarImageContainer}
                    />
                  ) : (
                    <Image
                      src={HumanIcon}
                      alt="Icon"
                      className={styles.avatarImageContainer}
                    />
                  )}
                </div>
                <div className={styles.imageContainer}>
                  <div className={styles.imageContainer1}>
                    <label>Username: </label>
                    <h4>{review.jobSeeker.userName}</h4>
                  </div>
                  <div className={styles.imageContainer1}>
                    <label>Submitted Date: </label>
                    <h4>{formatDate(review.submissionDate)}</h4>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.cardHeaderRight}>
            <h4>{formatDate(review.startDate)}</h4>
            <h4 className={styles.hideOnMobile}>-</h4>
            <h4>
              {formatDate(review.endDate) === '01/01/1970'
                ? 'Present'
                : formatDate(review.endDate)}
            </h4>
          </div>
        </div>
        <div className={styles.cardDescription}>
          <p>{review.description}</p>
        </div>
        <div className={styles.cardFooter}>
          {review.reviewType === 'Corporate' && roleRef === Enums.JOBSEEKER && (
            <>
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
            </>
          )}
          {review.reviewType === 'Job_Seeker' &&
            roleRef === Enums.CORPORATE && (
              <>
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
              </>
            )}
        </div>
      </Card>
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      {/* <DataView
        value={sortFunction(review)}
        className={styles.dataViewContainer}
        layout="grid"
        rows={3}
        header={reviewHeader}
        itemTemplate={itemTemplate}
        color="black"
      ></DataView> */}
      <TabView>
        <TabPanel header="Received">
          <DataView
            value={receivedReviews}
            className={styles.dataViewContainer}
            layout="grid"
            rows={3}
            header={reviewHeader}
            itemTemplate={itemTemplate}
            paginator
            color="black"
          />
        </TabPanel>
        <TabPanel header="Given">
          <DataView
            value={givenReviews}
            className={styles.dataViewContainer}
            layout="grid"
            rows={3}
            header={reviewHeader}
            itemTemplate={itemTemplate}
            paginator
            color="black"
          />
        </TabPanel>
      </TabView>

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
        <EditReviewForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          editReview={editReview}
          selectedReview={selectedReviewData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          roleRef={roleRef}
        />
      </Dialog>

      <Dialog
        header="Delete Review"
        visible={showDeleteReviewDialog}
        onHide={hideDeleteReviewDialog}
        className={styles.cardDialog}
        footer={deleteDialogFooter}
      >
        <h3>
          Confirm Delete Review:{' '}
          {showDeleteReviewDialog && showDeleteReviewDialog.reviewId},
        </h3>
      </Dialog>
    </div>
  );
};

export default ReviewPanel;
