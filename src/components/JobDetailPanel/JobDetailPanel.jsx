import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import styles from "./jobDetailPanel.module.css";
import Image from "next/image";
import HumanIcon from "./../../../public/icon.png";
import { removeJobListingAssignment } from "@/app/api/jobListing/route";
import {
  createJobApplication,
  findExistingJobApplication,
} from "@/app/api/jobApplication/route";
import CreateJobApplicationForm from "@/components/CreateJobApplicationForm/CreateJobApplicationForm";
import { getReviews } from "@/app/api/review/route";

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
  sessionTokenRef,
}) => {
  const [showCreateJobApplicationDialog, setShowCreateJobApplicationDialog] =
    useState(false);
  const [showRejectJobListingDialog, setShowRejectJobListingDialog] =
    useState(false);

  const [showCorporateReview, setShowCorporateReview] = useState(false);
  const hideCorporateReview = () => {
    setShowCorporateReview(false);
  };
  const [reviews, setReviews] = useState([]);

  const router = useRouter();

  const [isJobApplicationAbsent, setIsJobApplicationAbsent] = useState(false);

  useEffect(() => {
    if (!selectedJob) return;

    const fetchJobApplication = async () => {
      try {
        const response = await findExistingJobApplication(
          jobSeekerId,
          selectedJob.jobListingId,
          accessToken
        );
        console.log("selectedJob", selectedJob.corporate.userId);
        if (response.statusCode === 200) {
          setIsJobApplicationAbsent(false);
        } else if (response.statusCode === 404) {
          setIsJobApplicationAbsent(true);
        } else {
          console.error("Error fetching job application:", response);
          setIsJobApplicationAbsent(true);
        }
      } catch (error) {
        console.error("Error fetching job application:", error);
        setIsJobApplicationAbsent(true);
      }
    };
    fetchJobApplication();

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

    const retrieveReviews = async () => {
      try {
        const response = await getReviews(
          selectedJob.corporate.userId,
          "Corporate",
          accessToken
        );
        if (response.statusCode === 200) {
          console.log("Reviews retrieved");
          console.log(response.data);
          setReviews(response.data);
        }
      } catch (error) {
        console.log("Error fetching reviews", error.message);
      }
    };
    retrieveReviews();
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
          detail: `Successfully created job application for ${selectedJob.title}`,
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
    setSelectedJob(null);
    setShowRejectJobListingDialog(false);
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
          {/* Add onclick button to setShowCorporateReivew to true */}
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
            <p
              className={styles.reviewText}
              onClick={() => setShowCorporateReview(true)}
            >
              {selectedJob.corporate.userName}
            </p>
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
            label="Apply Now"
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
        <span>You have submitted an application for this job</span>
      )}

      <Dialog
        header="Create Job Application"
        visible={showCreateJobApplicationDialog}
        onHide={hideCreateJobApplicationDialog}
        // className={styles.createDialog}
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

      <Dialog
        header={selectedJob.corporate.userName + " Reviews"}
        visible={showCorporateReview}
        onHide={hideCorporateReview}
        className={styles.cardDialog}
      >
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            There are currently no reviews for this workplace.
          </p>
        ) : (
          reviews.map(
            (review, index) =>
              review.description && (
                <div className={styles.review} key={index}>
                  <p>
                    <strong> {review.jobSeeker.fullName}</strong>
                  </p>
                  <p>{review.description}</p>
                </div>
              )
          )
        )}
      </Dialog>
    </div>
  );
};

export default JobDetailPanel;
