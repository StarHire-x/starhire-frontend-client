import React from 'react';
import { Panel } from "primereact/panel";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import styles from "./jobPreferencePanel.module.css"

const JobPreferencePanel = ({
  isJobPreferenceAbsent,
  formData,
  setFormData,
  newJobPreferences,
  modifyJobPreference,
}) => {
  
  return (
    <Panel header="Job Preference" toggleable>
      {isJobPreferenceAbsent ? (
        <>
          <h1 className={styles.title}>Create Job Preference</h1>
          <form className={styles.form} onSubmit={newJobPreferences}>
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
              <Button label="Create Preferences" severity="success" raised />
            </div>
          </form>
        </>
      ) : (
        <>
          <h1 className={styles.title}>Update Job Preference</h1>
          <form className={styles.form} onSubmit={modifyJobPreference}>
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
              <Button label="Save Preferences" severity="success" raised />
            </div>
          </form>
        </>
      )}
    </Panel>
  );
};

export default JobPreferencePanel;