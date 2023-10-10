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
} from '@/app/api/jobListing/route';

import styles from './page.module.css';
import 'primeflex/primeflex.css';
import CreateJobListingForm from '@/components/CreateJobListingForm/CreateJobListingForm';
import CreateATicketForm from '@/components/CreateATicketForm/CreateATicketForm';
import { useRouter } from 'next/navigation';
import Enums from '@/common/enums/enums';
import { Toast } from "primereact/toast";

const CreateATicketPage = () => {
  const [jobListing, setJobListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  const toast = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = (status) => {
    switch (status) {
      case Enums.ACTIVE:
        return 'success';
      case 'Unverified':
        return 'danger';
      case Enums.INACTIVE:
        return 'danger';
    }
  };


  const hideCreateDialog = () => {
    setShowCreateDialog(false);
  };

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

  /*
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
      </div>
    );
  };
*/

  const handleTicketCreation = async (newJobListing) => {
    try {
      const payload = {
        ...newJobListing,
        corporateId: userIdRef,
      };
      const response = await createJobListing(payload, accessToken);
      console.log('Created Job listing Successfully', response);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Created job listing successfully",
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error(
        'There was an error creating the job listing:',
        error.message
      );
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateDialog(false);
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
          <h1 className={styles.headerTitle} style={{ marginBottom: "15px" }}>
            Ticket Management
          </h1>
          <Button
            className={styles.createJobListingButton}
            label="Submit a Ticket"
            rounded
            style={{ marginTop: "10px", marginBottom: "15px" }}
            onClick={() => setShowCreateDialog(true)}
          />
        </div>

        <div className={styles.cardsGrid}>
          {/* {jobListing.map((job) => itemTemplate(job))} */}
        </div>

        <Dialog
          header="Create a Ticket"
          visible={showCreateDialog}
          onHide={hideCreateDialog}
          className={styles.cardDialog}
        >
          <CreateATicketForm  onCreate={handleTicketCreation} />
        </Dialog>

      </>
    );
  }
};

export default CreateATicketPage;