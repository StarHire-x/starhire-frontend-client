import { Widget } from "@typeform/embed-react";
import styles from "./collectJobSeekerInfoForm.module.css";
import { submitTypeFormResponsesJobSeeker } from "@/app/api/typeform/routes";

const CollectJobSeekerInfoForm = ({ refreshData, setRefreshData, email, accessToken }) => {
  const handleSubmit = async () => {
    console.log("typeform completed");
    const body = { email: email };
    const result = await submitTypeFormResponsesJobSeeker(accessToken, body);
    console.log("Result");
    console.log(result);
    setRefreshData(!refreshData);
  };
  return (
    <div className={styles.typeFormContainer}>
      <Widget
        id="okpg5zBV"
        style={{ width: "100%", height: "100%" }}
        className="my-form"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CollectJobSeekerInfoForm;
