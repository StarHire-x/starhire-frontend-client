'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';
import {
  findAllJobListingsByCorporate,
  createJobListing,
  updateJobListing,
  removeJobListing,
} from '../api/jobListing/route';
import styles from './page.module.css';
import 'primeflex/primeflex.css';
import CreateJobListingForm from '@/components/CreateJobListingForm/CreateJobListingForm';
import EditJobListingForm from '@/components/EditJobListingForm/EditJobListingForm';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

//this page is viewed by corporate
const JobListingManagementPage = () => {
  const [jobListing, setJobListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedJobListingData, setSelectedJobListingData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const router = useRouter();

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  console.log(session);
  console.log(userIdRef);

  const toast = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Unverified':
        return 'danger';
      case 'Rejected':
        return 'danger';
    }
  };

  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

  const hideEditDialog = () => {
    setSelectedJobListingData(null);
    setShowEditDialog(false);
  };

  const hideDeleteDialog = () => {
    setSelectedJobListingData(null);
    setShowDeleteDialog(false);
  };

  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        rounded
        onClick={() =>
          handleDeleteJobListing(selectedJobListingData.jobListingId)
        }
      />
    </React.Fragment>
  );

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
        <div className={styles.cardFooter}>
          <Button
            label="Edit"
            icon="pi pi-pencil"
            rounded
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobListingData(jobListing);
              setShowEditDialog(jobListing);
            }}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            rounded
            className={styles.buttonSpacing}
            onClick={() => {
              setSelectedJobListingData(jobListing);
              setShowDeleteDialog(jobListing);
            }}
          />
        </div>
      </div>
    );
  };

  const handleJobListingCreation = async (newJobListing) => {
    try {
      const payload = {
        ...newJobListing,
        corporateId: userIdRef,
      };
      const response = await createJobListing(payload, accessToken);
      console.log('Created Job listing Successfully', response);
      // alert('Created job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Created job listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error(
        'There was an error creating the job listing:',
        error.message
      );
      // alert('There was an error creating the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateDialog(false);
  };

  const handleEditJobListing = async (jobListingId, updatedData) => {
    try {
      const payload = {
        ...updatedData,
        jobListingStatus: 'Unverified',
        corporateId: userIdRef,
      };
      const response = await updateJobListing(
        payload,
        jobListingId,
        accessToken
      );
      console.log('Updated job listing Successfully', response);
      // alert('Updated job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Updated job listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error(
        'There was an error updating the job listing:',
        error.message
      );
      // alert('There was an error updating the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setSelectedJobListingData(null);
    setShowEditDialog(false);
  };

  const handleDeleteJobListing = async (jobListingId) => {
    try {
      const response = await removeJobListing(jobListingId, accessToken);
      console.log('User is deleted', response);
      // alert('Deleted job listing successfully');
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Deleted job listing successfully',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error('Error deleting user:', error);
      // alert('There was an error deleting the job listing:');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setSelectedJobListingData(null);
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  if (session.status === 'authenticated') {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Job Listing Management</h1>
          <Button
            className={styles.createJobListingButton}
            label="Add A Job Listing"
            rounded
            style={{ marginTop: '10px', marginBottom: '15px' }}
            onClick={() => setShowCreateDialog(true)}
          />
        </div>

        <div className={styles.cardsGrid}>
          {jobListing.map((job) => itemTemplate(job))}
        </div>

        <Dialog
          header="Create Job Listing"
          visible={showCreateDialog}
          onHide={hideCreateDialog}
          className={styles.cardDialog}
        >
          <CreateJobListingForm onCreate={handleJobListingCreation} />
        </Dialog>

        <Dialog
          header="Edit Job Listing"
          visible={showEditDialog}
          onHide={hideEditDialog}
          className={styles.cardDialog}
        >
          <EditJobListingForm
            initialData={showEditDialog}
            onSave={(updatedData) => {
              handleEditJobListing(showEditDialog.jobListingId, updatedData);
            }}
          />
        </Dialog>

        <Dialog
          header="Delete Job Listing"
          visible={showDeleteDialog}
          onHide={hideDeleteDialog}
          className={styles.cardDialog}
          footer={deleteDialogFooter}
        >
          <h3>
            Confirm Delete Job ID:{' '}
            {showDeleteDialog && showDeleteDialog.jobListingId}?
          </h3>
        </Dialog>
      </>
    );
  }
};

export default JobListingManagementPage;
