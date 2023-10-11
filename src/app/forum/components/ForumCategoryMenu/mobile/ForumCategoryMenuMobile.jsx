"use client";

import { Dropdown } from "primereact/dropdown";

const ForumCategoryMenuMobile = ({
  setForumCategoryTitle,
  forumCategoryTitle,
  forumCategories,
  setForumGuideLinesByCategory,
}) => {
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      name: forumCategory.forumCategoryTitle,
      guideLines: forumCategory.forumGuidelines,
    };
    return finalForumCategory;
  });

  return (
    <>
      <Dropdown
        value={forumCategoryTitle}
        onChange={(e) => {
          setForumCategoryTitle(e.value);
          // To access the guideLines property, you should find the corresponding object
          const selectedCategory = finalForumCategories.find(
            (category) => category.name === e.value
          );
          if (selectedCategory) {
            setForumGuideLinesByCategory(selectedCategory.guideLines);
          }
        }}
        options={finalForumCategories}
        optionLabel="name"
        optionValue="name"
        placeholder="Select a forum category"
      />
    </>
  );
};

export default ForumCategoryMenuMobile;
