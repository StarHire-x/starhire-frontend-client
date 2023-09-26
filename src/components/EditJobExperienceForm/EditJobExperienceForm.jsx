import React, { useState, useEffect } from "react";
import styles from "./editJobExperienceForm.module.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const EditJobExperienceForm = ({
  formData,
  setFormData,
  handleInputChange,
  editJobExperience,
  selectedJobExperience,
  formErrors,
  setFormErrors
}) => {

  useEffect(() => {
    if (selectedJobExperience) {
      setFormData({
        jobExperienceId: selectedJobExperience.jobExperienceId,
        employerName: selectedJobExperience.employerName,
        jobTitle: selectedJobExperience.jobTitle,
        startDate: new Date(selectedJobExperience.startDate),
        endDate: new Date(selectedJobExperience.endDate),
        jobDescription: selectedJobExperience.jobDescription,
      });
    }
  }, [selectedJobExperience]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={editJobExperience}>
        <div className={styles.cardBody}>
          <div className={styles.cardRow}>
            <label>Company Name:</label>
            <InputText
              name="employerName"
              value={formData?.employerName}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.cardRow}>
            <label>Job Title</label>
            <InputText
              name="jobTitle"
              value={formData?.jobTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.cardRow}>
            <label>Start Date</label>
            <Calendar
              id="startDate"
              name="startDate"
              value={formData?.startDate}
              dateFormat="dd/mm/yy"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: e.value,
                }))
              }
            />
          </div>

          {formErrors.endDate && (
            <small className={styles.errorMessage}>{formErrors.endDate}</small>
          )}

          <div className={styles.cardRow}>
            <label>End Date</label>
            <Calendar
              id="endDate"
              name="endDate"
              value={formData?.endDate}
              dateFormat="dd/mm/yy"
              maxDate={new Date(new Date().setDate(new Date().getDate()))}
              onChange={(e) => {
                if (e.value <= formData.startDate) {
                  setFormErrors((prev) => ({
                    ...prev,
                    endDate: "End date must be after start date.",
                  }));
                } else {
                  setFormErrors((prev) => {
                    const { endDate, ...rest } = prev;
                    return rest;
                  });
                }
                setFormData((prev) => ({
                  ...prev,
                  endDate: e.value,
                }));
              }}
            />
          </div>

          <div className={styles.cardRow}>
            <label htmlFor="jobDescription">Job Description:</label>
            <InputTextarea
              id="jobDescription"
              name="jobDescription"
              value={formData?.jobDescription}
              onChange={handleInputChange}
              rows={7} /* Adjust as needed */
              autoResize={true} /* If you want it to resize automatically */
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button label="Save Changes" severity="success" raised />
        </div>
      </form>
    </div>
  );
};

export default EditJobExperienceForm;
