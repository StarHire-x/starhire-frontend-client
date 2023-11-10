import React, { useState, useEffect } from "react";
import styles from "./CreateReviewForm.module.css";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import Enums from "@/common/enums/enums"; 
import { Dropdown } from "primereact/dropdown";

const CreateReviewForm = ({
  formData,
  setFormData,
  handleInputChange,
  addReview,
  formErrors,
  setFormErrors,
  roleRef,
  dropdownList,
}) => {
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    if (dropdownList.length > 0) {
      let options = dropdownList.map((item) => ({
        label: item.key,
        value: item.value,
      }));

      setFilterOptions([...options]);

      setFormData((prevFormData) => ({
        ...prevFormData,
        jobSeekerId: selectedFilter,
      }));
    }
  }, [dropdownList, setFormData, selectedFilter]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={addReview}>
        <div className={styles.cardBody}>
          {roleRef === Enums.CORPORATE && (
            <>
              <div className={styles.cardRow}>
                <label>Job Seeker username</label>
                <Dropdown
                  name="jobSeekerId"
                  value={selectedFilter}
                  options={filterOptions}
                  onChange={(e) => setSelectedFilter(e.value)}
                  placeholder="Select Job Seeker"
                  required
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
                  rows={7}
                  autoResize={true}
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <Button label="Create Review" severity="success" raised />
        </div>
      </form>
    </div>
  );
};

export default CreateReviewForm;
