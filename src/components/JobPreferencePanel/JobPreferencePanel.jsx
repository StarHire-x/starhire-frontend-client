import React, { useState } from "react";
import { Panel } from "primereact/panel";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import styles from "./jobPreferencePanel.module.css";
import {
  createJobPreference,
  updateJobPreference,
} from "@/app/api/auth/preference/route";

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
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRatingChange = (category, value) => {
    // Calculate the new total stars used for the specific category
    const currentCategoryStars = formData[category] || 0;
    const newCategoryStarsUsed = totalStarsUsed - currentCategoryStars + value;

    // Check if the new total stars used across all categories exceeds 20
    if (totalStarsUsed - currentCategoryStars + value > 20) {
      setErrorMessage("You cannot select more than 20 stars in total.");
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
          <p className={styles.title}>Indicate your Job Preference</p>
          <div className={styles.dialogueContainer}>
            <p className={styles.subTitle}>
              You have a maximum of 20 stars
            </p>
            <Button
              style={{ width: "30px", height: "30px", marginBottom: "30px" }}
              severity="info"
              onClick={() => setVisible(true)}
              icon="pi pi-question"
              outlined
            ></Button>
            <Dialog
              header="What are job preferences?"
              visible={visible}
              style={{ width: "80vw" }}
              onHide={() => setVisible(false)}
            >
              <p className={styles.dialogueText}>
                These preferences serve as indicators of your prioritization
                criteria when evaluating potential job opportunities.
                <br />
                <br />
                You will be matched to suitable opportunities based on the
                preferences that you have provided
                <br />
                <br />
                Locations:
                <br />5 star: {"<"} 1km of mrt/bus
                <br />4 star: {"<"} 2km of mrt/bus
                <br />3 star: {"<"} 3km of mrt/bus
                <br />2 star: {"<"} 5km of mrt/bus
                <br />1 star: {"<"} 10km of mrt/bus
                <br />
                <br />
                Salary:
                <br />5 star: {">"}$10,000
                <br />4 star: {">"}$5,000
                <br />3 star: {">"}$3,500
                <br />2 star: {">"}$2,500
                <br />1 star: {">"}$1,500
                <br />
                <br />
                Work Life Balance:
                <br />5 star: {">"}50 hrs / week
                <br />4 star: {">"}40 hrs / week
                <br />3 star: {">"}30 hrs / week
                <br />2 star: {">"}20 hrs / week
                <br />1 star: {">"}10 hrs / week
                <br />
              </p>
            </Dialog>
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
          <p className={styles.title}>Update your Job Preference</p>
          <div className={styles.dialogueContainer}>
            <p className={styles.subTitle}>You have a maximum of 20 stars</p>
            <Button
              style={{ width: "30px", height: "30px", marginBottom: "30px" }}
              severity="info"
              onClick={() => setVisible(true)}
              icon="pi pi-question"
              outlined
            ></Button>
            <Dialog
              header="What are job preferences?"
              visible={visible}
              style={{ width: "80vw" }}
              onHide={() => setVisible(false)}
            >
              <p className={styles.dialogueText}>
                These preferences serve as indicators of your prioritization
                criteria when evaluating potential job opportunities.
                <br />
                <br />
                You will be matched to suitable opportunities based on the
                preferences that you have provided
                <br />
                <br />
                Locations:
                <br />5 star: {"<"} 1km of mrt/bus
                <br />4 star: {"<"} 2km of mrt/bus
                <br />3 star: {"<"} 3km of mrt/bus
                <br />2 star: {"<"} 5km of mrt/bus
                <br />1 star: {"<"} 10km of mrt/bus
                <br />
                <br />
                Salary:
                <br />5 star: {">"}$10,000
                <br />4 star: {">"}$5,000
                <br />3 star: {">"}$3,500
                <br />2 star: {">"}$2,500
                <br />1 star: {">"}$1,500
                <br />
                <br />
                Work Life Balance:
                <br />5 star: {">"}50 hrs / week
                <br />4 star: {">"}40 hrs / week
                <br />3 star: {">"}30 hrs / week
                <br />2 star: {">"}20 hrs / week
                <br />1 star: {">"}10 hrs / week
                <br />
              </p>
            </Dialog>
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={updateExistingJobPreference}>
            <div className={styles.inputFields}>
              <div className={styles.fieldRating}>
                <label
                  htmlFor="locationPreference"
                  className={styles.labelRating}
                >
                  Location Preference:
                </label>
                <Rating
                  value={Number(formData?.locationPreference)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationPreference: e.value,
                    })
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
                  Salary Preference:
                </label>
                <Rating
                  value={Number(formData?.salaryPreference)}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryPreference: e.value })
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
                  Culture Preference:
                </label>
                <Rating
                  value={Number(formData?.culturePreference)}
                  onChange={(e) =>
                    setFormData({ ...formData, culturePreference: e.value })
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
                  Diversity Preference:
                </label>
                <Rating
                  value={Number(formData?.diversityPreference)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      diversityPreference: e.value,
                    })
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
                  Work Life Balance Preference:
                </label>
                <Rating
                  value={Number(formData?.workLifeBalancePreference)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workLifeBalancePreference: e.value,
                    })
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
