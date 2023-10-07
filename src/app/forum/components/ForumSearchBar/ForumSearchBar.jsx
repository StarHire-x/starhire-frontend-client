"use client";

import { InputText } from "primereact/inputtext";
import styles from './ForumSearchBar.module.css';

const ForumSearchBar = () => {
  return (
    <>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText className={styles.forumSearchBar} placeholder="Search post title" />
      </span>
    </>
  );
};

export default ForumSearchBar;
