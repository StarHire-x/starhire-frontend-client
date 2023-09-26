import React, { useState } from "react";
import styles from "./createJobExperienceForm.module.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

const CreateJobExperienceForm = ({
  formData,
  setFormData,
  handleInputChange,
  addJobExperience,
  formErrors,
  setFormErrors
}) => {

  const [isCurrentJob, setIsCurrentJob] = useState(false);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={addJobExperience}>
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
            <label>Current Job:</label>
            <Checkbox
              inputId="isCurrent"
              checked={isCurrentJob}
              onChange={(e) => {
                setIsCurrentJob(e.checked);
                if (e.checked) {
                  setFormData((prev) => ({
                    ...prev,
                    endDate: null,
                  }));
                }
              }}
            />
          </div>

          <div className={styles.cardRow}>
            <label>End Date</label>
            <Calendar
              id="endDate"
              name="endDate"
              value={formData?.endDate}
              dateFormat="dd/mm/yy"
              disabled={isCurrentJob}
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
              rows={7}
              autoResize={true}
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

export default CreateJobExperienceForm;
