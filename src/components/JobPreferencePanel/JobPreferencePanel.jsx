import React, { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import styles from "./jobPreferencePanel.module.css";
import {
  createJobPreference,
  updateJobPreference,
} from "@/app/api/preference/route";
import { Toast } from "primereact/toast";
import Enums from "@/common/enums/enums";

const JobPreferencePanel = ({
  formData,
  setFormData,
  sessionTokenRef,
  roleRef,
  setRefreshData,
  isJobPreferenceAbsent,
  setIsJobPreferenceAbsent,
  totalStarsUsed,
  setTotalStarsUsed,
}) => {
  // Dialog Box
  const [errorMessage, setErrorMessage] = useState("");

  const toast = useRef(null);

  const handleRatingChange = (category, value) => {
    setErrorMessage("")
    // Calculate the new total stars used for the specific category
    const currentCategoryStars = formData[category] || 0;
    const newCategoryStarsUsed = totalStarsUsed - currentCategoryStars + value;

    // Check if the new total stars used across all categories exceeds 10
    // if (totalStarsUsed - currentCategoryStars + value > 10) {
    //   setErrorMessage("You have selected more than 10 stars");
    //   return;
    // }

    // Update the form data and total stars used
    const updatedFormData = { ...formData };
    updatedFormData[category] = value;
    setFormData(updatedFormData);
    setTotalStarsUsed(newCategoryStarsUsed);
    setErrorMessage(""); // Clear any previous error message
  };

  const createNewJobPreference = async (e) => {
    e.preventDefault();

    if(totalStarsUsed < 10) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You have selected less than 10 stars",
        life: 5000,
      });
      return;
    } else if(totalStarsUsed > 10) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You have selected more than 10 stars",
        life: 5000,
      });
      return;
    } 

    let reqBody;
    if(roleRef === Enums.JOBSEEKER) {
      reqBody = {
        jobSeekerId: formData.userId,
        benefitPreference: formData.benefitPreference,
        salaryPreference: formData.salaryPreference,
        workLifeBalancePreference: formData.workLifeBalancePreference,
      };
    } else if (roleRef === Enums.CORPORATE) {
      reqBody = {
        corporateId: formData.userId,
        benefitPreference: formData.benefitPreference,
        salaryPreference: formData.salaryPreference,
        workLifeBalancePreference: formData.workLifeBalancePreference,
      };
    }
    
    try {
      const response = await createJobPreference(reqBody, sessionTokenRef);
      if (!response.error) {
        // alert("Job preference created successfully!");
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Job preference created successfully!",
          life: 5000,
        });
        setRefreshData((prev) => !prev);
        setIsJobPreferenceAbsent(false);
      }
    } catch (error) {
      console.log("Failed to create job preference", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
      setErrorMessage(error.message);
    }
  };

  const updateExistingJobPreference = async (e) => {
    e.preventDefault();
    const jobPreferenceId = formData.jobPreferenceId;

    if (totalStarsUsed < 10) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You have selected less than 10 stars",
        life: 5000,
      });
      return;
    } else if (totalStarsUsed > 10) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You have selected more than 10 stars",
        life: 5000,
      });
      return;
    } 

    const reqBody = {
      benefitPreference: formData.benefitPreference,
      salaryPreference: formData.salaryPreference,
      workLifeBalancePreference: formData.workLifeBalancePreference,
    };

    try {
      const response = await updateJobPreference(
        jobPreferenceId,
        reqBody,
        sessionTokenRef
      );
      if (!response.error) {
        // alert("Job preference update successfully!");
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Job preference updated successfully!",
          life: 5000,
        });
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      console.log("Failed to update job preference", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000,
      });
      setErrorMessage(error.message);
    }
  };

  return (
    <Panel header="Job Preference" toggleable>
      <Toast ref={toast} />

      {isJobPreferenceAbsent ? (
        <>
          <div className={styles.titleContainer}>
            <p className={styles.title}>Indicate your Preference</p>
            <p className={styles.subTitle}>You have a maximum of 10 stars</p>
            <p className={styles.starCounter}>
              Number of stars used: {totalStarsUsed} / 10
            </p>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={createNewJobPreference}>
            <div className={styles.inputFields}>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="benefitPreference"
                  className={styles.labelRating}
                >
                  Benefit:
                </label>
                <Rating
                  value={Number(formData?.benefitPreference)}
                  onChange={(e) =>
                    handleRatingChange("benefitPreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="salaryPreference"
                  className={styles.labelRating}
                >
                  Salary:
                </label>
                <Rating
                  value={Number(formData?.salaryPreference)}
                  onChange={(e) =>
                    handleRatingChange("salaryPreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="workLifeBalancePreference"
                  className={styles.labelRating}
                >
                  Work Life Balance:
                </label>
                <Rating
                  value={Number(formData?.workLifeBalancePreference)}
                  onChange={(e) =>
                    handleRatingChange("workLifeBalancePreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button label="Submit" severity="success" raised />
            </div>
          </form>
        </>
      ) : (
        <>
          <div className={styles.titleContainer}>
            <p className={styles.title}>Update your Preference</p>
            <p className={styles.subTitle}>You have a maximum of 10 stars</p>
            <p className={styles.starCounter}>
              Number of stars used: {totalStarsUsed} / 10
            </p>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={updateExistingJobPreference}>
            <div className={styles.inputFields}>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="benefitPreference"
                  className={styles.labelRating}
                >
                  Benefit:
                </label>
                <Rating
                  value={Number(formData?.benefitPreference)}
                  onChange={(e) =>
                    handleRatingChange("benefitPreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="salaryPreference"
                  className={styles.labelRating}
                >
                  Salary:
                </label>
                <Rating
                  value={Number(formData?.salaryPreference)}
                  onChange={(e) =>
                    handleRatingChange("salaryPreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="workLifeBalancePreference"
                  className={styles.labelRating}
                >
                  Work Life Balance:
                </label>
                <Rating
                  value={Number(formData?.workLifeBalancePreference)}
                  onChange={(e) =>
                    handleRatingChange("workLifeBalancePreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button label="Save" severity="success" raised />
            </div>
          </form>
        </>
      )}
    </Panel>
  );
};

export default JobPreferencePanel;
