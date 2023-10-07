"use client";

import { Dropdown } from "primereact/dropdown";

const ForumCategoryMenuMobile = ({
  setForumCategoryTitle,
  forumCategoryTitle,
}) => {
  const forumCategories = [
    {
      name: "My Posts",
    },
    {
      name: "Events",
    },
    {
      name: "Career",
    },
    {
      name: "Miscellaneous",
    },
    {
      name: "Confession",
    },
  ];

  return (
    <>
      <Dropdown
        value={forumCategoryTitle}
        onChange={(e) => setForumCategoryTitle(e.value.name)}
        options={forumCategories}
        optionLabel="name"
        placeholder="Select a forum category"
      />
    </>
  );
};

export default ForumCategoryMenuMobile;
