import { Widget } from "@typeform/embed-react";
import styles from "./collectJobSeekerInfoForm.module.css";

const CollectJobSeekerInfoForm = ({ refreshData, setRefreshData }) => {
  const handleSubmit = () => {
    alert("form submitted");
    setRefreshData((prev) => !prev);
  };

  return (
    <div className={styles.typeFormContainer}>
      <Widget
        id="zBqvHfol"
        style={{ width: "100%", height: "100%" }}
        className="my-form"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CollectJobSeekerInfoForm;
