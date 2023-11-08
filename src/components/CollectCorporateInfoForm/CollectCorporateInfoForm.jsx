import { Widget } from "@typeform/embed-react";
import styles from "./collectCorporateInfoForm.module.css";
import {
  fetchTypeFormResponses,
  submitTypeFormResponsesCorporate,
} from "@/app/api/typeform/routes";
import { useEffect } from "react";

const CollectCorporateInfoForm = ({ refreshData, setRefreshData, email, accessToken }) => {
  const handleSubmit = async () => {
    console.log("typeform completed");
    const body = { email: email };
    const result = await submitTypeFormResponsesCorporate(accessToken, body);
    console.log("Result");
    console.log(result);
    setRefreshData(!refreshData);
  };

  return (
    <div className={styles.typeFormContainer}>
      <Widget
        id="hON4lBQP"
        style={{ width: "100%", height: "100%" }}
        className="my-form"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CollectCorporateInfoForm;
