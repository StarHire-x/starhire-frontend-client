'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  getJobApplicationsByJobSeeker,
  updateJobApplicationStatus,
} from '../api/jobApplication/route';
import ViewJobApplicationForm from '@/components/ViewJobApplicationForm/ViewJobApplicationForm';
import EditJobApplicationForm from '@/components/EditJobApplicationForm/EditJobApplicationForm';
import styles from './page.module.css';

const JobApplicationPage = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobApplicationId: '',
    jobApplicationStatus: '',
    availableStartDate: '',
    availableEndDate: '',
    submissionDate: '',
    remarks: '',
    documents: [
      {
        documentName: '',
        documentLink: '',
      },
    ],
  });

  const toast = useRef(null);

  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { label: 'Submitted', value: 'Submitted' },
    { label: 'Processing', value: 'Processing' },
    { label: 'To Be Submitted', value: 'To_Be_Submitted' },
    { label: 'Waiting For Interview', value: 'Waiting_For_Interview' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Offered', value: 'Offered' },
    { label: 'Offer Rejected', value: 'Offer_Rejected' },
    { label: 'Offer Accepted', value: 'Offer_Accepted' },
  ];

  const filteredApplications = filterStatus
    ? jobApplications.filter((app) => app.jobApplicationStatus === filterStatus)
    : jobApplications;

  const getStatus = (status) => {
    switch (status) {
      case 'Submitted':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'To_Be_Submitted':
        return 'danger';
      case 'Waiting_For_Interview':
        return 'info';
      case 'Rejected':
        return 'danger';
      case 'Offered':
        return 'success';
      case 'Offer_Rejected':
        return 'danger';
      case 'Offer_Accepted':
        return 'success';
      default:
        return '';
    }
  };

  const [showViewJobApplicationDialog, setShowViewJobApplicationDialog] =
    useState(false);

  const [formErrors, setFormErrors] = useState({});

  const [showEditJobApplicationDialog, setShowEditJobApplicationDialog] =
    useState(false);

  const [selectedJobApplicationData, setSelectedJobApplicationData] =
    useState(null);

  const hideViewJobApplicationDialog = () => {
    setShowViewJobApplicationDialog(false);
  };

  const hideEditJobApplicationDialog = () => {
    setShowEditJobApplicationDialog(false);
  };

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentJobApplicationId, setCurrentJobApplicationId] = useState(null);

  const statusRemoveUnderscore = (status) => {
    return status.replaceAll('_', ' ');
  };

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    } else if (session.status === 'authenticated') {
      getJobApplicationsByJobSeeker(userIdRef, accessToken)
        .then((data) => {
          setJobApplications(data);
          console.log('Received job applications:', data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job applications:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, userIdRef, accessToken]);

  const header = (
    <div className={styles.headerContainer}>
      <h2 className={styles.headerTitle}>My Job Applications</h2>
      <Dropdown
        value={filterStatus}
        options={statusOptions}
        placeholder="Filter by Status"
        onChange={(e) => setFilterStatus(e.value)}
      />
    </div>
  );

  const editJobApplication = async (e) => {
    e.preventDefault();
    const jobApplicationId = formData.jobApplicationId;
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

    const areDocumentsFilled = formData.documents.every(
      (doc) => doc.documentName.trim() !== '' && doc.documentLink.trim() !== ''
    );

    if (!areDocumentsFilled) {
      //alert("Please ensure all documents are properly filled up.");
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please ensure all documents are properly filled up.',
        life: 5000,
      });
      return;
    }

    const reqBody = {
      jobApplicationStatus: 'Submitted',
      availableStartDate: formData.availableStartDate,
      availableEndDate: formData.availableEndDate,
      remarks: formData.remarks,
      submissionDate: new Date(),
      documents: formData.documents,
    };

    console.log(reqBody);

    try {
      const response = await updateJobApplicationStatus(
        reqBody,
        jobApplicationId,
        accessToken
      );
      console.log('Job Application successfully updated!');
      //alert("Job Application successfully updated!");
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Job Application successfully updated!',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
      //alert(error.message);
    }
    setSelectedJobApplicationData(null);
    setShowEditJobApplicationDialog(false);
  };

  const handleAccept = async (jobApplicationId) => {
    try {
      await updateJobApplicationStatus(
        {
          jobApplicationStatus: 'Offer_Accepted',
        },
        jobApplicationId,
        accessToken
      );

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Offer accepted successfully!',
        life: 5000,
      });

      setRefreshData((prev) => !prev);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
  };

  const handleReject = async (jobApplicationId) => {
    try {
      await updateJobApplicationStatus(
        {
          jobApplicationStatus: 'Offer_Rejected',
        },
        jobApplicationId,
        accessToken
      );

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Offer rejected successfully!',
        life: 5000,
      });

      setRefreshData((prev) => !prev);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
  };

  const openConfirmationDialog = (action, jobApplicationId) => {
    setCurrentAction(action);
    setCurrentJobApplicationId(jobApplicationId);
    setShowConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setCurrentAction(null);
    setCurrentJobApplicationId(null);
    setShowConfirmationDialog(false);
  };

  const itemTemplate = (jobApplication) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Job Application Id:</span>
          <h5>{jobApplication.jobApplicationId}</h5>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardRow}>
            <span>Available Start Date:</span>
            <span>{formatDate(jobApplication.availableStartDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Submission Date:</span>
            <span>{formatDate(jobApplication.submissionDate)}</span>
          </div>
          <div className={styles.cardRow}>
            <span>Status</span>
            <span>
              <Tag
                value={statusRemoveUnderscore(
                  jobApplication.jobApplicationStatus
                )}
                severity={getStatus(jobApplication.jobApplicationStatus)}
              />
            </span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          {jobApplication.jobApplicationStatus === 'Offered' && (
            <>
              <Button
                label="Accept"
                rounded
                className={styles.acceptButton}
                onClick={() =>
                  openConfirmationDialog(
                    'accept',
                    jobApplication.jobApplicationId
                  )
                }
              />
              <Button
                label="Reject"
                rounded
                className={styles.rejectButton}
                onClick={() =>
                  openConfirmationDialog(
                    'reject',
                    jobApplication.jobApplicationId
                  )
                }
              />
            </>
          )}
          {jobApplication.jobApplicationStatus === 'To_Be_Submitted' && (
            <Button
              label="Edit Application"
              rounded
              className={styles.editApplicationButton}
              severity="info"
              onClick={() => {
                setSelectedJobApplicationData(jobApplication);
                setShowEditJobApplicationDialog(jobApplication);
              }}
            />
          )}
          <Button
            label="Details"
            rounded
            className={styles.cardFooterButton}
            onClick={() => {
              setSelectedJobApplicationData(jobApplication);
              setShowViewJobApplicationDialog(jobApplication);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      {isLoading ? (
        <ProgressSpinner
          style={{
            display: 'flex',
            height: '100vh',
            'justify-content': 'center',
            'align-items': 'center',
          }}
        />
      ) : jobApplications.length === 0 ? (
        <p>You have not applied for any jobs.</p>
      ) : (
        <DataView
          value={filteredApplications}
          className={styles.dataViewContainer}
          layout="grid"
          rows={10}
          paginator
          header={header}
          emptyMessage="You have no job application yet."
          itemTemplate={itemTemplate}
        />
      )}

      <Dialog
        header="View Job Application"
        visible={showViewJobApplicationDialog}
        onHide={hideViewJobApplicationDialog}
        className={styles.cardDialog}
      >
        <ViewJobApplicationForm
          formData={formData}
          setFormData={setFormData}
          getStatus={getStatus}
          accessToken={accessToken}
          selectedJobApplicationData={selectedJobApplicationData}
        />
      </Dialog>

      <Dialog
        header="Edit Job Application"
        visible={showEditJobApplicationDialog}
        onHide={hideEditJobApplicationDialog}
      >
        <EditJobApplicationForm
          formData={formData}
          setFormData={setFormData}
          accessToken={accessToken}
          selectedJobApplicationData={selectedJobApplicationData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          editJobApplication={editJobApplication}
        />
      </Dialog>

      <Dialog
        header="Confirmation"
        visible={showConfirmationDialog}
        onHide={closeConfirmationDialog}
        footer={
          <div>
            <Button label="No" onClick={closeConfirmationDialog} />
            <Button
              label="Yes"
              onClick={() => {
                closeConfirmationDialog();
                if (currentAction === 'accept') {
                  handleAccept(currentJobApplicationId);
                } else if (currentAction === 'reject') {
                  handleReject(currentJobApplicationId);
                }
              }}
            />
          </div>
        }
      >
        Are you sure you want to {currentAction} this offer?
      </Dialog>
    </div>
  );
};

export default JobApplicationPage;
