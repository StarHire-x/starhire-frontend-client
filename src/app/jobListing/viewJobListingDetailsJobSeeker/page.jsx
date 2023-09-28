'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { viewOneJobListing } from '@/app/api/auth/jobListing/route'; // Adjust the path
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image';
import HumanIcon from '../../../../public/icon.png'; // Adjust the path
import { Dialog } from 'primereact/dialog';
import CreateJobApplicationForm from '@/components/CreateJobApplicationForm/CreateJobApplicationForm';
import styles from './page.module.css'
import { Button } from 'primereact/button';
import {
  createJobApplication,
  findExistingJobApplication,
} from "@/app/api/auth/jobApplication/route";

export default function viewJobListingDetailsJobSeeker() {
  const params = useSearchParams();
  const id = params.get('id');

  const session = useSession();

  const router = useRouter();

  const jobSeekerId = session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;


  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const [jobListing, setJobListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [refreshData, setRefreshData] = useState(false);

  const [showCreateJobApplicationDialog, setShowCreateJobApplicationDialog] =
    useState(false);

  const hideCreateJobApplicationDialog = () => {
    setShowCreateJobApplicationDialog(false);
  };

  const [formErrors, setFormErrors] = useState({});

  const [isJobApplicationAbsent, setIsJobApplicationAbsent] = useState(false);


  const [formData, setFormData] = useState({
    jobApplicationStatus: "",
    availableStartDate: "",
    availableEndDate: "",
    submissionDate: "",
    documents: [
      {
        documentName: "",
        documentLink: "",
      },
    ],
  });

  const addJobApplication = async (e) => {
  
    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      alert("Please fix the form errors before submitting.");
      return;
    }
    
    const reqBody = {
      jobListingId: jobListing.jobListingId,
      jobSeekerId: jobSeekerId,
      jobApplicationStatus: "Submitted",
      availableStartDate: formData.availableStartDate,
      availableEndDate: formData.availableEndDate,
      submissionDate: new Date(),
      documents: formData.documents,
    };

    console.log(reqBody);

    try {
      const response = await createJobApplication(reqBody, accessToken);
      if (!response.error) {
        console.log("Job application created successfully:", response);
        alert("Job application created successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      alert(error.message)
    }
    setShowCreateJobApplicationDialog(false);
    router.push(`/jobListing/viewJobListingDetailsJobSeeker?id=${id}`);
  }

  useEffect(() => {
    if (accessToken) {
      viewOneJobListing(id, accessToken)
        .then((data) => {
          setJobListing(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
          setIsLoading(false);
        });

      findExistingJobApplication(jobSeekerId,id,accessToken)
      .then((response) => {
        if(response.statusCode === 200) {
          setIsJobApplicationAbsent(false);
        } else {
          console.error("Error fetching job preference:", response.json());
          setIsJobApplicationAbsent(true);
        }
      })
    }
  }, [accessToken, refreshData]);

  // Function to format date in "day-month-year" format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      {isLoading ? (
        <ProgressSpinner
          style={{
            display: "flex",
            height: "100vh",
            "justify-content": "center",
            "align-items": "center",
          }}
        />
      ) : (
        <Card
          title={jobListing.title}
          subTitle={jobListing.jobLocation}
          className="my-card"
          style={{ borderRadius: "0" }}
        >
          <div className="my-card.p-card-content">
            <div className="company-info">
              {jobListing.corporate.profilePictureUrl === "" ? (
                <Image src={HumanIcon} alt="User" className="avatar" />
              ) : (
                <img
                  src={jobListing.corporate.profilePictureUrl}
                  className="avatar"
                />
              )}
              <div className="company-details">
                <p>{jobListing.corporate.userName}</p>
              </div>
            </div>

            <strong>Job Overview</strong>
            <p>{jobListing.overview}</p>
            <strong>Job Responsibilities</strong>
            <p>{jobListing.responsibilities}</p>
            <strong>Job Requirements</strong>
            <p>{jobListing.requirements}</p>
            <strong>Average Salary</strong>
            <p>{"$" + jobListing.averageSalary + " SGD"}</p>
            <strong>Listing Date</strong>
            <p>{formatDate(jobListing.listingDate)}</p>
            <strong>Job Start Date</strong>
            <p>{formatDate(jobListing.jobStartDate)}</p>

            <div className="contact-info">
              <strong>Contact Information</strong>
              <p>{jobListing.corporate.email}</p>
              <p className="second-p">{jobListing.corporate.contactNo}</p>
            </div>

            <strong>Corporate Details</strong>
            <p>{"UEN Number: " + jobListing.corporate.companyRegistrationId}</p>
            <p className="second-p">
              {"Address: " + jobListing.corporate.companyAddress}
            </p>

            <strong>Job Listing Details</strong>
            <p>{formatDate(jobListing.listingDate)}</p>

            <p>{"Job Listing ID: " + jobListing.jobListingId}</p>
          </div>

          {/* Conditionally rendering the button based on the existence of jobListing.jobApplication */}
          {isJobApplicationAbsent && (
            <Button
              icon="pi pi-plus"
              rounded
              severity="success"
              onClick={() => setShowCreateJobApplicationDialog(true)}
            />
          )}

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
        </Card>
      )}
    </div>
  );
}
