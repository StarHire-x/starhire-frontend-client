"use client";
import { Menu } from "primereact/menu";
const ForumCategoryMenu = ({
  setForumCategoryTitle,
  forumCategories,
  setForumGuideLinesByCategory,
}) => {
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      label: forumCategory.forumCategoryTitle,
      command: () => {
        setForumCategoryTitle(forumCategory.forumCategoryTitle);
        setForumGuideLinesByCategory(forumCategory.forumGuidelines)
      },
    };
    return finalForumCategory;
  });

  return (
    <>
      <Menu model={finalForumCategories} />
    </>
  );
};

export default ForumCategoryMenu;
