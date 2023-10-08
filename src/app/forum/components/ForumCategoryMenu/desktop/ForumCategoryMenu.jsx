"use client";
import { Menu } from "primereact/menu";
const ForumCategoryMenu = ({setForumCategoryTitle, forumCategories}) => {


  const finalForumCategories = forumCategories?.map((forumCategory) => {
    const finalForumCategory = {
      label: forumCategory.label,
      command: () => {
        setForumCategoryTitle(forumCategory.label);
      },
    };
    return finalForumCategory;
  });

  // const forumCategories = [
  //   {
  //     label: "My Posts",
  //     command: () => {
  //       setForumCategoryTitle("My Posts");
  //     },
  //   },
  //   {
  //     label: "Events",
  //     command: () => {
  //       setForumCategoryTitle("Events");
  //     },
  //   },
  //   {
  //     label: "Career",
  //     command: () => {
  //       setForumCategoryTitle("Career");
  //     },
  //   },
  //   {
  //     label: "Miscellaneous",
  //     command: () => {
  //       setForumCategoryTitle("Miscellaneous");
  //     },
  //   },
  //   {
  //     label: "Confession",
  //     command: () => {
  //       setForumCategoryTitle("Confession");
  //     },
  //   },
  // ];

  return (
    <>
      <Menu model={finalForumCategories} />
    </>
  );
};

export default ForumCategoryMenu;
