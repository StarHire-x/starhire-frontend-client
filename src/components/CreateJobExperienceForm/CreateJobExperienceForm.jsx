import React, { useState } from "react";
import styles from './page.module.css'
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const CreateJobExperienceForm = ({ formData, setFormData, handleInputChange, createJobExperience }) => {
    
    return (
      <div className={styles.container}>
          <form className={styles.form} onSubmit={createJobExperience}>
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.value,
                    }))
                  }
                />
              </div>

              <div className={styles.cardRow}>
                <label>End Date</label>
                <Calendar
                  id="endDate"
                  name="endDate"
                  value={formData?.endDate}
                  maxDate={new Date(new Date().setDate(new Date().getDate()))}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.value,
                    }))
                  }
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
}

export default CreateJobExperienceForm;