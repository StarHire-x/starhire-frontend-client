"use client";

import { Dropdown } from "primereact/dropdown";

const ForumCategoryMenuMobile = ({
  setForumCategoryTitle,
  forumCategoryTitle,
  forumCategories,
}) => {
  console.log(forumCategoryTitle);
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      name: forumCategory.forumCategoryTitle,
    };
    return finalForumCategory;
  });

  return (
    <>
      <Dropdown
        value={{name: forumCategoryTitle}}
        onChange={(e) => setForumCategoryTitle(e.value.name)}
        options={finalForumCategories}
        optionLabel="name"
        placeholder="Select a forum category"
      />
    </>
  );
};

export default ForumCategoryMenuMobile;
