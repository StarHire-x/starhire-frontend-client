import { Widget } from "@typeform/embed-react";
import styles from "./collectCorporateInfoForm.module.css"
import { fetchTypeFormResponses } from "@/app/api/typeform/routes";
import { useEffect } from "react";


const CollectCorporateInfoForm = ({sessionTokenRef}) => {

  useEffect(() => {
    const fetchResponses = async () => {
      const result = await fetchTypeFormResponses(sessionTokenRef);
      return result
    }
    fetchResponses().then((responses) => {
      console.log(responses)
      console.log("done")
    })
  }, [])


  const handleSubmit = async() => {
    console.log("typeform completed")
  }


  return (
    <div className={styles.typeFormContainer}>
      <Widget id="hON4lBQP" style={{ width: "100%", height: "100%"}} className="my-form" onSubmit={handleSubmit} />
    </div>
  );
};

export default CollectCorporateInfoForm;
