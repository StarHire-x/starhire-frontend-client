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
import { Joan } from 'next/font/google';

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
          label="Accept"
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
              subTitle={
                "Submitted on: " + formatDate(jobApplication.submissionDate)
              }
              footer={footer}
              className="my-card"
              style={{ borderRadius: "0" }}
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

                  {/*<div className="company-details">
                    <p>{jobApplication.jobApplicationId}</p>
                  </div>
                  */}
                </div>

                <strong>Application Details</strong>
                <p>
                  {"Available Start Date: " +
                    formatDate(jobApplication.availableStartDate)}
                </p>
                <p>
                  {"Available End Date: " +
                    formatDate(jobApplication.availableEndDate)}
                </p>

                <strong>Personal Particulars </strong>
                <p>{"StarHire User ID: " + jobApplication.jobSeeker.userId}</p>
                <p>{"Full Name: " + jobApplication.jobSeeker.fullName}</p>
                <p>
                  {"Date of Birth: " +
                    formatDate(jobApplication.jobSeeker.dateOfBirth)}
                </p>

                <p className="second-p">
                  {"Contact Number: " + jobApplication.jobSeeker.contactNo}
                </p>
                <p className="second-p">
                  {"Home Address: " + jobApplication.jobSeeker.homeAddress}
                </p>

                <div className="contact-info">
                  <strong>Contact Information</strong>
                  <p>{"Email Adress: " + jobApplication.jobSeeker.email}</p>
                  <p className="second-p">
                    {"Contact Number: " + jobApplication.jobSeeker.contactNo}
                  </p>
                </div>

                <div className="contact-info">
                  <strong>Education Infomation</strong>
                  <p>
                    {"Highest Education Level: " +
                      jobApplication.jobSeeker.highestEducationStatus}
                  </p>
                  <p className="second-p">
                    {"Name of Institution: " +
                      jobApplication.jobSeeker.instituteName}
                  </p>
                  <p className="second-p">
                    {"Date of Graduation: " +
                      formatDate(jobApplication.jobSeeker.dateOfGraduation)}
                  </p>
                </div>

                <div className="contact-info">
                  <strong>Attachments</strong>
                  <p>{"Resume: " + "Attach Link here"}</p>
                  <p className="second-p">
                    {"L1 Certificate: " + "Attach Link here"}
                  </p>
                  <p className="second-p">
                    {"L2 Certificate: " + "Attach Link here"}
                  </p>
                </div>

                <div className="contact-info">
                  <strong>Assigned by: </strong>

                  {jobApplication.jobApplicationId === "" ? (
                    <Image src={HumanIcon} alt="User" className="avatar" />
                  ) : (
                    <div>
                      <img
                        src={jobApplication.jobSeeker.profilePictureUrl}
                        className="avatar"
                      />
                      <p>
                        {"Recruiter User ID: " +
                          jobApplication.recruiter.userId}
                      </p>
                    </div>
                  )}
                  <p>
                    {"Recruiter Email Address: " +
                      jobApplication.recruiter.email}
                  </p>
                </div>

                <strong>Application Status</strong>
                <p
                  style={{
                    color:
                      jobApplication.jobApplicationStatus === "Accepted"
                        ? "green"
                        : jobApplication.jobApplicationStatus === "Rejected"
                        ? "red"
                        : "grey",
                  }}
                >
                  {jobApplication.jobApplicationStatus}
                </p>
              </div>
            </Card>

            <Dialog
              visible={userDialog}
              style={{ width: "32rem" }}
              breakpoints={{ "960px": "75vw", "641px": "90vw" }}
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