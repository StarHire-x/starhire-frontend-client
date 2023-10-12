import React, { useState, useRef, useEffect } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import styles from "./jobDetailPanel.module.css";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import {
  createJobApplication,
  findExistingJobApplication,
} from "@/app/api/jobApplication/route";
import CreateJobApplicationForm from "@/components/CreateJobApplicationForm/CreateJobApplicationForm";
import { removeJobListingAssignment } from "@/app/api/jobListing/route";
import { useRouter } from "next/navigation";

const JobDetailPanel = ({
  selectedJob,
  setSelectedJob,
  accessToken,
  formErrors,
  setFormErrors,
  jobSeekerId,
  refreshData,
  setRefreshData,
  toast,
}) => {
  const [showCreateJobApplicationDialog, setShowCreateJobApplicationDialog] =
    useState(false);
  const [showRejectJobListingDialog, setShowRejectJobListingDialog] =
    useState(false);

  const router = useRouter();

  const [isJobApplicationAbsent, setIsJobApplicationAbsent] = useState(false);

  useEffect(() => {
    if (selectedJob) {
      findExistingJobApplication(
        jobSeekerId,
        selectedJob.jobListingId,
        accessToken
      ).then((response) => {
        if (response.statusCode === 200) {
          setIsJobApplicationAbsent(false);
        } else {
          console.error("Error fetching job preference:", response.json());
          setIsJobApplicationAbsent(true);
        }
      });

      const documentsList = selectedJob.requiredDocuments
        ? selectedJob.requiredDocuments.split(",").map((name) => ({
            mandatory: true,
            documentName: name.trim(),
            documentLink: "",
          }))
        : [];
      setFormData((prevData) => ({
        ...prevData,
        documents: documentsList,
      }));
    }
  }, [refreshData, jobSeekerId, selectedJob]);

  const hideRejectJobListingDialog = () => {
    setShowRejectJobListingDialog(false);
  };

  const hideCreateJobApplicationDialog = () => {
    setShowCreateJobApplicationDialog(false);
  };

  const [formData, setFormData] = useState({
    jobApplicationStatus: "",
    availableStartDate: "",
    availableEndDate: "",
    submissionDate: "",
    remarks: "",
    documents: [
      {
        documentName: "",
        documentLink: "",
      },
    ],
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const addJobApplication = async (e) => {
    e.preventDefault();
    if (Object.keys(formErrors).length > 0) {
      // There are validation errors
      //alert('Please fix the form errors before submitting.');
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please fix the form errors before submitting.",
        life: 5000,
      });
      return;
    }

    const areDocumentsFilled = formData.documents.every(
      (doc) => doc.documentName.trim() !== "" && doc.documentLink.trim() !== ""
    );

    if (!areDocumentsFilled) {
      //alert('Please ensure all documents are properly filled up.');
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please ensure all documents are properly filled up.",
        life: 5000,
      });
      return;
    }

    const reqBody = {
      jobListingId: selectedJob.jobListingId,
      jobSeekerId: jobSeekerId,
      jobApplicationStatus: "Submitted",
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
        console.log("Job application created successfully:", response);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail:
            `Successfully created job application for ${selectedJob.title}`,
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      //alert(error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateJobApplicationDialog(false);
  };

  const removeJobListing = async (jobSeekerId, jobListingId) => {
    try {
      const response = await removeJobListingAssignment(
        jobSeekerId,
        jobListingId,
        accessToken
      );
      console.log(
        "Job Listing disassociated with Job Seeker",
        response.message
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `${selectedJob.title} disassociated successfully!`,
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error("Error dissociating job listing:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
    }
    setShowRejectJobListingDialog(false);
    setSelectedJob(null);
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

  const job = selectedJob;
  if (!selectedJob) return null;

  return (
    <div className={styles.jobDetailPanel}>
      <h2>{selectedJob.title}</h2>
      <div className={styles.pCardContent}>
        <div className={styles.companyInfo}>
          {job.corporate.profilePictureUrl === "" ? (
            <Image src={HumanIcon} alt="User" className={styles.avatar} />
          ) : (
            <img
              src={selectedJob.corporate.profilePictureUrl}
              alt="Corporate Profile"
              className={styles.avatar}
            />
          )}
          <div>
            <p>{selectedJob.corporate.userName}</p>
          </div>
        </div>
      </div>
      <strong>Job Overview</strong>
      <p>{selectedJob.overview}</p>
      <strong>Responsibilities</strong>
      <p>{selectedJob.responsibilities}</p>
      <strong>Requirements</strong>
      <p>{selectedJob.requirements}</p>
      <strong>Suggested Documents</strong>
      <p>{selectedJob.requiredDocuments}</p>
      <strong>Average Monthly Salary</strong>
      <p>
        <span>$</span>
        {selectedJob.averageSalary}
      </p>
      <strong>Preferred Start Date</strong>
      <p>{formatDate(selectedJob.jobStartDate)}</p>
      <p>
        <span>Posted on </span>
        {formatDate(selectedJob.listingDate)}
      </p>

      {isJobApplicationAbsent ? (
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
      ) : (
        <span>You have submitted an application for this job listing</span>
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

      <Dialog
        header="Reject Job Listing"
        visible={showRejectJobListingDialog}
        onHide={hideRejectJobListingDialog}
        className={styles.cardDialog}
        footer={deleteDialogFooter}
      >
        Are you sure you want to reject this job listing?
      </Dialog>
    </div>
  );
};

export default JobDetailPanel;
