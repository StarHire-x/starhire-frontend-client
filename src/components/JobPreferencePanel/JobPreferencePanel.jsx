import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import styles from "./jobPreferencePanel.module.css";
import {
  createJobPreference,
  updateJobPreference,
} from "@/app/api/preference/route";

const JobPreferencePanel = ({
  formData,
  setFormData,
  sessionTokenRef,
  setRefreshData,
  isJobPreferenceAbsent,
  setIsJobPreferenceAbsent,
  totalStarsUsed,
  setTotalStarsUsed,
}) => {
  // Dialog Box
  const [errorMessage, setErrorMessage] = useState("");

  const handleRatingChange = (category, value) => {
    setErrorMessage("")
    // Calculate the new total stars used for the specific category
    const currentCategoryStars = formData[category] || 0;
    const newCategoryStarsUsed = totalStarsUsed - currentCategoryStars + value;

    // Check if the new total stars used across all categories exceeds 20
    if (totalStarsUsed - currentCategoryStars + value > 20) {
      setErrorMessage("You have selected more than 20 stars");
      return;
    }

    // Update the form data and total stars used
    const updatedFormData = { ...formData };
    updatedFormData[category] = value;
    setFormData(updatedFormData);
    setTotalStarsUsed(newCategoryStarsUsed);
    setErrorMessage(""); // Clear any previous error message
  };

  const createNewJobPreference = async (e) => {
    e.preventDefault();

    const reqBody = {
      jobSeekerId: formData.userId,
      locationPreference: formData.locationPreference,
      culturePreference: formData.culturePreference,
      salaryPreference: formData.salaryPreference,
      diversityPreference: formData.diversityPreference,
      workLifeBalancePreference: formData.workLifeBalancePreference,
    };

    try {
      const response = await createJobPreference(reqBody, sessionTokenRef);
      if (!response.error) {
        alert("Job preference created successfully!");
        setRefreshData((prev) => !prev);
        setIsJobPreferenceAbsent(false);
      }
    } catch (error) {
      console.log("Failed to create job preference", error.message);
      setErrorMessage(error.message);
    }
  };

  const updateExistingJobPreference = async (e) => {
    e.preventDefault();
    const jobPreferenceId = formData.jobPreferenceId;

    const reqBody = {
      locationPreference: formData.locationPreference,
      culturePreference: formData.culturePreference,
      salaryPreference: formData.salaryPreference,
      diversityPreference: formData.diversityPreference,
      workLifeBalancePreference: formData.workLifeBalancePreference,
    };

    try {
      const response = await updateJobPreference(
        jobPreferenceId,
        reqBody,
        sessionTokenRef
      );
      if (!response.error) {
        alert("Job preference update successfully!");
        setRefreshData((prev) => !prev);
      }
    } catch (error) {
      console.log("Failed to update job preference", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <Panel header="Job Preference" toggleable>
      {isJobPreferenceAbsent ? (
        <>
          <div className={styles.titleContainer}>
            <p className={styles.title}>Indicate your Job Preference</p>
            <p className={styles.subTitle}>You have a maximum of 20 stars</p>
            <p className={styles.starCounter}>Number of stars used: {totalStarsUsed} / 20
            </p>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={createNewJobPreference}>
            <div className={styles.inputFields}>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="locationPreference"
                  className={styles.labelRating}
                >
                  Location:
                </label>
                <Rating
                  value={Number(formData?.locationPreference)}
                  onChange={(e) =>
                    handleRatingChange("locationPreference", e.value)
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
              <div className={styles.fieldRating}>
                <label
                  htmlFor="culturePreference"
                  className={styles.labelRating}
                >
                  Culture:
                </label>
                <Rating
                  value={Number(formData?.culturePreference)}
                  onChange={(e) =>
                    handleRatingChange("culturePreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="diversityPreference"
                  className={styles.labelRating}
                >
                  Diversity:
                </label>
                <Rating
                  value={Number(formData?.diversityPreference)}
                  onChange={(e) =>
                    handleRatingChange("diversityPreference", e.value)
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
            <p className={styles.title}>Update your Job Preference</p>
            <p className={styles.subTitle}>You have a maximum of 20 stars</p>
            <p className={styles.starCounter}>Number of stars used: {totalStarsUsed} / 20
            </p>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={updateExistingJobPreference}>
            <div className={styles.inputFields}>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="locationPreference"
                  className={styles.labelRating}
                >
                  Location:
                </label>
                <Rating
                  value={Number(formData?.locationPreference)}
                  onChange={(e) =>
                    handleRatingChange("locationPreference", e.value)
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
              <div className={styles.fieldRating}>
                <label
                  htmlFor="culturePreference"
                  className={styles.labelRating}
                >
                  Culture:
                </label>
                <Rating
                  value={Number(formData?.culturePreference)}
                  onChange={(e) =>
                    handleRatingChange("culturePreference", e.value)
                  }
                  stars={5}
                  cancel={false}
                />
              </div>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="diversityPreference"
                  className={styles.labelRating}
                >
                  Diversity:
                </label>
                <Rating
                  value={Number(formData?.diversityPreference)}
                  onChange={(e) =>
                    handleRatingChange("diversityPreference", e.value)
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
