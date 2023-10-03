'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  viewOneJobListing,
  saveJobListing,
  unsaveJobListing,
  checkIfJobIsSaved,
  removeJobListingAssignment,
} from '@/app/api/jobListing/route';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image';
import HumanIcon from '../../../../public/icon.png';
import { Dialog } from 'primereact/dialog';
import CreateJobApplicationForm from '@/components/CreateJobApplicationForm/CreateJobApplicationForm';
import styles from './page.module.css';
import {
  createJobApplication,
  findExistingJobApplication,
} from '@/app/api/jobApplication/route';

export default function viewJobListingDetailsJobSeeker() {
  const session = useSession();
  const router = useRouter();

  const jobSeekerId =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const params = useSearchParams();
  const id = params.get('id');

  const userId = session?.data?.user?.id;

  const [jobListing, setJobListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [isJobSaved, setIsJobSaved] = useState(false);
  console.log('Initial isJobSaved:', isJobSaved);
  const [showCreateJobApplicationDialog, setShowCreateJobApplicationDialog] =
    useState(false);
  const [showRejectJobListingDialog, setShowRejectJobListingDialog] =
    useState(false);

  const hideRejectJobListingDialog = () => {
    setShowRejectJobListingDialog(false);
  };

  const hideCreateJobApplicationDialog = () => {
    setShowCreateJobApplicationDialog(false);
  };

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
      alert('Please fix the form errors before submitting.');
      return;
    }

    const areDocumentsFilled = formData.documents.every(
      (doc) => doc.documentName.trim() !== '' && doc.documentLink.trim() !== ''
    );

    if (!areDocumentsFilled) {
      alert('Please ensure all documents are properly filled up.');
      return;
    }

    const reqBody = {
      jobListingId: jobListing.jobListingId,
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
        alert('Job application created successfully!');
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      alert(error.message);
    }
    setShowCreateJobApplicationDialog(false);
  };

  // useEffect(() => {
  //   console.log('useEffect triggered');
  //   if (accessToken) {
  //     viewOneJobListing(id, accessToken)
  //       .then((data) => {
  //         setJobListing(data);
  //         setIsLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching job details:', error);
  //         setIsLoading(false);
  //       });

  //     findExistingJobApplication(jobSeekerId, id, accessToken).then(
  //       (response) => {
  //         if (response.statusCode === 200) {
  //           setIsJobApplicationAbsent(false);
  //         } else {
  //           console.error('Error fetching job preference:', response.json());
  //           setIsJobApplicationAbsent(true);
  //         }
  //       }
  //     );
  //     // Check if the job is saved
  //     checkIfJobIsSaved(id, accessToken)
  //       .then((result) => {
  //         setIsJobSaved(result.isSaved); // Assuming the API returns an object with an 'isSaved' property
  //       })
  //       .catch((error) => {
  //         console.error('Error checking job save status:', error);
  //       });
  //   }
  // }, [accessToken, refreshData]);

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading') {
      router.push('/login');
    }
    if (accessToken) {
      // Fetching the job listing details
      viewOneJobListing(id, accessToken)
        .then((data) => {
          setJobListing(data);
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

      // Checking if the job is already saved by the user
      checkIfJobIsSaved(id, accessToken)
        .then((response) => {
          setIsJobSaved(response.statusCode === 200);
        })
        .catch((error) => {
          console.error('Error checking if job is saved:', error);
        });
    }
  }, [accessToken, id, jobSeekerId, refreshData]);

  // Function to format date in "day-month-year" format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
      alert('Removed Job Listing Assignment successfully');
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
        onClick={() => removeJobListing(jobSeekerId, jobListing.jobListingId)}
      />
    </React.Fragment>
  );

  const handleSaveJobListing = async () => {
    try {
      if (isJobSaved) {
        await unsaveJobListing(jobListing.jobListingId, accessToken);
        setIsJobSaved(false);
        alert('Job Listing Unsaved Successfully!');
      } else {
        await saveJobListing(jobListing.jobListingId, accessToken);
        setIsJobSaved(true);
        alert('Job Listing Saved Successfully!');
      }
    } catch (error) {
      alert(
        isJobSaved
          ? 'Failed to unsave job listing. Please try again later.'
          : 'Failed to save job listing. Please try again later.'
      );
    }
  };

  const cardFooter = (
    <div className={styles.footerContainer}>
      <Button
        label="Back"
        icon="pi pi-chevron-left"
        className={styles.backButton}
        onClick={() => router.back()}
        rounded
      />
      {isJobApplicationAbsent && (
        <Button
          label="Create Job Application"
          className={styles.createButton}
          icon="pi pi-plus"
          onClick={() => setShowCreateJobApplicationDialog(true)}
          rounded
        />
      )}
      <Button
        label={isJobSaved ? 'Saved' : 'Save'}
        className={styles.saveButton}
        icon={isJobSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'}
        onClick={handleSaveJobListing}
        rounded
      />
      <Button
        label="Not Interested"
        className={styles.rejectButton}
        icon="pi pi-trash"
        onClick={() => setShowRejectJobListingDialog(true)}
        rounded
      />
    </div>
  );

  return (
    <div className="container">
      {isLoading ? (
        <ProgressSpinner
          style={{
            display: 'flex',
            height: '100vh',
            'justify-content': 'center',
            'align-items': 'center',
          }}
        />
      ) : (
        <Card
          title={jobListing.title}
          subTitle={jobListing.jobLocation}
          footer={cardFooter}
          className="my-card"
          style={{ borderRadius: '0' }}
        >
          <div className="my-card.p-card-content">
            {/* <div className="company-info">
              {jobListing.corporate.profilePictureUrl === '' ? (
                <Image src={HumanIcon} alt="User" className="avatar" />
              ) : (
                <img
                  src={jobListing.corporate.profilePictureUrl}
                  className="avatar"
                  width={30}
                  height={30}
                />
              )}
              <div className="company-details">
                <p>{jobListing.corporate.userName}</p>
              </div>
            </div> */}

            <div className="company-info">
              <Image
                src={jobListing.corporate.profilePictureUrl || HumanIcon}
                alt="User"
                className="avatar"
                width={40} // This should match the CSS value
                height={40} // This should match the CSS value
              />
              <div className="company-details">
                <p className={styles.fieldContent}>
                  {jobListing.corporate.userName}
                </p>
              </div>
            </div>

            <strong className={styles.fieldLabel}>Job Overview</strong>
            <p className={styles.fieldContent}>{jobListing.overview}</p>

            <strong className={styles.fieldLabel}>Job Responsibilities</strong>
            <p className={styles.fieldContent}>{jobListing.responsibilities}</p>

            <strong className={styles.fieldLabel}>Job Requirements</strong>
            <p className={styles.fieldContent}>{jobListing.requirements}</p>

            <strong className={styles.fieldLabel}>Required Documents</strong>
            <p className={styles.fieldContent}>
              {jobListing.requiredDocuments}
            </p>

            <strong className={styles.fieldLabel}>Average Salary</strong>
            <p className={styles.fieldContent}>
              {'$' + jobListing.averageSalary + ' SGD'}
            </p>

            <strong className={styles.fieldLabel}>Listing Date</strong>
            <p className={styles.fieldContent}>
              {formatDate(jobListing.listingDate)}
            </p>

            <strong className={styles.fieldLabel}>Job Start Date</strong>
            <p className={styles.fieldContent}>
              {formatDate(jobListing.jobStartDate)}
            </p>

            <div className="contact-info">
              <strong className={styles.fieldLabel}>Contact Information</strong>
              <p>{jobListing.corporate.email}</p>
              <p className="second-p">{jobListing.corporate.contactNo}</p>
            </div>

            {/* <strong>Corporate Details</strong>
            <p>{'UEN Number: ' + jobListing.corporate.companyRegistrationId}</p>
            <p className="second-p">
              {'Address: ' + jobListing.corporate.companyAddress}
            </p>

            <strong>Job Listing ID</strong>
            <p>{jobListing.jobListingId}</p> */}
          </div>

          {/* Conditionally rendering the button based on the existence of jobListing.jobApplication
          {isJobApplicationAbsent && (
            <Button
              label="Create Job Application"
              raised
              type="button"
              severity="success"
              onClick={() => setShowCreateJobApplicationDialog(true)}
            />
          )} */}

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
        </Card>
      )}
    </div>
  );
}
