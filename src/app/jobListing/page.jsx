'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import HumanIcon from './../../../public/icon.png';
import CreateJobApplicationForm from '@/components/CreateJobApplicationForm/CreateJobApplicationForm';
import {
  findAssignedJobListingsByJobSeeker,
  saveJobListing,
  unsaveJobListing,
  viewOneJobListing,
  removeJobListingAssignment,
} from '../api/jobListing/route';
import {
  createJobApplication,
  findExistingJobApplication,
} from '../api/jobApplication/route';
import styles from './page.module.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JobListingPage = () => {
  const session = useSession();
  const router = useRouter();

  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [showCreateJobApplicationDialog, setShowCreateJobApplicationDialog] =
    useState(false);
  const [showRejectJobListingDialog, setShowRejectJobListingDialog] =
    useState(false);

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const jobSeekerId =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const [selectedJob, setSelectedJob] = useState(null);

  const toast = useRef(null);

  const hideRejectJobListingDialog = () => {
    setShowRejectJobListingDialog(false);
  };

  const hideCreateJobApplicationDialog = () => {
    setShowCreateJobApplicationDialog(false);
  };

  const params = useSearchParams();
  const id = params.get('id');

  const [formErrors, setFormErrors] = useState({});
  const [isJobApplicationAbsent, setIsJobApplicationAbsent] = useState(false);

  const [formData, setFormData] = useState({
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

  const addJobApplication = async (e) => {
    e.preventDefault();
    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      //alert('Please fix the form errors before submitting.');
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
      //alert('Please ensure all documents are properly filled up.');
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please ensure all documents are properly filled up.',
        life: 5000,
      });
      return;
    }

    const reqBody = {
      jobListingId: selectedJob.jobListingId,
      jobSeekerId: jobSeekerId,
      jobApplicationStatus: 'Submitted',
      availableStartDate: formData.availableStartDate,
      availableEndDate: formData.availableEndDate,
      remarks: formData.remarks,
      submissionDate: new Date(),
      documents: formData.documents,
    };

    console.log(reqBody);

    try {
      const response = await createJobApplication(reqBody, accessToken);
      if (!response.error) {
        console.log('Job application created successfully:', response);
        //alert('Job application created successfully!');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job application created successfully!',
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      //alert(error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateJobApplicationDialog(false);
  };

  useEffect(() => {
    // Redirect to login if the user is unauthenticated
    if (session.status === 'unauthenticated') {
      router.push('/login');
    }

    // Only run the logic if the user is authenticated
    if (accessToken) {
      // Fetching the job listing details
      viewOneJobListing(id, accessToken)
        .then((data) => {
          setJobListing(data);
          // Preload the form with mandatory documents
          const documentsList = data.requiredDocuments
            ? data.requiredDocuments.split(',').map((name) => ({
                mandatory: true,
                documentName: name.trim(),
                documentLink: '',
              }))
            : [];
          setFormData((prevData) => ({
            ...prevData,
            documents: documentsList,
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job details:', error);
          setIsLoading(false);
        });

      // Checking existing job application
      findExistingJobApplication(jobSeekerId, id, accessToken).then(
        (response) => {
          if (response.statusCode === 200) {
            setIsJobApplicationAbsent(false);
          } else {
            console.error('Error fetching job preference:', response.json());
            setIsJobApplicationAbsent(true);
          }
        }
      );

      // Logic from JobListingPage
      findAssignedJobListingsByJobSeeker(jobSeekerId, accessToken)
        .then((data) => {
          setJobListings(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job listings:', error);
          setIsLoading(false);
        });
    }
  }, [refreshData, accessToken, id, jobSeekerId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredJobListings = jobListings.filter((jobListing) => {
    return jobListing.title.toLowerCase().includes(filterKeyword.toLowerCase());
  });

  const removeJobListing = async (jobSeekerId, jobListingId) => {
    try {
      const response = await removeJobListingAssignment(
        jobSeekerId,
        jobListingId,
        accessToken
      );
      console.log(
        'Job Listing disassociated with Job Seeker',
        response.message
      );
      //alert('Removed Job Listing Assignment successfully');
    } catch (error) {
      console.error('Error dissociating job listing:', error);
    }
    setShowRejectJobListingDialog(false);
    router.push('/jobListing');
  };

  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => removeJobListing(jobSeekerId, selectedJob.jobListingId)}
      />
    </React.Fragment>
  );

  const handleSaveJobListing = async (jobListing) => {
    try {
      if (jobListing.isSaved) {
        await unsaveJobListing(jobListing.jobListingId, accessToken);
        //alert('Job Listing Unsaved Successfully!');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job Listing Unsaved Successfully!',
          life: 5000,
        });
      } else {
        await saveJobListing(jobListing.jobListingId, accessToken);
        //alert('Job Listing Saved Successfully!');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Job Listing Saved Successfully!',
          life: 5000,
        });
      }
      // Update the state to force a re-render
      setJobListings([...jobListings]);
      // Refresh the data after saving/un-saving
      setRefreshData(!refreshData);
    } catch (error) {
      console.error('Error when saving/un-saving:', error);
      // alert(
      //   `Error: ${error.message || 'Failed to save/un-save the job listing.'}`
      // );
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
  };

  const JobDetailPanel = ({ selectedJob }) => {
    const job = selectedJob;
    if (!selectedJob) return null;

    return (
      <div className={styles.jobDetailPanel}>
        <h2>{job.title}</h2>
        <div className={styles.pCardContent}>
          <div className={styles.companyInfo}>
            {job.corporate.profilePictureUrl === '' ? (
              <Image src={HumanIcon} alt="User" className={styles.avatar} />
            ) : (
              <img
                src={job.corporate.profilePictureUrl}
                alt="Corporate Profile"
                className={styles.avatar}
              />
            )}
            <div>
              <p>{job.corporate.userName}</p>
            </div>
          </div>
        </div>
        <strong>Job Overview</strong>
        <p>{job.overview}</p>
        <strong>Responsibilities</strong>
        <p>{job.responsibilities}</p>
        <strong>Requirements</strong>
        <p>{job.requirements}</p>
        <strong>Suggested Documents</strong>
        <p>{job.requiredDocuments}</p>
        <strong>Average Monthly Salary</strong>
        <p>
          <span>$</span>
          {job.averageSalary}
        </p>
        <strong>Preferred Start Date</strong>
        <p>{formatDate(job.jobStartDate)}</p>
        <p>
          <span>Posted on </span>
          {formatDate(job.listingDate)}
        </p>

        {isJobApplicationAbsent && (
          <>
            <Button
              label="Create Job Application"
              className={styles.createButton}
              icon="pi pi-plus"
              onClick={() => setShowCreateJobApplicationDialog(true)}
              rounded
            />
            <Button
              label="Not Interested"
              className={styles.rejectButton}
              icon="pi pi-trash"
              onClick={() => setShowRejectJobListingDialog(true)}
              rounded
            />
          </>
        )}
      </div>
    );
  };

  const itemTemplate = (jobListing) => (
    <div
      className={styles.listingItem}
      onClick={() => setSelectedJob(jobListing)}
    >
      <div className={styles.titleWithSaveButton}>
        <h3>{jobListing.title}</h3>
        <Button
          className={styles.saveButton}
          icon={jobListing.isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'}
          onClick={(e) => {
            e.stopPropagation(); // To prevent setSelectedJob from being triggered
            handleSaveJobListing(jobListing);
          }}
          rounded
        />
      </div>
      <div className={styles.pCardContent}>
        <div className={styles.companyInfo}>
          {jobListing.corporate.profilePictureUrl === '' ? (
            <Image src={HumanIcon} alt="User" className={styles.avatar} />
          ) : (
            <img
              src={jobListing.corporate.profilePictureUrl}
              alt="Corporate Profile"
              className={styles.avatar}
            />
          )}
          <div>
            <p>{jobListing.corporate.userName}</p>
          </div>
        </div>
      </div>
      <p>
        <strong>{jobListing.jobLocation}</strong>
      </p>
      <p>
        <span>$</span>
        {jobListing.averageSalary}
        <span> monthly</span>
      </p>
      <p>
        <span>Posted on </span>
        {formatDate(jobListing.listingDate)}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      {/* Header */}
      <div className={styles.header}>
        <h1 style={{ marginBottom: '15px' }}>Assigned Jobs</h1>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Keyword Search"
            style={{ width: '265px' }}
          />
        </span>
        <Button
          className={styles.savedJobsButton}
          label="My Saved Job Listings"
          onClick={() =>
            router.push('/jobListing/viewSavedJobListingsJobSeeker')
          }
          rounded
        />
      </div>
      <div className={styles.container}>
        {/* Left Panel - Job Listings */}
        <div className={styles.listingsPanel}>
          {filteredJobListings.map((jobListing) => itemTemplate(jobListing))}
        </div>

        {/* Right Panel - Job Details */}
        <div className={styles.detailsPanel}>
          {selectedJob ? (
            <JobDetailPanel selectedJob={selectedJob} />
          ) : (
            <p>Select a job listing to view details.</p>
          )}
        </div>
      </div>
      <Dialog
        header="Create Job Application"
        visible={showCreateJobApplicationDialog}
        onHide={hideCreateJobApplicationDialog}
        className={styles.cardDialog}
      >
        <CreateJobApplicationForm
          formData={formData}
          setFormData={setFormData}
          addJobApplication={addJobApplication}
          accessToken={accessToken}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      </Dialog>

      <Dialog
        header="Reject Job Listing"
        visible={showRejectJobListingDialog}
        onHide={hideRejectJobListingDialog}
        className={styles.cardDialog}
        footer={deleteDialogFooter}
      >
        Are you sure you want to reject this job listing?
      </Dialog>
    </>
  );
};

export default JobListingPage;
