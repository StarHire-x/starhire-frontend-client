import React, { useState } from "react";
import styles from "./viewJobApplicationForm.module.css";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Panel } from "primereact/panel";
import { useEffect } from "react";
import { Tag } from "primereact/tag";
import { viewJobApplicationDetails } from "@/app/api/jobApplication/route";

const ViewJobApplicationForm = ({
  formData,
  setFormData,
  getStatus,
  accessToken,
  selectedJobApplicationData,
}) => {
  const [jobApplication, setJobApplication] = useState({});

  useEffect(() => {
    if (selectedJobApplicationData) {
      viewJobApplicationDetails(
        selectedJobApplicationData.jobApplicationId,
        accessToken
      )
        .then((data) => {
          setJobApplication(data);
          console.log(jobApplication);
        })
        .catch((error) => {
          console.log("Failed to fetch job application details");
        });
    }
  }, [selectedJobApplicationData]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span>
            Your Job Application for{" "}
            <strong>
              {jobApplication.jobListing && jobApplication.jobListing.title}
            </strong>{" "}
            is managed by{" "}
            <strong>
              {jobApplication.recruiter && jobApplication.recruiter.userName}
            </strong>
          </span>
        </div>
        <br />
        <div className={styles.cardRow}>
          <span>Job Application Id</span>
          <span>{jobApplication.jobApplicationId}</span>
        </div>
        <div className={styles.cardRow}>
          <span>Available Start Date</span>
          <span>{formatDate(jobApplication.availableStartDate)}</span>
        </div>
        <div className={styles.cardRow}>
          <span>Available End Date</span>
          <span>
            {formatDate(new Date(jobApplication.availableEndDate)) ===
            "01/01/1970"
              ? ""
              : formatDate(new Date(jobApplication.availableEndDate))}
          </span>
        </div>
        <div className={styles.cardRow}>
          <span>Remarks</span>
          <span>{jobApplication.remarks}</span>
        </div>
        <div className={styles.cardRow}>
          <span>Status</span>
          <span>
            <Tag
              value={jobApplication.jobApplicationStatus}
              severity={getStatus(jobApplication.jobApplicationStatus)}
            />
          </span>
        </div>
        <br />

        {jobApplication.documents &&
          jobApplication.documents.map((document, index) => (
            <React.Fragment key={index}>
              <div className={styles.cardRow}>
                <span>Document Title</span>
                <span>{document.documentName}</span>
              </div>
              <div className={styles.cardRow}>
                <span>File</span>
                <Button
                  type="button"
                  icon="pi pi-file-pdf"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(document.documentLink, "_blank");
                  }}
                  className="p-button-rounded p-button-danger"
                  aria-label="Open PDF"
                />
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default ViewJobApplicationForm;
