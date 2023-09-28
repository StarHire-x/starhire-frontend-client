'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { viewOneJobListing } from '@/app/api/auth/jobListing/route'; // Adjust the path
import { saveJobListing } from '@/app/api/auth/jobListing/route'; // Adjust the path
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import Image from 'next/image';
import HumanIcon from '../../../../public/icon.png'; // Adjust the path

export default function viewJobListingDetailsJobSeeker() {
  const params = useSearchParams();
  const id = params.get('id');

  const session = useSession();

  const router = useRouter();

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const [jobListing, setJobListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      viewOneJobListing(id, accessToken)
        .then((data) => {
          setJobListing(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching job details:', error);
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  // Function to format date in "day-month-year" format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSaveJobListing = async (jobListingId) => {
    try {
      console.log('Attempting to save job listing with ID:', jobListingId);
      if (accessToken) {
        console.log('Access Token before API call:', accessToken);
        await saveJobListing(jobListingId, accessToken);
        alert('Job listing saved successfully!');
        console.log('Successfully saved job listing.');
      } else {
        alert('Please login to save the job listing.');
      }
    } catch (error) {
      console.error('Error saving job listing:', error);
      alert('Failed to save job listing. Please try again.');
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        label="Save"
        icon="pi pi-bookmark" // An icon to represent 'Save'
        className="save-button p-button-outlined p-button-secondary"
        onClick={() => handleSaveJobListing(jobListing.jobListingId)} // Pass the job listing ID to the save handler
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
          footer={footer}
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
                />
              )} */}
            <div className="company-details">
              <p>{jobListing.corporate.userName}</p>
            </div>
            {/* </div> */}

            <strong>Job Overview</strong>
            <p>{jobListing.overview}</p>
            <strong>Job Responsibilities</strong>
            <p>{jobListing.responsibilities}</p>
            <strong>Job Requirements</strong>
            <p>{jobListing.requirements}</p>
            <strong>Average Salary</strong>
            <p>{'$' + jobListing.averageSalary + ' SGD'}</p>
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
            <p>{'UEN Number: ' + jobListing.corporate.companyRegistrationId}</p>
            <p className="second-p">
              {'Address: ' + jobListing.corporate.companyAddress}
            </p>

            <strong>Job Listing Details</strong>
            <p>{formatDate(jobListing.listingDate)}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
