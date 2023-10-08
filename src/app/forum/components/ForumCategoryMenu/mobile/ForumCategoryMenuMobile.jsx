"use client";

import { Dropdown } from "primereact/dropdown";

const ForumCategoryMenuMobile = ({
  setForumCategoryTitle,
  forumCategoryTitle,
  forumCategories,
}) => {
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      name: forumCategory.label,
    };
    return finalForumCategory;
  });

  return (
    <>
      <Dropdown
        value={forumCategoryTitle}
        onChange={(e) => setForumCategoryTitle(e.value.name)}
        options={finalForumCategories}
        optionLabel="name"
        placeholder="Select a forum category"
      />
    </>
  );
};

export default ForumCategoryMenuMobile;
