"use client";
import { Menu } from "primereact/menu";
const ForumCategoryMenu = ({ setForumCategoryTitle, forumCategories }) => {
  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      label: forumCategory.label,
      command: () => {
        setForumCategoryTitle(forumCategory.label);
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
