import React, { useState, useEffect } from "react";
import styles from "./EditReviewForm.module.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import Enums from "@/common/enums/enums"; 

const EditReviewForm = ({
  formData,
  setFormData,
  handleInputChange,
  editReview,
  selectedReview,
  formErrors,
  roleRef,
  setFormErrors,
}) => {
  useEffect(() => {
    if (selectedReview) {
      if (formatDate(new Date(selectedReview.endDate)) === "01/01/1970") {
        setIsCurrentJob(true);
      }
      setFormData({
        reviewId: selectedReview.reviewId,
        startDate: new Date(selectedReview.startDate),
        endDate:
          formatDate(new Date(selectedReview.endDate)) === "01/01/1970"
            ? null
            : new Date(selectedReview.endDate),
        description: selectedReview.description,
      });
    }
  }, [selectedReview]);

  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={editReview}>
        <div className={styles.cardBody}>
          {roleRef === Enums.CORPORATE && (
            <>
              {/* <div className={styles.cardRow}>
                <label>Job Seeker Username</label>
                <InputText
                  name="userName"
                  value={selectedReview?.jobSeeker.userName}
                  readOnly
                />
              </div>

              <div className={styles.cardRow}>
                <label>Job Seeker Full Name</label>
                <InputText
                  name="fullName"
                  value={selectedReview?.jobSeeker.fullName}
                  readOnly
                />
              </div> */}

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
                  required
                />
              </div>

              {formErrors.endDate && (
                <small className={styles.errorMessage}>
                  {formErrors.endDate}
                </small>
              )}

              <div className={styles.cardRow}>
                <label>Current Review</label>
                <Checkbox
                  inputId="isCurrent"
                  checked={isCurrentJob}
                  onChange={(e) => {
                    setIsCurrentJob(e.checked);
                    if (e.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        endDate: "null",
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
                <label htmlFor="description">Description:</label>
                <InputTextarea
                  id="description"
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  rows={7} /* Adjust as needed */
                  autoResize={true} /* If you want it to resize automatically */
                  required
                />
              </div>
            </>
          )}
          {roleRef === Enums.JOBSEEKER && (
            <>
              {/* <div className={styles.cardRow}>
                <label>Job Seeker Username</label>
                <InputText
                  name="userName"
                  value={selectedReview?.jobSeeker.userName}
                  readOnly
                />
              </div>

              <div className={styles.cardRow}>
                <label>Job Seeker Full Name</label>
                <InputText
                  name="fullName"
                  value={selectedReview?.jobSeeker.fullName}
                  readOnly
                />
              </div> */}

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
                  required
                />
              </div>

              {formErrors.endDate && (
                <small className={styles.errorMessage}>
                  {formErrors.endDate}
                </small>
              )}

              <div className={styles.cardRow}>
                <label>Current Review</label>
                <Checkbox
                  inputId="isCurrent"
                  checked={isCurrentJob}
                  onChange={(e) => {
                    setIsCurrentJob(e.checked);
                    if (e.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        endDate: "null",
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
                <label htmlFor="description">Description:</label>
                <InputTextarea
                  id="description"
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  rows={7} /* Adjust as needed */
                  autoResize={true} /* If you want it to resize automatically */
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <Button label="Save Changes" severity="success" raised />
        </div>
      </form>
    </div>
  );
};

export default EditReviewForm;
