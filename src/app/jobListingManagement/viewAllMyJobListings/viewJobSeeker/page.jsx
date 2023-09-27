"use client"
import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { getJobSeekersByJobApplicationId } from '@/app/api/auth/jobListing/route';
import styles from 'src/app/jobListingManagement/page.module.css';
import 'primeflex/primeflex.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Card } from 'primereact/card';
import Image from 'next/image';
import "./styles.css";

const ViewJobSeekerPage = () => {
    const [jobApplication, setJobApplications] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userDialog, setUserDialog] = useState(false);
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

    const params = useSearchParams();
    const id = params.get("id");

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
      if (accessToken) {
        getJobSeekersByJobApplicationId(id, accessToken)
          .then((response) => {
            setJobApplications(response);
            setIsLoading(false);
            console.log(jobApplication);
          })
          .catch((error) => {
            console.error("Error fetching job listings:", error);
            setIsLoading(false);
          });
      }
    }, [userIdRef, accessToken]);

    const hideDialog = () => {
      setUserDialog(false);
    };
  
    const showUserDialog = (action) => {
      setUserDialog(true);
      setStatus(action);
    };
  
    const userDialogFooter = (
      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button
          label="Yes"
          icon="pi pi-check"
          outlined
          //onClick={() => updateJobListingStatus(status)}
        />
      </React.Fragment>
    );
  
    const footer = (
      <div className="flex flex-wrap justify-content-end gap-2">
        <Button
          label="Approve"
          icon="pi pi-check"
          className="approve-button p-button-outlined p-button-secondary"
          onClick={() => showUserDialog('Active')}
        />
        <Button
          label="Reject"
          icon="pi pi-times"
          className="reject-button p-button-outlined p-button-secondary"
          onClick={() => showUserDialog('Inactive')}
        />
        <Button
          label="Archive"
          icon="pi pi-folder"
          className="archive-button p-button-outlined p-button-secondary"
          onClick={() => showUserDialog('Inactive')}
        />
      </div>
    );
  
    return (
      <div className="container">
        {isLoading ? (
          <div className="loading-animation">
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            <Card
              title={"Job Application: " + jobApplication.jobApplicationId}
              //subTitle={jobApplication.jobSeeker.userName}
              footer={footer}
              className="my-card"
              style={{ borderRadius: '0' }}
            >
              <div className="my-card.p-card-content">
                <div className="company-info">
                {jobApplication.jobApplicationId === "" ? (
                    <Image src={HumanIcon} alt="User" className="avatar" />
                  ) : (
                  <img
                    src={jobApplication.jobSeeker.profilePictureUrl}
                    className="avatar"
                  />
                )}
                  
                  <div className="company-details">
                    <p>{jobApplication.jobApplicationId}</p>
                  </div>
                </div>
  
                <strong>Username: </strong>
                <p>{jobApplication.jobSeeker.userName}</p>
                <strong>Job Responsibilities</strong>
                <p>{jobApplication.jobApplicationId}</p>
                <strong>Job Requirements</strong>
                <p>{jobApplication.jobApplicationId}</p>
                <strong>Average Salary</strong>
                <p>{"$" + jobApplication.jobApplicationId + " SGD"}</p>
                <strong>Job Start Date</strong>
  
                <div className="contact-info">
                  <strong>Contact Information</strong>
                  <p>{jobApplication.jobApplicationId}</p>
                  <p className="second-p">{jobApplication.jobApplicationId}</p>
                </div>
  
                <strong>Job Seeker Details</strong>
                <p>{"Email: " + jobApplication.jobSeeker.email}</p>
                <p className="second-p">{"Address: " + jobApplication.jobApplicationId}</p>
  
  
                <p>{"Job Listing ID: " + jobApplication.jobApplicationId}</p>
  
                <strong>Current Status of Job</strong>
                <p
                  style={{
                    color:
                    jobApplication.jobApplicationIds === 'Active' ? 'green' : 'red',
                  }}
                >
                  {jobApplication.jobApplicationId}
                </p>
              </div>
            </Card>
  
            <Dialog
              visible={userDialog}
              style={{ width: '32rem' }}
              breakpoints={{ '960px': '75vw', '641px': '90vw' }}
              header="Confirm?"
              className="p-fluid"
              footer={userDialogFooter}
              onHide={hideDialog}
            ></Dialog>
          </div>
        )}
      </div>
    );

    
}

export default ViewJobSeekerPage;