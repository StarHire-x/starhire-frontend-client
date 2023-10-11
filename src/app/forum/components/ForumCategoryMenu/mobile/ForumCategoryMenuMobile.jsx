"use client";

import { Dropdown } from "primereact/dropdown";

const ForumCategoryMenuMobile = ({
  setForumCategoryTitle,
  forumCategoryTitle,
  forumCategories,
  setForumGuideLinesByCategory
}) => {
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      name: forumCategory.forumCategoryTitle,
      guideLines: forumCategory.forumGuidelines
    };
    return finalForumCategory;
  });

  return (
    <>
      <Dropdown
        value={{name: forumCategoryTitle}}
        onChange={(e) => {
          setForumCategoryTitle(e.value.name)
          setForumGuideLinesByCategory(e.value.guideLines)
        }}
        options={finalForumCategories}
        optionLabel="name"
        placeholder="Select a forum category"
      />
    </>
  );
};

export default ForumCategoryMenuMobile;
