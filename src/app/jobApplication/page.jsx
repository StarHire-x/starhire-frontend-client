'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './page.module.css';
import { getJobApplicationsByJobSeeker, updateJobApplicationStatus } from '../api/jobApplication/route';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import ViewJobApplicationForm from '@/components/ViewJobApplicationForm/ViewJobApplicationForm';
import { Dropdown } from 'primereact/dropdown';
import EditJobApplicationForm from '@/components/EditJobApplicationForm/EditJobApplicationForm';

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

  const [filterStatus, setFilterStatus] = useState('');

  const statusOptions = [
    { label: 'Submitted', value: 'Submitted' },
    { label: 'Processing', value: 'Processing' },
    { label: 'To Be Submitted', value: 'To_Be_Submitted' },
    { label: 'Waiting For Interview', value: 'Waiting_For_Interview' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Accepted', value: 'Accepted' },
  ];

  const filteredApplications = filterStatus
    ? jobApplications.filter((app) => app.jobApplicationStatus === filterStatus)
    : jobApplications;

  const getStatus = (status) => {
    switch (status) {
      case 'Submitted':
        return 'info'; // or choose other severity based on your preference
      case 'Processing':
        return 'warning';
      case 'To_Be_Submitted':
        return 'danger'; // assuming this is a critical state before submission
      case 'Waiting_For_Interview':
        return 'info';
      case 'Rejected':
        return 'danger';
      case 'Accepted':
        return 'success';
      default:
        return '';
    }
  };

  const [showViewJobApplicationDialog, setShowViewJobApplicationDialog] =
    useState(false);

  const [formErrors, setFormErrors] = useState({});

  const [showEditJobApplicationDialog, setShowEditJobApplicationDialog] = useState(false);

  const [selectedJobApplicationData, setSelectedJobApplicationData] =
    useState(null);

  const hideViewJobApplicationDialog = () => {
    setShowViewJobApplicationDialog(false);
  };

  const hideEditJobApplicationDialog = () => {
    setShowEditJobApplicationDialog(false);
  }

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
       alert("Please fix the form errors before submitting.");
       return;
     }

     const areDocumentsFilled = formData.documents.every(
       (doc) => doc.documentName.trim() !== "" && doc.documentLink.trim() !== ""
     );

     if (!areDocumentsFilled) {
       alert("Please ensure all documents are properly filled up.");
       return;
     }

     const reqBody = {
       jobApplicationStatus: "Submitted",
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
       console.log("Job Application successfully updated!");
       alert("Job Application successfully updated!");
       setRefreshData((prev) => !prev);
     } catch (error) {
       alert(error.message);
     }
     setSelectedJobApplicationData(null);
     setShowEditJobApplicationDialog(false);
  }

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
          <Button
            label="Details"
            rounded
            onClick={() => {
              setSelectedJobApplicationData(jobApplication);
              setShowViewJobApplicationDialog(jobApplication);
            }}
          />
          {jobApplication.jobApplicationStatus === 'To_Be_Submitted' && (
            <Button
              label="Edit Application"
              rounded
              severity="info"
              onClick={() => {
                setSelectedJobApplicationData(jobApplication);
                setShowEditJobApplicationDialog(jobApplication);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <ProgressSpinner
          style={{
            display: "flex",
            height: "100vh",
            "justify-content": "center",
            "align-items": "center",
          }}
        />
      ) : jobApplications.length === 0 ? (
        <p>You have no assigned job applications yet.</p>
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
        className={styles.editCardDialog}
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
    </div>
  );
};

export default JobApplicationPage;
