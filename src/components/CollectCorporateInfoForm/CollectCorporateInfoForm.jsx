import { Widget } from "@typeform/embed-react";
import styles from "./collectCorporateInfoForm.module.css"


const CollectCorporateInfoForm = () => {
  return (
    <div className={styles.typeFormContainer}>
      <Widget id="hON4lBQP" style={{ width: "100%", height: "100%"}} className="my-form" />
    </div>
  );
};

export default CollectCorporateInfoForm;
