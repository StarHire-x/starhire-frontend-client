"use client";

import { InputText } from "primereact/inputtext";
import styles from "./ForumSearchBar.module.css";

const ForumSearchBar = ({onSearchQueryChange, searchQuery}) => {
  const handleInputChange = (event) => {
    const query = event.target.value;
    onSearchQueryChange(query);
  };

  return (
    <>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          className={styles.forumSearchBar}
          placeholder="Search post title"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </span>
    </>
  );
};

export default ForumSearchBar;
